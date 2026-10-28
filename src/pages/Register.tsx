import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface RegisterProps {
  onRegister: (data: { full_name: string; email: string; password: string }) => Promise<any>;
  onNavigateLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onRegister({ full_name: fullName, email, password });
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden text-slate-100">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-8 backdrop-blur-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] mx-auto mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Analyst Registration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access CityPulse Urban Intelligence Network
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Dr. Rajesh Kumar"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pl-10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Work Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="analyst@transport.gov.in"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pl-10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pl-10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pl-10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Credentials...' : 'Register as Analyst'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have credentials?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-cyan-300 font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
};
