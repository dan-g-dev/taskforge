const express = require('express');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');
const { notifyUser } = require('../utils/notifier');

const router = express.Router();
router.use(authenticateUser);

const USER_COLS = 'id, organization_id, first_name, last_name, email, role, avatar_color, created_at';

async function findTaskInMyOrg(taskId, organizationId) {
  const [rows] = await pool.query(
    `SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id
     WHERE t.id = ? AND p.organization_id = ?`,
    [taskId, organizationId]
  );
  return rows[0] || null;
}

async function attachPeople(task) {
  let assignee, creator;
  if (task.assignee_id) {
    const [[row]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [task.assignee_id]);
    assignee = row;
  }
  const [[creatorRow]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [task.created_by]);
  creator = creatorRow;
  return { ...task, assignee, creator };
}

// GET /api/tasks - search/filter across all projects in my org
router.get('/', asyncHandler(async (req, res) => {
  const { projectId, status, priority, assigneeId, search } = req.query;

  let sql = `SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id WHERE p.organization_id = ?`;
  const params = [req.user.organization_id];
  if (projectId) { sql += ' AND t.project_id = ?'; params.push(projectId); }
  if (status) { sql += ' AND t.status = ?'; params.push(status); }
  if (priority) { sql += ' AND t.priority = ?'; params.push(priority); }
  if (assigneeId) { sql += ' AND t.assignee_id = ?'; params.push(assigneeId); }
  if (search) { sql += ' AND (t.title LIKE ? OR t.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY t.position ASC, t.created_at DESC';

  const [tasks] = await pool.query(sql, params);
  const enriched = await Promise.all(tasks.map(attachPeople));
  res.json({ success: true, tasks: enriched });
}));

// GET /api/tasks/board?projectId=1 - tasks grouped by status, for the kanban board
router.get('/board', asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) return res.status(400).json({ success: false, error: 'projectId is required' });

  const [tasks] = await pool.query(
    `SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id
     WHERE t.project_id = ? AND p.organization_id = ? ORDER BY t.position ASC`,
    [projectId, req.user.organization_id]
  );
  const enriched = await Promise.all(tasks.map(attachPeople));

  const board = { TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: [] };
  for (const task of enriched) board[task.status].push(task);
  res.json({ success: true, board });
}));

// GET /api/tasks/:id - full task detail incl. comments, attachments, activity
router.get('/:id', asyncHandler(async (req, res) => {
  const task = await findTaskInMyOrg(req.params.id, req.user.organization_id);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
  const enriched = await attachPeople(task);

  const [project] = await pool.query('SELECT * FROM projects WHERE id = ?', [task.project_id]);

  const [comments] = await pool.query('SELECT * FROM comments WHERE task_id = ? ORDER BY created_at ASC', [req.params.id]);
  const commentsWithUsers = await Promise.all(comments.map(async (c) => {
    const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [c.user_id]);
    return { ...c, user };
  }));

  const [attachments] = await pool.query('SELECT * FROM attachments WHERE task_id = ? ORDER BY created_at DESC', [req.params.id]);
  const attachmentsWithUsers = await Promise.all(attachments.map(async (a) => {
    const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [a.user_id]);
    return { ...a, user };
  }));

  const [activityHistory] = await pool.query(
    `SELECT * FROM activity_logs WHERE entity = 'task' AND entity_id = ? ORDER BY created_at DESC`,
    [req.params.id]
  );
  const activityWithUsers = await Promise.all(activityHistory.map(async (a) => {
    const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [a.user_id]);
    return { ...a, user };
  }));

  res.json({
    success: true,
    task: { ...enriched, project: project[0], comments: commentsWithUsers, attachments: attachmentsWithUsers, activityHistory: activityWithUsers }
  });
}));

// POST /api/tasks - create a task (any authenticated org member)
router.post('/', asyncHandler(async (req, res) => {
  const { projectId, title, description, status, priority, assigneeId, dueDate } = req.body;
  if (!projectId || !title) return res.status(400).json({ success: false, error: 'projectId and title are required' });

  const [projects] = await pool.query('SELECT id FROM projects WHERE id = ? AND organization_id = ?', [projectId, req.user.organization_id]);
  if (projects.length === 0) return res.status(404).json({ success: false, error: 'Project not found' });

  const [[{ maxNumber }]] = await pool.query('SELECT COALESCE(MAX(task_number), 0) AS maxNumber FROM tasks WHERE project_id = ?', [projectId]);
  const [[{ maxPos }]] = await pool.query('SELECT COALESCE(MAX(position), -1) AS maxPos FROM tasks WHERE project_id = ? AND status = ?', [projectId, status || 'TODO']);

  const [result] = await pool.query(
    `INSERT INTO tasks (project_id, task_number, title, description, status, priority, assignee_id, created_by, due_date, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [projectId, maxNumber + 1, title, description || '', status || 'TODO', priority || 'MEDIUM', assigneeId || null, req.user.id, dueDate || null, maxPos + 1]
  );

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: Number(projectId),
    action: 'task_created', entity: 'task', entityId: result.insertId
  });

  if (assigneeId) {
    await notifyUser({
      userId: assigneeId, type: 'task_assigned', title: 'New task assigned',
      message: `You were assigned to task "${title}"`, link: `/tasks/${result.insertId}`
    });
    await logActivity({
      organizationId: req.user.organization_id, userId: req.user.id, projectId: Number(projectId),
      action: 'task_assigned', entity: 'task', entityId: result.insertId, metadata: { assigneeId }
    });
  }

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
  const enriched = await attachPeople(rows[0]);
  res.status(201).json({ success: true, task: enriched });
}));

// PUT /api/tasks/:id - update task fields
router.put('/:id', asyncHandler(async (req, res) => {
  const existing = await findTaskInMyOrg(req.params.id, req.user.organization_id);
  if (!existing) return res.status(404).json({ success: false, error: 'Task not found' });

  const { title, description, priority, status, assigneeId, dueDate } = req.body;
  const newAssignee = assigneeId !== undefined ? (assigneeId || null) : existing.assignee_id;

  await pool.query(
    `UPDATE tasks SET
       title = COALESCE(?, title), description = COALESCE(?, description),
       priority = COALESCE(?, priority), status = COALESCE(?, status),
       assignee_id = ?, due_date = COALESCE(?, due_date)
     WHERE id = ?`,
    [title, description, priority, status, newAssignee, dueDate, req.params.id]
  );

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: existing.project_id,
    action: 'task_updated', entity: 'task', entityId: Number(req.params.id)
  });

  if (assigneeId && Number(assigneeId) !== existing.assignee_id) {
    await notifyUser({
      userId: assigneeId, type: 'task_assigned', title: 'New task assigned',
      message: `You were assigned to task "${title || existing.title}"`, link: `/tasks/${req.params.id}`
    });
  }

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
  const enriched = await attachPeople(rows[0]);
  res.json({ success: true, task: enriched });
}));

// PATCH /api/tasks/:id/status - move a task on the kanban board
router.patch('/:id/status', asyncHandler(async (req, res) => {
  const { status, position } = req.body;
  const validStatuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'status must be one of ' + validStatuses.join(', ') });
  }

  const existing = await findTaskInMyOrg(req.params.id, req.user.organization_id);
  if (!existing) return res.status(404).json({ success: false, error: 'Task not found' });

  await pool.query('UPDATE tasks SET status = ?, position = ? WHERE id = ?', [status, position ?? existing.position, req.params.id]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: existing.project_id,
    action: 'task_status_changed', entity: 'task', entityId: Number(req.params.id), metadata: { from: existing.status, to: status }
  });

  if (existing.assignee_id && existing.assignee_id !== req.user.id) {
    await notifyUser({
      userId: existing.assignee_id, type: 'task_status_changed', title: 'Task status changed',
      message: `Task "${existing.title}" moved to ${status.replace('_', ' ')}`, link: `/tasks/${req.params.id}`
    });
  }

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
  const enriched = await attachPeople(rows[0]);
  res.json({ success: true, task: enriched });
}));

// DELETE /api/tasks/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = await findTaskInMyOrg(req.params.id, req.user.organization_id);
  if (!existing) return res.status(404).json({ success: false, error: 'Task not found' });

  await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: existing.project_id,
    action: 'task_deleted', entity: 'task', entityId: Number(req.params.id)
  });

  res.json({ success: true, message: 'Task deleted' });
}));

module.exports = router;
