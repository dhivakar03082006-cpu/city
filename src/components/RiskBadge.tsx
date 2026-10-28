import React from 'react';
import { RiskLevelType } from '../types/index';
import clsx from 'clsx';

interface RiskBadgeProps {
  level: RiskLevelType | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, size = 'md', showPulse = false }) => {
  const normalized = (level || 'Low').toLowerCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold'
  };

  const getStyle = () => {
    switch (normalized) {
      case 'critical':
        return 'bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]';
      case 'high':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'moderate':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
      case 'low':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    }
  };

  const getDotColor = () => {
    switch (normalized) {
      case 'critical': return 'bg-red-400';
      case 'high': return 'bg-amber-400';
      case 'moderate': return 'bg-cyan-400';
      default: return 'bg-emerald-400';
    }
  };

  return (
    <span
      id={`risk-badge-${normalized}`}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider transition-all duration-200',
        sizeClasses[size],
        getStyle()
      )}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && (normalized === 'critical' || normalized === 'high') && (
          <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', getDotColor())} />
        )}
        <span className={clsx('relative inline-flex rounded-full h-2 w-2', getDotColor())} />
      </span>
      <span>{level}</span>
      {score !== undefined && (
        <span className="font-mono text-slate-300 font-bold ml-0.5">
          ({score})
        </span>
      )}
    </span>
  );
};
