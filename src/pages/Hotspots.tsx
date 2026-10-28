import React, { useState, useEffect } from 'react';
import {
  Flame,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  ExternalLink,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { FilterState, Hotspot } from '../types/index';
import { ApiService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { HotspotModal } from '../components/HotspotModal';
import { FilterBar } from '../components/FilterBar';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';

interface HotspotsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

export const Hotspots: React.FC<HotspotsProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | 'Critical' | 'High' | 'Moderate'>('all');
  const [sortBy, setSortBy] = useState<'risk_score' | 'accidents' | 'fatalities' | 'avg_congestion'>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    let mounted = true;
    async function loadHotspots() {
      setLoading(true);
      try {
        const res = await ApiService.getHotspots(filters);
        if (mounted) setHotspots(res);
      } catch (err) {
        console.error('Failed to load hotspots:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadHotspots();
    return () => { mounted = false; };
  }, [filters]);

  // Filtering & Sorting
  const filteredHotspots = hotspots
    .filter(h => {
      if (selectedRiskFilter !== 'all' && h.risk_level !== selectedRiskFilter) return false;
      if (localSearch) {
        const q = localSearch.toLowerCase();
        return (
          h.road_name.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.dominant_cause.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const criticalCount = hotspots.filter(h => h.risk_score >= 80).length;
  const highCount = hotspots.filter(h => h.risk_score >= 65 && h.risk_score < 80).length;
  const avgRisk = hotspots.length ? Math.round(hotspots.reduce((a, b) => a + b.risk_score, 0) / hotspots.length) : 0;
  const topHazardCorridor = hotspots[0]?.road_name || 'Outer Ring Road';

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Top Section: Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Critical Risk Corridors (&gt;80)"
          value={criticalCount}
          changePct={-5.0}
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          accentColor="red"
        />
        <KpiCard
          title="High Hazard Zones (65–79)"
          value={highCount}
          changePct={-2.1}
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          accentColor="amber"
        />
        <KpiCard
          title="Mean Corridor Risk Rating"
          value={avgRisk}
          unit="/ 100"
          changePct={-1.4}
          icon={<ShieldAlert className="w-5 h-5 text-cyan-400" />}
          accentColor="cyan"
        />
        <KpiCard
          title="Top Priority Road Corridor"
          value={topHazardCorridor}
          unit={`(${hotspots[0]?.city || 'Bengaluru'})`}
          icon={<Zap className="w-5 h-5 text-purple-400" />}
          accentColor="purple"
        />
      </div>

      {/* Risk Scoring Mathematical Model Breakdown Callout */}
      <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-cyan-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SCORING ALGORITHM SPECIFICATION
              </span>
              <span className="text-xs font-semibold text-slate-400">Continuous 0–100 Weighted Normalization</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Composite Urban Hazard Index Formula
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 font-mono">
              Risk Score = 0.30×Norm(Accidents) + 0.25×Norm(Fatalities) + 0.15×Norm(Volume) + 0.15×Norm(Congestion) + 0.15×Norm(SpeedVariance)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedHotspot(hotspots[0])}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Advisory: #{hotspots[0]?.rank || 1} Corridor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 10 Corridors Bar Chart */}
      <ChartCard
        title="Top 10 Hazardous Road Corridors by Risk Score"
        subtitle="Visualizing risk intensity and composite scoring across monitored arteries"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={hotspots.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="road_name" stroke="#64748b" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Bar dataKey="risk_score" name="Risk Score (0-100)" radius={[6, 6, 0, 0]}>
              {hotspots.slice(0, 10).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.risk_score >= 80 ? '#ef4444' : entry.risk_score >= 65 ? '#f59e0b' : '#06b6d4'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Corridor Table & Controls */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/80 space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search road, area, cause..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
              />
            </div>

            {/* Severity Pill Filter */}
            <div className="flex items-center gap-1.5">
              {(['all', 'Critical', 'High', 'Moderate'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedRiskFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedRiskFilter === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {lvl === 'all' ? 'All Risks' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Showing <b>{filteredHotspots.length}</b> corridors</span>
          </div>
        </div>

        {/* Hotspots Ranking Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Road Corridor & Location</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-cyan-300"
                  onClick={() => {
                    setSortBy('risk_score');
                    setSortOrder(sortBy === 'risk_score' && sortOrder === 'desc' ? 'asc' : 'desc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Risk Rating</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-cyan-300"
                  onClick={() => {
                    setSortBy('accidents');
                    setSortOrder(sortBy === 'accidents' && sortOrder === 'desc' ? 'asc' : 'desc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Collisions</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-cyan-300"
                  onClick={() => {
                    setSortBy('fatalities');
                    setSortOrder(sortBy === 'fatalities' && sortOrder === 'desc' ? 'asc' : 'desc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Fatalities</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Dominant Cause</th>
                <th className="py-3 px-3">Congestion</th>
                <th className="py-3 px-3">Engineering Action</th>
                <th className="py-3 px-3 text-right">Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHotspots.map(h => (
                <tr
                  key={h.road_name}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedHotspot(h)}
                >
                  <td className="py-3 px-3">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center">
                      #{h.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {h.road_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {h.area}, <span className="text-slate-300 font-medium">{h.city}</span>
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge level={h.risk_level} score={h.risk_score} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    {h.accidents}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-400">
                    {h.fatalities}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                      {h.dominant_cause}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {h.avg_congestion}/10
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs truncate">
                    {h.recommended_action}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspot(h);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <HotspotModal hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />
    </div>
  );
};
