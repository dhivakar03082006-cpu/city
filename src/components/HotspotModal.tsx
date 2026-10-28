import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, ShieldAlert, Sparkles, MapPin, Gauge, Activity, Car, Clock, CheckCircle2 } from 'lucide-react';
import { Hotspot } from '../types/index';
import { RiskBadge } from './RiskBadge';
import { ApiService } from '../services/api';

interface HotspotModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({ hotspot, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!hotspot) return null;

  const handleGenerateAiMitigation = async () => {
    setLoadingAi(true);
    try {
      const res = await ApiService.getAiAdvisory({
        corridor: hotspot.road_name,
        city: hotspot.city,
        riskScore: hotspot.risk_score,
        dominantCause: hotspot.dominant_cause
      });
      setAiAnalysis(res.analysis || 'Analysis generated.');
    } catch (e) {
      setAiAnalysis('Deploy automated speed-calming radar displays, enforce automated lane-discipline surveillance, and improve overhead illumination.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="hotspot-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="hotspot-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 relative overflow-hidden"
        >
          {/* Top Banner Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-cyan-500" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  RANK #{hotspot.rank}
                </span>
                <RiskBadge level={hotspot.risk_level} score={hotspot.risk_score} showPulse={true} />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                {hotspot.road_name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {hotspot.area}, {hotspot.city} ({hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)})
              </p>
            </div>

            <button
              id="hotspot-modal-close"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Collisions</span>
              <p className="font-mono text-xl font-extrabold text-white mt-0.5">{hotspot.accidents}</p>
              <span className="text-[10px] text-rose-400 font-semibold">{hotspot.fatalities} Fatalities</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400">Congestion Index</span>
              <p className="font-mono text-xl font-extrabold text-amber-400 mt-0.5">{hotspot.avg_congestion}/10</p>
              <span className="text-[10px] text-slate-400">High Peak Friction</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400">Average Speed</span>
              <p className="font-mono text-xl font-extrabold text-cyan-400 mt-0.5">{hotspot.avg_speed} <span className="text-xs font-normal">km/h</span></p>
              <span className="text-[10px] text-slate-400">Pre-incident flow</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400">EMS Response</span>
              <p className="font-mono text-xl font-extrabold text-emerald-400 mt-0.5">{hotspot.avg_response_time} <span className="text-xs font-normal">min</span></p>
              <span className="text-[10px] text-slate-400">Ambulance lag</span>
            </div>
          </div>

          {/* Mathematical 0-100 Risk Score Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>0-100 Risk Scoring Sub-Components</span>
              <span className="font-mono text-cyan-400 font-bold">{hotspot.risk_score} / 100</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>Accident Frequency Weight (30% max)</span>
                  <span className="font-mono font-bold text-red-400">{hotspot.score_breakdown.frequency_score} pts</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${(hotspot.score_breakdown.frequency_score / 30) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>Fatality & Severity Severity Multiplier (25% max)</span>
                  <span className="font-mono font-bold text-amber-400">{hotspot.score_breakdown.fatality_score} pts</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${(hotspot.score_breakdown.fatality_score / 25) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>Traffic Volume Exposure (15% max)</span>
                  <span className="font-mono font-bold text-cyan-400">{hotspot.score_breakdown.volume_score} pts</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${(hotspot.score_breakdown.volume_score / 15) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>Congestion Friction Factor (15% max)</span>
                  <span className="font-mono font-bold text-violet-400">{hotspot.score_breakdown.congestion_score} pts</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-violet-500" style={{ width: `${(hotspot.score_breakdown.congestion_score / 15) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-5">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Dominant Accident Cause</span>
              <p className="text-white font-semibold mt-1">{hotspot.dominant_cause}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Most Involved Vehicle</span>
              <p className="text-cyan-300 font-semibold mt-1">{hotspot.dominant_vehicle}</p>
            </div>
          </div>

          {/* AI / Engineering Mitigation Advisory */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Engineering Intervention Plan
              </span>
              {!aiAnalysis && (
                <button
                  id="generate-ai-plan-btn"
                  onClick={handleGenerateAiMitigation}
                  disabled={loadingAi}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold transition-colors flex items-center gap-1 text-[11px]"
                >
                  {loadingAi ? 'Synthesizing...' : 'Generate AI Advisory'}
                </button>
              )}
            </div>

            <p className="text-slate-300 leading-relaxed">
              {aiAnalysis ||
                `Recommended Priority: Install automated speed radar units at 500m intervals on ${hotspot.road_name}. Re-adjust signal timing to relieve 35% evening bottleneck congestion.`}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
