require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organizations');
const teamRoutes = require('./routes/teams');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const { taskCommentRouter, commentRouter } = require('./routes/comments');
const { taskAttachmentRouter, attachmentRouter } = require('./routes/attachments');
const notificationRoutes = require('./routes/notifications');
const activityRoutes = require('./routes/activity');
const dashboardRoutes = require('./routes/dashboard');
const demoRequestRoutes = require('./routes/demoRequests');

const app = express();

app.use(cors());
app.use(express.json());

// The frontend's TypeScript types model every id as a string (it was
// originally written against a UUID-based backend). Our backend uses
// plain auto-increment integers, which is simpler to read and query.
// Rather than rewrite the frontend's id types everywhere, we convert
// integer id-like fields to strings right before they leave the server.
const ID_KEYS = new Set([
  'id', 'organization_id', 'team_id', 'project_id', 'user_id', 'task_id',
  'assignee_id', 'created_by', 'uploaded_by', 'entity_id', 'addedUserId',
  'removedUserId', 'assigneeId'
]);

function stringifyIds(value) {
  if (Array.isArray(value)) return value.map(stringifyIds);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (ID_KEYS.has(key) && (typeof val === 'number')) {
        out[key] = String(val);
      } else {
        out[key] = stringifyIds(val);
      }
    }
    return out;
  }
  return value;
}

app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(stringifyIds(body));
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'TaskForge', version: '1.0.0' });
});

// Serve uploaded files (attachments) statically
app.use('/uploads', express.static(require('path').join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks', taskCommentRouter);       // /api/tasks/:taskId/comments
app.use('/api/comments', commentRouter);        // /api/comments/:id
app.use('/api/tasks', taskAttachmentRouter);    // /api/tasks/:taskId/attachments
app.use('/api/attachments', attachmentRouter);  // /api/attachments/:id/...
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/demo-requests', demoRequestRoutes);

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message === 'File type not allowed') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TaskForge API listening on http://localhost:${PORT}`);
});
