const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { logActivity } = require('../utils/activityLogger');

const router = express.Router();
router.use(authenticateUser);

const AVATAR_COLORS = ['#2F5FED', '#E2793D', '#3F7D54', '#8B5CF6', '#DB2777', '#0EA5E9'];
function pickAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

// GET /api/organization - view my organization + a few headline stats
router.get('/', asyncHandler(async (req, res) => {
  const [orgRows] = await pool.query('SELECT * FROM organizations WHERE id = ?', [req.user.organization_id]);
  const [[stats]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM users WHERE organization_id = ?) AS memberCount,
       (SELECT COUNT(*) FROM teams WHERE organization_id = ?) AS teamCount,
       (SELECT COUNT(*) FROM projects WHERE organization_id = ?) AS projectCount`,
    [req.user.organization_id, req.user.organization_id, req.user.organization_id]
  );
  res.json({ success: true, organization: orgRows[0], stats });
}));

// PUT /api/organization - admin can rename the organization
router.put('/', requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'name is required' });

  await pool.query('UPDATE organizations SET name = ? WHERE id = ?', [name, req.user.organization_id]);
  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'organization_updated', entity: 'organization', entityId: req.user.organization_id
  });

  const [rows] = await pool.query('SELECT * FROM organizations WHERE id = ?', [req.user.organization_id]);
  res.json({ success: true, organization: rows[0] });
}));

// GET /api/organization/users - list all users in my organization
router.get('/users', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, organization_id, first_name, last_name, email, role, avatar_color, created_at FROM users WHERE organization_id = ? ORDER BY created_at',
    [req.user.organization_id]
  );
  res.json({ success: true, users: rows });
}));

// POST /api/organization/users - admin creates a new user directly
router.post('/users', requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ success: false, error: 'firstName, lastName and email are required' });
  }
  const validRoles = ['ADMIN', 'MANAGER', 'DEVELOPER'];
  const finalRole = validRoles.includes(role) ? role : 'DEVELOPER';

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ success: false, error: 'A user with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password || 'password123', 10);
  const avatarColor = pickAvatarColor();
  const [result] = await pool.query(
    'INSERT INTO users (organization_id, first_name, last_name, email, password_hash, role, avatar_color) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.organization_id, firstName, lastName, email, passwordHash, finalRole, avatarColor]
  );

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'user_added', entity: 'user', entityId: result.insertId
  });

  const [rows] = await pool.query(
    'SELECT id, organization_id, first_name, last_name, email, role, avatar_color, created_at FROM users WHERE id = ?',
    [result.insertId]
  );
  res.status(201).json({ success: true, user: rows[0] });
}));

// PUT /api/organization/users/:id/role - admin changes a user's role
router.put('/users/:id/role', requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { role } = req.body;
  const validRoles = ['ADMIN', 'MANAGER', 'DEVELOPER'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, error: 'role must be ADMIN, MANAGER or DEVELOPER' });
  }

  const [result] = await pool.query(
    'UPDATE users SET role = ? WHERE id = ? AND organization_id = ?',
    [role, req.params.id, req.user.organization_id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'User not found' });

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'user_role_changed', entity: 'user', entityId: Number(req.params.id), metadata: { newRole: role }
  });

  const [rows] = await pool.query(
    'SELECT id, organization_id, first_name, last_name, email, role, avatar_color, created_at FROM users WHERE id = ?',
    [req.params.id]
  );
  res.json({ success: true, user: rows[0] });
}));

// DELETE /api/organization/users/:id - admin removes a user
router.delete('/users/:id', requireRole('ADMIN'), asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ success: false, error: 'You cannot remove yourself' });
  }
  const [result] = await pool.query(
    'DELETE FROM users WHERE id = ? AND organization_id = ?',
    [req.params.id, req.user.organization_id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'User not found' });

  await logActivity({
    organizationId: req.user.organization_id, userId: req.user.id,
    action: 'user_removed', entity: 'user', entityId: Number(req.params.id)
  });

  res.json({ success: true, message: 'User removed' });
}));

module.exports = router;
