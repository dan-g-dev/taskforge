const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

// A small fixed palette so avatar colors look intentional, not random.
const AVATAR_COLORS = ['#2F5FED', '#E2793D', '#3F7D54', '#8B5CF6', '#DB2777', '#0EA5E9'];
function pickAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function safeUser(row) {
  const { password_hash, ...rest } = row;
  return rest;
}

// POST /api/auth/register
// Creates a brand new organization + its first user (as ADMIN),
// unless organizationName is omitted, in which case... we still require it.
router.post('/register', asyncHandler(async (req, res) => {
  const { organizationName, firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, error: 'firstName, lastName, email and password are required' });
  }
  const finalOrgName = organizationName && organizationName.trim() ? organizationName.trim() : `${firstName}'s Team`;
  const validRoles = ['ADMIN', 'MANAGER', 'DEVELOPER'];
  const finalRole = validRoles.includes(role) ? role : 'ADMIN';
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orgResult] = await connection.query(
      'INSERT INTO organizations (name) VALUES (?)',
      [finalOrgName]
    );
    const organizationId = orgResult.insertId;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const avatarColor = pickAvatarColor();

    const [userResult] = await connection.query(
      `INSERT INTO users (organization_id, first_name, last_name, email, password_hash, role, avatar_color)
       VALUES (?, ?, ?, ?, ?, 'ADMIN', ?)`,
      [organizationId, firstName, lastName, email, passwordHash, avatarColor]
    );

    await connection.commit();

    const user = safeUser({
      id: userResult.insertId,
      organization_id: organizationId,
      first_name: firstName,
      last_name: lastName,
      email,
      role: 'ADMIN',
      avatar_color: avatarColor,
      created_at: new Date().toISOString()
    });

    const token = signToken(user);
    res.status(201).json({ success: true, token, user });
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const user = rows[0];
  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({ success: true, token, user: safeUser(user) });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out. Please discard your token.' });
});

// GET /api/auth/me
router.get('/me', authenticateUser, asyncHandler(async (req, res) => {
  const [orgRows] = await pool.query('SELECT * FROM organizations WHERE id = ?', [req.user.organization_id]);
  res.json({ success: true, user: req.user, organization: orgRows[0] || null });
}));

// GET /api/auth/demo-users - lets the landing page's "try a role" UI list demo accounts
router.get('/demo-users', asyncHandler(async (req, res) => {
  const demoEmails = ['admin@taskforge.io', 'manager@taskforge.io', 'david@taskforge.io'];
  const [rows] = await pool.query(
    `SELECT id, organization_id, first_name, last_name, email, role, avatar_color, created_at
     FROM users WHERE email IN (?)`,
    [demoEmails]
  );
  const demoUsers = rows.map((row) => ({ ...row, defaultPassword: 'password123' }));
  res.json({ success: true, demoUsers });
}));

module.exports = router;
