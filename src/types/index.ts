/**
 * CityPulse - Global TypeScript Definitions
 */

export type SeverityType = 'None' | 'Minor' | 'Moderate' | 'Severe' | 'Fatal';
export type RiskLevelType = 'Low' | 'Moderate' | 'High' | 'Critical';
export type VehicleType = 'Motorcycle' | 'Car' | 'Auto' | 'Truck' | 'Bus' | 'Other';
export type WeatherType = 'Clear' | 'Rain' | 'Fog' | 'Drizzle' | 'Stormy';
export type RoadConditionType = 'Dry' | 'Wet' | 'Under Construction' | 'Potholes / Damaged';
export type LightingConditionType = 'Daylight' | 'Twilight / Dusk' | 'Dark with Streetlights' | 'Dark without Streetlights';

export interface TrafficRecord {
  record_id: string;
  date: string;
  time: string;
  city: string;
  area: string;
  road_name: string;
  latitude: number;
  longitude: number;
  traffic_volume: number;
  average_speed: number;
  congestion_index: number;
  vehicle_type: VehicleType;
  accident_occurred: number;
  severity: SeverityType;
  weather: WeatherType;
  road_condition: RoadConditionType;
  lighting_condition: LightingConditionType;
  response_time_min: number;
  cause: string;
  // Engineered attributes
  hour?: number;
  day_of_week?: string;
  risk_score?: number;
  risk_level?: RiskLevelType;
}

export interface KpiStats {
  total_records: number;
  total_accidents: number;
  avg_speed: number;
  avg_congestion: number;
  fatal_accidents: number;
  severe_accidents: number;
  moderate_accidents: number;
  minor_accidents: number;
  high_risk_zones: number;
  avg_response_time: number;
  // Comparison vs baseline
  records_change_pct: number;
  accidents_change_pct: number;
  speed_change_pct: number;
  congestion_change_pct: number;
  fatal_change_pct: number;
  risk_change_pct: number;
}

export interface Hotspot {
  rank: number;
  road_name: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  accidents: number;
  fatalities: number;
  severe: number;
  avg_traffic_volume: number;
  avg_congestion: number;
  avg_speed: number;
  risk_score: number; // 0 - 100
  risk_level: RiskLevelType;
  avg_response_time: number;
  dominant_cause: string;
  dominant_vehicle: string;
  score_breakdown: {
    frequency_score: number;
    fatality_score: number;
    volume_score: number;
    congestion_score: number;
    speed_score: number;
  };
}

export interface InsightItem {
  id: string;
  category: 'High-Risk Corridors' | 'Vulnerable Road Users' | 'Temporal Peaks' | 'Weather Vulnerability' | 'Emergency Medical Response' | 'Speed & Congestion';
  insight: string;
  why_it_matters: string;
  recommended_action: string;
  priority: 'Critical' | 'High' | 'Moderate' | 'Informational';
  metric_stat?: string;
  affected_entity?: string;
}

export interface FilterState {
  city: string;
  dateRange: 'all' | '7d' | '30d' | '90d' | '2025' | '2026';
  vehicleType: string;
  severity: string;
  weather: string;
  searchQuery: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface TimeDistributionItem {
  hour: string;
  hour_num: number;
  accidents: number;
  traffic_volume: number;
  avg_speed: number;
  congestion: number;
  fatalities: number;
  risk_index: number;
}

export interface DayDistributionItem {
  day: string;
  accidents: number;
  avg_volume: number;
  fatalities: number;
}

export interface MonthlyTrendItem {
  month: string;
  date_key: string;
  accidents: number;
  fatalities: number;
  avg_speed: number;
  traffic_volume: number;
  congestion: number;
  risk_score: number;
  accidents_mom_pct?: number;
}

export interface VehicleStatItem {
  vehicle_type: VehicleType;
  accident_count: number;
  share_pct: number;
  fatalities: number;
  fatality_rate_pct: number;
  avg_speed: number;
  dominant_cause: string;
  risk_level: RiskLevelType;
}

export interface MetricParametricStats {
  mean: number;
  median: number;
  std_dev: number;
  p95: number;
  skewness: number;
}

export interface StatisticalSummary {
  sample_size: number;
  volume: MetricParametricStats;
  speed: MetricParametricStats;
  congestion: MetricParametricStats;
  response_time: MetricParametricStats;
  correlations: {
    volume_vs_congestion: number;
    speed_vs_congestion: number;
    volume_vs_accidents: number;
    weather_vs_accidents: number;
  };
  hypothesis_tests: {
    chi_square_vehicle_severity: {
      stat: number;
      p_value: number;
      is_significant: boolean;
      interpretation: string;
    };
    anova_weather_speed: {
      f_stat: number;
      p_value: number;
      is_significant: boolean;
      interpretation: string;
    };
  };
}
