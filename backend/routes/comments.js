const express = require('express');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');
const { notifyUser } = require('../utils/notifier');

const taskCommentRouter = express.Router();
const commentRouter = express.Router();
taskCommentRouter.use(authenticateUser);
commentRouter.use(authenticateUser);

const USER_COLS = 'id, organization_id, first_name, last_name, email, role, avatar_color, created_at';

async function getTaskInMyOrg(taskId, organizationId) {
  const [rows] = await pool.query(
    `SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id WHERE t.id = ? AND p.organization_id = ?`,
    [taskId, organizationId]
  );
  return rows[0] || null;
}

// GET /api/tasks/:taskId/comments
taskCommentRouter.get('/:taskId/comments', asyncHandler(async (req, res) => {
  const task = await getTaskInMyOrg(req.params.taskId, req.user.organization_id);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

  const [comments] = await pool.query('SELECT * FROM comments WHERE task_id = ? ORDER BY created_at ASC', [req.params.taskId]);
  const withUsers = await Promise.all(comments.map(async (c) => {
    const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [c.user_id]);
    return { ...c, user };
  }));
  res.json({ success: true, comments: withUsers });
}));

// POST /api/tasks/:taskId/comments
taskCommentRouter.post('/:taskId/comments', asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ success: false, error: 'Comment content is required' });

  const task = await getTaskInMyOrg(req.params.taskId, req.user.organization_id);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

  const [result] = await pool.query('INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)', [req.params.taskId, req.user.id, content.trim()]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: task.project_id,
    action: 'comment_added', entity: 'task', entityId: Number(req.params.taskId)
  });

  if (task.assignee_id && task.assignee_id !== req.user.id) {
    await notifyUser({
      userId: task.assignee_id, type: 'comment_added', title: 'New comment',
      message: `${req.user.first_name} commented on "${task.title}"`, link: `/tasks/${req.params.taskId}`
    });
  }

  const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, comment: { ...rows[0], user: req.user } });
}));

// PUT /api/comments/:id - edit own comment only
commentRouter.put('/:id', asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ success: false, error: 'Comment content is required' });

  const [rows] = await pool.query(
    `SELECT c.* FROM comments c JOIN tasks t ON t.id = c.task_id JOIN projects p ON p.id = t.project_id
     WHERE c.id = ? AND p.organization_id = ?`,
    [req.params.id, req.user.organization_id]
  );
  if (rows.length === 0) return res.status(404).json({ success: false, error: 'Comment not found' });
  if (rows[0].user_id !== req.user.id) return res.status(403).json({ success: false, error: 'You can only edit your own comments' });

  await pool.query('UPDATE comments SET content = ? WHERE id = ?', [content.trim(), req.params.id]);
  const [updated] = await pool.query('SELECT * FROM comments WHERE id = ?', [req.params.id]);
  res.json({ success: true, comment: updated[0] });
}));

// DELETE /api/comments/:id - delete own comment only
commentRouter.delete('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.* FROM comments c JOIN tasks t ON t.id = c.task_id JOIN projects p ON p.id = t.project_id
     WHERE c.id = ? AND p.organization_id = ?`,
    [req.params.id, req.user.organization_id]
  );
  if (rows.length === 0) return res.status(404).json({ success: false, error: 'Comment not found' });
  if (rows[0].user_id !== req.user.id) return res.status(403).json({ success: false, error: 'You can only delete your own comments' });

  await pool.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Comment deleted' });
}));

module.exports = { taskCommentRouter, commentRouter };
