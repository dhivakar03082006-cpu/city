import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Shield,
  MapPin,
  BarChart3,
  Flame,
  Zap,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';

interface LandingProps {
  onExplore: () => void;
  onLoginClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onExplore, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Floating Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              CITY<span className="text-cyan-400">PULSE</span>
            </span>
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              B.Tech IT Portfolio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="landing-nav-login-btn"
            onClick={onLoginClick}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            Analyst Login
          </button>
          <button
            id="landing-nav-explore-btn"
            onClick={onExplore}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 inline-flex items-center gap-1.5"
          >
            <span>Live Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Background Glowing Orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-violet-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Data Analytics, Geospatial Intelligence & Road Safety Engineering</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Turning Urban Traffic Data Into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Safer Cities
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            An intelligent analytics platform for understanding traffic patterns, accident risks, and urban road safety. Powered by 25,000+ multi-modal records, mathematical 0–100 risk scoring, and interactive geospatial mapping.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              id="hero-explore-dashboard-btn"
              onClick={onExplore}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_25px_rgba(6,182,212,0.45)] transition-all duration-300 inline-flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-view-analytics-btn"
              onClick={onExplore}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all duration-300 inline-flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>View Analytics Suite</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Interactive Visualization Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 rounded-3xl p-4 sm:p-6 bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Top Bar Preview */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">CityPulse v1.0 — Realtime GIS Intelligence Stream</span>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level="Critical" score={92.4} showPulse={true} />
              <span className="text-xs font-mono text-cyan-400">25,000 Records Indexed</span>
            </div>
          </div>

          {/* Grid Mock Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <p className="text-xs uppercase font-bold text-slate-400">Total Accidents Monitored</p>
              <p className="font-mono text-3xl font-extrabold text-white mt-1">3,842</p>
              <p className="text-xs text-rose-400 mt-1 font-semibold">184 Fatalities Tracked</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <p className="text-xs uppercase font-bold text-slate-400">0-100 Risk Score Engine</p>
              <p className="font-mono text-3xl font-extrabold text-amber-400 mt-1">Multi-Factor</p>
              <p className="text-xs text-slate-400 mt-1">Fatality + Congestion + Speed</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <p className="text-xs uppercase font-bold text-slate-400">Metropolitan Corridors</p>
              <p className="font-mono text-3xl font-extrabold text-cyan-400 mt-1">7 Metros</p>
              <p className="text-xs text-emerald-400 mt-1 font-semibold">Chennai, Mumbai, BLR & More</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 1. Problem Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
            01. Urban Challenge
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
            Why Raw Traffic Data Fails Modern Urban Planners
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Millions of sensors and accident reports sit in isolated silos. Without unified geospatial analytics and normalized risk modeling, emergency response lags and fatalities remain unmitigated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <AlertTriangle className="w-6 h-6 text-rose-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Unidentified Blackspots</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional accident reports lack real-time correlation with speed limit compliance, rain intensity, and lane congestion.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <Flame className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Delayed Emergency Response</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Congestion friction causes ambulance delays exceeding 18 minutes, missing the life-saving Golden Hour in trauma care.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <TrendingUp className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Static Decision Making</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              City councils rely on annual spreadsheets instead of continuous statistical EDA, time-series forecasting, and interactive GIS maps.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Solution Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            02. The Solution
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
            CityPulse: End-to-End Traffic Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            A comprehensive pipeline from raw telemetry cleaning to machine-weighted risk scoring, interactive GIS mapping, and automated safety recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-3 border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">25k Cleaned Records</h4>
            <p className="text-xs text-slate-400">
              IQR outlier removal, median imputation, and time standardization.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 w-fit mb-3 border border-violet-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">0–100 Risk Score</h4>
            <p className="text-xs text-slate-400">
              Frequency + Fatality weight + Volume + Speed + Congestion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-3 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Leaflet GIS Risk Map</h4>
            <p className="text-xs text-slate-400">
              Hotspot radius clustering, severity color coding, and road drilldown.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Actionable Insights</h4>
            <p className="text-xs text-slate-400">
              Root-cause analysis and prioritized infrastructure recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Tech Stack Matrix */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400">
            03. Technology Architecture
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
            Production Data Science Stack
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {[
            { name: 'Python', role: 'Analytics Engine', color: 'text-amber-400' },
            { name: 'Pandas & NumPy', role: 'Data Manipulation', color: 'text-blue-400' },
            { name: 'PostgreSQL', role: 'Relational Schema & SQL', color: 'text-sky-400' },
            { name: 'FastAPI / Node', role: 'High-Speed REST APIs', color: 'text-emerald-400' },
            { name: 'React & TS', role: 'Interactive Dashboard', color: 'text-cyan-400' },
            { name: 'Leaflet GIS', role: 'Geospatial Risk Mapping', color: 'text-violet-400' }
          ].map((t, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className={`font-mono text-sm font-extrabold ${t.color}`}>{t.name}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center border-t border-slate-800/80">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/20 blur-[90px] rounded-full pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight relative z-10">
            Explore the Live Urban Intelligence Dashboard
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-3 mb-6 relative z-10">
            Interactive filtering across 7 cities, 10+ analytical modules, real-time 0-100 road risk calculations, and CSV exports.
          </p>

          <button
            id="landing-cta-launch-btn"
            onClick={onExplore}
            className="px-8 py-4 rounded-2xl text-base font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 inline-flex items-center gap-2 hover:scale-[1.02] relative z-10"
          >
            <span>Launch CityPulse Platform</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
