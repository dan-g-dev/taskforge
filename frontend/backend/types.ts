// ==========================================================
// TaskForge - Shared Type Definitions
// These describe the JSON shapes returned by the Express/MySQL
// backend (see ../routes/*.js). This file is TypeScript-only:
// it is never executed, it just gives the Vite/React frontend
// accurate types to build against.
// ==========================================================

export type UserRole = 'ADMIN' | 'MANAGER' | 'DEVELOPER';

export interface User {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  avatar_color: string;
  created_at: string;
}

export type SafeUser = Omit<User, 'password_hash'>;

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  created_at: string;
}

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';

export interface Project {
  id: string;
  organization_id: string;
  team_id: string | null;
  name: string;
  key_prefix: string;
  description: string;
  status: ProjectStatus;
  start_date: string | null;
  deadline: string | null;
  created_by: string;
  created_at: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  task_number: number;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  task_id: string;
  user_id: string;
  original_name: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  organization_id: string;
  project_id: string | null;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string;
  metadata: any;
  created_at: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
}
