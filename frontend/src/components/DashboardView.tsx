import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Task, Project, ActivityLog } from '../../backend/types';
import { GanttChartSection } from './GanttChartSection';

interface DashboardViewProps {
  onTaskSelect: (taskId: string) => void;
  onNavigateToProjects: () => void;
  onNavigateToKanban: () => void;
  projects: (Project & { taskCount?: number; completedTasks?: number })[];
  onSelectProject: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onTaskSelect,
  onNavigateToProjects,
  onNavigateToKanban,
  projects,
  onSelectProject
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    myTasksCount: 0,
    myTasks: [],
    upcomingDeadlines: []
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto bg-slate-50/60">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.first_name} 👋
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Here is what is happening across your projects today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToKanban}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div 
          onClick={onNavigateToProjects}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats.totalProjects}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all team workspaces</p>
        </div>

        {/* Total Tasks */}
        <div 
          onClick={onNavigateToKanban}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats.totalTasks}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Managed in backlog & boards</p>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {stats.completedTasks}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionRate}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{completionRate}% completion rate</p>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overdue Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${stats.overdueTasks > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {stats.overdueTasks}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate attention</p>
        </div>
      </div>

      {/* Project Timeline (Gantt) */}
      <GanttChartSection projects={projects} onSelectProject={onSelectProject} />

      {/* Main Grid: My Tasks & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Assigned Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-800">Tasks Assigned to Me ({stats.myTasks?.length || 0})</h3>
            </div>
            <button
              onClick={onNavigateToKanban}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              View in Kanban →
            </button>
          </div>

          {stats.myTasks?.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              🎉 No tasks assigned to you right now. Great job!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.myTasks.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => onTaskSelect(task.id)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        TF-{task.task_number || 100}
                      </span>
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{task.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Project: {task.project?.name || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'URGENT' ? 'bg-red-50 text-red-700' :
                      task.priority === 'HIGH' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">Upcoming Deadlines</h3>
          </div>

          {stats.upcomingDeadlines?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No upcoming deadlines.</p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingDeadlines.map((task: any) => {
                const isOverdue = new Date(task.due_date) < new Date();
                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskSelect(task.id)}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer text-xs"
                  >
                    <p className="font-semibold text-slate-900 truncate">{task.title}</p>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-500'}>
                        Due {task.due_date}
                      </span>
                      <span className="text-slate-400 truncate max-w-[100px]">
                        {task.assignee?.first_name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">Recent Organization Activity</h3>
        </div>

        <div className="space-y-3 pt-1">
          {data?.recentActivity?.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No recent activity</p>
          ) : (
            data?.recentActivity?.slice(0, 6).map((act: any) => (
              <div key={act.id} className="flex items-start gap-3 text-xs text-slate-600">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">
                    <span className="font-bold text-slate-900">
                      {act.user ? `${act.user.first_name} ${act.user.last_name}` : 'Team member'}
                    </span>{' '}
                    {act.action === 'TASK_CREATED' && `created task: "${act.metadata?.title}"`}
                    {act.action === 'STATUS_CHANGED' && `moved "${act.metadata?.title}" to ${act.metadata?.to}`}
                    {act.action === 'TASK_UPDATED' && `updated task: "${act.metadata?.title}"`}
                    {act.action === 'PROJECT_CREATED' && `created project: "${act.metadata?.name}"`}
                    {act.action === 'COMMENT_ADDED' && `commented on task: "${act.metadata?.taskTitle}"`}
                    {act.action === 'ATTACHMENT_UPLOADED' && `uploaded ${act.metadata?.fileName}`}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(act.created_at).toLocaleDateString()} at {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
