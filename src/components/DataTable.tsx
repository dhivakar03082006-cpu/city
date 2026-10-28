import React, { useState } from 'react';
import { TrafficRecord } from '../types/index';
import { Download, ChevronLeft, ChevronRight, ArrowUpDown, Search, Eye, Filter } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import clsx from 'clsx';

interface DataTableProps {
  records: TrafficRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onPageChange: (page: number) => void;
  onSort: (column: string) => void;
  sortBy: string;
  sortOrder: string;
  onExportCsv: () => void;
  loading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  pagination,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
  onExportCsv,
  loading = false
}) => {
  const [selectedRecord, setSelectedRecord] = useState<TrafficRecord | null>(null);

  const getSeverityStyle = (s: string) => {
    switch (s) {
      case 'Fatal': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Severe': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Moderate': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Minor': return 'bg-slate-700/60 text-slate-300 border-slate-600';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div id="data-explorer-table-container" className="glass-card rounded-2xl border border-slate-800 p-5 overflow-hidden">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Telemetry & Accident Data Records
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing <span className="font-mono text-cyan-300 font-bold">{records.length}</span> of <span className="font-mono font-bold text-white">{pagination.total.toLocaleString()}</span> indexed records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-csv-button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Download Filtered CSV</span>
          </button>
        </div>
      </div>

      {/* Table Responsive View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('record_id')}>
                <div className="flex items-center gap-1">Record ID <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('date')}>
                <div className="flex items-center gap-1">Timestamp <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('city')}>
                <div className="flex items-center gap-1">Metro / Road <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('vehicle_type')}>
                <div className="flex items-center gap-1">Vehicle <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('traffic_volume')}>
                <div className="flex items-center gap-1">Volume <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('average_speed')}>
                <div className="flex items-center gap-1">Speed <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('congestion_index')}>
                <div className="flex items-center gap-1">Congestion <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5 cursor-pointer hover:text-white" onClick={() => onSort('severity')}>
                <div className="flex items-center gap-1">Incident Severity <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
              </th>
              <th className="py-3 px-3.5">Environment</th>
              <th className="py-3 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {records.map((r, idx) => (
              <tr
                key={r.record_id}
                className={clsx(
                  'hover:bg-slate-800/40 transition-colors',
                  r.severity === 'Fatal' && 'bg-red-950/10'
                )}
              >
                <td className="py-2.5 px-3.5 font-mono text-[11px] font-bold text-cyan-300">
                  {r.record_id}
                </td>
                <td className="py-2.5 px-3.5">
                  <div className="font-mono text-slate-200">{r.date}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{r.time}</div>
                </td>
                <td className="py-2.5 px-3.5">
                  <div className="font-semibold text-white truncate max-w-[180px]">{r.road_name}</div>
                  <div className="text-[10px] text-slate-400">{r.city} • {r.area}</div>
                </td>
                <td className="py-2.5 px-3.5 font-medium text-slate-200">
                  {r.vehicle_type}
                </td>
                <td className="py-2.5 px-3.5 font-mono text-slate-300">
                  {r.traffic_volume.toLocaleString()}
                </td>
                <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-200">
                  {r.average_speed} <span className="text-[10px] text-slate-400">km/h</span>
                </td>
                <td className="py-2.5 px-3.5 font-mono">
                  <span className={clsx(
                    'font-bold',
                    r.congestion_index > 7 ? 'text-red-400' : (r.congestion_index > 4 ? 'text-amber-400' : 'text-emerald-400')
                  )}>
                    {r.congestion_index}
                  </span>
                </td>
                <td className="py-2.5 px-3.5">
                  {r.accident_occurred === 1 ? (
                    <span className={clsx('px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider', getSeverityStyle(r.severity))}>
                      {r.severity}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Safe Passage</span>
                  )}
                </td>
                <td className="py-2.5 px-3.5 text-[11px] text-slate-400">
                  {r.weather} • {r.road_condition}
                </td>
                <td className="py-2.5 px-3.5 text-right">
                  <button
                    onClick={() => setSelectedRecord(r)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors border border-slate-700/60"
                    title="View Telemetry JSON"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-400">
          Page <span className="font-mono text-white font-bold">{pagination.page}</span> of{' '}
          <span className="font-mono text-white font-bold">{pagination.total_pages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="table-prev-page"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 font-mono text-cyan-400 font-bold border border-slate-700">
            {pagination.page}
          </span>

          <button
            id="table-next-page"
            disabled={pagination.page >= pagination.total_pages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Record Inspector Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800">
              <span className="font-bold text-white font-mono text-sm">{selectedRecord.record_id}</span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto max-h-80 border border-slate-800">
              {JSON.stringify(selectedRecord, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
