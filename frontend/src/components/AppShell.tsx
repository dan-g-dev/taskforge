import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthView } from './AuthView';
import { Sidebar, type NavView } from './Sidebar';
import { DashboardView } from './DashboardView';
import { KanbanView } from './KanbanView';
import { ProjectsView } from './ProjectsView';
import { TeamsView } from './TeamsView';
import { OrganizationView } from './OrganizationView';
import { ActivityView } from './ActivityView';
import { TaskDetailModal } from './TaskDetailModal';
import { NewTaskModal } from './NewTaskModal';
import { api } from '../services/api';
import { Menu } from 'lucide-react';
import type { Project, Team, SafeUser, Task, TaskStatus } from '../../backend/types';

export const AppShell: React.FC = () => {
  const { isAuthenticated, isLoading, organization, refreshUser } = useAuth();

  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const [tasks, setTasks] = useState<(Task & { assignee?: SafeUser; creator?: SafeUser })[]>([]);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [newTaskModal, setNewTaskModal] = useState<{ open: boolean; status?: TaskStatus }>({ open: false });

  const refreshProjects = useCallback(async () => {
    const res = await api.listProjects();
    setProjects(res.projects);
    if (!selectedProjectId && res.projects.length > 0) {
      setSelectedProjectId(res.projects[0].id);
    }
  }, [selectedProjectId]);

  const refreshTeams = useCallback(async () => {
    const res = await api.listTeams();
    setTeams(res.teams);
  }, []);

  const refreshUsers = useCallback(async () => {
    const res = await api.listOrgUsers();
    setUsers(res.users);
  }, []);

  const refreshTasks = useCallback(async (projectId: string) => {
    if (!projectId) return;
    const res = await api.listTasks({ projectId });
    setTasks(res.tasks);
  }, []);

  // Initial load once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    refreshProjects();
    refreshTeams();
    refreshUsers();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload tasks whenever the selected project changes
  useEffect(() => {
    if (selectedProjectId) refreshTasks(selectedProjectId);
  }, [selectedProjectId, refreshTasks]);

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus, newPosition?: number) => {
    // optimistic update so the drag feels instant
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await api.updateTaskStatus(taskId, newStatus, newPosition);
    } finally {
      refreshTasks(selectedProjectId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-slate-200 bg-white">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-900">{organization?.name || 'TaskForge'}</span>
        </div>

        <main className="flex-1 min-w-0 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              projects={projects}
              onTaskSelect={(id) => setActiveTaskId(id)}
              onNavigateToProjects={() => setCurrentView('projects')}
              onNavigateToKanban={() => setCurrentView('kanban')}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setCurrentView('kanban');
              }}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              projects={projects}
              teams={teams}
              users={users}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setCurrentView('kanban');
              }}
              onRefreshProjects={refreshProjects}
            />
          )}

          {currentView === 'kanban' && (
            <KanbanView
              tasks={tasks}
              projects={projects}
              users={users}
              selectedProjectId={selectedProjectId}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onTaskSelect={(id) => setActiveTaskId(id)}
              onOpenNewTaskModal={(status) => setNewTaskModal({ open: true, status })}
            />
          )}

          {currentView === 'teams' && (
            <TeamsView teams={teams} users={users} onRefreshTeams={refreshTeams} />
          )}

          {currentView === 'organization' && (
            <OrganizationView
              organization={organization}
              users={users}
              onRefreshUsers={refreshUsers}
              onRefreshOrg={refreshUser}
            />
          )}

          {currentView === 'activity' && (
            <ActivityView projects={projects} selectedProjectId={selectedProjectId} />
          )}
        </main>
      </div>

      {activeTaskId && (
        <TaskDetailModal
          taskId={activeTaskId}
          users={users}
          onClose={() => setActiveTaskId(null)}
          onTaskUpdated={() => refreshTasks(selectedProjectId)}
          onTaskDeleted={() => {
            setActiveTaskId(null);
            refreshTasks(selectedProjectId);
          }}
        />
      )}

      {newTaskModal.open && (
        <NewTaskModal
          projects={projects}
          users={users}
          selectedProjectId={selectedProjectId}
          initialStatus={newTaskModal.status}
          onClose={() => setNewTaskModal({ open: false })}
          onTaskCreated={() => refreshTasks(selectedProjectId)}
        />
      )}
    </div>
  );
};
