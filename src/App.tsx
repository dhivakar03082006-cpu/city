/**
 * CityPulse - Urban Traffic & Accident Intelligence Platform
 * Main App Architecture & Routing Engine
 */

import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useFilters } from './hooks/useFilters';
import { FilterState } from './types/index';
import { PageId, Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TrafficAnalytics } from './pages/TrafficAnalytics';
import { AccidentAnalytics } from './pages/AccidentAnalytics';
import { RiskMap } from './pages/RiskMap';
import { Hotspots } from './pages/Hotspots';
import { TimeAnalysis } from './pages/TimeAnalysis';
import { VehicleAnalytics } from './pages/VehicleAnalytics';
import { TrendAnalysis } from './pages/TrendAnalysis';
import { DataExplorer } from './pages/DataExplorer';
import { InsightsRecommendations } from './pages/InsightsRecommendations';
import { PythonPipeline } from './pages/PythonPipeline';

type AppView = 'landing' | 'login' | 'register' | PageId;

const PAGE_TITLES: Record<PageId, string> = {
  'dashboard': 'Urban Intelligence Dashboard',
  'traffic': 'Traffic Flow & Mobility Analytics',
  'accidents': 'Accident & Collision Intelligence',
  'risk-map': 'Geospatial GIS Risk Mapping',
  'hotspots': 'Hazardous Corridor Rankings (0–100 Engine)',
  'time': 'Temporal & Diurnal Hazard Analysis',
  'vehicles': 'Vehicle Modal Class Analytics & VRU',
  'trends': 'Time-Series Forecasting & Moving Averages',
  'data-explorer': 'Multi-Metro 25k Telemetry Explorer',
  'insights': 'Safety Recommendations & Statistical EDA',
  'python-pipeline': 'Python, Pandas, NumPy & SQL Architecture'
};

export default function App() {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const { filters, setFilters, resetFilters } = useFilters();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectPage = (page: PageId) => {
    setCurrentView(page);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in landing or auth mode
  if (currentView === 'landing') {
    return (
      <>
        <CustomCursor />
        <Landing
          onExplore={() => setCurrentView('dashboard')}
          onLoginClick={() => setCurrentView('login')}
        />
      </>
    );
  }

  if (currentView === 'login') {
    return (
      <>
        <CustomCursor />
        <Login
          onLogin={async (creds) => {
            await login(creds);
            setCurrentView('dashboard');
          }}
          onNavigateRegister={() => setCurrentView('register')}
          onContinueAsGuest={() => setCurrentView('dashboard')}
        />
      </>
    );
  }

  if (currentView === 'register') {
    return (
      <>
        <CustomCursor />
        <Register
          onRegister={async (data) => {
            await register(data);
            setCurrentView('dashboard');
          }}
          onNavigateLogin={() => setCurrentView('login')}
        />
      </>
    );
  }

  const activePageId = (currentView as PageId);
  const activeTitle = PAGE_TITLES[activePageId] || 'CityPulse Intelligence';

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <CustomCursor />

      {/* Sidebar Navigation */}
      <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar
          activePage={activePageId}
          onSelectPage={handleSelectPage}
          onLogout={() => {
            logout();
            setCurrentView('landing');
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Top Navbar */}
        <Navbar
          filters={filters}
          onFilterChange={handleFilterChange}
          user={user}
          onLogout={() => {
            logout();
            setCurrentView('landing');
          }}
          onNavigateLogin={() => setCurrentView('login')}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          activePageTitle={activeTitle}
        />

        {/* Page Body Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {activePageId === 'dashboard' && (
            <Dashboard
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              onNavigatePage={(page) => handleSelectPage(page as PageId)}
            />
          )}

          {activePageId === 'traffic' && (
            <TrafficAnalytics
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'accidents' && (
            <AccidentAnalytics
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'risk-map' && (
            <RiskMap
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'hotspots' && (
            <Hotspots
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'time' && (
            <TimeAnalysis
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'vehicles' && (
            <VehicleAnalytics
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'trends' && (
            <TrendAnalysis
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'data-explorer' && (
            <DataExplorer
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
            />
          )}

          {activePageId === 'insights' && (
            <InsightsRecommendations
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              onNavigatePage={(page) => handleSelectPage(page as PageId)}
            />
          )}

          {activePageId === 'python-pipeline' && (
            <PythonPipeline />
          )}
        </main>

        {/* Global Compact Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CityPulse</span>
            <span>•</span>
            <span>Urban Traffic & Accident Intelligence Platform</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">B.Tech IT Project</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('landing')} className="hover:text-cyan-300 transition-colors">
              Landing Overview
            </button>
            <button onClick={() => handleSelectPage('python-pipeline')} className="hover:text-cyan-300 transition-colors">
              Python & SQL Methodology
            </button>
            <button onClick={() => handleSelectPage('insights')} className="hover:text-cyan-300 transition-colors">
              Vision Zero Framework
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
