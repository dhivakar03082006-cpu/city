import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Key } from 'lucide-react';

interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<any>;
  onNavigateRegister: () => void;
  onContinueAsGuest: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateRegister, onContinueAsGuest }) => {
  const [email, setEmail] = useState('demo@citypulse.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@citypulse.com');
    setPassword('demo123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden text-slate-100">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-8 backdrop-blur-2xl relative z-10"
      >
        {/* Logo and Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] mx-auto mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            CITY<span className="text-cyan-400">PULSE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Urban Traffic & Accident Intelligence Platform
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <p className="font-semibold text-cyan-300 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-cyan-400" /> Demo Analyst Account
            </p>
            <p className="text-[11px] text-slate-400 font-mono">demo@citypulse.com / demo123</p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-colors"
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 cursor-pointer">
              Analyst Email
            </label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="analyst@citypulse.com"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 cursor-pointer">
              Secure Password
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating Analyst...' : 'Sign In to Analytics Hub'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={onNavigateRegister}
            className="hover:text-cyan-300 transition-colors font-medium"
          >
            Create new account
          </button>
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="hover:text-white text-slate-400 transition-colors font-medium underline underline-offset-4"
          >
            Continue as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
};
