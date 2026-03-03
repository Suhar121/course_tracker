import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Play,
  Clock,
  CheckCircle2,
  ChevronRight,
  User,
  Target,
  Flame,
  Calendar,
  Star,
  Award,
  TrendingUp,
  Edit3,
  RotateCcw,
  Trash2,
  ArrowLeft,
  BookMarked,
  BarChart3,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

// ─── UTILITIES ────────────────────────────────────────────────

const TYPE_COLORS = {
  setup: { bg: "#1a2a1a", text: "#4ade80", border: "#166534", label: "Setup" },
  learn: { bg: "#1a1a2e", text: "#818cf8", border: "#3730a3", label: "Learn" },
  code: { bg: "#2a1a1a", text: "#fb923c", border: "#9a3412", label: "Code" },
  notes: { bg: "#2a2a1a", text: "#facc15", border: "#854d0e", label: "Notes" },
  project: { bg: "#2a1a2a", text: "#e879f9", border: "#7e22ce", label: "Project" },
};
const TYPE_LIST = ["learn", "code", "project", "setup", "notes"];

const GRADIENT_PAIRS = [
  ['from-violet-600', 'to-indigo-800'],
  ['from-emerald-600', 'to-teal-800'],
  ['from-orange-500', 'to-red-700'],
  ['from-cyan-500', 'to-blue-700'],
  ['from-pink-500', 'to-rose-700'],
  ['from-amber-500', 'to-yellow-700'],
];

const ACHIEVEMENT_LIST = [
  { id: 'first_task', title: 'First Step', desc: 'Complete your first task', icon: '🎯', req: 1 },
  { id: 'ten_tasks', title: 'Getting Started', desc: 'Complete 10 tasks', icon: '🔟', req: 10 },
  { id: 'fifty_tasks', title: 'Halfway Hero', desc: 'Complete 50 tasks', icon: '💪', req: 50 },
  { id: 'hundred_tasks', title: 'Century Mark', desc: 'Complete 100 tasks', icon: '💯', req: 100 },
  { id: 'streak_3', title: 'On Fire', desc: '3-day learning streak', icon: '🔥', req: 3, type: 'streak' },
  { id: 'streak_7', title: 'Weekly Warrior', desc: '7-day learning streak', icon: '⚡', req: 7, type: 'streak' },
  { id: 'streak_14', title: 'Unstoppable', desc: '14-day learning streak', icon: '🚀', req: 14, type: 'streak' },
  { id: 'streak_30', title: 'Legend', desc: '30-day learning streak', icon: '👑', req: 30, type: 'streak' },
  { id: 'phase_1', title: 'Foundation Layer', desc: 'Complete Phase 1', icon: '📊', req: 1, type: 'phase' },
  { id: 'phase_2', title: 'ML Master', desc: 'Complete Phase 2', icon: '🤖', req: 2, type: 'phase' },
  { id: 'all_phases', title: 'Full Stack ML', desc: 'Complete all phases', icon: '🏆', req: 'all', type: 'phase' },
  { id: 'note_taker', title: 'Note Taker', desc: 'Write notes in 5 weeks', icon: '📝', req: 5, type: 'notes' },
];

// ─── COMPONENTS ───────────────────────────────────────────────

const SidebarLink = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
      ? 'bg-gradient-to-r from-lime-400/20 to-emerald-400/10 text-lime-400 border border-lime-400/20'
      : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    <Icon size={18} className={active ? 'text-lime-400' : 'text-slate-500 group-hover:text-white'} />
    <span className="font-medium text-sm hidden lg:inline">{label}</span>
    {badge && (
      <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
    )}
  </button>
);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
};

export default function Dashboard({ data, setData, view, setView }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [toast, setToast] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const phases = data?.phases || [];
  const completed = data?.completed || {};
  const notes = data?.notes || {};
  const profile = data?.profile || {};
  const streakDays = data?.streakDays || [];

  // ── Calculations ──
  const totalTasks = phases.reduce((a, p) => a + p.weeks.reduce((b, w) => b + w.days.length, 0), 0);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const pct = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (streakDays.includes(d.toDateString())) streak++;
    else if (i > 0) break;
  }

  function phasePct(p) {
    const ids = p.weeks.flatMap(w => w.days.map(d => d.id));
    return ids.length ? Math.round(ids.filter(id => completed[id]).length / ids.length * 100) : 0;
  }

  function showToastMsg(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function upd(fn) { setData(d => fn({ ...d })); }

  function toggleTask(taskId) {
    upd(d => ({ ...d, completed: { ...d.completed, [taskId]: !d.completed[taskId] } }));
  }

  function updateProfile(k, v) { upd(d => ({ ...d, profile: { ...d.profile, [k]: v } })); }

  function resetProgress() {
    upd(d => ({ ...d, completed: {}, streakDays: [], lastVisit: null }));
    showToastMsg("Progress reset ✓");
  }

  function resetAll() {
    const fresh = {
      phases: data.phases, completed: {}, notes: {}, streakDays: [], lastVisit: null,
      profile: { name: "Student", goal: "Master new skills", quote: "Learn. Build. Grow." },
    };
    setData(fresh);
    showToastMsg("Reset to defaults ✓");
  }

  // ── Chart Data ──
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const activityCounts = last7.map(day => {
    const dayStr = day.toDateString();
    return streakDays.includes(dayStr) ? Math.floor(Math.random() * 4) + 2 : 0;
  });

  const lineChartData = {
    labels: last7.map(d => d.toLocaleDateString('en', { weekday: 'short' })),
    datasets: [{
      label: 'Hours',
      data: activityCounts,
      borderColor: '#a3e635',
      backgroundColor: 'rgba(163, 230, 53, 0.1)',
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: '#a3e635',
      pointBorderColor: '#1e293b',
      pointBorderWidth: 2,
      fill: true
    }]
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleColor: '#e2e8f0', bodyColor: '#e2e8f0', padding: 12, cornerRadius: 8 } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 11 } }, beginAtZero: true }
    }
  };

  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{ data: [completedCount, totalTasks - completedCount], backgroundColor: ['#a3e635', '#1e293b'], borderWidth: 0, cutout: '78%' }]
  };

  // ── Achievements Check ──
  const notesCount = Object.values(notes).filter(v => v && v.trim().length > 0).length;
  const completedPhases = phases.filter((p, i) => phasePct(p) === 100).length;

  function isAchievementUnlocked(ach) {
    if (ach.type === 'streak') return streak >= ach.req;
    if (ach.type === 'phase') {
      if (ach.req === 'all') return completedPhases === phases.length && phases.length > 0;
      return completedPhases >= ach.req;
    }
    if (ach.type === 'notes') return notesCount >= ach.req;
    return completedCount >= ach.req;
  }

  const unlockedCount = ACHIEVEMENT_LIST.filter(a => isAchievementUnlocked(a)).length;

  // ── Filter courses ──
  const filteredPhases = categoryFilter === 'all' 
    ? phases 
    : phases.filter(p => {
        const types = p.weeks.flatMap(w => w.days.map(d => d.type));
        return types.includes(categoryFilter);
      });

  const searchedPhases = searchQuery 
    ? filteredPhases.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredPhases;

  // ─── NAV HANDLER ───
  function navigate(tab) {
    setActiveTab(tab);
    setSelectedPhase(null);
    setSelectedWeek(null);
    setSidebarOpen(false);
  }

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#0c0f1a] text-slate-200 overflow-hidden font-sans">
      
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-lime-400 text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-lime-400/30"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className={`fixed lg:relative z-50 h-full w-72 lg:w-64 bg-[#0c0f1a] border-r border-slate-800/60 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-400/20">
              <GraduationCap size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Learxpo</h1>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase">Learning Hub</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => navigate('dashboard')} />
          <SidebarLink icon={BookOpen} label="My Courses" active={activeTab === 'courses'} onClick={() => navigate('courses')} badge={phases.length} />
          <SidebarLink icon={Trophy} label="Achievements" active={activeTab === 'achievements'} onClick={() => navigate('achievements')} badge={unlockedCount} />
          <SidebarLink icon={BarChart3} label="Statistics" active={activeTab === 'stats'} onClick={() => navigate('stats')} />
          <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => navigate('settings')} />
        </nav>

        {/* Streak Card */}
        <div className="mx-4 mb-4 bg-gradient-to-br from-lime-400/10 to-emerald-500/5 border border-lime-400/20 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-lime-500/20">
              🔥
            </div>
            <div>
              <p className="text-2xl font-bold text-lime-400">{streak}</p>
              <p className="text-[11px] text-slate-400">Day Streak</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Keep it up! You're doing great.</p>
        </div>

        {/* User Card */}
        <div className="border-t border-slate-800/60 p-4">
          <button onClick={() => navigate('profile')} className="w-full flex items-center gap-3 hover:bg-white/5 rounded-xl p-2 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-lime-400 to-emerald-500 flex items-center justify-center text-black font-bold text-sm shadow-lg">
              {(profile.name || 'S')[0].toUpperCase()}
            </div>
            <div className="text-left flex-1 hidden lg:block">
              <p className="text-sm font-medium text-white truncate">{profile.name || 'Student'}</p>
              <p className="text-[11px] text-slate-500 truncate">{profile.goal || 'Learning'}</p>
            </div>
            <ChevronRight size={14} className="text-slate-600 hidden lg:block" />
          </button>
        </div>
      </aside>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-800/60 bg-[#0c0f1a]/90 backdrop-blur-xl shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center bg-slate-800/40 rounded-full px-4 py-2 w-80 border border-slate-700/40 focus-within:border-lime-400/40 focus-within:ring-1 focus-within:ring-lime-400/20 transition-all">
              <Search size={16} className="text-slate-500 mr-3" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-white relative rounded-lg hover:bg-white/5">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime-400 rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-slate-800 hidden md:block" />
            <button onClick={() => navigate('profile')} className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <User size={16} /> Profile
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">

              {/* ═══════════════════════════════════════════════ */}
              {/* DASHBOARD TAB */}
              {/* ═══════════════════════════════════════════════ */}
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" {...fadeUp} className="space-y-8">

                  {/* Hero */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1f2e] to-[#0c0f1a] rounded-3xl p-6 md:p-8 border border-slate-800/60 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-72 h-72 bg-lime-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/20 rounded-full px-3 py-1 mb-4">
                          <Sparkles size={14} className="text-lime-400" />
                          <span className="text-xs font-semibold text-lime-400">Welcome back!</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                          Hey, <span className="text-lime-400">{profile.name || 'Student'}</span> 👋
                        </h2>
                        <p className="text-slate-400 text-sm mb-6 max-w-md">
                          {pct > 0 ? `You've completed ${pct}% of your learning journey. Keep the momentum going!` : 'Start your learning journey today. Every expert was once a beginner.'}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button onClick={() => navigate('courses')} className="bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-lime-400/20 hover:shadow-xl hover:shadow-lime-400/30 hover:scale-105 transition-all flex items-center gap-2">
                            <Play size={16} className="fill-current" /> Continue Learning
                          </button>
                          <button onClick={() => navigate('stats')} className="bg-white/5 border border-slate-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                            <BarChart3 size={16} /> View Stats
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="bg-[#12162a] rounded-3xl p-6 border border-slate-800/60 flex flex-col items-center justify-center">
                      <h3 className="text-sm font-bold text-white mb-4 self-start flex items-center gap-2">
                        <Target size={16} className="text-lime-400" /> Overall Progress
                      </h3>
                      <div className="w-36 h-36 relative">
                        <Doughnut data={doughnutData} options={{ cutout: '78%', plugins: { tooltip: { enabled: false } } }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-lime-400">{pct}%</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Complete</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-4">{completedCount} / {totalTasks} tasks done</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: 'Courses', value: phases.length, sub: 'Total enrolled', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                      { title: 'Hours', value: Math.round(completedCount * 0.5), sub: 'Estimated', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                      { title: 'Streak', value: `${streak}d`, sub: 'Keep going!', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                      { title: 'Badges', value: unlockedCount, sub: `of ${ACHIEVEMENT_LIST.length}`, icon: Award, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    ].map(s => (
                      <div key={s.title} className="bg-[#12162a] border border-slate-800/60 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${s.bg}`}>
                            <s.icon size={18} className={s.color} />
                          </div>
                        </div>
                        <p className="text-xl font-bold text-white">{s.value}</p>
                        <p className="text-[11px] text-slate-500">{s.title} · {s.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts + Tasks */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#12162a] rounded-3xl p-6 border border-slate-800/60">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <TrendingUp size={16} className="text-lime-400" /> Learning Activity
                        </h3>
                        <span className="text-xs text-slate-500">Last 7 days</span>
                      </div>
                      <div className="h-[220px]">
                        <Line data={lineChartData} options={lineOptions} />
                      </div>
                    </div>

                    <div className="bg-[#12162a] rounded-3xl p-6 border border-slate-800/60">
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <BookMarked size={16} className="text-lime-400" /> Continue Learning
                      </h3>
                      <div className="space-y-3">
                        {phases.slice(0, 3).map((p, i) => {
                          const prog = phasePct(p);
                          return (
                            <button key={p.id} onClick={() => { setSelectedPhase(p); setActiveTab('courses'); }} className="w-full text-left bg-slate-800/30 hover:bg-slate-800/60 rounded-xl p-3.5 transition-all group">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{p.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate group-hover:text-lime-400 transition-colors">{p.title}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                      <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, background: p.color }} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">{prog}%</span>
                                  </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-600 group-hover:text-lime-400 transition-colors" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════ */}
              {/* COURSES TAB */}
              {/* ═══════════════════════════════════════════════ */}
              {activeTab === 'courses' && !selectedPhase && (
                <motion.div key="courses" {...fadeUp} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Courses</h2>
                      <p className="text-sm text-slate-400">Browse and manage your learning path</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="md:hidden flex items-center bg-slate-800/40 rounded-full px-3 py-2 border border-slate-700/40 flex-1">
                        <Search size={14} className="text-slate-500 mr-2" />
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600" />
                      </div>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[{ k: 'all', l: 'All Category' }, ...TYPE_LIST.map(t => ({ k: t, l: TYPE_COLORS[t].label }))].map(cat => (
                      <button key={cat.k} onClick={() => setCategoryFilter(cat.k)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${categoryFilter === cat.k
                          ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/40'
                          }`}>
                        {cat.l}
                      </button>
                    ))}
                  </div>

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {searchedPhases.map((phase, i) => {
                      const prog = phasePct(phase);
                      const grad = GRADIENT_PAIRS[i % GRADIENT_PAIRS.length];
                      const taskCount = phase.weeks.reduce((a, w) => a + w.days.length, 0);
                      const doneCount = phase.weeks.flatMap(w => w.days).filter(d => completed[d.id]).length;
                      return (
                        <motion.div
                          key={phase.id}
                          whileHover={{ y: -4 }}
                          onClick={() => { setSelectedPhase(phase); setSelectedWeek(null); }}
                          className="bg-[#12162a] rounded-2xl border border-slate-800/60 overflow-hidden cursor-pointer group hover:border-slate-600/60 transition-all hover:shadow-xl hover:shadow-black/20"
                        >
                          {/* Card Header / Image area */}
                          <div className={`h-36 bg-gradient-to-br ${grad[0]} ${grad[1]} p-5 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                            <div className="relative z-10 flex justify-between items-start">
                              <div className="bg-black/30 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold text-white/90 uppercase tracking-wider">
                                {phase.month}
                              </div>
                              {prog === 100 && (
                                <div className="bg-emerald-400 text-black rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Done
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-4 left-5 z-10">
                              <span className="text-3xl drop-shadow-lg">{phase.icon}</span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5">
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-lime-400 transition-colors">{phase.title}</h3>
                            <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-4">
                              <span className="flex items-center gap-1"><BookOpen size={12} /> {phase.weeks.length} Weeks</span>
                              <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {doneCount}/{taskCount}</span>
                            </div>

                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prog}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ background: phase.color }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-500">{prog}% Complete</span>
                              <span className="text-lime-400 font-medium group-hover:underline">{prog > 0 ? 'Resume →' : 'Start →'}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══════════ COURSE DETAIL ═══════════ */}
              {activeTab === 'courses' && selectedPhase && (
                <motion.div key="course-detail" {...fadeUp} className="space-y-6">
                  {/* Back + Header */}
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setSelectedPhase(null); setSelectedWeek(null); }}
                      className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/40 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all">
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>{selectedPhase.icon}</span> {selectedPhase.title}
                      </h2>
                      <p className="text-sm text-slate-400">{selectedPhase.month} · {selectedPhase.weeks.length} weeks · {phasePct(selectedPhase)}% complete</p>
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { l: 'Lectures', v: `${selectedPhase.weeks.reduce((a, w) => a + w.days.length, 0)}+`, icon: BookOpen },
                      { l: 'Progress', v: `${phasePct(selectedPhase)}%`, icon: Target },
                      { l: 'Weeks', v: selectedPhase.weeks.length, icon: Calendar },
                    ].map(s => (
                      <div key={s.l} className="bg-[#12162a] border border-slate-800/60 rounded-xl p-3 text-center">
                        <s.icon size={16} className="text-lime-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{s.v}</p>
                        <p className="text-[10px] text-slate-500">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-4">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${phasePct(selectedPhase)}%`, background: selectedPhase.color, boxShadow: `0 0 12px ${selectedPhase.color}44` }} />
                    </div>
                  </div>

                  {/* Week tabs */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {selectedPhase.weeks.map((w, wi) => {
                      const wDone = w.days.filter(d => completed[d.id]).length;
                      const wPct = w.days.length ? Math.round(wDone / w.days.length * 100) : 0;
                      const isActive = selectedWeek?.week === w.week;
                      return (
                        <button key={w.week} onClick={() => setSelectedWeek(w)}
                          className={`shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                            ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/40 hover:border-slate-500'
                            }`}>
                          <div className="text-sm font-bold">Week {wi + 1}</div>
                          <div className={`text-[10px] mt-0.5 ${isActive ? 'text-black/60' : wPct === 100 ? 'text-emerald-400' : 'text-slate-500'}`}>{wPct}% done</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tasks */}
                  {selectedWeek && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-white">{selectedWeek.title}</h3>
                      {selectedWeek.days.map(task => {
                        const done = !!completed[task.id];
                        const tc = TYPE_COLORS[task.type] || TYPE_COLORS.learn;
                        return (
                          <motion.div
                            key={task.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleTask(task.id)}
                            className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border ${done
                              ? 'bg-emerald-900/10 border-emerald-800/30'
                              : 'bg-[#12162a] border-slate-800/60 hover:border-slate-600'
                              }`}
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${done
                              ? 'bg-lime-400 border-lime-400 text-black shadow-lg shadow-lime-400/30'
                              : 'border-slate-600'
                              }`}>
                              {done && <CheckCircle2 size={12} />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm transition-all ${done ? 'text-slate-500 line-through' : 'text-white'}`}>{task.task}</p>
                              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                                {task.type}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Notes */}
                      <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-4 mt-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Edit3 size={12} /> Week Notes</p>
                        <textarea
                          placeholder="Your notes, blockers, ideas..."
                          value={notes[`${selectedPhase.id}-${selectedWeek.week}`] || ""}
                          onChange={e => upd(d => ({ ...d, notes: { ...(d.notes || {}), [`${selectedPhase.id}-${selectedWeek.week}`]: e.target.value } }))}
                          className="w-full bg-slate-900/50 border border-slate-700/40 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-lime-400/40 resize-y min-h-[80px]"
                        />
                      </div>
                    </div>
                  )}

                  {!selectedWeek && (
                    <div className="text-center py-12 text-slate-500">
                      <BookOpen size={48} className="mx-auto mb-4 text-slate-700" />
                      <p className="text-lg font-medium">Select a week to see tasks</p>
                      <p className="text-sm">Click on a week tab above to get started</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════ */}
              {/* ACHIEVEMENTS TAB */}
              {/* ═══════════════════════════════════════════════ */}
              {activeTab === 'achievements' && (
                <motion.div key="achievements" {...fadeUp} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Achievements</h2>
                    <p className="text-sm text-slate-400">{unlockedCount} of {ACHIEVEMENT_LIST.length} unlocked</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
                        🏆
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{unlockedCount} Badges Earned</h3>
                        <p className="text-sm text-slate-400">Complete tasks and maintain streaks to earn more!</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(unlockedCount / ACHIEVEMENT_LIST.length) * 100}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{Math.round((unlockedCount / ACHIEVEMENT_LIST.length) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ACHIEVEMENT_LIST.map(ach => {
                      const unlocked = isAchievementUnlocked(ach);
                      return (
                        <motion.div
                          key={ach.id}
                          whileHover={unlocked ? { scale: 1.02 } : {}}
                          className={`p-5 rounded-2xl border transition-all ${unlocked
                            ? 'bg-gradient-to-br from-amber-400/10 to-orange-400/5 border-amber-500/30 shadow-lg shadow-amber-500/5'
                            : 'bg-[#12162a] border-slate-800/60 opacity-50'
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${unlocked ? 'bg-amber-400/20' : 'bg-slate-800 grayscale'}`}>
                              {ach.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-bold ${unlocked ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h4>
                                {unlocked && <Star size={12} className="text-amber-400 fill-amber-400" />}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{ach.desc}</p>
                              {unlocked && (
                                <span className="inline-block mt-2 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">UNLOCKED ✓</span>
                              )}
                              {!unlocked && (
                                <span className="inline-block mt-2 text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">LOCKED</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════ */}
              {/* STATISTICS TAB */}
              {/* ═══════════════════════════════════════════════ */}
              {activeTab === 'stats' && (
                <motion.div key="stats" {...fadeUp} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Study Statistics</h2>

                  {/* Phase progress */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phases.map(p => {
                      const prog = phasePct(p);
                      const ids = p.weeks.flatMap(w => w.days.map(d => d.id));
                      const done = ids.filter(id => completed[id]).length;
                      return (
                        <div key={p.id} className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xl">{p.icon}</span>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white">{p.title}</h4>
                              <p className="text-[11px] text-slate-500">{done}/{ids.length} tasks · {p.weeks.length} weeks</p>
                            </div>
                            <span className="text-lg font-bold" style={{ color: prog === 100 ? '#34d399' : p.color }}>{prog}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, background: p.color, boxShadow: `0 0 8px ${p.color}66` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Activity Heatmap */}
                  <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Calendar size={16} className="text-lime-400" /> Activity — Last 60 Days</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: 60 }).map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() - (59 - i));
                        const active = streakDays.includes(d.toDateString());
                        return <div key={i} className={`w-3 h-3 rounded-sm ${active ? 'bg-lime-400 shadow-sm shadow-lime-400/40' : 'bg-slate-800'}`} title={d.toLocaleDateString()} />;
                      })}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">🔥 Current streak: <span className="text-orange-400 font-bold">{streak} days</span></p>
                  </div>

                  {/* By type */}
                  <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4">By Task Type</h3>
                    <div className="space-y-3">
                      {Object.entries(TYPE_COLORS).map(([type, tc]) => {
                        const all = phases.flatMap(p => p.weeks.flatMap(w => w.days.filter(d => d.type === type)));
                        const done = all.filter(t => completed[t.id]).length;
                        const tp = all.length ? Math.round(done / all.length * 100) : 0;
                        return (
                          <div key={type}>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: tc.text }}>{type}</span>
                              <span className="text-xs text-slate-500">{done}/{all.length}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${tp}%`, background: tc.text }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity Chart */}
                  <div className="bg-[#12162a] rounded-2xl p-6 border border-slate-800/60">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={16} className="text-lime-400" /> Weekly Trend
                    </h3>
                    <div className="h-[200px]">
                      <Line data={lineChartData} options={lineOptions} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════ */}
              {/* SETTINGS TAB */}
              {/* ═══════════════════════════════════════════════ */}
              {activeTab === 'settings' && (
                <motion.div key="settings" {...fadeUp} className="space-y-6 max-w-2xl">
                  <h2 className="text-2xl font-bold text-white">Settings</h2>

                  {/* Profile Edit */}
                  <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-6 space-y-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><User size={16} className="text-lime-400" /> Profile Settings</h3>
                    {[
                      { k: 'name', label: 'Display Name', ph: 'Your name' },
                      { k: 'goal', label: 'Learning Goal', ph: 'What are you working towards?' },
                      { k: 'quote', label: 'Motivational Quote', ph: 'Your daily motivation...' },
                    ].map(f => (
                      <div key={f.k}>
                        <label className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                        <input
                          value={profile[f.k] || ''}
                          onChange={e => updateProfile(f.k, e.target.value)}
                          placeholder={f.ph}
                          className="w-full bg-slate-900/50 border border-slate-700/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-lime-400/40 transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Settings size={16} className="text-lime-400" /> Quick Actions</h3>
                    <button onClick={() => { setView('home'); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 text-slate-300 hover:text-white transition-all text-sm">
                      <Edit3 size={16} className="text-blue-400" /> Edit Courses & Tasks (Legacy Editor)
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2"><Trash2 size={16} /> Danger Zone</h3>
                    <p className="text-xs text-slate-500">These actions cannot be undone. Be careful.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={resetProgress}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-900/20 border border-rose-800/30 text-rose-400 hover:bg-rose-900/40 transition-all text-sm font-medium">
                        <RotateCcw size={14} /> Reset Progress
                      </button>
                      <button onClick={resetAll}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-900/20 border border-rose-800/30 text-rose-400 hover:bg-rose-900/40 transition-all text-sm font-medium">
                        <Trash2 size={14} /> Reset Everything
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════ */}
              {/* PROFILE TAB */}
              {/* ═══════════════════════════════════════════════ */}
              {activeTab === 'profile' && (
                <motion.div key="profile" {...fadeUp} className="space-y-6 max-w-2xl mx-auto">
                  {/* Profile Card */}
                  <div className="bg-gradient-to-br from-[#12162a] to-[#0c0f1a] border border-slate-800/60 rounded-3xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-lime-400/20 via-emerald-400/10 to-transparent relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12162a]" />
                    </div>
                    <div className="px-6 pb-6 -mt-12 relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-500 flex items-center justify-center text-black text-3xl font-bold shadow-xl shadow-lime-400/20 border-4 border-[#12162a]">
                        {(profile.name || 'S')[0].toUpperCase()}
                      </div>
                      <div className="mt-4">
                        <h2 className="text-2xl font-bold text-white">{profile.name || 'Student'}</h2>
                        <p className="text-sm text-slate-400 mt-1">{profile.goal || 'Learning enthusiast'}</p>
                        <p className="text-xs text-slate-600 mt-1 italic">"{profile.quote || 'Learn. Build. Grow.'}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { l: 'Tasks Done', v: completedCount, c: 'text-lime-400' },
                      { l: 'Streak', v: `${streak}d`, c: 'text-orange-400' },
                      { l: 'Badges', v: unlockedCount, c: 'text-amber-400' },
                      { l: 'Progress', v: `${pct}%`, c: 'text-cyan-400' },
                    ].map(s => (
                      <div key={s.l} className="bg-[#12162a] border border-slate-800/60 rounded-xl p-4 text-center">
                        <p className={`text-xl font-bold ${s.c}`}>{s.v}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Achievements */}
                  <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Recent Achievements</h3>
                    <div className="flex flex-wrap gap-3">
                      {ACHIEVEMENT_LIST.filter(a => isAchievementUnlocked(a)).slice(0, 6).map(ach => (
                        <div key={ach.id} className="bg-amber-400/10 border border-amber-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                          <span className="text-lg">{ach.icon}</span>
                          <span className="text-xs font-medium text-amber-300">{ach.title}</span>
                        </div>
                      ))}
                      {unlockedCount === 0 && <p className="text-sm text-slate-500">Complete tasks to earn your first badge!</p>}
                    </div>
                  </div>

                  {/* Course Progress */}
                  <div className="bg-[#12162a] border border-slate-800/60 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Course Progress</h3>
                    <div className="space-y-4">
                      {phases.map(p => {
                        const prog = phasePct(p);
                        return (
                          <div key={p.id} className="flex items-center gap-3">
                            <span className="text-lg">{p.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">{p.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${prog}%`, background: p.color }} />
                                </div>
                                <span className="text-xs text-slate-500 font-mono w-10 text-right">{prog}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button onClick={() => navigate('settings')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800/50 border border-slate-700/40 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all text-sm font-medium">
                    <Settings size={16} /> Edit Settings
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* ═══════════ MOBILE BOTTOM NAV ═══════════ */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0c0f1a]/95 backdrop-blur-xl border-t border-slate-800/60 z-50">
          <div className="flex justify-around py-2 px-2">
            {[
              { k: 'dashboard', icon: LayoutDashboard, label: 'Home' },
              { k: 'courses', icon: BookOpen, label: 'Courses' },
              { k: 'achievements', icon: Trophy, label: 'Awards' },
              { k: 'profile', icon: User, label: 'Profile' },
            ].map(nav => (
              <button key={nav.k} onClick={() => navigate(nav.k)} className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg transition-all">
                <nav.icon size={20} className={activeTab === nav.k ? 'text-lime-400' : 'text-slate-500'} />
                <span className={`text-[10px] font-medium ${activeTab === nav.k ? 'text-lime-400' : 'text-slate-500'}`}>{nav.label}</span>
                {activeTab === nav.k && <div className="w-4 h-0.5 bg-lime-400 rounded-full shadow-lg shadow-lime-400/50" />}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
