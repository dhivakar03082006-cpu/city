import React from 'react';
import {
  LayoutDashboard,
  Car,
  AlertTriangle,
  MapPin,
  Flame,
  Clock,
  Bike,
  TrendingUp,
  Table,
  Lightbulb,
  Terminal,
  Settings,
  User,
  LogOut,
  Sparkles,
  Activity,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

export type PageId =
  | 'dashboard'
  | 'traffic'
  | 'accidents'
  | 'risk-map'
  | 'hotspots'
  | 'time'
  | 'vehicles'
  | 'trends'
  | 'data-explorer'
  | 'insights'
  | 'python-pipeline';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  onLogout,
  collapsed = false,
  onToggleCollapse
}) => {
  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'traffic', label: 'Traffic Analytics', icon: <Car className="w-4 h-4" /> },
    { id: 'accidents', label: 'Accident Analytics', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'risk-map', label: 'Risk Map', icon: <MapPin className="w-4 h-4" />, badge: 'Live GIS' },
    { id: 'hotspots', label: 'Hotspot Analysis', icon: <Flame className="w-4 h-4 text-orange-400" /> },
    { id: 'time', label: 'Time Analysis', icon: <Clock className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Vehicle Analytics', icon: <Bike className="w-4 h-4" /> },
    { id: 'trends', label: 'Trend Analysis', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'data-explorer', label: 'Data Explorer', icon: <Table className="w-4 h-4" />, badge: '25k' },
    { id: 'insights', label: 'Insights & Actions', icon: <Lightbulb className="w-4 h-4 text-yellow-400" /> },
    { id: 'python-pipeline', label: 'Python & SQL Pipeline', icon: <Terminal className="w-4 h-4 text-emerald-400" />, badge: 'EDA' }
  ];

  return (
    <aside
      id="main-sidebar"
      className={clsx(
        'fixed top-0 left-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-wider text-white">
                    CITY<span className="text-cyan-400">PULSE</span>
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    B.TECH
                  </span>
                </div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                  Traffic Intelligence
                </p>
              </div>
            )}
          </div>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hidden lg:flex items-center justify-center"
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
          {!collapsed && (
            <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Analytics Modules
            </p>
          )}

          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectPage(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group text-left relative',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={clsx(
                    'p-1 rounded-lg transition-colors flex-shrink-0',
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={clsx(
                          'text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono',
                          isActive
                            ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Left Active Glow Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 bg-slate-950">
        <button
          id="sidebar-nav-settings"
          onClick={() => onSelectPage('insights')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          title="System Architecture"
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          {!collapsed && <span>Data Governance</span>}
        </button>

        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
