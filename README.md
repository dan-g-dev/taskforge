# TaskForge

A full-stack project & team management app (Trello/Jira-style) —
React + Vite frontend, Express + MySQL backend, JWT auth, role-based
access control, and a drag-and-drop Kanban board.

```
taskforge/
├── frontend/     React + Vite + Tailwind + dnd-kit + TanStack Query
├── backend/      Express + MySQL REST API
└── database/     schema.sql (MySQL DDL)
```

## 1. Prerequisites

- Node.js 18+
- MySQL 8 running locally (or update `backend/.env` to point elsewhere)

## 2. Database setup

```bash
mysql -u root -p -e "CREATE DATABASE taskforge;"
mysql -u root -p taskforge < database/schema.sql
```

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env   # edit DB_USER / DB_PASSWORD to match your MySQL setup
node utils/seed.js     # loads demo org + 3 demo users + sample projects/tasks
npm start               # http://localhost:4000
```

Demo logins (all password `password123`):

| Email                  | Role      |
|-------------------------|-----------|
| admin@taskforge.io      | ADMIN     |
| manager@taskforge.io    | MANAGER   |
| david@taskforge.io      | DEVELOPER |

## 4. Frontend setup

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:4000`
(see `frontend/vite.config.ts`), so no CORS config or extra env vars are
needed for local development.

- `/` — the marketing/landing page
- `/app` — the actual product (dashboard, kanban, projects, teams, org admin)

On first load of `/app` with no saved session, it auto-logs in as the demo
admin account so you can explore immediately. Use the login screen to try
the other two demo roles and see how the UI/permissions differ.

## 5. Building for production

```bash
cd frontend && npm run build   # outputs to frontend/dist
cd backend  && npm start       # serve the API (put behind a reverse proxy)
```

`frontend/dist` is static and can be served by any static host / CDN; just
make sure `/api` and `/uploads` are proxied to the backend in production too.

## Architecture notes

- **Auth**: JWT bearer tokens, bcrypt-hashed passwords, 7-day expiry.
- **RBAC**: enforced server-side (`backend/middleware/rbac.js`) — ADMIN,
  MANAGER, DEVELOPER — never trust the frontend to hide buttons alone.
- **Multi-tenancy**: every query is scoped by `organization_id`; verified
  that one org can never read another org's projects, tasks, or files.
- **IDs**: the database uses plain auto-increment integers, but every
  JSON response converts id fields to strings before sending, to match
  the frontend's TypeScript types (see `backend/server.js`,
  `stringifyIds`).
- **File uploads**: stored on local disk under `backend/uploads/`,
  validated by MIME type and size (10MB default), served statically at
  `/uploads/...`. For production, swap for S3/Cloud Storage.
- **Landing page**: `frontend/src/App.tsx` and its marketing components
  are a separate page from the working product (behind `/app`, wired up
  in `frontend/src/components/AppShell.tsx`). The "Sign Up" modal calls
  the real registration API and drops you into `/app` as a brand new
  account; "Request a Demo" saves the lead to a `demo_requests` table
  (no email/CRM integration — it's just persisted for follow-up).

## Known limitations

- No automated test suite (all testing was done manually via curl against
  a live server during development).
- File storage is local disk only — fine for a demo, not for multi-server
  production deployments.
- No email verification, password reset, or 2FA.
- "Request a Demo" just stores the lead in the database — nothing actually
  emails or calls the person back.
