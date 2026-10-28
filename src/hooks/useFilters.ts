/**
 * CityPulse - Global Filter State Hook
 */

import { useState } from 'react';
import { FilterState } from '../types/index';

export const INITIAL_FILTERS: FilterState = {
  city: 'All',
  dateRange: 'all',
  vehicleType: 'All',
  severity: 'All',
  weather: 'All',
  searchQuery: ''
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const setCity = (city: string) => setFilters(prev => ({ ...prev, city }));
  const setDateRange = (dateRange: FilterState['dateRange']) => setFilters(prev => ({ ...prev, dateRange }));
  const setVehicleType = (vehicleType: string) => setFilters(prev => ({ ...prev, vehicleType }));
  const setSeverity = (severity: string) => setFilters(prev => ({ ...prev, severity }));
  const setWeather = (weather: string) => setFilters(prev => ({ ...prev, weather }));
  const setSearchQuery = (searchQuery: string) => setFilters(prev => ({ ...prev, searchQuery }));

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return {
    filters,
    setFilters,
    setCity,
    setDateRange,
    setVehicleType,
    setSeverity,
    setWeather,
    setSearchQuery,
    resetFilters
  };
}
