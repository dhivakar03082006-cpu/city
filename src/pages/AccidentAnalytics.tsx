import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  CloudRain,
  Flame,
  Activity,
  Zap,
  Car
} from 'lucide-react';
import {
  ResponsiveContainer,
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
import { FilterState } from '../types/index';
import { ApiService } from '../services/api';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { FilterBar } from '../components/FilterBar';

interface AccidentAnalyticsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

const CAUSE_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#64748b'];
const SEVERITY_COLORS = {
  Fatal: '#ef4444',
  Severe: '#f59e0b',
  Moderate: '#06b6d4',
  Minor: '#64748b'
};

export const AccidentAnalytics: React.FC<AccidentAnalyticsProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchAccidents() {
      setLoading(true);
      try {
        const res = await ApiService.getAccidentAnalytics(filters);
        if (mounted) setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAccidents();
    return () => { mounted = false; };
  }, [filters]);

  const kpis = data?.kpis || {};
  const causes = data?.causes || [];
  const roadConditions = data?.road_conditions || [];
  const lightingConditions = data?.lighting_conditions || [];
  const severityDist = data?.severity_distribution || [];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* 5 Accident Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <KpiCard
          title="Total Road Collisions"
          value={kpis.total_accidents || 0}
          changePct={-2.4}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="red"
        />
        <KpiCard
          title="Fatal Collisions"
          value={kpis.fatal_accidents || 0}
          changePct={-8.1}
          icon={<ShieldAlert className="w-5 h-5" />}
          accentColor="purple"
        />
        <KpiCard
          title="Severe Injuries"
          value={kpis.severe_accidents || 0}
          changePct={-3.0}
          icon={<Activity className="w-5 h-5" />}
          accentColor="amber"
        />
        <KpiCard
          title="Moderate / Minor"
          value={(kpis.moderate_accidents || 0) + (kpis.minor_accidents || 0)}
          changePct={1.2}
          icon={<Car className="w-5 h-5" />}
          accentColor="cyan"
        />
        <KpiCard
          title="Avg EMS Ambulance Lag"
          value={kpis.avg_response_time || 0}
          unit="min"
          changePct={-6.5}
          icon={<Clock className="w-5 h-5" />}
          accentColor="emerald"
        />
      </div>

      {/* Row 1: Primary Accident Causes & Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accident Causes Breakdown */}
        <ChartCard
          title="Dominant Accident Causes (Root Cause Distribution)"
          subtitle="Overspeeding and Distracted Driving constitute >50% of serious trauma"
          badge={<span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300">Overspeeding #1</span>}
        >
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={causes} layout="vertical" margin={{ top: 10, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" stroke="#cbd5e1" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="value" name="Accidents" fill="#ef4444" radius={[0, 4, 4, 0]}>
                {causes.map((entry: any, index: number) => (
                  <Cell key={`cause-${index}`} fill={CAUSE_COLORS[index % CAUSE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Severity Classification */}
        <ChartCard
          title="Incident Severity Tier Proportion"
          subtitle="Classification of medical trauma outcomes"
        >
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={severityDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {severityDist.map((entry: any) => (
                  <Cell key={`sev-${entry.name}`} fill={(SEVERITY_COLORS as any)[entry.name] || '#06b6d4'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Road Conditions & Lighting Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Road Surface Condition Impact"
          subtitle="Impact of wet, potholed, and under-construction road surfaces"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roadConditions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="value" name="Collisions" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Ambient Lighting & Visibility Risk"
          subtitle="Accident counts during daylight vs dark unlit nocturnal corridors"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lightingConditions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="value" name="Collisions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
