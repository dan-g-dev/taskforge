const express = require('express');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateUser);

const USER_COLS = 'id, organization_id, first_name, last_name, email, role, avatar_color, created_at';

// GET /api/activity?projectId=optional
router.get('/', asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  let sql = `SELECT * FROM activity_logs WHERE organization_id = ?`;
  const params = [req.user.organization_id];
  if (projectId) { sql += ' AND project_id = ?'; params.push(projectId); }
  sql += ' ORDER BY created_at DESC LIMIT 50';

  const [activity] = await pool.query(sql, params);
  const withUsers = await Promise.all(activity.map(async (a) => {
    const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [a.user_id]);
    return { ...a, user };
  }));
  res.json({ success: true, activity: withUsers });
}));

module.exports = router;
