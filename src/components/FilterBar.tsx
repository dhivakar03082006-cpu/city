import React from 'react';
import { FilterState } from '../types/index';
import { RotateCcw, Filter, Calendar, MapPin, Car, ShieldAlert, CloudRain } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  className?: string;
  showAllControls?: boolean;
}

const CITIES = ['All', 'Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kochi'];
const VEHICLES = ['All', 'Motorcycle', 'Car', 'Auto', 'Truck', 'Bus', 'Other'];
const SEVERITIES = ['All', 'Minor', 'Moderate', 'Severe', 'Fatal'];
const WEATHERS = ['All', 'Clear', 'Rain', 'Fog', 'Drizzle', 'Stormy'];
const DATE_RANGES = [
  { label: 'All Time (2025-26)', value: 'all' },
  { label: 'Past 7 Days', value: '7d' },
  { label: 'Past 30 Days', value: '30d' },
  { label: 'Past 90 Days', value: '90d' },
  { label: 'Year 2026', value: '2026' },
  { label: 'Year 2025', value: '2025' }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  className = '',
  showAllControls = true
}) => {
  return (
    <div
      id="global-filter-bar"
      className={`glass-panel rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 border border-slate-800/90 shadow-md ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/50 text-slate-300 text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Telemetry Filters:</span>
        </div>

        {/* City Filter */}
        <div className="relative">
          <select
            id="filter-city-select"
            value={filters.city}
            onChange={e => onFilterChange('city', e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 pl-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 hover:border-slate-600 transition-colors cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">
                {c === 'All' ? 'All Metropolitan Hubs' : c}
              </option>
            ))}
          </select>
          <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Range */}
        <div className="relative">
          <select
            id="filter-date-select"
            value={filters.dateRange}
            onChange={e => onFilterChange('dateRange', e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 pl-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 hover:border-slate-600 transition-colors cursor-pointer"
          >
            {DATE_RANGES.map(d => (
              <option key={d.value} value={d.value} className="bg-slate-900 text-slate-200">
                {d.label}
              </option>
            ))}
          </select>
          <Calendar className="w-3.5 h-3.5 text-violet-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {showAllControls && (
          <>
            {/* Vehicle Type */}
            <div className="relative hidden md:block">
              <select
                id="filter-vehicle-select"
                value={filters.vehicleType}
                onChange={e => onFilterChange('vehicleType', e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 pl-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 hover:border-slate-600 transition-colors cursor-pointer"
              >
                {VEHICLES.map(v => (
                  <option key={v} value={v} className="bg-slate-900 text-slate-200">
                    {v === 'All' ? 'All Vehicles' : v}
                  </option>
                ))}
              </select>
              <Car className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Severity */}
            <div className="relative hidden lg:block">
              <select
                id="filter-severity-select"
                value={filters.severity}
                onChange={e => onFilterChange('severity', e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 pl-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 hover:border-slate-600 transition-colors cursor-pointer"
              >
                {SEVERITIES.map(s => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">
                    {s === 'All' ? 'All Severities' : s}
                  </option>
                ))}
              </select>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Weather */}
            <div className="relative hidden xl:block">
              <select
                id="filter-weather-select"
                value={filters.weather}
                onChange={e => onFilterChange('weather', e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 pl-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 hover:border-slate-600 transition-colors cursor-pointer"
              >
                {WEATHERS.map(w => (
                  <option key={w} value={w} className="bg-slate-900 text-slate-200">
                    {w === 'All' ? 'All Weather Conditions' : w}
                  </option>
                ))}
              </select>
              <CloudRain className="w-3.5 h-3.5 text-sky-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </>
        )}
      </div>

      {/* Reset Button */}
      <button
        id="filter-reset-button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-all duration-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>
    </div>
  );
};
