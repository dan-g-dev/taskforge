import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  FolderKanban, 
  UserPlus, 
  UserMinus,
  Briefcase
} from 'lucide-react';
import type { Team, SafeUser } from '../../backend/types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface TeamsViewProps {
  teams: any[];
  users: SafeUser[];
  onRefreshTeams: () => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  users,
  onRefreshTeams
}) => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Add member modal state
  const [selectedTeamForMember, setSelectedTeamForMember] = useState<string | null>(null);
  const [memberToAddId, setMemberToAddId] = useState('');

  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const isAdmin = user?.role === 'ADMIN';

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setSubmitting(true);
    try {
      await api.createTeam(teamName.trim(), description.trim());
      setIsCreateModalOpen(false);
      setTeamName('');
      setDescription('');
      onRefreshTeams();
    } catch (err: any) {
      alert(err.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamId: string, name: string) => {
    if (!confirm(`Delete team "${name}"?`)) return;
    try {
      await api.deleteTeam(teamId);
      onRefreshTeams();
    } catch (err: any) {
      alert(err.message || 'Failed to delete team');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForMember || !memberToAddId) return;

    try {
      await api.addTeamMember(selectedTeamForMember, memberToAddId);
      setSelectedTeamForMember(null);
      setMemberToAddId('');
      onRefreshTeams();
    } catch (err: any) {
      alert(err.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    if (!confirm('Remove this member from team?')) return;
    try {
      await api.removeTeamMember(teamId, userId);
      onRefreshTeams();
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto bg-slate-50/60">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Teams
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Group developers and project managers by squads, departments, or focus areas.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
          </button>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{team.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {canManage && (
                    <button
                      onClick={() => setSelectedTeamForMember(team.id)}
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Add Member</span>
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {team.description || 'No team description provided.'}
              </p>

              {/* Members Section */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Members ({team.members?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {team.members?.map((m: SafeUser) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                        style={{ backgroundColor: m.avatar_color || '#2563EB' }}
                      >
                        {m.first_name[0]}{m.last_name[0]}
                      </div>
                      <span className="font-medium text-slate-700">
                        {m.first_name} {m.last_name}
                      </span>
                      {canManage && (
                        <button
                          onClick={() => handleRemoveMember(team.id, m.id)}
                          className="text-slate-400 hover:text-red-600 ml-1"
                          title="Remove from team"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {(!team.members || team.members.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No members assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Associated Projects */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                <span>{team.projects?.length || 0} Projects Assigned</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Create New Team</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Core Infrastructure Squad"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Responsibilities, domain ownership..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {selectedTeamForMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-3">Add Member to Team</h3>
            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select User</label>
                <select
                  required
                  value={memberToAddId}
                  onChange={(e) => setMemberToAddId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Choose a team member...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeamForMember(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
