import React, { useState, useEffect } from 'react';
import {
  Car,
  Gauge,
  Activity,
  TrendingUp,
  Clock,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ZAxis
} from 'recharts';
import { FilterState } from '../types/index';
import { ApiService } from '../services/api';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { FilterBar } from '../components/FilterBar';

interface TrafficAnalyticsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

export const TrafficAnalytics: React.FC<TrafficAnalyticsProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchTraffic() {
      setLoading(true);
      try {
        const res = await ApiService.getTrafficAnalytics(filters);
        if (mounted) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchTraffic();
    return () => { mounted = false; };
  }, [filters]);

  const kpis = data?.kpis || {};
  const cityStats = data?.city_stats || [];
  const hourly = data?.hourly_pattern || [];
  const daily = data?.day_pattern || [];

  // Speed vs Congestion Scatter Mock derived data
  const scatterData = cityStats.map((c: any) => ({
    city: c.city,
    speed: c.avg_speed,
    congestion: c.avg_congestion,
    volume: c.avg_volume
  }));

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 4 Traffic Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Average Hourly Traffic Volume"
          value={kpis.avg_volume || 0}
          unit="vehicles/hr"
          changePct={3.4}
          icon={<Car className="w-5 h-5" />}
          accentColor="blue"
        />
        <KpiCard
          title="Peak Recorded Traffic Volume"
          value={kpis.peak_volume || 0}
          unit="vehicles/hr"
          changePct={5.2}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="purple"
        />
        <KpiCard
          title="Average Urban Flow Speed"
          value={kpis.avg_speed || 0}
          unit="km/h"
          changePct={-1.2}
          icon={<Gauge className="w-5 h-5" />}
          accentColor="cyan"
        />
        <KpiCard
          title="Citywide Congestion Index"
          value={kpis.congestion_index || 0}
          unit="/ 10"
          changePct={0.8}
          icon={<Activity className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* Primary Traffic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Traffic Pattern */}
        <ChartCard
          title="Hourly Traffic Volume Curve (Vehicular Flow)"
          subtitle="Identifies morning rush (08:00–11:00) and evening peak (17:00–21:00)"
          infoTooltip="Evaluates throughput bottleneck periods across arterial corridors."
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="avg_volume" name="Vehicular Volume" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3, fill: '#06b6d4' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Day of Week Traffic Load */}
        <ChartCard
          title="Day-of-Week Average Traffic Load"
          subtitle="Comparison of weekday commuter density versus weekend travel"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="avg_volume" name="Average Volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Metro Comparison & Speed vs Congestion Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City-by-City Volume vs Congestion */}
        <ChartCard
          title="Metropolitan City Comparison: Volume & Congestion"
          subtitle="Benchmarking 7 major Indian tech and transport hubs"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cityStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="city" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="avg_volume" name="Avg Volume" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="avg_congestion" name="Congestion (0-10)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Speed vs Congestion Inverse Correlation Matrix */}
        <ChartCard
          title="Speed vs Congestion Correlation (Statistical EDA)"
          subtitle="Pearson r = -0.76 (Strong Inverse Correlation: higher congestion drops flow speed)"
        >
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" dataKey="congestion" name="Congestion Index" unit="/10" domain={[0, 10]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="speed" name="Average Speed" unit="km/h" domain={[0, 70]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <ZAxis type="number" dataKey="volume" range={[60, 400]} name="Traffic Volume" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Scatter name="Metropolitan Hubs" data={scatterData} fill="#22d3ee" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
