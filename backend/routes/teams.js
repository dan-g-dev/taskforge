const express = require('express');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { logActivity } = require('../utils/activityLogger');

const router = express.Router();
router.use(authenticateUser);

const USER_COLS = 'id, organization_id, first_name, last_name, email, role, avatar_color, created_at';

// GET /api/teams - list teams in my organization, with member/project info
router.get('/', asyncHandler(async (req, res) => {
  const [teams] = await pool.query(
    'SELECT * FROM teams WHERE organization_id = ? ORDER BY created_at DESC',
    [req.user.organization_id]
  );

  const teamsWithDetails = await Promise.all(teams.map(async (team) => {
    const [members] = await pool.query(
      `SELECT u.${USER_COLS} FROM team_members tm JOIN users u ON u.id = tm.user_id WHERE tm.team_id = ?`,
      [team.id]
    );
    const [projects] = await pool.query('SELECT * FROM projects WHERE team_id = ?', [team.id]);
    return { ...team, membersCount: members.length, members, projects };
  }));

  res.json({ success: true, teams: teamsWithDetails });
}));

// GET /api/teams/:id - team detail with members + projects
router.get('/:id', asyncHandler(async (req, res) => {
  const [teams] = await pool.query(
    'SELECT * FROM teams WHERE id = ? AND organization_id = ?',
    [req.params.id, req.user.organization_id]
  );
  if (teams.length === 0) return res.status(404).json({ success: false, error: 'Team not found' });

  const [members] = await pool.query(
    `SELECT u.${USER_COLS} FROM team_members tm JOIN users u ON u.id = tm.user_id WHERE tm.team_id = ?`,
    [req.params.id]
  );
  const [projects] = await pool.query('SELECT * FROM projects WHERE team_id = ?', [req.params.id]);

  res.json({ success: true, team: { ...teams[0], membersCount: members.length, members, projects } });
}));

// POST /api/teams - create a team (ADMIN or MANAGER)
router.post('/', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'name is required' });

  const [result] = await pool.query(
    'INSERT INTO teams (organization_id, name, description, created_by) VALUES (?, ?, ?, ?)',
    [req.user.organization_id, name, description || '', req.user.id]
  );
  await pool.query('INSERT INTO team_members (team_id, user_id) VALUES (?, ?)', [result.insertId, req.user.id]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'team_created', entity: 'team', entityId: result.insertId
  });

  const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [result.insertId]);
  res.status(201).json({ success: true, team: rows[0] });
}));

// PUT /api/teams/:id - update team
router.put('/:id', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const [result] = await pool.query(
    'UPDATE teams SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ? AND organization_id = ?',
    [name, description, req.params.id, req.user.organization_id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Team not found' });

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'team_updated', entity: 'team', entityId: Number(req.params.id)
  });

  const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [req.params.id]);
  res.json({ success: true, team: rows[0] });
}));

// DELETE /api/teams/:id
router.delete('/:id', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    'DELETE FROM teams WHERE id = ? AND organization_id = ?',
    [req.params.id, req.user.organization_id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Team not found' });

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'team_deleted', entity: 'team', entityId: Number(req.params.id)
  });

  res.json({ success: true, message: 'Team deleted' });
}));

// POST /api/teams/:id/members - add a member
router.post('/:id/members', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });

  await pool.query('INSERT IGNORE INTO team_members (team_id, user_id) VALUES (?, ?)', [req.params.id, userId]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'team_member_added', entity: 'team', entityId: Number(req.params.id), metadata: { addedUserId: userId }
  });

  res.status(201).json({ success: true, message: 'Member added' });
}));

// DELETE /api/teams/:id/members/:userId - remove a member
router.delete('/:id/members/:userId', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM team_members WHERE team_id = ? AND user_id = ?', [req.params.id, req.params.userId]);

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'team_member_removed', entity: 'team', entityId: Number(req.params.id), metadata: { removedUserId: Number(req.params.userId) }
  });

  res.json({ success: true, message: 'Member removed' });
}));

module.exports = router;
