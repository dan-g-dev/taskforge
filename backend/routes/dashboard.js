const express = require('express');
const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateUser);

const USER_COLS = 'id, organization_id, first_name, last_name, email, role, avatar_color, created_at';

// GET /api/dashboard
router.get('/', asyncHandler(async (req, res) => {
  const orgId = req.user.organization_id;

  const [[totals]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM projects WHERE organization_id = ?) AS totalProjects,
       (SELECT COUNT(*) FROM tasks t JOIN projects p ON p.id = t.project_id WHERE p.organization_id = ?) AS totalTasks,
       (SELECT COUNT(*) FROM tasks t JOIN projects p ON p.id = t.project_id WHERE p.organization_id = ? AND t.status = 'DONE') AS completedTasks,
       (SELECT COUNT(*) FROM tasks t JOIN projects p ON p.id = t.project_id
          WHERE p.organization_id = ? AND t.due_date < CURDATE() AND t.status != 'DONE') AS overdueTasks`,
    [orgId, orgId, orgId, orgId]
  );

  const [myTaskRows] = await pool.query(
    `SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id
     WHERE t.assignee_id = ? AND t.status != 'DONE'
     ORDER BY t.due_date IS NULL, t.due_date ASC LIMIT 10`,
    [req.user.id]
  );
  const myTasks = await Promise.all(myTaskRows.map(async (t) => {
    const [[project]] = await pool.query('SELECT * FROM projects WHERE id = ?', [t.project_id]);
    return { ...t, project };
  }));

  const [deadlineRows] = await pool.query(
    `SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id
     WHERE p.organization_id = ? AND t.due_date IS NOT NULL AND t.due_date >= CURDATE() AND t.status != 'DONE'
     ORDER BY t.due_date ASC LIMIT 10`,
    [orgId]
  );
  const upcomingDeadlines = await Promise.all(deadlineRows.map(async (t) => {
    const [[project]] = await pool.query('SELECT * FROM projects WHERE id = ?', [t.project_id]);
    let assignee;
    if (t.assignee_id) {
      const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [t.assignee_id]);
      assignee = user;
    }
    return { ...t, project, assignee };
  }));

  const [activityRows] = await pool.query(
    `SELECT * FROM activity_logs WHERE organization_id = ? ORDER BY created_at DESC LIMIT 10`,
    [orgId]
  );
  const recentActivity = await Promise.all(activityRows.map(async (a) => {
    const [[user]] = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id = ?`, [a.user_id]);
    return { ...a, user };
  }));

  const [recentNotifications] = await pool.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
    [req.user.id]
  );

  res.json({
    success: true,
    stats: {
      totalProjects: totals.totalProjects,
      totalTasks: totals.totalTasks,
      completedTasks: totals.completedTasks,
      overdueTasks: totals.overdueTasks,
      myTasksCount: myTasks.length,
      myTasks,
      upcomingDeadlines
    },
    recentActivity,
    recentNotifications
  });
}));

module.exports = router;
