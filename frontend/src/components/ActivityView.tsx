import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  CheckSquare, 
  FolderKanban, 
  MessageSquare, 
  Paperclip, 
  Users, 
  ShieldAlert,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import type { Project } from '../../backend/types';

interface ActivityViewProps {
  projects: Project[];
  selectedProjectId: string;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  projects,
  selectedProjectId: initialProjectFilter
}) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState<string>(initialProjectFilter || 'ALL');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.listActivity(filterProject !== 'ALL' ? filterProject : undefined);
      setActivities(res.activity);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filterProject]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'TASK_CREATED':
        return { label: 'Task Created', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckSquare };
      case 'STATUS_CHANGED':
        return { label: 'Status Changed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Clock };
      case 'TASK_UPDATED':
        return { label: 'Task Updated', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: CheckSquare };
      case 'COMMENT_ADDED':
        return { label: 'Comment Added', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: MessageSquare };
      case 'ATTACHMENT_UPLOADED':
        return { label: 'Attachment', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Paperclip };
      case 'PROJECT_CREATED':
        return { label: 'Project Created', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FolderKanban };
      case 'ROLE_CHANGED':
        return { label: 'Role Changed', bg: 'bg-red-50 text-red-700 border-red-200', icon: ShieldAlert };
      default:
        return { label: action.replace('_', ' '), bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: Activity };
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto bg-slate-50/60">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Activity Feed
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Audit logs and real-time history of tasks, project changes, and member activities.
          </p>
        </div>

        {/* Project Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.key_prefix} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading audit trail...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No activity logs found for this project
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => {
              const badge = getActionBadge(act.action);
              const BadgeIcon = badge.icon;
              return (
                <div key={act.id} className="relative flex items-start gap-3 text-xs">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>

                  <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                          style={{ backgroundColor: act.user?.avatar_color || '#2563EB' }}
                        >
                          {act.user ? `${act.user.first_name[0]}${act.user.last_name[0]}` : 'U'}
                        </div>
                        <span className="font-bold text-slate-900">
                          {act.user ? `${act.user.first_name} ${act.user.last_name}` : 'System'}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                      {act.action === 'TASK_CREATED' && (
                        <>Created task <span className="font-bold">&quot;{act.metadata?.title}&quot;</span> with priority <span className="font-semibold text-blue-600">{act.metadata?.priority}</span>.</>
                      )}
                      {act.action === 'STATUS_CHANGED' && (
                        <>Moved <span className="font-bold">&quot;{act.metadata?.title}&quot;</span> from <span className="font-mono bg-slate-200/80 px-1 rounded">{act.metadata?.from}</span> to <span className="font-mono bg-emerald-100 text-emerald-800 px-1 rounded">{act.metadata?.to}</span>.</>
                      )}
                      {act.action === 'TASK_UPDATED' && (
                        <>Updated task attributes on <span className="font-bold">&quot;{act.metadata?.title}&quot;</span>.</>
                      )}
                      {act.action === 'COMMENT_ADDED' && (
                        <>Commented on <span className="font-bold">&quot;{act.metadata?.taskTitle}&quot;</span>: <span className="italic text-slate-600">&quot;{act.metadata?.commentSnippet}&quot;</span></>
                      )}
                      {act.action === 'ATTACHMENT_UPLOADED' && (
                        <>Uploaded attachment <span className="font-mono font-semibold">{act.metadata?.fileName}</span>.</>
                      )}
                      {act.action === 'PROJECT_CREATED' && (
                        <>Created new project <span className="font-bold">&quot;{act.metadata?.name}&quot;</span> [{act.metadata?.key}].</>
                      )}
                      {act.action === 'USER_INVITED' && (
                        <>Invited new user <span className="font-semibold">{act.metadata?.name}</span> with role <span className="font-bold">{act.metadata?.role}</span>.</>
                      )}
                      {act.action === 'ROLE_CHANGED' && (
                        <>Changed role of <span className="font-semibold">{act.metadata?.targetUser}</span> to <span className="font-bold text-red-600">{act.metadata?.newRole}</span>.</>
                      )}
                    </p>

                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(act.created_at).toLocaleDateString()} at {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
