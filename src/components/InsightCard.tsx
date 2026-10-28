import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ShieldCheck, ArrowRight, Lightbulb, MapPin, Zap } from 'lucide-react';
import { InsightItem } from '../types/index';
import clsx from 'clsx';

interface InsightCardProps {
  insight: InsightItem;
  id?: string;
  onActionClick?: (insight: InsightItem) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, id, onActionClick }) => {
  const getPriorityTheme = () => {
    switch (insight.priority) {
      case 'Critical':
        return {
          border: 'border-red-500/30 hover:border-red-500/50',
          bg: 'bg-red-950/20',
          badge: 'bg-red-500/15 text-red-400 border-red-500/40',
          icon: <AlertTriangle className="w-4 h-4 text-red-400" />
        };
      case 'High':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/50',
          bg: 'bg-amber-950/20',
          badge: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
          icon: <Zap className="w-4 h-4 text-amber-400" />
        };
      case 'Moderate':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-500/50',
          bg: 'bg-cyan-950/20',
          badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
          icon: <Lightbulb className="w-4 h-4 text-cyan-400" />
        };
      default:
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/50',
          bg: 'bg-emerald-950/20',
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
        };
    }
  };

  const theme = getPriorityTheme();

  return (
    <motion.div
      id={id || `insight-card-${insight.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={clsx(
        'rounded-2xl p-5 border transition-all duration-300 backdrop-blur-xl bg-slate-900/80 shadow-md',
        theme.border,
        theme.bg
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
            {theme.icon}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {insight.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {insight.metric_stat && (
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-800/90 text-cyan-300 border border-slate-700">
              {insight.metric_stat}
            </span>
          )}
          <span className={clsx('text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border', theme.badge)}>
            {insight.priority} Priority
          </span>
        </div>
      </div>

      {/* Primary Key Finding */}
      <h4 className="text-sm md:text-base font-bold text-white mb-2 tracking-tight">
        {insight.insight}
      </h4>

      {/* Sub-sections: Why It Matters & Actionable Recommendation */}
      <div className="space-y-2.5 my-3.5 text-xs">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1 text-cyan-400">
            Why It Matters (Root Cause Analysis)
          </p>
          <p className="text-slate-300 leading-relaxed">
            {insight.why_it_matters}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
          <p className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" /> Actionable Safety Policy Intervention
          </p>
          <p className="text-cyan-100 font-medium leading-relaxed">
            {insight.recommended_action}
          </p>
        </div>
      </div>

      {insight.affected_entity && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            {insight.affected_entity}
          </span>
          {onActionClick && (
            <button
              onClick={() => onActionClick(insight)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Analyze Corridor <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
