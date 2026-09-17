import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  FolderKanban, 
  Users, 
  Building2, 
  Activity, 
  LogOut, 
  ShieldAlert,
  Briefcase,
  Code2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../../backend/types';

export type NavView = 'dashboard' | 'kanban' | 'projects' | 'teams' | 'organization' | 'activity';

interface SidebarProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isMobileOpen,
  onMobileClose
}) => {
  const { user, organization, logout, switchDemoUser } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban' as NavView, label: 'Kanban Board', icon: Kanban },
    { id: 'projects' as NavView, label: 'Projects', icon: FolderKanban },
    { id: 'teams' as NavView, label: 'Teams', icon: Users },
    { 
      id: 'organization' as NavView, 
      label: 'Organization', 
      icon: Building2,
      badge: user?.role === 'ADMIN' ? 'Admin' : undefined 
    },
    { id: 'activity' as NavView, label: 'Activity Feed', icon: Activity }
  ];

  const handleNavClick = (view: NavView) => {
    onViewChange(view);
    onMobileClose();
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Admin', bg: 'bg-red-50 text-red-700 border-red-200', icon: ShieldAlert };
      case 'MANAGER':
        return { label: 'Manager', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Briefcase };
      case 'DEVELOPER':
      default:
        return { label: 'Developer', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Code2 };
    }
  };

  const roleInfo = getRoleBadge(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo & App Title */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
              TF
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">TaskForge</span>
              <span className="text-[11px] text-slate-400 font-medium block truncate max-w-[130px]">
                {organization?.name || 'Workspace'}
              </span>
            </div>
          </div>
        </div>

        {/* Role Quick Switcher (Essential for evaluating RBAC requirements in Phase 4 & 20) */}
        <div className="px-3 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1.5 px-1">
            <span>Test Role (RBAC):</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${roleInfo.bg}`}>
              {roleInfo.label}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[11px]">
            {(['ADMIN', 'MANAGER', 'DEVELOPER'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchDemoUser(r)}
                className={`py-1 rounded font-medium text-center transition-all cursor-pointer ${
                  user?.role === r
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={`Switch session to ${r} role`}
              >
                {r === 'DEVELOPER' ? 'Dev' : r === 'MANAGER' ? 'Mgr' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Card at Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                style={{ backgroundColor: user?.avatar_color || '#2563EB' }}
              >
                {user ? `${user.first_name[0]}${user.last_name[0]}` : 'TF'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user ? `${user.first_name} ${user.last_name}` : 'User'}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <RoleIcon className="w-3 h-3" />
                  <span className="capitalize">{user?.role.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-md transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
