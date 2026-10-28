import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  changePct?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  accentColor?: 'blue' | 'purple' | 'red' | 'amber' | 'emerald' | 'cyan';
  id?: string;
  sparklineData?: number[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  changePct,
  changeLabel = 'vs prev month',
  icon,
  accentColor = 'blue',
  id,
  sparklineData = [35, 42, 38, 49, 52, 45, 60, 58]
}) => {
  const colorSchemes = {
    blue: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      glow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]',
      spark: '#06b6d4'
    },
    purple: {
      border: 'border-violet-500/20 hover:border-violet-500/40',
      iconBg: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      glow: 'hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]',
      spark: '#8b5cf6'
    },
    red: {
      border: 'border-red-500/20 hover:border-red-500/40',
      iconBg: 'bg-red-500/10 text-red-400 border border-red-500/20',
      glow: 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]',
      spark: '#ef4444'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      glow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
      spark: '#f59e0b'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
      spark: '#10b981'
    },
    cyan: {
      border: 'border-sky-500/20 hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
      glow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)]',
      spark: '#0ea5e9'
    }
  };

  const scheme = colorSchemes[accentColor];

  return (
    <motion.div
      id={id || `kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={clsx(
        'relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-xl p-5 border transition-all duration-300',
        scheme.border,
        scheme.glow
      )}
    >
      {/* Subtle top light gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
          </div>
        </div>

        <div className={clsx('p-2.5 rounded-xl shadow-inner', scheme.iconBg)}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
        {changePct !== undefined ? (
          <div className="flex items-center gap-1 text-xs">
            {changePct > 0 ? (
              <span className="inline-flex items-center text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{changePct}%
              </span>
            ) : changePct < 0 ? (
              <span className="inline-flex items-center text-rose-400 font-semibold">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {changePct}%
              </span>
            ) : (
              <span className="inline-flex items-center text-slate-400 font-semibold">
                <Minus className="w-3.5 h-3.5 mr-0.5" />
                0%
              </span>
            )}
            <span className="text-slate-400 text-[11px] truncate max-w-[130px]">
              {changeLabel}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Live Telemetry Synchronized</span>
        )}

        {/* Mini SVG Sparkline */}
        <div className="w-16 h-5 opacity-70">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
            <polyline
              fill="none"
              stroke={scheme.spark}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklineData.map((d, i) => `${(i / (sparklineData.length - 1)) * 60},${20 - (d / 80) * 18}`).join(' ')}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};
