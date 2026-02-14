import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';

import {
  Calendar,
  TrendingUp,
  Brain,
  AlertCircle,
  Moon,
  DollarSign,
  Briefcase,
  LogOut,
  GraduationCap,
  Zap,
} from 'lucide-react';

import AttendancePlanner from './modules/AttendancePlanner';
import CGPAPredictor from './modules/CGPAPredictor';
import ExamStressPredictor from './modules/ExamStressPredictor';
import AssignmentPanicMeter from './modules/AssignmentPanicMeter';
import SleepinessDetector from './modules/SleepinessDetector';
import ExpenseSplitter from './modules/ExpenseSplitter';
import PlacementReadiness from './modules/PlacementReadiness';

type ModuleType =
  | 'attendance'
  | 'cgpa'
  | 'stress'
  | 'assignment'
  | 'sleepiness'
  | 'expense'
  | 'placement'
  | null;

const modules = [
  { id: 'attendance' as ModuleType, title: 'Attendance Planner', description: 'Calculate allowable absences to maintain compliance', icon: Calendar, gradient: 'from-blue-500 via-indigo-500 to-cyan-500' },
  { id: 'cgpa' as ModuleType, title: 'CGPA Predictor', description: 'Predict your semester CGPA based on expected grades', icon: TrendingUp, gradient: 'from-green-500 via-emerald-500 to-teal-500' },
  { id: 'stress' as ModuleType, title: 'Exam Stress Predictor', description: 'Assess your stress level based on preparation', icon: Brain, gradient: 'from-orange-500 via-amber-500 to-red-500' },
  { id: 'assignment' as ModuleType, title: 'Assignment Panic Meter', description: 'Evaluate urgency level of pending assignments', icon: AlertCircle, gradient: 'from-red-500 via-pink-500 to-rose-500' },
  { id: 'sleepiness' as ModuleType, title: 'Class Sleepiness Detector', description: 'Quick assessment of your alertness level', icon: Moon, gradient: 'from-purple-500 via-violet-500 to-indigo-500' },
  { id: 'expense' as ModuleType, title: 'Expense Splitter', description: 'Calculate fair share for group expenses', icon: DollarSign, gradient: 'from-teal-500 via-cyan-500 to-blue-500' },
  { id: 'placement' as ModuleType, title: 'Placement Readiness Meter', description: 'Evaluate your preparation for campus placements', icon: Briefcase, gradient: 'from-cyan-500 via-sky-500 to-indigo-500' },
];

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState<ModuleType>(null);
  const [neon, setNeon] = useState(false);

  // 🔥 get profile from context
  const { signOut, profile } = useAuth();

  /* ---------------- Greeting Logic ---------------- */
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const studentName = profile?.full_name
    ? profile.full_name.split(' ')[0]
    : 'Student';

  /* -------- Cursor Absolute Position -------- */
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const glowX = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const glowY = useSpring(cursorY, { stiffness: 120, damping: 20 });

  /* -------- Parallax -------- */
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);

  const springPX = useSpring(parallaxX, { stiffness: 40, damping: 20 });
  const springPY = useSpring(parallaxY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      parallaxX.set((e.clientX - window.innerWidth / 2) / 50);
      parallaxY.set((e.clientY - window.innerHeight / 2) / 50);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [cursorX, cursorY, parallaxX, parallaxY]);

  const renderModule = () => {
    switch (activeModule) {
      case 'attendance': return <AttendancePlanner onClose={() => setActiveModule(null)} />;
      case 'cgpa': return <CGPAPredictor onClose={() => setActiveModule(null)} />;
      case 'stress': return <ExamStressPredictor onClose={() => setActiveModule(null)} />;
      case 'assignment': return <AssignmentPanicMeter onClose={() => setActiveModule(null)} />;
      case 'sleepiness': return <SleepinessDetector onClose={() => setActiveModule(null)} />;
      case 'expense': return <ExpenseSplitter onClose={() => setActiveModule(null)} />;
      case 'placement': return <PlacementReadiness onClose={() => setActiveModule(null)} />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${neon ? 'bg-black' : 'bg-slate-950'}`}>

      {/* Breathing Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: neon
            ? 'radial-gradient(circle at 30% 40%, rgba(0,255,255,0.25), transparent 60%)'
            : 'radial-gradient(circle at 30% 40%, rgba(99,102,241,0.25), transparent 60%)',
        }}
      />

      {/* Parallax Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: springPX, y: springPY }}
      />

      {/* Cursor Glow */}
      <motion.div
        className="pointer-events-none fixed w-72 h-72 rounded-full blur-3xl opacity-30"
        style={{
          background: neon ? 'cyan' : 'rgb(99,102,241)',
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-slate-900/70 backdrop-blur-xl border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-2.5 rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">StudentOS</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setNeon(!neon)} className="p-2 rounded-lg bg-slate-800">
              <Zap className={`w-4 h-4 ${neon ? 'text-cyan-400' : 'text-slate-400'}`} />
            </button>

            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* 🔥 GREETING SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-6 pt-8"
      >
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          {greeting}, {studentName}
        </h2>
      </motion.div>

      {/* MAIN */}
      <main className="relative max-w-7xl mx-auto px-6 py-10">
        <p className="text-slate-400 mb-12">
          Access your academic productivity tools and insights
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <motion.button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                whileHover={{ scale: 1.05, rotateX: -6, rotateY: 6 }}
                whileTap={{ scale: 0.97 }}
                style={{ transformPerspective: 1200 }}
                className="group relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 text-left overflow-hidden"
              >
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-6 shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {module.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {module.description}
                </p>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 group-hover:w-full transition-all duration-500 rounded-b-2xl" />
              </motion.button>
            );
          })}
        </div>
      </main>

      <AnimatePresence mode="wait">
        {activeModule && (
          <motion.div
            key={activeModule}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 150) setActiveModule(null);
            }}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
          >
            {renderModule()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
