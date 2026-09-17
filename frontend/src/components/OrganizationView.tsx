import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Check, 
  Briefcase, 
  Code2, 
  Edit3,
  AlertCircle
} from 'lucide-react';
import type { Organization, SafeUser, UserRole } from '../../backend/types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface OrganizationViewProps {
  organization: Organization | null;
  users: SafeUser[];
  onRefreshUsers: () => void;
  onRefreshOrg: () => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  organization,
  users,
  onRefreshUsers,
  onRefreshOrg
}) => {
  const { user: currentUser } = useAuth();
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New user form state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('DEVELOPER');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    try {
      await api.updateOrganization(orgName.trim());
      setIsEditingOrg(false);
      onRefreshOrg();
    } catch (err: any) {
      alert(err.message || 'Failed to update organization');
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      onRefreshUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleRemoveUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove user "${email}" from the organization?`)) return;
    try {
      await api.removeOrgUser(userId);
      onRefreshUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to remove user');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.addOrgUser({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
        password: password.trim() || undefined
      });
      setIsAddUserModalOpen(false);
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('DEVELOPER');
      onRefreshUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto bg-slate-50/60">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Organization & Members
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage organization profile, team members, and role-based permissions (RBAC).
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Read-only: Admin role required to modify users</span>
          </div>
        )}
      </div>

      {/* Organization Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              {isEditingOrg ? (
                <form onSubmit={handleUpdateOrg} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-blue-500"
                  />
                  <button type="submit" className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-slate-900">{organization?.name || 'TaskForge Workspace'}</h3>
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditingOrg(true)}
                      className="text-slate-400 hover:text-blue-600"
                      title="Rename organization"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
              <span className="text-xs text-slate-400 font-mono">
                slug: {organization?.slug || 'workspace'} • {users.length} registered members
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">Directory ({users.length})</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Backend RBAC checks enforce permissions for all operations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role (RBAC)</th>
                <th className="px-5 py-3">Joined Date</th>
                {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs shrink-0"
                        style={{ backgroundColor: u.avatar_color || '#2563EB' }}
                      >
                        {u.first_name[0]}{u.last_name[0]}
                      </div>
                      <span>{u.first_name} {u.last_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{u.email}</td>
                  <td className="px-5 py-3.5">
                    {isAdmin ? (
                      <select
                        value={u.role}
                        disabled={u.id === currentUser?.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700 cursor-pointer disabled:bg-transparent disabled:border-transparent"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-red-50 text-red-700' :
                        u.role === 'MANAGER' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5 text-right">
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => handleRemoveUser(u.id, u.email)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-3">Add Member to Organization</h3>
            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@company.com"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="DEVELOPER">DEVELOPER (View tasks, update status, comment, attachments)</option>
                  <option value="MANAGER">MANAGER (Create projects, create & assign tasks, manage teams)</option>
                  <option value="ADMIN">ADMIN (Full organization, billing, project, user & team control)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  {submitting ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
