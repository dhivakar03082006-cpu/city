import React, { useState, useEffect } from 'react';
import {
  Table,
  Download,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  Car,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { FilterState, TrafficRecord } from '../types/index';
import { ApiService } from '../services/api';
import { FilterBar } from '../components/FilterBar';

interface DataExplorerProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [records, setRecords] = useState<TrafficRecord[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 25000, total_pages: 1000 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    let mounted = true;
    async function loadRecords() {
      setLoading(true);
      try {
        const res = await ApiService.getDataRecords(filters, pagination.page, pagination.limit, sortBy, sortOrder);
        if (mounted) {
          setRecords(res.records);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to load records:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRecords();
    return () => { mounted = false; };
  }, [filters, pagination.page, pagination.limit, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const exportUrl = ApiService.getExportUrl(filters);

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Explorer Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Multi-Metro Telemetry Data Explorer
            </h2>
            <p className="text-xs text-slate-400">
              Querying <b>{pagination.total.toLocaleString()}</b> verified sensor records across 7 metropolitan zones
            </p>
          </div>
        </div>

        {/* Action Buttons: Export CSV */}
        <div className="flex items-center gap-3">
          <a
            href={exportUrl}
            download
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Filtered CSV</span>
          </a>
        </div>
      </div>

      {/* Main Records Table Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/80 space-y-4">
        {/* Table View */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs font-mono text-cyan-300">Retrieving paginated records from database...</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 cursor-pointer hover:text-cyan-300" onClick={() => handleSort('record_id')}>
                    <div className="flex items-center gap-1">
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-cyan-300" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">
                      <span>Timestamp</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3">City & Road Corridor</th>
                  <th className="py-3 px-3 cursor-pointer hover:text-cyan-300" onClick={() => handleSort('traffic_volume')}>
                    <div className="flex items-center gap-1">
                      <span>Volume</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-cyan-300" onClick={() => handleSort('average_speed')}>
                    <div className="flex items-center gap-1">
                      <span>Speed</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-cyan-300" onClick={() => handleSort('congestion_index')}>
                    <div className="flex items-center gap-1">
                      <span>Congestion</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Weather</th>
                  <th className="py-3 px-3">Accident Event</th>
                  <th className="py-3 px-3">Severity & Cause</th>
                  <th className="py-3 px-3">Vehicle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {records.map(r => (
                  <tr key={r.record_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-cyan-300 font-bold">#{r.record_id}</td>
                    <td className="py-3 px-3 text-slate-300">
                      {r.date} <span className="text-slate-400">{r.time}</span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <p className="font-bold text-white text-xs">{r.road_name}</p>
                      <p className="text-[10px] text-slate-400">{r.area}, <span className="text-slate-300">{r.city}</span></p>
                    </td>
                    <td className="py-3 px-3 text-slate-200">{r.traffic_volume.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-200">{r.average_speed} km/h</td>
                    <td className="py-3 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.congestion_index >= 7 ? 'bg-red-500/20 text-red-300' :
                        r.congestion_index >= 4 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {r.congestion_index}/10
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300">{r.weather}</td>
                    <td className="py-3 px-3 font-sans">
                      {r.accident_occurred === 1 ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <AlertTriangle className="w-3 h-3" /> Collision
                        </span>
                      ) : (
                        <span className="text-slate-400">Clear Flow</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      {r.accident_occurred === 1 ? (
                        <div>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            r.severity === 'Fatal' ? 'bg-red-500/20 text-red-300' :
                            r.severity === 'Severe' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {r.severity}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">{r.cause}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300">{r.vehicle_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Showing Page <b>{pagination.page}</b> of <b>{pagination.total_pages}</b></span>
            <span>•</span>
            <span>Rows per page:</span>
            <select
              value={pagination.limit}
              onChange={e => setPagination(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.total_pages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.total_pages}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
