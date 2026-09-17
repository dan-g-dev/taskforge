const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');

const taskAttachmentRouter = express.Router();
const attachmentRouter = express.Router();
taskAttachmentRouter.use(authenticateUser);
attachmentRouter.use(authenticateUser);

const USER_COLS = 'id, organization_id, first_name, last_name, email, role, avatar_color, created_at';
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIME_TYPES = [
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(new Error('File type not allowed'));
    cb(null, true);
  }
});

async function getTaskInMyOrg(taskId, organizationId) {
  const [rows] = await pool.query(
    `SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id WHERE t.id = ? AND p.organization_id = ?`,
    [taskId, organizationId]
  );
  return rows[0] || null;
}

// GET /api/tasks/:taskId/attachments
taskAttachmentRouter.get('/:taskId/attachments', asyncHandler(async (req, res) => {
  const task = await getTaskInMyOrg(req.params.taskId, req.user.organization_id);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

  const [attachments] = await pool.query('SELECT * FROM attachments WHERE task_id = ? ORDER BY created_at DESC', [req.params.taskId]);
  const withUsers = await Promise.all(attachments.map(async (a) => {
    const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [a.user_id]);
    return { ...a, user };
  }));
  res.json({ success: true, attachments: withUsers });
}));

// POST /api/tasks/:taskId/attachments
taskAttachmentRouter.post('/:taskId/attachments', upload.single('file'), asyncHandler(async (req, res) => {
  const task = await getTaskInMyOrg(req.params.taskId, req.user.organization_id);
  if (!task) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ success: false, error: 'Task not found' });
  }
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

  const relativePath = `/uploads/${req.file.filename}`;
  const [result] = await pool.query(
    `INSERT INTO attachments (task_id, user_id, original_name, stored_filename, file_path, file_size, mime_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.params.taskId, req.user.id, req.file.originalname, req.file.filename, relativePath, req.file.size, req.file.mimetype]
  );

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: task.project_id,
    action: 'attachment_uploaded', entity: 'task', entityId: Number(req.params.taskId), metadata: { fileName: req.file.originalname }
  });

  const [rows] = await pool.query('SELECT * FROM attachments WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, attachment: { ...rows[0], user: req.user } });
}));

// GET /api/attachments/:id/download
attachmentRouter.get('/:id/download', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.* FROM attachments a JOIN tasks t ON t.id = a.task_id JOIN projects p ON p.id = t.project_id
     WHERE a.id = ? AND p.organization_id = ?`,
    [req.params.id, req.user.organization_id]
  );
  if (rows.length === 0) return res.status(404).json({ success: false, error: 'Attachment not found' });

  const filePath = path.join(uploadDir, rows[0].stored_filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, error: 'File missing from disk' });
  res.download(filePath, rows[0].original_name);
}));

// DELETE /api/attachments/:id
attachmentRouter.delete('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.* FROM attachments a JOIN tasks t ON t.id = a.task_id JOIN projects p ON p.id = t.project_id
     WHERE a.id = ? AND p.organization_id = ?`,
    [req.params.id, req.user.organization_id]
  );
  if (rows.length === 0) return res.status(404).json({ success: false, error: 'Attachment not found' });

  const filePath = path.join(uploadDir, rows[0].stored_filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await pool.query('DELETE FROM attachments WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Attachment deleted' });
}));

module.exports = { taskAttachmentRouter, attachmentRouter };
