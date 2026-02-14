import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  GraduationCap,
  Zap,
} from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  LayoutGroup,
} from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [neon, setNeon] = useState(false);

  const { signIn, signUp } = useAuth();

  /* ---------------- Mouse Glow ---------------- */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  /* ---------------- Password Strength ---------------- */
  const strength =
    password.length < 6
      ? 20
      : password.length < 8
      ? 50
      : password.length < 12
      ? 75
      : 100;

  const strengthColor =
    strength < 40
      ? 'from-red-500 to-red-600'
      : strength < 75
      ? 'from-yellow-500 to-yellow-600'
      : 'from-emerald-500 to-emerald-600';

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if (!fullName.trim()) throw new Error('Full name required');

        // 🔥 IMPORTANT: Pass fullName properly to signUp
        const { error } = await signUp(email, password, fullName.trim());
        if (error) throw error;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutGroup>
      <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${neon ? 'bg-black' : 'bg-slate-950'}`}>

        {/* Breathing Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.03, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            background: neon
              ? 'radial-gradient(circle at top, rgba(0,255,255,0.25), transparent 60%)'
              : 'radial-gradient(circle at top, rgba(99,102,241,0.25), transparent 60%)',
          }}
        />

        {/* Mouse Glow */}
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

        <div className="relative flex items-center justify-center min-h-screen p-6">

          <motion.div
            layoutId="auth-card"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8"
          >

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <motion.div layoutId="logo" className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-3 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-semibold text-white">StudentOS</h1>
              </div>

              <button onClick={() => setNeon(!neon)} className="p-2 rounded-lg bg-slate-800">
                <Zap className={`w-4 h-4 ${neon ? 'text-cyan-400' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Toggle */}
            <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg ${isLogin ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg ${!isLogin ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <InputField value={fullName} onChange={setFullName} placeholder="Full Name" />
              )}

              <InputField value={email} onChange={setEmail} placeholder="Email" type="email" />
              <InputField value={password} onChange={setPassword} placeholder="Password" type="password" />

              {/* Password Strength */}
              {password && (
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${strength}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full bg-gradient-to-r ${strengthColor}`}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                type="submit"
                className="relative w-full py-3 rounded-xl font-medium text-white overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: 'linear-gradient(270deg,#6366f1,#06b6d4,#6366f1)',
                    backgroundSize: '200% 200%',
                  }}
                />
                <span className="relative z-10">
                  {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
                </span>
              </motion.button>

            </form>
          </motion.div>
        </div>
      </div>
    </LayoutGroup>
  );
}

/* ---------------- Input ---------------- */
function InputField({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <motion.div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </motion.div>
  );
}
