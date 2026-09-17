const express = require('express');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { logActivity } = require('../utils/activityLogger');

const router = express.Router();
router.use(authenticateUser);

const USER_COLS = 'id, organization_id, first_name, last_name, email, role, avatar_color, created_at';

function makeKeyPrefix(name) {
  return (name || 'PRJ').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'PRJ';
}

// GET /api/projects - list projects in my organization, with quick stats
router.get('/', asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  let sql = 'SELECT * FROM projects WHERE organization_id = ?';
  const params = [req.user.organization_id];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (search) { sql += ' AND name LIKE ?'; params.push(`%${search}%`); }
  sql += ' ORDER BY created_at DESC';

  const [projects] = await pool.query(sql, params);

  const projectsWithStats = await Promise.all(projects.map(async (project) => {
    const [[stats]] = await pool.query(
      `SELECT COUNT(*) AS taskCount,
              SUM(status = 'DONE') AS completedTasks,
              SUM(due_date IS NOT NULL AND due_date < CURDATE() AND status != 'DONE') AS overdueTasks
       FROM tasks WHERE project_id = ?`,
      [project.id]
    );
    const [members] = await pool.query(
      `SELECT u.${USER_COLS} FROM project_members pm JOIN users u ON u.id = pm.user_id WHERE pm.project_id = ?`,
      [project.id]
    );
    let teamName;
    if (project.team_id) {
      const [[team]] = await pool.query('SELECT name FROM teams WHERE id = ?', [project.team_id]);
      teamName = team ? team.name : undefined;
    }
    return {
      ...project,
      taskCount: stats.taskCount || 0,
      completedTasks: stats.completedTasks || 0,
      overdueTasks: stats.overdueTasks || 0,
      teamName,
      members
    };
  }));

  res.json({ success: true, projects: projectsWithStats });
}));

// GET /api/projects/:id - project detail + overview stats
router.get('/:id', asyncHandler(async (req, res) => {
  const [projects] = await pool.query(
    'SELECT * FROM projects WHERE id = ? AND organization_id = ?',
    [req.params.id, req.user.organization_id]
  );
  if (projects.length === 0) return res.status(404).json({ success: false, error: 'Project not found' });
  const project = projects[0];

  const [members] = await pool.query(
    `SELECT u.${USER_COLS} FROM project_members pm JOIN users u ON u.id = pm.user_id WHERE pm.project_id = ?`,
    [req.params.id]
  );

  const [[stats]] = await pool.query(
    `SELECT
       COUNT(*) AS totalTasks,
       SUM(status = 'DONE') AS completedTasks,
       SUM(due_date IS NOT NULL AND due_date < CURDATE() AND status != 'DONE') AS overdueTasks
     FROM tasks WHERE project_id = ?`,
    [req.params.id]
  );
  const totalTasks = stats.totalTasks || 0;
  const completedTasks = stats.completedTasks || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const [recentActivity] = await pool.query(
    `SELECT al.*, u.first_name, u.last_name FROM activity_logs al
     JOIN users u ON u.id = al.user_id
     WHERE al.project_id = ? OR (al.entity = 'task' AND al.entity_id IN (SELECT id FROM tasks WHERE project_id = ?))
     ORDER BY al.created_at DESC LIMIT 10`,
    [req.params.id, req.params.id]
  );

  let teamName;
  if (project.team_id) {
    const [[team]] = await pool.query('SELECT name FROM teams WHERE id = ?', [project.team_id]);
    teamName = team ? team.name : undefined;
  }

  res.json({
    success: true,
    project: { ...project, teamName, members, stats: { totalTasks, completedTasks, overdueTasks: stats.overdueTasks || 0, progress }, recentActivity }
  });
}));

// POST /api/projects - create a project (ADMIN or MANAGER)
router.post('/', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const { name, keyPrefix, description, teamId, status, startDate, deadline } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'name is required' });

  const finalKeyPrefix = keyPrefix ? keyPrefix.toUpperCase().slice(0, 20) : makeKeyPrefix(name);

  const [result] = await pool.query(
    `INSERT INTO projects (organization_id, team_id, name, key_prefix, description, status, start_date, deadline, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.organization_id, teamId || null, name, finalKeyPrefix, description || '',
      status || 'PLANNING', startDate || null, deadline || null, req.user.id
    ]
  );

  await pool.query('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [result.insertId, req.user.id]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: result.insertId,
    action: 'project_created', entity: 'project', entityId: result.insertId
  });

  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, project: rows[0] });
}));

// PUT /api/projects/:id - update project
router.put('/:id', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const { name, description, status, startDate, deadline, teamId, keyPrefix } = req.body;

  const [result] = await pool.query(
    `UPDATE projects SET
       name = COALESCE(?, name),
       description = COALESCE(?, description),
       status = COALESCE(?, status),
       start_date = COALESCE(?, start_date),
       deadline = COALESCE(?, deadline),
       team_id = COALESCE(?, team_id),
       key_prefix = COALESCE(?, key_prefix)
     WHERE id = ? AND organization_id = ?`,
    [name, description, status, startDate, deadline, teamId, keyPrefix, req.params.id, req.user.organization_id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Project not found' });

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: Number(req.params.id),
    action: 'project_updated', entity: 'project', entityId: Number(req.params.id)
  });

  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
  res.json({ success: true, project: rows[0] });
}));

// DELETE /api/projects/:id
router.delete('/:id', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    'DELETE FROM projects WHERE id = ? AND organization_id = ?',
    [req.params.id, req.user.organization_id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Project not found' });

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'project_deleted', entity: 'project', entityId: Number(req.params.id)
  });

  res.json({ success: true, message: 'Project deleted' });
}));

// POST /api/projects/:id/members
router.post('/:id/members', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });

  await pool.query('INSERT IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)', [req.params.id, userId]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id, projectId: Number(req.params.id),
    action: 'project_member_added', entity: 'project', entityId: Number(req.params.id), metadata: { addedUserId: userId }
  });

  res.status(201).json({ success: true, message: 'Member added' });
}));

// DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [req.params.id, req.params.userId]);
  res.json({ success: true, message: 'Member removed' });
}));

module.exports = router;
