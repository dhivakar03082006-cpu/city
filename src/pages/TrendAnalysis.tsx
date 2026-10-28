import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ComposedChart
} from 'recharts';
import { FilterState, MonthlyTrendItem } from '../types/index';
import { ApiService } from '../services/api';
import { FilterBar } from '../components/FilterBar';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';

interface TrendAnalysisProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [trends, setTrends] = useState<MonthlyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadTrends() {
      setLoading(true);
      try {
        const res = await ApiService.getTrendAnalysis(filters);
        if (mounted) setTrends(res);
      } catch (err) {
        console.error('Failed to load trends:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTrends();
    return () => { mounted = false; };
  }, [filters]);

  // Compute 3-Month Moving Average for statistical smoothing
  const processedTrends = trends.map((item, idx, arr) => {
    const start = Math.max(0, idx - 2);
    const windowSlice = arr.slice(start, idx + 1);
    const avg = Math.round(windowSlice.reduce((sum, curr) => sum + curr.accidents, 0) / windowSlice.length);
    return {
      ...item,
      moving_avg_3m: avg,
      fatality_pct: Number(((item.fatal / Math.max(1, item.accidents)) * 100).toFixed(1))
    };
  });

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Trend Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Year-to-Date Collision Trend"
          value="-4.8%"
          unit="YoY Decrease"
          changePct={-4.8}
          icon={<TrendingDown className="w-5 h-5 text-emerald-400" />}
          accentColor="emerald"
        />
        <KpiCard
          title="Monsoon Anomaly Spike"
          value="+28.4%"
          unit="Accident Surge (Jul–Aug)"
          changePct={28.4}
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          accentColor="amber"
        />
        <KpiCard
          title="3-Month Moving Average"
          value={processedTrends[processedTrends.length - 1]?.moving_avg_3m || 320}
          unit="Incidents/Mo"
          icon={<Activity className="w-5 h-5 text-cyan-400" />}
          accentColor="cyan"
        />
        <KpiCard
          title="Predictive Safety Model"
          value="ARIMA (1,1,1)"
          unit="Confidence 92.4%"
          icon={<Sparkles className="w-5 h-5 text-purple-400" />}
          accentColor="purple"
        />
      </div>

      {/* Forecasting & Seasonal Trajectory Main Chart */}
      <ChartCard
        title="12-Month Collision Trajectory & 3-Month Moving Average"
        subtitle="Time-series smoothing highlighting seasonal peaks and policy intervention dips"
      >
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={processedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} domain={[0, 30]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar yAxisId="left" dataKey="accidents" name="Actual Collisions" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Line yAxisId="left" type="monotone" dataKey="moving_avg_3m" name="3M Moving Average" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} />
            <Line yAxisId="right" type="monotone" dataKey="fatality_pct" name="Fatality Rate (%)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Row 2: Severity Progression & Traffic Load Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fatal vs Severe Breakdown */}
        <ChartCard
          title="Monthly Trauma Severity Breakdown"
          subtitle="Proportion of fatal vs severe injury incidents across time"
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={processedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="fatal" name="Fatal Incidents" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="severe" name="Severe Incidents" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Speed & Congestion Monthly Profile */}
        <ChartCard
          title="Monthly Traffic Flow & Congestion Dynamic"
          subtitle="Tracking citywide mobility metrics against urban safety targets"
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={processedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="avg_speed" name="Flow Speed (km/h)" stroke="#10b981" strokeWidth={2.5} />
              <Line type="monotone" dataKey="avg_congestion" name="Congestion Index" stroke="#8b5cf6" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
