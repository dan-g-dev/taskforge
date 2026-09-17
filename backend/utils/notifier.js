const pool = require('../config/db');

// Creates a notification row for a single user.
async function notifyUser({ userId, type, title = '', message, link = null }) {
  if (!userId) return;
  await pool.query(
    `INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)`,
    [userId, type, title, message, link]
  );
}

module.exports = { notifyUser };
