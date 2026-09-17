// Seeds a demo organization with 3 users (matching the frontend's
// auto-login / "switch demo role" feature), a team, a couple of
// projects, and a handful of tasks across every kanban column.
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function seed() {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@taskforge.io']);
  if (existing.length > 0) {
    console.log('Demo data already present, skipping seed.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  const [orgResult] = await pool.query('INSERT INTO organizations (name) VALUES (?)', ['TaskForge Demo']);
  const orgId = orgResult.insertId;

  const [adminResult] = await pool.query(
    `INSERT INTO users (organization_id, first_name, last_name, email, password_hash, role, avatar_color)
     VALUES (?, 'Amara', 'Okafor', 'admin@taskforge.io', ?, 'ADMIN', '#2F5FED')`,
    [orgId, passwordHash]
  );
  const adminId = adminResult.insertId;

  const [managerResult] = await pool.query(
    `INSERT INTO users (organization_id, first_name, last_name, email, password_hash, role, avatar_color)
     VALUES (?, 'Priya', 'Menon', 'manager@taskforge.io', ?, 'MANAGER', '#E2793D')`,
    [orgId, passwordHash]
  );
  const managerId = managerResult.insertId;

  const [devResult] = await pool.query(
    `INSERT INTO users (organization_id, first_name, last_name, email, password_hash, role, avatar_color)
     VALUES (?, 'David', 'Chen', 'david@taskforge.io', ?, 'DEVELOPER', '#3F7D54')`,
    [orgId, passwordHash]
  );
  const devId = devResult.insertId;

  const [team1] = await pool.query(
    'INSERT INTO teams (organization_id, name, description, created_by) VALUES (?, ?, ?, ?)',
    [orgId, 'Platform Team', 'Core product engineering', adminId]
  );
  const teamId = team1.insertId;
  await pool.query('INSERT INTO team_members (team_id, user_id) VALUES (?, ?), (?, ?), (?, ?)', [
    teamId, adminId, teamId, managerId, teamId, devId
  ]);

  const [proj1] = await pool.query(
    `INSERT INTO projects (organization_id, team_id, name, key_prefix, description, status, start_date, deadline, created_by)
     VALUES (?, ?, 'Website Redesign', 'WEB', 'Revamp the marketing site and landing pages', 'ACTIVE', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), ?)`,
    [orgId, teamId, managerId]
  );
  const project1Id = proj1.insertId;

  const [proj2] = await pool.query(
    `INSERT INTO projects (organization_id, team_id, name, key_prefix, description, status, start_date, deadline, created_by)
     VALUES (?, ?, 'Mobile App v2', 'MOB', 'Native mobile client rewrite', 'PLANNING', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), ?)`,
    [orgId, teamId, adminId]
  );
  const project2Id = proj2.insertId;

  for (const pid of [project1Id, project2Id]) {
    await pool.query('INSERT INTO project_members (project_id, user_id) VALUES (?, ?), (?, ?), (?, ?)', [
      pid, adminId, pid, managerId, pid, devId
    ]);
  }

  const tasks = [
    [project1Id, 1, 'Design homepage hero section', 'TODO', 'HIGH', devId, 5],
    [project1Id, 2, 'Set up analytics tracking', 'TODO', 'MEDIUM', null, 10],
    [project1Id, 3, 'Build responsive nav bar', 'IN_PROGRESS', 'HIGH', devId, 3],
    [project1Id, 4, 'Write copy for pricing page', 'IN_PROGRESS', 'LOW', managerId, 7],
    [project1Id, 5, 'Accessibility audit', 'REVIEW', 'MEDIUM', devId, 2],
    [project1Id, 6, 'Migrate blog to new CMS', 'DONE', 'MEDIUM', devId, null],
    [project2Id, 1, 'Define app navigation structure', 'TODO', 'HIGH', managerId, 14],
    [project2Id, 2, 'Prototype onboarding flow', 'TODO', 'URGENT', devId, 4],
    [project2Id, 3, 'Set up CI pipeline', 'IN_PROGRESS', 'MEDIUM', devId, 6],
  ];

  for (const [pid, num, title, status, priority, assignee, dueInDays] of tasks) {
    await pool.query(
      `INSERT INTO tasks (project_id, task_number, title, description, status, priority, assignee_id, created_by, due_date, position)
       VALUES (?, ?, ?, '', ?, ?, ?, ?, ${dueInDays !== null ? 'DATE_ADD(CURDATE(), INTERVAL ? DAY)' : 'NULL'}, ?)`,
      dueInDays !== null
        ? [pid, num, title, status, priority, assignee, adminId, dueInDays, num]
        : [pid, num, title, status, priority, assignee, adminId, num]
    );
  }

  console.log('Seed complete.');
  console.log('Demo logins (all password123):');
  console.log('  admin@taskforge.io    (ADMIN)');
  console.log('  manager@taskforge.io  (MANAGER)');
  console.log('  david@taskforge.io    (DEVELOPER)');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
