/**
 * CityPulse - API Service Layer
 * Connects frontend to Express/FastAPI analytics endpoints with error handling and caching.
 */

import { FilterState, TrafficRecord, KpiStats, Hotspot, InsightItem, TimeDistributionItem, DayDistributionItem, MonthlyTrendItem, VehicleStatItem, StatisticalSummary } from '../types/index';

const API_BASE = '/api';

function buildQueryString(filters: Partial<FilterState>): string {
  const params = new URLSearchParams();
  if (filters.city && filters.city !== 'All') params.append('city', filters.city);
  if (filters.dateRange && filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
  if (filters.vehicleType && filters.vehicleType !== 'All') params.append('vehicleType', filters.vehicleType);
  if (filters.severity && filters.severity !== 'All') params.append('severity', filters.severity);
  if (filters.weather && filters.weather !== 'All') params.append('weather', filters.weather);
  if (filters.searchQuery) params.append('search', filters.searchQuery);
  const q = params.toString();
  return q ? `?${q}` : '';
}

export const ApiService = {
  // Authentication
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Authentication failed. Use demo@citypulse.com / demo123');
    }
    return res.json();
  },

  async register(userData: { full_name: string; email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed.');
    }
    return res.json();
  },

  // Dashboard Data
  async getDashboardData(filters: FilterState) {
    const res = await fetch(`${API_BASE}/dashboard${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load dashboard data');
    return res.json();
  },

  // Traffic Analytics
  async getTrafficAnalytics(filters: FilterState) {
    const res = await fetch(`${API_BASE}/traffic${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load traffic analytics');
    return res.json();
  },

  // Accident Analytics
  async getAccidentAnalytics(filters: FilterState) {
    const res = await fetch(`${API_BASE}/accidents${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load accident analytics');
    return res.json();
  },

  // Risk Map
  async getRiskMapData(filters: FilterState) {
    const res = await fetch(`${API_BASE}/risk-map${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load risk map');
    return res.json();
  },

  // Hotspots Ranking
  async getHotspots(filters: FilterState): Promise<Hotspot[]> {
    const res = await fetch(`${API_BASE}/hotspots${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load hotspots');
    return res.json();
  },

  // Time Analysis
  async getTimeAnalysis(filters: FilterState): Promise<{
    hourlyDistribution: TimeDistributionItem[];
    dayDistribution: DayDistributionItem[];
    peakRiskHour: string;
    peakRiskDay: string;
    peakRiskMonth: string;
  }> {
    const res = await fetch(`${API_BASE}/time-analysis${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load time analysis');
    return res.json();
  },

  // Vehicle Analytics
  async getVehicleAnalytics(filters: FilterState): Promise<VehicleStatItem[]> {
    const res = await fetch(`${API_BASE}/vehicles${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load vehicle analytics');
    return res.json();
  },

  // Trend Analysis
  async getTrendAnalysis(filters: FilterState): Promise<MonthlyTrendItem[]> {
    const res = await fetch(`${API_BASE}/trends${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load trend analytics');
    return res.json();
  },

  // Insights & Statistical Summary
  async getInsights(filters: FilterState): Promise<{
    insights: InsightItem[];
    statistical_summary: StatisticalSummary;
  }> {
    const res = await fetch(`${API_BASE}/insights${buildQueryString(filters)}`);
    if (!res.ok) throw new Error('Failed to load insights');
    return res.json();
  },

  // Data Explorer (Paginated)
  async getDataRecords(filters: FilterState, page = 1, limit = 25, sortBy = 'date', sortOrder = 'desc'): Promise<{
    records: TrafficRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  }> {
    const qs = buildQueryString(filters);
    const separator = qs ? '&' : '?';
    const res = await fetch(`${API_BASE}/data${qs}${separator}page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    if (!res.ok) throw new Error('Failed to load records table');
    return res.json();
  },

  // CSV Export URL
  getExportUrl(filters: FilterState): string {
    return `${API_BASE}/export${buildQueryString(filters)}`;
  },

  // AI Insights on Hotspot
  async getAiAdvisory(payload: { corridor: string; city: string; riskScore: number; dominantCause: string }) {
    const res = await fetch(`${API_BASE}/ai-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return { ai_generated: false, analysis: 'Unable to reach AI service.' };
    return res.json();
  }
};
