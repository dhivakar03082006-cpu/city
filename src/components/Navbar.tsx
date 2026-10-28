import React, { useState } from 'react';
import { Search, Bell, MapPin, Calendar, User, ChevronDown, LogOut, CheckCircle2, Shield, Menu } from 'lucide-react';
import { FilterState, User as UserType } from '../types/index';

interface NavbarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  user: UserType | null;
  onLogout: () => void;
  onNavigateLogin?: () => void;
  onToggleSidebar?: () => void;
  activePageTitle: string;
}

const CITIES = ['All', 'Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kochi'];

export const Navbar: React.FC<NavbarProps> = ({
  filters,
  onFilterChange,
  user,
  onLogout,
  onNavigateLogin,
  onToggleSidebar,
  activePageTitle
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = [
    { id: 1, title: 'High Risk Alert: WEH Mumbai', desc: 'Congestion index reached 9.4 with rain advisory.', time: '12m ago', type: 'risk' },
    { id: 2, title: 'Model Pipeline Refresh', desc: '0-100 road risk weights recomputed across 25,000 records.', time: '45m ago', type: 'system' },
    { id: 3, title: 'EMS Response Optimization', desc: 'Average response time improved by 1.2 min in Bengaluru.', time: '2h ago', type: 'success' }
  ];

  return (
    <header
      id="main-top-navbar"
      className="sticky top-0 z-30 w-full h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="text-slate-400 font-medium hidden sm:inline">CityPulse</span>
          <span className="text-slate-400 hidden sm:inline">/</span>
          <span className="text-white font-bold tracking-tight">{activePageTitle}</span>
        </div>
      </div>

      {/* Center: Quick Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <input
            id="global-search-input"
            type="text"
            placeholder="Search road corridor, city, area or cause..."
            value={filters.searchQuery}
            onChange={e => onFilterChange('searchQuery', e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-1.5 pl-9 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/80 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* City Selector */}
        <div className="relative hidden sm:block">
          <select
            id="navbar-city-selector"
            value={filters.city}
            onChange={e => onFilterChange('city', e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 pl-7 pr-8 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">
                {c === 'All' ? 'All Metros' : c}
              </option>
            ))}
          </select>
          <MapPin className="w-3 h-3 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Live Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live 25k Telemetry</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </button>

          {showNotifications && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-4 z-50 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Intelligence Alerts</span>
                <span className="text-[10px] text-cyan-400 font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2.5">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/30 text-xs">
                    <p className="font-bold text-slate-200">{n.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-cyan-400 mt-1 block font-mono">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            id="user-profile-button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-inner">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-200 truncate max-w-[100px] leading-tight">
                {user?.full_name || 'Analyst'}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {user?.role || 'Lead Analyst'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div
              id="user-profile-dropdown"
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-3 z-50 backdrop-blur-xl"
            >
              <div className="p-2.5 rounded-xl bg-slate-800/50 mb-2">
                <p className="text-xs font-bold text-white">{user?.full_name || 'Demo Analyst'}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email || 'demo@citypulse.com'}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                  <Shield className="w-3 h-3" /> Certified Traffic Analyst
                </div>
              </div>

              {onNavigateLogin && (
                <button
                  id="navbar-switch-analyst-btn"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onNavigateLogin();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-colors text-left mb-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Switch Analyst / Sign In</span>
                </button>
              )}

              <button
                id="navbar-logout-btn"
                onClick={() => {
                  setShowUserDropdown(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
