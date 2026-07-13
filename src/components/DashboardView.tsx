import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  Clock, 
  Star, 
  BookMarked, 
  Briefcase, 
  Plus,
  ExternalLink,
  Award,
  ChevronRight,
  Sparkles,
  Calendar,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  Edit
} from 'lucide-react';
import { 
  Task, 
  Skill, 
  DashboardWidget, 
  QuickLink, 
  WeeklyReview, 
  WidgetType 
} from '../types';

interface DashboardViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  skills: Skill[];
  quickLinks: QuickLink[];
  weeklyReviews: WeeklyReview[];
  widgets: DashboardWidget[];
  setWidgets: (widgets: DashboardWidget[]) => void;
  setView: (view: string) => void;
  darkMode: boolean;
  profileName?: string;
  setProfileName: (name: string) => void;
  targetRole?: string;
  setTargetRole: (role: string) => void;
  startDate?: string;
  setStartDate: (date: string) => void;
  endDate?: string;
  setEndDate: (date: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  setTasks,
  skills,
  quickLinks,
  weeklyReviews,
  widgets,
  setWidgets,
  setView,
  darkMode,
  profileName = 'Developer',
  setProfileName,
  targetRole = 'Big Tech Software Engineer',
  setTargetRole,
  startDate = '2026-07-12',
  setStartDate,
  endDate = '2027-06-30',
  setEndDate,
}) => {
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [activeRoadmapTab, setActiveRoadmapTab] = useState<'day1' | 'week1' | 'phase1'>('day1');

  // Profile Edit Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempProfileName, setTempProfileName] = useState(profileName);
  const [tempTargetRole, setTempTargetRole] = useState(targetRole);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  // Stats calculation
  const totalLoggedHours = skills.reduce((acc, curr) => acc + curr.hoursSpent, 0);
  const tasksCompleted = tasks.filter(t => t.status === 'Completed').length;
  const tasksRemaining = tasks.filter(t => t.status !== 'Completed').length;
  const averageSkillProgress = skills.length > 0 
    ? Math.round(skills.reduce((acc, curr) => acc + curr.progress, 0) / skills.length) 
    : 0;

  // Starred items count
  const starredTasks = tasks.filter(t => t.isFavourite && t.status !== 'Completed');
  const starredSkills = skills.filter(s => s.isFavourite);

  // Widget visibility toggling
  const handleToggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  // Widget re-ordering
  const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= widgets.length) return;

    const updated = [...widgets];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;

    // Reassign serial order fields
    const withOrder = updated.map((w, idx) => ({ ...w, order: idx }));
    setWidgets(withOrder);
  };

  // Toggle tasks due today / tasks completed inside widgets
  const handleCheckTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'Completed' ? 'Todo' : 'Completed' } : t));
  };

  // Filter widgets by visibilities and order them
  const activeWidgets = widgets
    .filter(w => w.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">{profileName}'s Growth Tracker</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Welcome to your developer workspace. Below is your personalized roadmap, analytics, and checklists.
          </p>
        </div>

        {/* Customize button */}
        <button
          onClick={() => setIsCustomizeModalOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
            darkMode
              ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300'
              : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          <Settings2 size={13} />
          <span>Customize Dashboard</span>
        </button>
      </div>

      {/* 🚀 Journey Tracker Section */}
      <div className={`p-6 rounded-2xl border ${
        darkMode 
          ? 'bg-neutral-900/40 border-neutral-800 text-neutral-200' 
          : 'bg-white border-neutral-200 text-neutral-800'
      } shadow-sm space-y-5`}>
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-100 dark:border-neutral-850">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900/5 dark:bg-white/5 text-neutral-800 dark:text-neutral-100">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-display font-semibold tracking-tight flex items-center gap-2 flex-wrap">
                <span>🚀 {profileName}'s Big Tech Journey Tracker</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500">
                  Day 1 Active
                </span>
                <button
                  onClick={() => {
                    setTempProfileName(profileName);
                    setTempTargetRole(targetRole);
                    setTempStartDate(startDate);
                    setTempEndDate(endDate);
                    setIsProfileModalOpen(true);
                  }}
                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                  title="Edit Journey Profile Details"
                >
                  <Edit size={12} />
                </button>
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                Goal: <span className="text-neutral-600 dark:text-neutral-300 font-sans font-medium">{targetRole}</span> • Start Date: {startDate} • Target End Date: {endDate}
              </p>
            </div>
          </div>
          
          {/* Quick Stats: Day 1 completion */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-neutral-400 block text-[9px] uppercase">Day 1 Completed</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-100">
                {tasks.filter(t => t.id.startsWith('tsk-day1-') && t.status === 'Completed').length} / {tasks.filter(t => t.id.startsWith('tsk-day1-')).length} Tasks
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-neutral-150 dark:border-neutral-800 flex items-center justify-center relative">
              <span className="text-[10px] font-bold">
                {Math.round((tasks.filter(t => t.id.startsWith('tsk-day1-') && t.status === 'Completed').length / (tasks.filter(t => t.id.startsWith('tsk-day1-')).length || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-950/40 rounded-xl max-w-md">
          <button
            onClick={() => setActiveRoadmapTab('day1')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeRoadmapTab === 'day1'
                ? darkMode
                  ? 'bg-neutral-850 text-white shadow-sm'
                  : 'bg-white text-neutral-800 shadow-sm border border-neutral-200'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            📅 Day 1 Planner
          </button>
          <button
            onClick={() => setActiveRoadmapTab('week1')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeRoadmapTab === 'week1'
                ? darkMode
                  ? 'bg-neutral-850 text-white shadow-sm'
                  : 'bg-white text-neutral-800 shadow-sm border border-neutral-200'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            📆 Week 1 Plan
          </button>
          <button
            onClick={() => setActiveRoadmapTab('phase1')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeRoadmapTab === 'phase1'
                ? darkMode
                  ? 'bg-neutral-850 text-white shadow-sm'
                  : 'bg-white text-neutral-800 shadow-sm border border-neutral-200'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            🗺️ Phase 1 Goals
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-1">
          {activeRoadmapTab === 'day1' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display font-semibold text-neutral-500 uppercase font-mono tracking-wider">
                  📅 DAY 1 — {startDate} Schedule
                </h3>
                <span className="text-[11px] text-blue-500 font-mono bg-blue-500/10 px-2 py-0.5 rounded-md">
                  Active Today
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Morning Block */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-neutral-950/25 border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-500 font-semibold uppercase">🌅 Morning (1.5 hr)</span>
                    <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.2 rounded font-mono">DSA</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-[10px] text-neutral-400 uppercase">Topic: Time &amp; Arrays</p>
                    {tasks.filter(t => t.id.startsWith('tsk-day1-dsa')).map(task => (
                      <label key={task.id} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => handleCheckTask(task.id)}
                          className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 dark:border-neutral-800 cursor-pointer"
                        />
                        <span className={`leading-tight ${task.status === 'Completed' ? 'line-through opacity-45' : ''}`}>
                          {task.title.replace('DSA: ', '').replace('DSA Problems: ', '').replace('DSA Output: ', '')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Afternoon Block */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-neutral-950/25 border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-500 font-semibold uppercase">☀️ Afternoon (2 hr)</span>
                    <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.2 rounded font-mono">Python</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-[10px] text-neutral-400 uppercase">Topic: Foundation Rev</p>
                    {tasks.filter(t => t.id.startsWith('tsk-day1-py')).map(task => (
                      <label key={task.id} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => handleCheckTask(task.id)}
                          className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 dark:border-neutral-800 cursor-pointer"
                        />
                        <span className={`leading-tight ${task.status === 'Completed' ? 'line-through opacity-45' : ''}`}>
                          {task.title.replace('Python Foundation: ', '').replace('Python Practice: ', '')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Evening Block */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-neutral-950/25 border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-500 font-semibold uppercase">🌆 Evening (2 hr)</span>
                    <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.2 rounded font-mono">Web Dev</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-[10px] text-neutral-400 uppercase">Topic: HTML Day 1</p>
                    {tasks.filter(t => t.id.startsWith('tsk-day1-web')).map(task => (
                      <label key={task.id} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => handleCheckTask(task.id)}
                          className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 dark:border-neutral-800 cursor-pointer"
                        />
                        <span className={`leading-tight ${task.status === 'Completed' ? 'line-through opacity-45' : ''}`}>
                          {task.title.replace('Web Dev: ', '').replace('Web Dev Task: ', '')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Night Block */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-neutral-950/25 border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-500 font-semibold uppercase">🌃 Night (1 hr)</span>
                    <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.2 rounded font-mono">IITM BS</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-[10px] text-neutral-400 uppercase">Topic: Assignments &amp; Lec</p>
                    {tasks.filter(t => t.id === 'tsk-day1-iitm1' || t.id === 'tsk-day1-health1').map(task => (
                      <label key={task.id} className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => handleCheckTask(task.id)}
                          className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 dark:border-neutral-800 cursor-pointer"
                        />
                        <span className={`leading-tight ${task.status === 'Completed' ? 'line-through opacity-45' : ''}`}>
                          {task.title.replace('IITM BS: ', '').replace('Daily: ', '')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day 1 Quick Guidance Banner */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs">
                <Sparkles size={14} className="text-blue-500 shrink-0" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Tip:</span> Simply check the boxes as you finish each task session. Your stats, learning hours, and completion charts will update automatically!
                </p>
              </div>
            </div>
          )}

          {activeRoadmapTab === 'week1' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display font-semibold text-neutral-500 uppercase font-mono tracking-wider">
                  📆 Week 1 Plan (Starting {startDate})
                </h3>
                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-mono text-neutral-400">
                  Current Week Target
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DSA & Python Week Goals */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800' : 'bg-neutral-50/40 border-neutral-200'} space-y-3`}>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Target size={14} className="text-red-500" />
                    <span>DSA &amp; Python Targets</span>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-neutral-400 font-semibold uppercase">DSA Arrays Target (15 problems)</p>
                      <div className="space-y-1 pl-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                          <span>Two Sum, Kadane Algorithm, Prefix Sum, Sliding Window basics</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] text-neutral-400 font-semibold uppercase">Python Target</p>
                      <div className="space-y-1 pl-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                          <span>Finish Functions, Lists, Dictionaries, and File handling</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Web & Academics Week Goals */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800' : 'bg-neutral-50/40 border-neutral-200'} space-y-3`}>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Target size={14} className="text-purple-500" />
                    <span>Web Dev &amp; IITM BS Goals</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-neutral-400 font-semibold uppercase">Web Dev Target</p>
                      <div className="space-y-1 pl-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                          <span>Finish HTML, CSS basics &amp; build first Portfolio webpage</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] text-neutral-400 font-semibold uppercase">IITM BS Target</p>
                      <div className="space-y-1 pl-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                          <span>No pending assignments. Spotless Week 1 submittals to secure CGPA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrated Week 1 tasks checklist */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Week 1 Scheduled Milestone Checklists</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {tasks.filter(t => t.id.startsWith('tsk-w1-')).map(task => (
                    <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/10 text-xs">
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => handleCheckTask(task.id)}
                        className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 dark:border-neutral-800 cursor-pointer animate-pulse-once"
                      />
                      <span className={`truncate ${task.status === 'Completed' ? 'line-through opacity-45' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeRoadmapTab === 'phase1' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    Phase 1: Foundation (12 July – 31 August 2026)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Your focus is to form rigorous coding habits and build core backend &amp; frontend foundations.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full shrink-0 self-start sm:self-center">
                  Active Phase
                </span>
              </div>

              {/* Goal List for Phase 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Phase 1 Primary Milestones</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/20 dark:bg-neutral-950/20">
                      <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-[10px]">1</div>
                      <div className="min-w-0">
                        <span className="font-semibold block">Build Daily DSA Habit</span>
                        <span className="text-[10px] text-neutral-400">At least 1-2 hours of array / string solving every day.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/20 dark:bg-neutral-950/20">
                      <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-[10px]">2</div>
                      <div className="min-w-0">
                        <span className="font-semibold block">Complete Python Foundations</span>
                        <span className="text-[10px] text-neutral-400">Functions, object data structures, loops, file streams.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/20 dark:bg-neutral-950/20">
                      <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-[10px]">3</div>
                      <div className="min-w-0">
                        <span className="font-semibold block">Establish Frontend Core</span>
                        <span className="text-[10px] text-neutral-400">Semantic HTML and full mastery of CSS Flexbox &amp; Grid.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">IIT Madras BS Academics</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/20 dark:bg-neutral-950/20">
                      <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold text-[10px]">4</div>
                      <div className="min-w-0">
                        <span className="font-semibold block">Keep BS Assignments under control</span>
                        <span className="text-[10px] text-neutral-400">Plan out week schedule; watch video lectures on time.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/20 dark:bg-neutral-950/20">
                      <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold text-[10px]">5</div>
                      <div className="min-w-0">
                        <span className="font-semibold block">Improve Overall CGPA</span>
                        <span className="text-[10px] text-neutral-400">Aim for a flawless assignment sheet score this semester.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-100/40 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-center flex flex-col justify-center">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Phase Timeline Progress</span>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-1.5 mb-1">
                        <div className="bg-green-500 h-full" style={{ width: '2%' }}></div>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-mono">Day 1 of 50 (2%) • Ends 31 Aug 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Analytics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800/80' : 'bg-white border-neutral-200'} space-y-1`}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">Learning Hours</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-display font-bold">{totalLoggedHours}h</span>
            <span className="text-xs text-neutral-400 font-mono">Logged Total</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
            <Clock size={10} /> Active skill learning time
          </p>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800/80' : 'bg-white border-neutral-200'} space-y-1`}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">Task Completion</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-display font-bold">{tasksCompleted}</span>
            <span className="text-xs text-neutral-400 font-mono">Done / {tasksRemaining} Left</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-neutral-800 dark:bg-white h-full"
              style={{ width: `${tasks.length > 0 ? (tasksCompleted / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800/80' : 'bg-white border-neutral-200'} space-y-1`}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">Skills Roadmap Avg</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-display font-bold">{averageSkillProgress}%</span>
            <span className="text-xs text-neutral-400 font-mono">Competency</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-green-500 h-full"
              style={{ width: `${averageSkillProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-neutral-950/20 border-neutral-800/80' : 'bg-white border-neutral-200'} space-y-1`}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">Quick links launch</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-display font-bold">{quickLinks.length}</span>
            <span className="text-xs text-neutral-400 font-mono">Shortcuts</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
            <Star size={10} className="text-amber-500" fill="currentColor" /> Click to launch from sidebar
          </p>
        </div>
      </div>

      {/* 💻 GitHub & LeetCode Style Developer Activity Heatmap */}
      <div className={`p-6 rounded-2xl border ${
        darkMode 
          ? 'bg-neutral-950/40 border-neutral-800 text-neutral-200' 
          : 'bg-white border-neutral-200 text-neutral-800'
      } shadow-sm space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-100 dark:border-neutral-900">
          <div className="space-y-1">
            <h2 className="text-sm font-display font-semibold flex items-center gap-2">
              <span className="p-1 rounded bg-neutral-150 dark:bg-neutral-850 text-emerald-500 dark:text-emerald-400">
                <Flame size={14} className="fill-current" />
              </span>
              <span>Developer Contribution Heatmap</span>
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Interactive GitHub commit log &amp; LeetCode solver timeline. Tracks roadmap milestones, solved DSA structures, and daily check-ins.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-850 px-3 py-1.5 rounded-xl">
            <div className="text-center px-1">
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold tracking-wider">Current Streak</span>
              <span className="font-bold text-emerald-500 dark:text-emerald-400 flex items-center justify-center gap-0.5">14 Days 🔥</span>
            </div>
            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-850" />
            <div className="text-center px-1">
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold tracking-wider">Consistency</span>
              <span className="font-bold text-blue-500">94%</span>
            </div>
            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-850" />
            <div className="text-center px-1">
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold tracking-wider">Total Actions</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-100">{164 + tasksCompleted}</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid container */}
        <div className="overflow-x-auto pt-1 pb-1">
          <div className="min-w-[620px] flex flex-col gap-2">
            <div className="flex gap-2">
              {/* Day of week labels */}
              <div className="grid grid-rows-7 gap-[3px] text-[9px] font-mono text-neutral-400 dark:text-neutral-500 select-none pr-1 justify-items-end pt-1">
                <span></span>
                <span>Mon</span>
                <span></span>
                <span>Wed</span>
                <span></span>
                <span>Fri</span>
                <span></span>
              </div>

              {/* The Cells Grid (18 columns of weeks) */}
              <div 
                className="flex-1 grid gap-[4px]" 
                style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
              >
                {Array.from({ length: 18 }).map((_, weekIdx) => {
                  return (
                    <div key={weekIdx} className="grid grid-rows-7 gap-[4px]">
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        // Calculate date backward relative to simulated date: July 13, 2026 (Monday)
                        // July 13 is week 17, dayIdx 1.
                        // Let's compute day difference.
                        const daysOffset = (17 - weekIdx) * 7 + (1 - dayIdx);
                        const cellDate = new Date(2026, 6, 13); // July 13, 2026
                        cellDate.setDate(cellDate.getDate() - daysOffset);
                        
                        // Seed deterministic coding activity for mock historical commits
                        const dayOfYear = Math.floor((cellDate.getTime() - new Date(2026, 0, 1).getTime()) / 86400000);
                        let value = 0;
                        if (daysOffset > 0) {
                          // Deterministic distribution of completed items for history
                          value = (dayOfYear * 7 + weekIdx * 3) % 5;
                          if (value === 4 && dayOfYear % 3 === 0) value = 1; // Add realistic variability
                        } else if (daysOffset === 0) {
                          // Today's completed tasks
                          value = Math.min(4, Math.max(1, tasksCompleted % 5));
                        } else {
                          // Future days are uncommitted
                          value = 0;
                        }

                        // Colors corresponding to intensity levels
                        const colors = [
                          darkMode ? 'bg-neutral-900 border-neutral-950 hover:bg-neutral-850' : 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200',
                          'bg-emerald-500/10 hover:bg-emerald-500/20 border-transparent dark:bg-emerald-500/15',
                          'bg-emerald-500/30 hover:bg-emerald-500/40 border-transparent dark:bg-emerald-500/35',
                          'bg-emerald-500/65 hover:bg-emerald-500/75 border-transparent dark:bg-emerald-500/70',
                          'bg-emerald-500 hover:bg-emerald-600 border-transparent'
                        ];

                        const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const countText = value === 0 ? 'No activities' : `${value} development commits`;

                        return (
                          <div
                            key={dayIdx}
                            className={`w-[12px] h-[12px] rounded-sm border cursor-pointer transition-all duration-150 relative group ${colors[value]}`}
                          >
                            {/* Hover Tooltip Card (CSS only tooltip, works perfectly in iFrames) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                              <div className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-mono px-2 py-1 rounded-lg shadow-xl whitespace-nowrap leading-tight text-center border border-neutral-800 dark:border-neutral-200">
                                <span className="font-semibold block">{dateStr}</span>
                                <span className="opacity-80">{countText}</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-neutral-950 dark:bg-white rotate-45 -mt-1 border-r border-b border-neutral-800 dark:border-neutral-200" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Month labels & Legend */}
            <div className="flex items-center justify-between pl-8 pr-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-500 select-none">
              <div className="flex gap-12">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul 2026</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Widgets in Bento-Style Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {activeWidgets.map((widget) => {
          return (
            <div
              key={widget.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between min-h-[250px] shadow-sm transition-all ${
                darkMode 
                  ? 'bg-neutral-950/40 border-neutral-800 text-neutral-200' 
                  : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              <div className="space-y-4">
                {/* Widget Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-2.5">
                  <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                    <Sparkles size={14} className="text-neutral-400" />
                    <span>{widget.title}</span>
                  </h3>
                  <button
                    onClick={() => {
                      if (widget.type === 'todays_tasks' || widget.type === 'top_priority') setView('tasks');
                      if (widget.type === 'skill_progress') setView('skills');
                      if (widget.type === 'weekly_review') setView('weekly');
                    }}
                    className="text-[11px] font-mono text-neutral-400 hover:text-neutral-600 dark:hover:text-white flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ChevronRight size={11} />
                  </button>
                </div>

                {/* Widget Body Content based on widget.type */}
                <div className="space-y-3">
                  {/* Today's Tasks widget */}
                  {widget.type === 'todays_tasks' && (
                    <div className="space-y-2">
                      {tasks.filter(t => t.status !== 'Completed').slice(0, 4).map((task) => (
                        <div key={task.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-900/40">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={task.status === 'Completed'}
                              onChange={() => handleCheckTask(task.id)}
                              className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300 dark:border-neutral-800 cursor-pointer shrink-0"
                            />
                            <span className="truncate font-medium">{task.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 shrink-0 ml-2">{task.category}</span>
                        </div>
                      ))}
                      {tasks.filter(t => t.status !== 'Completed').length === 0 && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 italic text-center py-6">
                          No remaining tasks on your checklist! Nice work.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Top Priority Tasks widget */}
                  {widget.type === 'top_priority' && (
                    <div className="space-y-2">
                      {tasks.filter(t => (t.priority === 'Urgent' || t.priority === 'Important') && t.status !== 'Completed').slice(0, 4).map((task) => (
                        <div key={task.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-900/40">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'Urgent' ? 'bg-red-500' : 'bg-amber-500'}`} />
                            <span className="truncate font-medium">{task.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 shrink-0 ml-2">{task.priority}</span>
                        </div>
                      ))}
                      {tasks.filter(t => (t.priority === 'Urgent' || t.priority === 'Important') && t.status !== 'Completed').length === 0 && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 italic text-center py-6">
                          No outstanding Urgent or Important items!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Learning Hours Widget */}
                  {widget.type === 'learning_hours' && (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Your hours spent are automatically tracked across active roadmap elements. Below are key stats:
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                          <span className="block text-[10px] text-neutral-400 uppercase font-mono">DSA Roadmaps</span>
                          <span className="text-lg font-display font-semibold mt-1 block">
                            {skills.find(s => s.name === 'DSA')?.hoursSpent || 0}h
                          </span>
                        </div>
                        <div className="p-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                          <span className="block text-[10px] text-neutral-400 uppercase font-mono">Web Development</span>
                          <span className="text-lg font-display font-semibold mt-1 block">
                            {skills.find(s => s.name === 'Web Development')?.hoursSpent || 0}h
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skill Progress Widget */}
                  {widget.type === 'skill_progress' && (
                    <div className="space-y-3">
                      {skills.slice(0, 3).map((skill) => (
                        <div key={skill.id} className="space-y-1 text-xs">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">{skill.name}</span>
                            <span className="font-mono text-neutral-400">{skill.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-neutral-800 dark:bg-white h-full"
                              style={{ width: `${skill.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Weekly Review Widget */}
                  {widget.type === 'weekly_review' && (
                    <div className="space-y-2.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {weeklyReviews.length > 0 ? (
                        <>
                          <div className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-200">
                            <Award size={13} className="text-green-500" />
                            <span>Recent Achievement ({weeklyReviews[0].date})</span>
                          </div>
                          <p className="line-clamp-3 italic bg-neutral-50 dark:bg-neutral-900/20 p-2.5 rounded-lg border border-neutral-150 dark:border-neutral-900">
                            &quot;{weeklyReviews[0].achievements}&quot;
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 italic text-center py-6">
                          No reviews composed yet. Take stock in the Weekly Reviews diary.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Quick Links Widget */}
                  {widget.type === 'quick_links' && (
                    <div className="grid grid-cols-2 gap-2">
                      {quickLinks.slice(0, 4).map((link) => (
                        <a
                          key={link.id}
                          href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                        >
                          <span className="truncate">{link.label}</span>
                          <ExternalLink size={10} className="text-neutral-400 shrink-0" />
                        </a>
                      ))}
                      {quickLinks.length === 0 && (
                        <p className="col-span-2 text-xs text-neutral-400 dark:text-neutral-500 italic text-center py-6">
                          No links mapped. Add one in the sidebar launcher!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Widget Footer */}
              <div className="border-t border-neutral-100 dark:border-neutral-900/80 pt-2 text-[10px] text-neutral-400 font-mono flex justify-between items-center mt-4">
                <span>Developer Sandbox</span>
                <span>Active</span>
              </div>
            </div>
          );
        })}

        {activeWidgets.length === 0 && (
          <div className="col-span-2 py-16 text-center text-neutral-400 dark:text-neutral-500 border border-dashed rounded-2xl">
            <p className="italic">Your dashboard is blank.</p>
            <button
              onClick={() => setIsCustomizeModalOpen(true)}
              className="mt-2 text-xs font-semibold underline hover:text-black dark:hover:text-white"
            >
              Toggle Widget Visibilities
            </button>
          </div>
        )}
      </div>

      {/* ================= CUSTOMIZATION MODAL ================= */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-2 flex items-center gap-2">
              <Settings2 size={16} />
              <span>Customize Dashboard Bento Grid</span>
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Toggle widget visibility or rearrange their visual hierarchy with the up/down controllers.
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {widgets.map((w, index) => {
                return (
                  <div
                    key={w.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                      darkMode 
                        ? 'bg-neutral-950/40 border-neutral-800' 
                        : 'bg-neutral-50 border-neutral-250'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleWidget(w.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          w.visible
                            ? 'text-green-500 bg-green-500/10 border-green-500/20'
                            : 'text-neutral-400 bg-neutral-100 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800'
                        }`}
                        title={w.visible ? "Hide Widget" : "Show Widget"}
                      >
                        {w.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <span className="font-semibold">{w.title}</span>
                    </div>

                    {/* Up/Down buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveWidget(index, 'up')}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={index === widgets.length - 1}
                        onClick={() => handleMoveWidget(index, 'down')}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-neutral-100 dark:border-neutral-850 mt-4">
              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PROFILE EDIT MODAL ================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              ✏️ Edit Growth Journey Profile
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              setProfileName(tempProfileName);
              setTargetRole(tempTargetRole);
              setStartDate(tempStartDate);
              setEndDate(tempEndDate);
              setIsProfileModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Developer Profile Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Developer"
                  value={tempProfileName}
                  onChange={(e) => setTempProfileName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Target Dream Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Big Tech Software Engineer"
                  value={tempTargetRole}
                  onChange={(e) => setTempTargetRole(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12 July 2026"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Target End Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. June 2027"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    darkMode
                      ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                      : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
