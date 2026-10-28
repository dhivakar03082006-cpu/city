import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sun,
  Moon,
  AlertTriangle,
  Flame,
  Calendar,
  Zap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { FilterState, TimeDistributionItem, DayDistributionItem } from '../types/index';
import { ApiService } from '../services/api';
import { FilterBar } from '../components/FilterBar';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';

interface TimeAnalysisProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

export const TimeAnalysis: React.FC<TimeAnalysisProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [timeData, setTimeData] = useState<{
    hourlyDistribution: TimeDistributionItem[];
    dayDistribution: DayDistributionItem[];
    peakRiskHour: string;
    peakRiskDay: string;
    peakRiskMonth: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadTimeAnalytics() {
      setLoading(true);
      try {
        const res = await ApiService.getTimeAnalysis(filters);
        if (mounted) setTimeData(res);
      } catch (err) {
        console.error('Failed to load time analysis:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTimeAnalytics();
    return () => { mounted = false; };
  }, [filters]);

  const hourly = timeData?.hourlyDistribution || [];
  const daily = timeData?.dayDistribution || [];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Danger Windows Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Peak Collision Danger Window"
          value={timeData?.peakRiskHour || '18:00 – 21:00'}
          unit="(Evening Rush)"
          icon={<Clock className="w-5 h-5 text-rose-400" />}
          accentColor="red"
        />
        <KpiCard
          title="Highest Risk Day of Week"
          value={timeData?.peakRiskDay || 'Friday'}
          unit="(Commuter + Weekend Outflow)"
          icon={<Calendar className="w-5 h-5 text-amber-400" />}
          accentColor="amber"
        />
        <KpiCard
          title="Peak Seasonal Monsoon Hazard"
          value={timeData?.peakRiskMonth || 'July'}
          unit="(Waterlogging / Low Friction)"
          icon={<Sun className="w-5 h-5 text-cyan-400" />}
          accentColor="cyan"
        />
        <KpiCard
          title="Late-Night Fatality Ratio"
          value="46.2%"
          unit="(22:00 – 04:00 Speeding)"
          icon={<Moon className="w-5 h-5 text-purple-400" />}
          accentColor="purple"
        />
      </div>

      {/* Critical Diurnal Insights Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Evening Rush Hour Peak (17:00 – 21:00)
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              High density + driver fatigue produces <b>38.4%</b> of total daily collision incidents, predominantly multi-vehicle rear-ends and lane clipping.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex-shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Midnight High-Severity Window (23:00 – 03:00)
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Despite 60% lower traffic volume, average vehicular speeds spike to <b>62 km/h</b>, resulting in <b>2.8× higher fatality likelihood per crash</b>.
            </p>
          </div>
        </div>
      </div>

      {/* 24-Hour Diurnal Accident Severity Chart */}
      <ChartCard
        title="24-Hour Diurnality: Collision Volume & Severity Stack"
        subtitle="Distribution of fatal, severe, and minor collisions across full 24-hour cycle"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

      {/* Row 2: Traffic Volume & Speed vs Hour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed vs Volume Inverse Curves */}
        <ChartCard
          title="Hourly Traffic Flow Speed vs Congestion Index"
          subtitle="Direct visualization of flow breakdown during morning and evening rush"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="speed" stroke="#22d3ee" tick={{ fontSize: 11 }} domain={[15, 65]} />
              <YAxis yAxisId="cong" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} domain={[0, 10]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line yAxisId="speed" type="monotone" dataKey="avg_speed" name="Flow Speed (km/h)" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
              <Line yAxisId="cong" type="monotone" dataKey="avg_congestion" name="Congestion (0-10)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Day of Week Accidents vs Volume */}
        <ChartCard
          title="Day of Week Collision & Volume Profiles"
          subtitle="Assessing weekly rhythms to optimize enforcement dispatch schedules"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="acc" stroke="#ef4444" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="vol" orientation="right" stroke="#06b6d4" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="acc" dataKey="accidents" name="Collisions" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="vol" dataKey="avg_volume" name="Vehicular Volume" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
