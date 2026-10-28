import React from 'react';
import { motion } from 'motion/react';
import { Download, Maximize2, Info } from 'lucide-react';
import clsx from 'clsx';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  className?: string;
  onExport?: () => void;
  infoTooltip?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  children,
  id,
  className,
  onExport,
  infoTooltip
}) => {
  return (
    <motion.div
      id={id || `chart-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'glass-card rounded-2xl p-5 border border-slate-800/80 bg-slate-900/70 shadow-lg relative overflow-hidden flex flex-col',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              {title}
            </h3>
            {badge}
            {infoTooltip && (
              <span title={infoTooltip} className="cursor-help text-slate-400 hover:text-cyan-400 transition-colors">
                <Info className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {onExport && (
          <button
            onClick={onExport}
            title="Export chart data"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-cyan-300 transition-colors border border-slate-700/40"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Chart Visual Container */}
      <div className="flex-1 w-full min-h-[260px] relative">
        {children}
      </div>
    </motion.div>
  );
};
