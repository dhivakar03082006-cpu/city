import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  Flame,
  Gauge,
  ShieldAlert,
  Car,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { FilterState, Hotspot, InsightItem } from '../types/index';
import { ApiService } from '../services/api';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { RiskBadge } from '../components/RiskBadge';
import { FilterBar } from '../components/FilterBar';
import { HotspotModal } from '../components/HotspotModal';
import { InsightCard } from '../components/InsightCard';

interface DashboardProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  onNavigatePage: (page: string) => void;
}

const SEVERITY_COLORS = {
  Fatal: '#ef4444',
  Severe: '#f59e0b',
  Moderate: '#06b6d4',
  Minor: '#64748b'
};

const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onNavigatePage
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await ApiService.getDashboardData(filters);
        if (isMounted) setData(res);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cyan-300">Synchronizing 25,000 Multi-Metro Telemetry Records...</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const hourlyTrend = data?.hourly_trend || [];
  const topRoads = data?.top_roads || [];
  const vehicleDist = data?.vehicle_dist || [];
  const weatherDist = data?.weather_dist || [];
  const recentTrends = data?.recent_trends || [];
  const insights = data?.ai_insights || [];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 6 Key Performance Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KpiCard
          title="Total Traffic Records"
          value={kpis.total_records || 25000}
          changePct={4.2}
          icon={<Car className="w-5 h-5" />}
          accentColor="blue"
        />
        <KpiCard
          title="Total Collisions"
          value={kpis.total_accidents || 0}
          changePct={-3.1}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="red"
        />
        <KpiCard
          title="Average Speed"
          value={kpis.avg_speed || 0}
          unit="km/h"
          changePct={1.8}
          icon={<Gauge className="w-5 h-5" />}
          accentColor="cyan"
        />
        <KpiCard
          title="Avg Congestion"
          value={kpis.avg_congestion || 0}
          unit="/ 10"
          changePct={-0.5}
          icon={<Activity className="w-5 h-5" />}
          accentColor="amber"
        />
        <KpiCard
          title="Fatal Collisions"
          value={kpis.fatal_accidents || 0}
          changePct={-8.4}
          icon={<ShieldAlert className="w-5 h-5" />}
          accentColor="purple"
        />
        <KpiCard
          title="High Risk Zones"
          value={kpis.high_risk_zones || 0}
          changePct={-2.0}
          icon={<Flame className="w-5 h-5" />}
          accentColor="red"
        />
      </div>

      {/* Primary Analytics Charts Grid (Row 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Traffic & Accident Trend */}
        <ChartCard
          title="Monthly Traffic Volume vs Collision Incidence"
          subtitle="Time-series correlation between vehicular load and safety incidents"
          infoTooltip="Evaluates whether high traffic volume directly increases accident frequency."
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={recentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="accidentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area yAxisId="left" type="monotone" dataKey="total_volume" name="Traffic Volume" stroke="#06b6d4" fill="url(#trafficGradient)" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="accidents" name="Accidents" stroke="#ef4444" fill="url(#accidentGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Hourly Accident Distribution (Peak Risk Times) */}
        <ChartCard
          title="Collision Frequency & Severity by Hour of Day"
          subtitle="24-hour diurnality revealing rush hour and late night trauma spikes"
          badge={<span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300">Peak 18:00 - 21:00</span>}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="fatal_accidents" name="Fatal Incidents" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="severe_accidents" name="Severe Incidents" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="total_accidents" name="Moderate / Minor" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Road Hotspots & Modal Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 8 Critical Road Corridors */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                High-Risk Corridor Rankings (0–100 Engine)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated via composite weight: 30% Freq + 25% Fatal + 15% Vol + 15% Congestion
              </p>
            </div>
            <button
              onClick={() => onNavigatePage('hotspots')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              <span>View All 20</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {data?.hotspots?.slice(0, 5).map((h: Hotspot) => (
              <div
                key={h.road_name}
                onClick={() => setSelectedHotspot(h)}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                    #{h.rank}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {h.road_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {h.area}, {h.city} • <span className="text-rose-400 font-semibold">{h.accidents} collisions</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="font-mono text-xs font-bold text-slate-200">
                      {h.avg_congestion}/10 <span className="text-[10px] text-slate-400 font-normal">cong.</span>
                    </p>
                    <p className="text-[10px] text-slate-400">{h.dominant_cause}</p>
                  </div>
                  <RiskBadge level={h.risk_level} score={h.risk_score} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Modal Distribution */}
        <ChartCard
          title="Accident Share by Vehicle Mode"
          subtitle="Vulnerable road users vs heavy vehicles"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={vehicleDist}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {vehicleDist.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            {vehicleDist.slice(0, 6).map((v: any, i: number) => (
              <div key={v.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-slate-300 truncate">{v.name}</span>
                <span className="text-slate-400 font-mono font-bold ml-auto">{v.share}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Row 3: Automated Business Intelligence Insights */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Priority Urban Policy & Safety Recommendations
          </h3>
          <button
            onClick={() => onNavigatePage('insights')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <span>Explore All 12 Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.slice(0, 2).map((ins: InsightItem) => (
            <InsightCard key={ins.id} insight={ins} onActionClick={() => onNavigatePage('hotspots')} />
          ))}
        </div>
      </div>

      {/* Hotspot Detailed Modal */}
      <HotspotModal hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />
    </div>
  );
};
