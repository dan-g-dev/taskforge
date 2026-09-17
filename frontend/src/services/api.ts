// ==========================================================
// TaskForge Client API Client
// Handles authentication headers, REST calls, and typed responses
// ==========================================================

import type { 
  SafeUser, 
  Organization, 
  Project, 
  Team, 
  Task, 
  Comment, 
  Attachment, 
  Notification, 
  ActivityLog, 
  TaskStatus, 
  TaskPriority,
  UserRole
} from '../../backend/types';

const TOKEN_KEY = 'taskforge_token';
const USER_KEY = 'taskforge_user';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): SafeUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: SafeUser): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; app: string; version: string }>('/api/health'),

  requestDemo: (payload: { name: string; email: string; phone?: string; teamSize?: string; useCase?: string }) =>
    request<{ success: boolean; message: string }>('/api/demo-requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Auth
  login: async (email: string, password: string) => {
    const res = await request<{ success: boolean; token: string; user: SafeUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    tokenStorage.set(res.token);
    tokenStorage.setUser(res.user);
    return res;
  },

  register: async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    organizationName?: string;
  }) => {
    const res = await request<{ success: boolean; token: string; user: SafeUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    tokenStorage.set(res.token);
    tokenStorage.setUser(res.user);
    return res;
  },

  getMe: async () => {
    const res = await request<{ success: boolean; user: SafeUser; organization: Organization }>('/api/auth/me');
    tokenStorage.setUser(res.user);
    return res;
  },

  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      tokenStorage.remove();
    }
  },

  getDemoUsers: () => request<{ success: boolean; demoUsers: (SafeUser & { defaultPassword: string })[] }>('/api/auth/demo-users'),

  // Organization
  getOrganization: () => request<{ success: boolean; organization: Organization; stats: any }>('/api/organization'),
  updateOrganization: (name: string) => request<{ success: boolean; organization: Organization }>('/api/organization', {
    method: 'PUT',
    body: JSON.stringify({ name })
  }),
  listOrgUsers: () => request<{ success: boolean; users: SafeUser[] }>('/api/organization/users'),
  addOrgUser: (payload: { email: string; firstName: string; lastName: string; role: UserRole; password?: string }) =>
    request<{ success: boolean; user: SafeUser }>('/api/organization/users', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateUserRole: (userId: string, role: UserRole) =>
    request<{ success: boolean; user: SafeUser }>(`/api/organization/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    }),
  removeOrgUser: (userId: string) =>
    request<{ success: boolean; message: string }>(`/api/organization/users/${userId}`, {
      method: 'DELETE'
    }),

  // Teams
  listTeams: () => request<{ success: boolean; teams: (Team & { membersCount: number; members: SafeUser[]; projects: Project[] })[] }>('/api/teams'),
  createTeam: (name: string, description: string) =>
    request<{ success: boolean; team: Team }>('/api/teams', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    }),
  updateTeam: (id: string, name: string, description: string) =>
    request<{ success: boolean; team: Team }>(`/api/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description })
    }),
  deleteTeam: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/teams/${id}`, {
      method: 'DELETE'
    }),
  addTeamMember: (teamId: string, userId: string) =>
    request<{ success: boolean; message: string }>(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    }),
  removeTeamMember: (teamId: string, userId: string) =>
    request<{ success: boolean; message: string }>(`/api/teams/${teamId}/members/${userId}`, {
      method: 'DELETE'
    }),

  // Projects
  listProjects: () => request<{ success: boolean; projects: (Project & { taskCount: number; completedTasks: number; overdueTasks: number; teamName?: string; members: SafeUser[] })[] }>('/api/projects'),
  getProject: (id: string) => request<{
    success: boolean;
    project: Project & {
      teamName?: string;
      members: SafeUser[];
      stats: { totalTasks: number; completedTasks: number; overdueTasks: number; progress: number };
      recentActivity: (ActivityLog & { user?: SafeUser })[];
    };
  }>(`/api/projects/${id}`),
  createProject: (payload: {
    name: string;
    keyPrefix?: string;
    description?: string;
    teamId?: string;
    status?: string;
    startDate?: string;
    deadline?: string;
  }) => request<{ success: boolean; project: Project }>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateProject: (id: string, payload: Partial<Project>) =>
    request<{ success: boolean; project: Project }>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  deleteProject: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/projects/${id}`, {
      method: 'DELETE'
    }),

  // Tasks
  listTasks: (filters?: { projectId?: string; status?: string; priority?: string; assigneeId?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.set('projectId', filters.projectId);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.assigneeId) params.set('assigneeId', filters.assigneeId);
    if (filters?.search) params.set('search', filters.search);
    return request<{ success: boolean; tasks: (Task & { assignee?: SafeUser; creator?: SafeUser })[] }>(`/api/tasks?${params.toString()}`);
  },
  getTask: (id: string) => request<{
    success: boolean;
    task: Task & {
      assignee?: SafeUser;
      creator?: SafeUser;
      project?: Project;
      comments: (Comment & { user?: SafeUser })[];
      attachments: (Attachment & { user?: SafeUser })[];
      activityHistory: (ActivityLog & { user?: SafeUser })[];
    };
  }>(`/api/tasks/${id}`),
  createTask: (payload: {
    projectId: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
  }) => request<{ success: boolean; task: Task }>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateTask: (id: string, payload: Partial<Task> & { dueDate?: string; assigneeId?: string }) =>
    request<{ success: boolean; task: Task }>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  updateTaskStatus: (id: string, status: TaskStatus, position?: number) =>
    request<{ success: boolean; task: Task }>(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, position })
    }),
  deleteTask: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE'
    }),

  // Comments
  listComments: (taskId: string) =>
    request<{ success: boolean; comments: (Comment & { user?: SafeUser })[] }>(`/api/tasks/${taskId}/comments`),
  createComment: (taskId: string, content: string) =>
    request<{ success: boolean; comment: Comment & { user?: SafeUser } }>(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    }),
  updateComment: (commentId: string, content: string) =>
    request<{ success: boolean; comment: Comment }>(`/api/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    }),
  deleteComment: (commentId: string) =>
    request<{ success: boolean; message: string }>(`/api/comments/${commentId}`, {
      method: 'DELETE'
    }),

  // Attachments
  uploadAttachment: (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ success: boolean; attachment: Attachment & { user?: SafeUser } }>(`/api/tasks/${taskId}/attachments`, {
      method: 'POST',
      body: formData
    });
  },
  deleteAttachment: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/attachments/${id}`, {
      method: 'DELETE'
    }),

  // Notifications
  listNotifications: () =>
    request<{ success: boolean; notifications: Notification[]; unreadCount: number }>('/api/notifications'),
  markNotificationRead: (id: string) =>
    request<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PATCH'
    }),
  markAllNotificationsRead: () =>
    request<{ success: boolean; markedCount: number }>('/api/notifications/read-all', {
      method: 'POST'
    }),

  // Activity & Dashboard
  listActivity: (projectId?: string) => {
    const query = projectId ? `?projectId=${projectId}` : '';
    return request<{ success: boolean; activity: (ActivityLog & { user?: SafeUser })[] }>(`/api/activity${query}`);
  },
  getDashboard: () =>
    request<{
      success: boolean;
      stats: {
        totalProjects: number;
        totalTasks: number;
        completedTasks: number;
        overdueTasks: number;
        myTasksCount: number;
        myTasks: (Task & { project?: Project })[];
        upcomingDeadlines: (Task & { project?: Project; assignee?: SafeUser })[];
      };
      recentActivity: (ActivityLog & { user?: SafeUser })[];
      recentNotifications: Notification[];
    }>('/api/dashboard')
};
