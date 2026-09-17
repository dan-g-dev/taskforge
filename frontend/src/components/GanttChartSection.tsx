import React, { useMemo } from 'react';
import { GanttChartSquare } from 'lucide-react';
import type { Project } from '../../backend/types';

type ProjectWithStats = Project & {
  taskCount?: number;
  completedTasks?: number;
};

interface GanttChartSectionProps {
  projects: ProjectWithStats[];
  onSelectProject?: (id: string) => void;
}

const STATUS_STYLES: Record<string, { bar: string; label: string }> = {
  ACTIVE: { bar: 'bg-emerald-500', label: 'bg-emerald-50 text-emerald-700' },
  PLANNING: { bar: 'bg-blue-500', label: 'bg-blue-50 text-blue-700' },
  ON_HOLD: { bar: 'bg-amber-500', label: 'bg-amber-50 text-amber-700' },
  COMPLETED: { bar: 'bg-violet-500', label: 'bg-violet-50 text-violet-700' }
};

const DAY_MS = 1000 * 60 * 60 * 24;

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

export const GanttChartSection: React.FC<GanttChartSectionProps> = ({ projects, onSelectProject }) => {
  const timeline = useMemo(() => {
    const dated = projects.filter((p) => p.start_date);
    if (dated.length === 0) return null;

    const starts = dated.map((p) => new Date(p.start_date as string));
    const ends = dated.map((p) => new Date((p.deadline as string) || (p.start_date as string)));

    let rangeStart = startOfMonth(new Date(Math.min(...starts.map((d) => d.getTime()))));
    let rangeEnd = addDays(new Date(Math.max(...ends.map((d) => d.getTime()))), 14);

    // Always show at least a 3-month window so a single short project doesn't look silly.
    const minSpanDays = 90;
    if ((rangeEnd.getTime() - rangeStart.getTime()) / DAY_MS < minSpanDays) {
      rangeEnd = addDays(rangeStart, minSpanDays);
    }

    const totalDays = Math.max(1, Math.round((rangeEnd.getTime() - rangeStart.getTime()) / DAY_MS));

    // Build month tick marks for the header.
    const months: Date[] = [];
    let cursor = startOfMonth(rangeStart);
    while (cursor <= rangeEnd) {
      months.push(cursor);
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    const today = new Date();
    const todayOffsetPct = ((today.getTime() - rangeStart.getTime()) / DAY_MS / totalDays) * 100;

    return { rangeStart, rangeEnd, totalDays, months, todayOffsetPct };
  }, [projects]);

  if (!timeline) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <GanttChartSquare className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">Project Timeline</h3>
        </div>
        <p className="text-xs text-slate-400 text-center py-8">
          Add a start date and deadline to a project to see it plotted here.
        </p>
      </div>
    );
  }

  const { rangeStart, totalDays, months, todayOffsetPct } = timeline;
  const datedProjects = projects.filter((p) => p.start_date);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GanttChartSquare className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">Project Timeline</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
          {Object.entries(STATUS_STYLES).map(([status, style]) => (
            <span key={status} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${style.bar}`} />
              {status.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 640 }}>
          {/* Month header */}
          <div className="relative h-6 border-b border-slate-100 mb-2">
            {months.map((m, i) => {
              const offsetPct = ((m.getTime() - rangeStart.getTime()) / DAY_MS / totalDays) * 100;
              return (
                <span
                  key={i}
                  className="absolute text-[10px] font-semibold text-slate-400 -translate-x-1/2"
                  style={{ left: `${Math.min(Math.max(offsetPct, 0), 100)}%` }}
                >
                  {monthLabel(m)}
                </span>
              );
            })}
          </div>

          {/* Rows */}
          <div className="space-y-3 relative">
            {/* "Today" marker line */}
            {todayOffsetPct >= 0 && todayOffsetPct <= 100 && (
              <div
                className="absolute top-0 bottom-0 w-px bg-red-400/70 z-10"
                style={{ left: `${todayOffsetPct}%` }}
                title="Today"
              />
            )}

            {datedProjects.map((project) => {
              const start = new Date(project.start_date as string);
              const end = new Date((project.deadline as string) || project.start_date!);
              const leftPct = Math.max(0, ((start.getTime() - rangeStart.getTime()) / DAY_MS / totalDays) * 100);
              const widthPct = Math.max(
                1.5,
                ((end.getTime() - start.getTime()) / DAY_MS / totalDays) * 100
              );
              const style = STATUS_STYLES[project.status] || STATUS_STYLES.PLANNING;
              const progress =
                project.taskCount && project.taskCount > 0
                  ? Math.round(((project.completedTasks || 0) / project.taskCount) * 100)
                  : null;

              return (
                <div key={project.id} className="flex items-center gap-3">
                  <div className="w-36 shrink-0">
                    <button
                      onClick={() => onSelectProject?.(project.id)}
                      className="text-xs font-bold text-slate-800 hover:text-blue-600 truncate block text-left w-full"
                      title={project.name}
                    >
                      {project.name}
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">{project.key_prefix}</span>
                  </div>

                  <div className="relative flex-1 h-6 bg-slate-50 rounded">
                    <div
                      className={`absolute top-0.5 bottom-0.5 rounded ${style.bar} flex items-center px-2 shadow-sm cursor-pointer transition-opacity hover:opacity-90`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      onClick={() => onSelectProject?.(project.id)}
                      title={`${project.start_date} → ${project.deadline || 'no deadline'}`}
                    >
                      {progress !== null && (
                        <span className="text-[9px] font-bold text-white/90 truncate">{progress}%</span>
                      )}
                    </div>
                  </div>

                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${style.label}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
