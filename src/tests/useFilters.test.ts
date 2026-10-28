import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters, INITIAL_FILTERS } from '../hooks/useFilters';

describe('useFilters Hook', () => {
  it('should initialize with default INITIAL_FILTERS', () => {
    const { result } = renderHook(() => useFilters());
    expect(result.current.filters).toEqual(INITIAL_FILTERS);
    expect(result.current.filters.city).toBe('All');
    expect(result.current.filters.dateRange).toBe('all');
    expect(result.current.filters.vehicleType).toBe('All');
    expect(result.current.filters.severity).toBe('All');
    expect(result.current.filters.weather).toBe('All');
    expect(result.current.filters.searchQuery).toBe('');
  });

  it('should update city filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setCity('Bengaluru');
    });
    expect(result.current.filters.city).toBe('Bengaluru');
  });

  it('should update dateRange filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setDateRange('7d');
    });
    expect(result.current.filters.dateRange).toBe('7d');
  });

  it('should update vehicleType filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setVehicleType('Two-Wheeler');
    });
    expect(result.current.filters.vehicleType).toBe('Two-Wheeler');
  });

  it('should update severity filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setSeverity('Fatal');
    });
    expect(result.current.filters.severity).toBe('Fatal');
  });

  it('should update weather filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setWeather('Heavy Rain');
    });
    expect(result.current.filters.weather).toBe('Heavy Rain');
  });

  it('should update searchQuery filter', () => {
    const { result } = renderHook(() => useFilters());
    act(() => {
      result.current.setSearchQuery('Outer Ring Road');
    });
    expect(result.current.filters.searchQuery).toBe('Outer Ring Road');
  });

  it('should reset all filters back to INITIAL_FILTERS', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setCity('Mumbai');
      result.current.setDateRange('30d');
      result.current.setSeverity('Severe Injury');
      result.current.setSearchQuery('Western Express');
    });

    expect(result.current.filters.city).toBe('Mumbai');
    expect(result.current.filters.searchQuery).toBe('Western Express');

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual(INITIAL_FILTERS);
  });
});
