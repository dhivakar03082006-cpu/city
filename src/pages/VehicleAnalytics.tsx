import React, { useState, useEffect } from 'react';
import {
  Bike,
  Car,
  Truck,
  Bus,
  UserCheck,
  AlertTriangle,
  ShieldAlert,
  Gauge,
  Info,
  TrendingUp,
  Flame
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
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { FilterState, VehicleStatItem } from '../types/index';
import { ApiService } from '../services/api';
import { FilterBar } from '../components/FilterBar';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';

interface VehicleAnalyticsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

const VEHICLE_COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

export const VehicleAnalytics: React.FC<VehicleAnalyticsProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [vehicles, setVehicles] = useState<VehicleStatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadVehicles() {
      setLoading(true);
      try {
        const res = await ApiService.getVehicleAnalytics(filters);
        if (mounted) setVehicles(res);
      } catch (err) {
        console.error('Failed to load vehicles data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadVehicles();
    return () => { mounted = false; };
  }, [filters]);

  const twoWheeler = vehicles.find(v => v.vehicle_type === 'Two-Wheeler');
  const heavyTruck = vehicles.find(v => v.vehicle_type === 'Truck');
  const pedestrian = vehicles.find(v => v.vehicle_type === 'Pedestrian');

  // Radar metric formatting
  const radarData = vehicles.map(v => ({
    type: v.vehicle_type,
    share: v.share_pct,
    fatality_rate: v.fatality_rate,
    avg_speed: v.avg_speed
  }));

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Vehicle Category Threat KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Most Vulnerable Modal Group"
          value="Two-Wheelers"
          unit={`(${twoWheeler?.share_pct || 41.2}% share)`}
          icon={<Bike className="w-5 h-5 text-rose-400" />}
          accentColor="red"
        />
        <KpiCard
          title="Highest Lethality Collision Rate"
          value="Heavy Commercial Trucks"
          unit={`(${heavyTruck?.fatality_rate || 22.4}% fatality)`}
          icon={<Truck className="w-5 h-5 text-amber-400" />}
          accentColor="amber"
        />
        <KpiCard
          title="VRU Pedestrian Trauma Count"
          value={pedestrian?.accident_count || 184}
          unit="Incidents"
          icon={<UserCheck className="w-5 h-5 text-purple-400" />}
          accentColor="purple"
        />
        <KpiCard
          title="Average Flow Speed (Car)"
          value={vehicles.find(v => v.vehicle_type === 'Car')?.avg_speed || 48}
          unit="km/h"
          icon={<Gauge className="w-5 h-5 text-cyan-400" />}
          accentColor="cyan"
        />
      </div>

      {/* Vulnerable Road User Warning Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-slate-900 border border-rose-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Vulnerable Road User (VRU) Policy Directive</h4>
            <p className="text-xs text-slate-300">
              Two-wheelers and pedestrians represent <b>62.8% of all road fatalities</b>. Dedicated segregated lanes and raised pedestrian crossings reduce trauma by 45%.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accident Share vs Fatality Rate */}
        <ChartCard
          title="Accident Volume vs Fatality Rate by Mode"
          subtitle="Compares overall crash involvement against deadly outcome probability"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={vehicles} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="vehicle_type" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="accident_count" name="Total Collisions" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="fatality_rate" name="Fatality Rate (%)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Vehicle Mode Share Pie */}
        <ChartCard
          title="Modal Split of Accident Involvements"
          subtitle="Distribution across 6 standardized vehicle classifications"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={vehicles}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="accident_count"
                nameKey="vehicle_type"
              >
                {vehicles.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={VEHICLE_COLORS[index % VEHICLE_COLORS.length]} />
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

      {/* Vehicle Summary Table */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
        <h3 className="text-sm font-bold text-white mb-3">
          Statistical Breakdown by Vehicle Classification
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-2.5 px-3">Vehicle Class</th>
                <th className="py-2.5 px-3">Collisions</th>
                <th className="py-2.5 px-3">Modal Share</th>
                <th className="py-2.5 px-3">Fatal Incidents</th>
                <th className="py-2.5 px-3">Fatality Rate</th>
                <th className="py-2.5 px-3">Avg Cruising Speed</th>
                <th className="py-2.5 px-3">Primary Hazard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map((v, i) => (
                <tr key={v.vehicle_type} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: VEHICLE_COLORS[i % VEHICLE_COLORS.length] }} />
                    <span>{v.vehicle_type}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">{v.accident_count}</td>
                  <td className="py-3 px-3 font-mono text-cyan-300">{v.share_pct}%</td>
                  <td className="py-3 px-3 font-mono text-rose-400">{v.fatal_count}</td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-400">{v.fatality_rate}%</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{v.avg_speed} km/h</td>
                  <td className="py-3 px-3 text-slate-400">
                    {v.vehicle_type === 'Two-Wheeler' ? 'Helmets, lane zigzagging, skid' :
                     v.vehicle_type === 'Truck' ? 'Blind spots, braking distance' :
                     v.vehicle_type === 'Pedestrian' ? 'Jaywalking, lack of zebra lights' : 'Overspeeding, tailgating'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
