import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useDraggable
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { 
  Plus, 
  Calendar, 
  MessageSquare, 
  Paperclip, 
  Search, 
  Filter, 
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import type { Task, TaskPriority, TaskStatus, SafeUser, Project } from '../../backend/types';
import { useAuth } from '../context/AuthContext';

interface KanbanViewProps {
  tasks: (Task & { assignee?: SafeUser; creator?: SafeUser; commentsCount?: number; attachmentsCount?: number })[];
  projects: Project[];
  users: SafeUser[];
  selectedProjectId: string;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus, newPosition?: number) => void;
  onTaskSelect: (taskId: string) => void;
  onOpenNewTaskModal: (columnStatus?: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string; bg: string; border: string }[] = [
  { id: 'TODO', title: 'To Do', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  { id: 'REVIEW', title: 'In Review', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-300' },
  { id: 'DONE', title: 'Done', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300' }
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  projects,
  users,
  selectedProjectId,
  onUpdateTaskStatus,
  onTaskSelect,
  onOpenNewTaskModal
}) => {
  const { user } = useAuth();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  const canCreate = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  // Sensors for drag-and-drop: Pointer and Touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // Avoid accidental drags when clicking to view details
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5
      }
    })
  );

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId !== 'ALL' && t.project_id !== selectedProjectId) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'ALL') {
      if (assigneeFilter === 'UNASSIGNED' && t.assignee_id !== null) return false;
      if (assigneeFilter !== 'UNASSIGNED' && t.assignee_id !== assigneeFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchKey = `TF-${t.task_number}`.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchKey) return false;
    }
    return true;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = String(active.id);
    let targetStatus: TaskStatus;

    // Check if dropped onto a column or another task in that column
    if (COLUMNS.some((c) => c.id === over.id)) {
      targetStatus = over.id as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      } else {
        return;
      }
    }

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      onUpdateTaskStatus(taskId, targetStatus);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/70 overflow-hidden">
      {/* Filters & Control Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Keyword search inside board */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-40 sm:w-52"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Assignee filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Assignees</option>
            <option value="UNASSIGNED">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.first_name} {u.last_name}
              </option>
            ))}
          </select>

          {(searchQuery || priorityFilter !== 'ALL' || assigneeFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('ALL');
                setAssigneeFilter('ALL');
              }}
              className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="hidden sm:inline">Showing {filteredTasks.length} of {tasks.length} tasks</span>
          {canCreate && (
            <button
              onClick={() => onOpenNewTaskModal('TODO')}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 min-w-[320px] md:min-w-[900px] xl:min-w-[1100px] items-start pb-6">
            {COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter((t) => t.status === column.id);
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onTaskSelect={onTaskSelect}
                  onQuickAdd={() => onOpenNewTaskModal(column.id)}
                  canCreate={canCreate}
                />
              );
            })}
          </div>

          {/* Active Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

interface ColumnProps {
  column: { id: TaskStatus; title: string; color: string; bg: string; border: string };
  tasks: Task[];
  onTaskSelect: (id: string) => void;
  onQuickAdd: () => void;
  canCreate: boolean;
}

const KanbanColumn: React.FC<ColumnProps> = ({
  column,
  tasks,
  onTaskSelect,
  onQuickAdd,
  canCreate
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border flex flex-col max-h-[calc(100vh-175px)] transition-colors ${
        isOver ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-300' : 'bg-slate-100/70 border-slate-200'
      }`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-slate-200/80 flex items-center justify-between bg-white/70 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            column.id === 'TODO' ? 'bg-slate-400' :
            column.id === 'IN_PROGRESS' ? 'bg-blue-500' :
            column.id === 'REVIEW' ? 'bg-purple-500' : 'bg-emerald-500'
          }`} />
          <h3 className="font-bold text-xs text-slate-800 tracking-tight">{column.title}</h3>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 text-slate-700">
            {tasks.length}
          </span>
        </div>

        {canCreate && (
          <button
            onClick={onQuickAdd}
            className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title={`Add task to ${column.title}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Column Task Cards */}
      <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 min-h-[140px]">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onSelect={() => onTaskSelect(task.id)}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-28 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-3 text-slate-400 text-xs">
            <span>No tasks in {column.title}</span>
            <span className="text-[11px] text-slate-400/80">Drag a task here</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DraggableTaskCard: React.FC<{ task: Task; onSelect: () => void }> = ({ task, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={`${isDragging ? 'opacity-40' : 'opacity-100'} cursor-grab active:cursor-grabbing`}
    >
      <TaskCard task={task} />
    </div>
  );
};

export const TaskCard: React.FC<{ task: Task & { assignee?: SafeUser }; isOverlay?: boolean }> = ({
  task,
  isOverlay
}) => {
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return { label: 'Urgent', bg: 'bg-red-50 text-red-700 border-red-200' };
      case 'HIGH':
        return { label: 'High', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'MEDIUM':
        return { label: 'Medium', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'LOW':
      default:
        return { label: 'Low', bg: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
  };

  const priorityStyle = getPriorityBadge(task.priority);
  const isOverdue = task.due_date && task.status !== 'DONE' && new Date(task.due_date) < new Date();

  return (
    <div
      className={`p-3 bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all text-xs ${
        isOverlay ? 'shadow-2xl ring-2 ring-blue-500 rotate-2' : ''
      }`}
    >
      {/* Top row: Key + Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[11px] font-bold text-slate-600 uppercase">
          TF-{task.task_number || 100}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${priorityStyle.bg}`}>
          {priorityStyle.label}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-slate-900 line-clamp-2 mb-2.5 leading-snug">
        {task.title}
      </h4>

      {/* Bottom meta row: Due date & Assignee */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
        <div className="flex items-center gap-2 text-slate-500">
          {task.due_date && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{task.due_date}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {task.assignee ? (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-xs shrink-0"
            style={{ backgroundColor: task.assignee.avatar_color || '#2563EB' }}
            title={`Assigned to ${task.assignee.first_name} ${task.assignee.last_name}`}
          >
            {task.assignee.first_name[0]}{task.assignee.last_name[0]}
          </div>
        ) : (
          <div 
            className="w-5 h-5 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[9px]"
            title="Unassigned"
          >
            ?
          </div>
        )}
      </div>
    </div>
  );
};
