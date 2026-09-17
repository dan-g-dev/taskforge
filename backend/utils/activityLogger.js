const pool = require('../config/db');

// Records an entry in the activity_logs table.
// action: short string like "task_created", "task_status_changed"
// entity: "project" | "task" | "team" | "comment" | "user" | "organization"
// metadata: any extra JSON-serializable info about what happened
async function logActivity({ organizationId, userId, action, entity, entityId, projectId = null, metadata = null }) {
  await pool.query(
    `INSERT INTO activity_logs (organization_id, project_id, user_id, action, entity, entity_id, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [organizationId, projectId, userId, action, entity, entityId, metadata ? JSON.stringify(metadata) : null]
  );
}

module.exports = { logActivity };
