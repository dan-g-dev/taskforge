import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Play, 
  Pause, 
  RotateCcw, 
  BarChart2, 
  ArrowRight,
  Home,
  CheckSquare,
  Bug,
  Flag,
  Clock,
  Layers,
  Receipt,
  CheckCircle2,
  Maximize2,
  Calendar,
  Compass,
  MoreHorizontal
} from 'lucide-react';

interface GanttTask {
  id: string;
  name: string;
  startQuarter: number; // 0 to 6 (where 0 is Q4 2025 start, 6 is Q1 2027 end)
  duration: number; // in quarters
  baseStart: number;
  baseDuration: number;
  colorClass: string;
  stripeColor: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Open';
  predecessor?: string;
  datesText: string;
}

export const GanttSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Tasks' | 'Users' | 'Reports' | 'Documents' | 'Phases' | 'Finance'>('Tasks');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Tasks');
  
  // Animation states
  const [isPlayingAutoDemo, setIsPlayingAutoDemo] = useState(true);
  const [animationKey, setAnimationKey] = useState(0); // For replaying entrance animation
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [demoState, setDemoState] = useState<'normal' | 'shifting' | 'shifted'>('normal');
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  
  // Dragging interaction state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const dragStartXRef = useRef<number>(0);
  const dragInitialStartRef = useRef<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // 4 interactive tasks in the TaskForge Gantt timeline
  const [tasks, setTasks] = useState<GanttTask[]>([
    {
      id: 'ZS-T101',
      name: 'Project Planning',
      startQuarter: 0.15, // Oct 2025 - Feb 2026
      duration: 1.35,
      baseStart: 0.15,
      baseDuration: 1.35,
      colorClass: 'from-[#F87171] to-[#EF4444]',
      stripeColor: 'rgba(239, 68, 68, 0.85)',
      progress: 100,
      status: 'Completed',
      datesText: 'OCT 25 - FEB 26'
    },
    {
      id: 'ZS-T102',
      name: 'Design',
      startQuarter: 1.25, // Jan 2026 - May 2026
      duration: 1.45,
      baseStart: 1.25,
      baseDuration: 1.45,
      colorClass: 'from-[#A855F7] to-[#8B5CF6]',
      stripeColor: 'rgba(139, 92, 246, 0.85)',
      progress: 85,
      status: 'In Progress',
      predecessor: 'ZS-T101',
      datesText: 'JAN 26 - MAY 26'
    },
    {
      id: 'ZS-T103',
      name: 'Development',
      startQuarter: 2.35, // Apr 2026 - Aug 2026
      duration: 1.5,
      baseStart: 2.35,
      baseDuration: 1.5,
      colorClass: 'from-[#06B6D4] to-[#0284C7]',
      stripeColor: 'rgba(2, 132, 199, 0.85)',
      progress: 60,
      status: 'In Progress',
      predecessor: 'ZS-T102',
      datesText: 'APR 26 - AUG 26'
    },
    {
      id: 'ZS-T104',
      name: 'Review',
      startQuarter: 3.7, // Jul 2026 - Oct 2026
      duration: 1.2,
      baseStart: 3.7,
      baseDuration: 1.2,
      colorClass: 'from-[#FB923C] to-[#F97316]',
      stripeColor: 'rgba(249, 115, 22, 0.85)',
      progress: 25,
      status: 'Open',
      predecessor: 'ZS-T103',
      datesText: 'JUL 26 - OCT 26'
    }
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  // 6 Quarter Timeline Columns
  const quarters = [
    { label: 'Q4 2025', months: ['OCT', 'NOV', 'DEC'] },
    { label: 'Q1 2026', months: ['JAN', 'FEB', 'MAR'] },
    { label: 'Q2 2026', months: ['APR', 'MAY', 'JUN'] },
    { label: 'Q3 2026', months: ['JUL', 'AUG', 'SEP'] },
    { label: 'Q4 2026', months: ['OCT', 'NOV', 'DEC'] },
    { label: 'Q1 2027', months: ['JAN', 'FEB', 'MAR'] },
  ];

  // Helper to convert quarter unit to CSS percentage
  const toPercent = (val: number) => `${Math.max(0, Math.min(100, (val / 6) * 100))}%`;

  // Entrance viewport trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEnteredView(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [animationKey]);

  // Automated cascading reschedule demonstration loop
  useEffect(() => {
    if (!isPlayingAutoDemo) return;

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 3;

      if (step === 1) {
        // Shift Development forward by 0.35 quarters (+1 month)
        setDemoState('shifting');
        setTasks(prev => prev.map(task => {
          if (task.id === 'ZS-T103') {
            return {
              ...task,
              startQuarter: task.baseStart + 0.35,
              datesText: 'MAY 26 - SEP 26'
            };
          }
          if (task.id === 'ZS-T104') {
            // Dependent task auto-reschedules forward!
            return {
              ...task,
              startQuarter: task.baseStart + 0.35,
              datesText: 'AUG 26 - NOV 26'
            };
          }
          return task;
        }));
      } else if (step === 2) {
        setDemoState('shifted');
      } else {
        // Reset smoothly back to baseline
        setDemoState('normal');
        setTasks(prev => prev.map(task => ({
          ...task,
          startQuarter: task.baseStart,
          datesText: task.id === 'ZS-T101' ? 'OCT 25 - FEB 26' :
                     task.id === 'ZS-T102' ? 'JAN 26 - MAY 26' :
                     task.id === 'ZS-T103' ? 'APR 26 - AUG 26' : 'JUL 26 - OCT 26'
        })));
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlayingAutoDemo]);

  // Handle interactive bar drag
  const handleMouseDown = (taskId: string, e: React.MouseEvent) => {
    setIsPlayingAutoDemo(false);
    setDraggedTaskId(taskId);
    dragStartXRef.current = e.clientX;
    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask) {
      dragInitialStartRef.current = currentTask.startQuarter;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedTaskId || !timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartXRef.current;
      const deltaQuarter = (deltaX / timelineRect.width) * 6;

      const newStart = Math.max(0, Math.min(6 - 0.5, dragInitialStartRef.current + deltaQuarter));

      setTasks(prev => {
        const updated = prev.map(t => {
          if (t.id === draggedTaskId) {
            return { ...t, startQuarter: newStart };
          }
          return t;
        });

        // If dragging Development, automatically push Review if overlapping
        const devTask = updated.find(t => t.id === 'ZS-T103');
        const reviewTask = updated.find(t => t.id === 'ZS-T104');
        if (devTask && reviewTask && (devTask.startQuarter + devTask.duration) > reviewTask.startQuarter) {
          reviewTask.startQuarter = devTask.startQuarter + devTask.duration + 0.1;
        }

        return [...updated];
      });
    };

    const handleMouseUp = () => {
      setDraggedTaskId(null);
    };

    if (draggedTaskId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedTaskId]);

  const handleAddNewTask = () => {
    if (!newTaskName.trim()) {
      setIsAddingTask(false);
      return;
    }
    const newTask: GanttTask = {
      id: `ZS-T10${tasks.length + 1}`,
      name: newTaskName,
      startQuarter: 4.8,
      duration: 1.0,
      baseStart: 4.8,
      baseDuration: 1.0,
      colorClass: 'from-[#10B981] to-[#059669]',
      stripeColor: 'rgba(16, 185, 129, 0.85)',
      progress: 0,
      status: 'Open',
      predecessor: 'ZS-T104',
      datesText: 'NOV 26 - FEB 27'
    };
    setTasks([...tasks, newTask]);
    setNewTaskName('');
    setIsAddingTask(false);
  };

  const replayAnimation = () => {
    setHasEnteredView(false);
    setTasks(prev => prev.map(t => ({ ...t, startQuarter: t.baseStart })));
    setAnimationKey(k => k + 1);
  };

  return (
    <section id="gantt" className="py-12 lg:py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
      
      {/* Scoped CSS for the diagonal hatch bars and animated flowing dependency curve */}
      <style>{`
        .tf-stripe-bar {
          background-size: 20px 20px;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.22),
            rgba(255, 255, 255, 0.22) 8px,
            transparent 8px,
            transparent 16px
          );
        }
        @keyframes dashFlow {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-dependency-flow {
          stroke-dasharray: 4 4;
          animation: dashFlow 1.2s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Control Badge Bar for Interactive Animation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#0066D6] text-xs font-semibold border border-blue-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0066D6] animate-pulse" />
              Interactive Gantt Demonstration
            </span>
            {demoState !== 'normal' && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium transition-all animate-in fade-in">
                Auto-cascaded: Dependent &quot;Review&quot; shifted with &quot;Development&quot;
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingAutoDemo(!isPlayingAutoDemo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                isPlayingAutoDemo 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {isPlayingAutoDemo ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingAutoDemo ? 'Auto-play ON' : 'Play Auto Demo'}</span>
            </button>

            <button
              onClick={replayAnimation}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Replay entrance animation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Replay</span>
            </button>
          </div>
        </div>

        {/* Authentic TaskForge Mockup Card Container */}
        <div className="relative rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* ========================================================= */}
          {/* LEFT SIDEBAR: Deep Navy TaskForge Sidebar                */}
          {/* ========================================================= */}
          <div className="w-full md:w-52 lg:w-56 bg-[#0c1a30] text-slate-300 shrink-0 border-r border-slate-800 flex flex-col select-none">
            
            {/* Top Logo Brand */}
            <div className="p-3.5 border-b border-slate-800/90 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#E42525] text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                TF
              </div>
              <span className="font-bold text-white text-sm tracking-tight">TaskForge</span>
            </div>

            {/* Sidebar Navigation Items */}
            <div className="py-2.5 space-y-4 text-xs">
              
              {/* Group: COLLABORATION */}
              <div>
                <div className="px-3.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
                  Collaboration
                </div>
                <div className="space-y-0.5">
                  <button 
                    onClick={() => setActiveSidebarItem('Home')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Home' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => setActiveSidebarItem('Reports')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Reports' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reports</span>
                  </button>
                  <button 
                    onClick={() => setActiveSidebarItem('My Approvals')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'My Approvals' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Approvals</span>
                  </button>
                </div>
              </div>

              {/* Group: PROJECTS */}
              <div>
                <div className="px-3.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/90 flex items-center justify-between">
                  <span>Projects</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="space-y-0.5">
                  <button 
                    onClick={() => setActiveSidebarItem('Overview')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Overview' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>Overview</span>
                  </button>
                  {/* Active Tasks Item */}
                  <button 
                    onClick={() => setActiveSidebarItem('Tasks')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-1.5 bg-[#0066D6] text-white font-semibold shadow-xs"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-white" />
                    <span>Tasks</span>
                  </button>
                  <button 
                    onClick={() => setActiveSidebarItem('Issues')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Issues' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Bug className="w-3.5 h-3.5 text-slate-400" />
                    <span>Issues</span>
                  </button>
                  <button 
                    onClick={() => setActiveSidebarItem('Milestones')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Milestones' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Milestones</span>
                  </button>
                  <button 
                    onClick={() => setActiveSidebarItem('Timesheets')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Timesheets' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Timesheets</span>
                  </button>
                  <button 
                    onClick={() => setActiveSidebarItem('Phase')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Phase' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phase</span>
                  </button>
                  <button 
                    onClick={() => setActiveSidebarItem('Expenses')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 transition-colors cursor-pointer ${
                      activeSidebarItem === 'Expenses' ? 'bg-blue-600/30 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                    <span>Expenses</span>
                  </button>
                </div>
              </div>

              {/* Group: RECENT PROJECTS */}
              <div>
                <div className="px-3.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/90">
                  Recent Projects
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 px-3.5 py-1 text-white font-medium bg-white/5 cursor-pointer">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="truncate">Zylker solutions</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="truncate">Projects Marketing</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT WORKSPACE: Top Nav, Toolbar & Animated Gantt Grid   */}
          {/* ========================================================= */}
          <div className="flex-1 min-w-0 bg-white flex flex-col">
            
            {/* Top Project Breadcrumb & Sub-navigation Tabs */}
            <div className="px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">PR-001 Zylker solutions</span>
                <button className="text-slate-400 hover:text-slate-600 p-0.5" title="More options">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-slate-600 overflow-x-auto">
                {(['Dashboard', 'Tasks', 'Users', 'Reports', 'Documents', 'Phases', 'Finance'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-[#0066D6] text-white font-bold shadow-2xs' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-toolbar with "All Projects", Gantt view dropdown, and hand-drawn Add Task */}
            <div className="px-4 py-2.5 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 bg-white text-xs relative">
              
              <div className="flex items-center gap-3">
                <div className="font-semibold text-slate-800 flex items-center gap-1 cursor-pointer">
                  <span>All Projects</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>

              {/* Right View & Actions */}
              <div className="flex items-center gap-2.5 relative">
                
                {/* Authentic Hand-drawn "Add Task" SVG arrow pointing right down */}
                <div className="hidden lg:flex items-center gap-1 absolute -top-8 right-24 pointer-events-none select-none">
                  <span className="font-handwriting text-xl text-slate-800 font-bold -rotate-6">Add Task</span>
                  <svg className="w-10 h-7 text-slate-800 -rotate-12" viewBox="0 0 40 28" fill="none" stroke="currentColor">
                    <path d="M4 8 C 14 4, 24 6, 32 18 M32 18 L 26 18 M32 18 L 30 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* View Dropdown: Gantt */}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-50 text-[#0066D6] font-bold border border-blue-200 cursor-pointer shadow-2xs">
                  <BarChart2 className="w-3.5 h-3.5 rotate-90" />
                  <span>Gantt</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </div>

                {/* Add Task Button */}
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0066D6] hover:bg-[#0052b0] text-white font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>

                {/* Utility Icons */}
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded" title="Filter">
                  <Filter className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded" title="Search">
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded" title="Calendar">
                  <Calendar className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded" title="Settings">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded" title="Fullscreen">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Quick Add Task Input Drawer */}
            {isAddingTask && (
              <div className="bg-blue-50/90 p-3 border-b border-blue-200 flex items-center gap-3 animate-in fade-in">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name (e.g. Quality Assurance & Audits)..."
                  className="flex-1 bg-white border border-blue-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNewTask()}
                  autoFocus
                />
                <button
                  onClick={handleAddNewTask}
                  className="px-3 py-1.5 bg-[#0066D6] text-white rounded-md text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  Save Task
                </button>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* GANTT TIMELINE TABLE & CANVAS                             */}
            {/* ========================================================= */}
            <div className="overflow-x-auto relative">
              <div className="min-w-[850px] relative select-none">
                
                {/* Header Row: Task Name + 6 Quarters */}
                <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold text-slate-600">
                  {/* Left Task Name Column */}
                  <div className="col-span-4 border-r border-slate-200 py-2 px-3 flex items-center gap-1 text-slate-700 font-bold uppercase">
                    <span>Task Name</span>
                  </div>

                  {/* Right Quarters Columns */}
                  <div className="col-span-8 grid grid-cols-6 divide-x divide-slate-200 text-center">
                    {quarters.map((q) => (
                      <div key={q.label} className="py-1">
                        <div className="text-[10px] font-bold text-slate-700">{q.label}</div>
                        <div className="grid grid-cols-3 text-[9px] text-slate-400 font-medium mt-0.5">
                          {q.months.map(m => (
                            <span key={m}>{m}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group Row: General */}
                <div className="border-b border-slate-100 bg-slate-50/50 py-1.5 px-3 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>General</span>
                  <span className="text-[10px] text-slate-400 font-normal">({tasks.length} tasks)</span>
                </div>

                {/* Canvas with SVG Dependency Lines & Task Rows */}
                <div className="relative" ref={timelineRef}>
                  
                  {/* SVG Dependency Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                      <marker
                        id="tf-arrow"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#0066D6" />
                      </marker>
                    </defs>

                    {/* Dynamic Dependency Lines */}
                    {/* Task 1 -> Task 2 */}
                    <path
                      d={`M ${toPercent(tasks[0].startQuarter + tasks[0].duration)} 24 C ${toPercent(tasks[1].startQuarter - 0.1)} 24, ${toPercent(tasks[1].startQuarter - 0.15)} 72, ${toPercent(tasks[1].startQuarter)} 72`}
                      fill="none"
                      stroke="#0066D6"
                      strokeWidth={1.8}
                      className="animate-dependency-flow transition-all duration-300"
                      markerEnd="url(#tf-arrow)"
                    />

                    {/* Task 2 -> Task 3 */}
                    <path
                      d={`M ${toPercent(tasks[1].startQuarter + tasks[1].duration)} 72 C ${toPercent(tasks[2].startQuarter - 0.1)} 72, ${toPercent(tasks[2].startQuarter - 0.15)} 120, ${toPercent(tasks[2].startQuarter)} 120`}
                      fill="none"
                      stroke="#0066D6"
                      strokeWidth={1.8}
                      className="animate-dependency-flow transition-all duration-300"
                      markerEnd="url(#tf-arrow)"
                    />

                    {/* Task 3 -> Task 4 */}
                    <path
                      d={`M ${toPercent(tasks[2].startQuarter + tasks[2].duration)} 120 C ${toPercent(tasks[3].startQuarter - 0.1)} 120, ${toPercent(tasks[3].startQuarter - 0.15)} 168, ${toPercent(tasks[3].startQuarter)} 168`}
                      fill="none"
                      stroke="#0066D6"
                      strokeWidth={1.8}
                      className="animate-dependency-flow transition-all duration-300"
                      markerEnd="url(#tf-arrow)"
                    />
                  </svg>

                  {/* Task Rows */}
                  <div className="divide-y divide-slate-100">
                    {tasks.map((task, idx) => {
                      return (
                        <div
                          key={task.id}
                          onMouseEnter={() => setHoveredTask(task.id)}
                          onMouseLeave={() => setHoveredTask(null)}
                          className="grid grid-cols-12 items-center hover:bg-blue-50/30 transition-colors text-xs relative h-12"
                        >
                          {/* Left: Task ID & Name */}
                          <div className="col-span-4 border-r border-slate-200 grid grid-cols-6 py-3 px-3 items-center h-full">
                            <span className="col-span-2 font-mono text-[11px] text-slate-500 font-medium">
                              {task.id}
                            </span>
                            <div className="col-span-4 flex items-center gap-2 truncate">
                              <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                              <span className="font-semibold text-slate-800 truncate">
                                {task.name}
                              </span>
                            </div>
                          </div>

                          {/* Right: Timeline Quarter Grid & Animated Bar */}
                          <div className="col-span-8 relative h-full flex items-center px-2">
                            
                            {/* Quarter Background Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-6 divide-x divide-slate-100 pointer-events-none">
                              <div />
                              <div />
                              <div />
                              <div />
                              <div />
                              <div />
                            </div>

                            {/* Animated Striped Gantt Bar */}
                            <motion.div
                              key={`${task.id}-${animationKey}`}
                              initial={hasEnteredView ? false : { scaleX: 0, opacity: 0 }}
                              animate={{ 
                                scaleX: 1, 
                                opacity: 1,
                                left: toPercent(task.startQuarter),
                                width: toPercent(task.duration)
                              }}
                              transition={{ 
                                scaleX: { duration: 0.7, delay: idx * 0.15, ease: 'easeOut' },
                                opacity: { duration: 0.4 },
                                left: { type: 'spring', stiffness: 220, damping: 24 },
                                width: { type: 'spring', stiffness: 220, damping: 24 }
                              }}
                              style={{
                                transformOrigin: 'left',
                                backgroundColor: task.stripeColor
                              }}
                              onMouseDown={(e) => handleMouseDown(task.id, e)}
                              className={`absolute h-7 rounded-full flex items-center justify-between px-2.5 text-white shadow-xs cursor-ew-resize tf-stripe-bar group hover:brightness-110 transition-all ${
                                draggedTaskId === task.id ? 'ring-2 ring-blue-500 ring-offset-1 z-30' : 'z-20'
                              }`}
                            >
                              {/* Left Progress Percent */}
                              <span className="text-[10px] font-extrabold drop-shadow-xs truncate">
                                {task.progress}%
                              </span>

                              {/* Center Task Date Label */}
                              <span className="text-[9px] font-semibold opacity-95 hidden sm:inline drop-shadow-xs truncate mx-1">
                                {task.datesText}
                              </span>

                              {/* Right Drag Handle Dots */}
                              <div className="w-1.5 h-3.5 rounded-full bg-white/60 opacity-60 group-hover:opacity-100" />

                              {/* Hover Floating Tooltip */}
                              <AnimatePresence>
                                {hoveredTask === task.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 3 }}
                                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap pointer-events-none z-50 flex items-center gap-2"
                                  >
                                    <span className="font-bold text-white">{task.name}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-blue-300">{task.datesText}</span>
                                    <span className="text-slate-400">({task.progress}% done)</span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>

                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Bottom Action Row: + Add Task | + Add Task List | Suggestion for Task */}
                <div className="p-3 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add Task</span>
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add Task List</span>
                  </button>
                  <span className="text-slate-300">|</span>
                  <a
                    href="#ai-section"
                    className="flex items-center gap-1.5 text-[#0066D6] hover:text-blue-800 font-bold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Suggestion for Task</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Section Heading & Copy directly matching the video */}
        <div className="mt-14 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            See the big picture with Gantt charts
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Use Gantt charts to build your project plan and track your task schedule. TaskForge keeps you aware of your critical tasks and their dependencies, and immediately shows any deviations between your planned and actual progress.
          </p>
          <div className="mt-5">
            <a
              href="#gantt"
              className="inline-flex items-center gap-1.5 text-[#0066D6] hover:text-[#004e9c] font-bold text-base group transition-colors cursor-pointer"
            >
              <span>Learn more about Gantt charts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
