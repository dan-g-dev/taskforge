const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 1. Read JWT from Authorization header
// 2. Verify JWT
// 3. Look up the user
// 4. Attach user info to req.user
// 5. Continue
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.query(
      'SELECT id, organization_id, first_name, last_name, email, role, avatar_color, created_at FROM users WHERE id = ?',
      [payload.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = rows[0]; // { id, organization_id, name, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticateUser };
