import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Trash2, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  Send, 
  Download, 
  UploadCloud, 
  FileText, 
  History, 
  AlertTriangle,
  Edit2,
  Check
} from 'lucide-react';
import type { Task, TaskPriority, TaskStatus, SafeUser, Comment, Attachment, ActivityLog } from '../../backend/types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface TaskDetailModalProps {
  taskId: string;
  users: SafeUser[];
  onClose: () => void;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  users,
  onClose,
  onTaskUpdated,
  onTaskDeleted
}) => {
  const { user: currentUser } = useAuth();
  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments' | 'history'>('comments');
  
  // Editable fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  // Comment input
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  // File upload
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canManageTask = currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER';

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const res = await api.getTask(taskId);
      const t = res.task;
      setTask(t);
      setTitle(t.title);
      setDescription(t.description || '');
      setStatus(t.status);
      setPriority(t.priority);
      setAssigneeId(t.assignee_id || '');
      setDueDate(t.due_date || '');
    } catch (err) {
      console.error('Failed to load task details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  // Handle saving task changes
  const handleSaveAttribute = async (updates: any) => {
    try {
      await api.updateTask(taskId, updates);
      await fetchTaskDetails();
      onTaskUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to update task');
    }
  };

  // Comments
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await api.createComment(taskId, commentText);
      setCommentText('');
      await fetchTaskDetails();
      onTaskUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateComment = async (id: string) => {
    if (!editCommentText.trim()) return;
    try {
      await api.updateComment(id, editCommentText);
      setEditingCommentId(null);
      await fetchTaskDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.deleteComment(id);
      await fetchTaskDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to delete comment');
    }
  };

  // Attachments
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await api.uploadAttachment(taskId, file);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchTaskDetails();
      onTaskUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to upload attachment');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (id: string) => {
    if (!confirm('Delete this attachment?')) return;
    try {
      await api.deleteAttachment(id);
      await fetchTaskDetails();
      onTaskUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to delete attachment');
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm(`Are you sure you want to delete "${task?.title}"?`)) return;
    try {
      await api.deleteTask(taskId);
      onTaskDeleted();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              TF-{task.task_number || 100}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Created {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canManageTask && (
              <button
                onClick={handleDeleteTask}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2-column layout */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Title, Description, Tabs (Comments, Attachments, History) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (title.trim() && title !== task.title) {
                    handleSaveAttribute({ title: title.trim() });
                  }
                }}
                className="w-full text-base sm:text-lg font-bold text-slate-900 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="Task title..."
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => {
                  if (description !== task.description) {
                    handleSaveAttribute({ description: description.trim() });
                  }
                }}
                rows={4}
                className="w-full text-xs text-slate-700 p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
                placeholder="Add a detailed description, acceptance criteria, steps to reproduce..."
              />
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('comments')}
                className={`pb-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'comments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments ({task.comments?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('attachments')}
                className={`pb-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'attachments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Attachments ({task.attachments?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Activity ({task.activityHistory?.length || 0})</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[160px]">
              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* New Comment Input */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment or status update..."
                      className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3 pt-1">
                    {task.comments?.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">
                        No comments yet. Start the conversation!
                      </p>
                    ) : (
                      task.comments.map((c: any) => (
                        <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                                style={{ backgroundColor: c.user?.avatar_color || '#2563EB' }}
                              >
                                {c.user ? `${c.user.first_name[0]}${c.user.last_name[0]}` : 'U'}
                              </div>
                              <span className="font-bold text-slate-800">
                                {c.user ? `${c.user.first_name} ${c.user.last_name}` : 'User'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(c.created_at).toLocaleDateString()} at {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {(c.user_id === currentUser?.id || currentUser?.role === 'ADMIN') && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(c.id);
                                    setEditCommentText(c.content);
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-blue-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(c.id)}
                                  className="text-[11px] text-slate-400 hover:text-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {editingCommentId === c.id ? (
                            <div className="flex gap-2 mt-2">
                              <input
                                type="text"
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="flex-1 text-xs border border-slate-300 rounded px-2 py-1"
                              />
                              <button
                                onClick={() => handleUpdateComment(c.id)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {c.content}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Attachments Tab */}
              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  {/* Upload Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-700">
                      {isUploading ? 'Uploading file...' : 'Click or drop files to upload'}
                    </p>
                    <p className="text-[11px] text-slate-400">PDF, PNG, JPG, ZIP, DOCX up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Attachments List */}
                  <div className="space-y-2">
                    {task.attachments?.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No attachments uploaded yet</p>
                    ) : (
                      task.attachments.map((att: any) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">{att.original_name}</p>
                              <span className="text-[10px] text-slate-400">
                                {(att.file_size / 1024).toFixed(1)} KB • Uploaded by {att.user?.first_name || 'User'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={att.file_path}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200 rounded transition-colors"
                              title="Download Attachment"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteAttachment(att.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Activity History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {task.activityHistory?.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No activity history for this task</p>
                  ) : (
                    task.activityHistory.map((act: any) => (
                      <div key={act.id} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <p>
                            <span className="font-bold text-slate-800">
                              {act.user ? `${act.user.first_name} ${act.user.last_name}` : 'System'}
                            </span>{' '}
                            {act.action === 'TASK_CREATED' && 'created this task.'}
                            {act.action === 'STATUS_CHANGED' && `changed status from ${act.metadata?.from} to ${act.metadata?.to}.`}
                            {act.action === 'TASK_UPDATED' && 'updated task details.'}
                            {act.action === 'COMMENT_ADDED' && 'added a comment.'}
                            {act.action === 'ATTACHMENT_UPLOADED' && `uploaded ${act.metadata?.fileName}.`}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(act.created_at).toLocaleDateString()} at {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Meta Attributes & RBAC Controls */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4 h-fit text-xs">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
              Task Attributes
            </h4>

            {/* Status Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value as TaskStatus;
                  setStatus(newStatus);
                  handleSaveAttribute({ status: newStatus });
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority Dropdown (RBAC Protected: Admin or Manager) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">Priority</label>
                {!canManageTask && (
                  <span className="text-[10px] text-purple-600 font-bold">Admin/Mgr only</span>
                )}
              </div>
              <select
                value={priority}
                disabled={!canManageTask}
                onChange={(e) => {
                  const newPriority = e.target.value as TaskPriority;
                  setPriority(newPriority);
                  handleSaveAttribute({ priority: newPriority });
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Assignee Dropdown (RBAC Protected: Admin or Manager) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">Assignee</label>
                {!canManageTask && (
                  <span className="text-[10px] text-purple-600 font-bold">Admin/Mgr only</span>
                )}
              </div>
              <select
                value={assigneeId}
                disabled={!canManageTask}
                onChange={(e) => {
                  const newAssignee = e.target.value;
                  setAssigneeId(newAssignee);
                  handleSaveAttribute({ assigneeId: newAssignee || null });
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Picker */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  handleSaveAttribute({ dueDate: e.target.value || null });
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
