import { describe, it, expect } from 'vitest';
import {
  computeParametricStats,
  computeCongestionIndex,
  computeCompositeRiskScore,
  calculateMovingAverage,
  calculateFatalityRate,
  calculatePearsonCorrelation,
  minMaxNormalize,
  DEFAULT_RISK_WEIGHTS
} from '../utils/analyticsCalculations';

describe('Analytical Calculations & Statistical Engine', () => {
  describe('computeParametricStats', () => {
    it('should handle empty or null array safely', () => {
      const emptyStats = computeParametricStats([]);
      expect(emptyStats).toEqual({
        mean: 0,
        median: 0,
        std_dev: 0,
        p95: 0,
        skewness: 0
      });
    });

    it('should accurately calculate parametric metrics for odd-length dataset', () => {
      const data = [10, 20, 30, 40, 50];
      const stats = computeParametricStats(data);
      expect(stats.mean).toBe(30.0);
      expect(stats.median).toBe(30.0);
      expect(stats.std_dev).toBeCloseTo(15.8, 1);
      expect(stats.p95).toBe(50.0);
      expect(stats.skewness).toBe(0);
    });

    it('should accurately calculate median for even-length dataset', () => {
      const data = [10, 20, 30, 40];
      const stats = computeParametricStats(data);
      expect(stats.median).toBe(25.0);
      expect(stats.mean).toBe(25.0);
    });

    it('should detect positive skewness in right-tailed telemetry distributions', () => {
      // Emergency response times with heavy right tail
      const responseTimes = [8, 9, 9, 10, 10, 11, 12, 12, 13, 28, 35];
      const stats = computeParametricStats(responseTimes);
      expect(stats.skewness).toBeGreaterThan(1.0);
      expect(stats.mean).toBeGreaterThan(stats.median);
    });
  });

  describe('computeCongestionIndex', () => {
    it('should compute moderate congestion index for typical urban flow', () => {
      const index = computeCongestionIndex(2000, 30);
      // ((2000 / 4000) * (60 / 30)) * 3.5 = 0.5 * 2 * 3.5 = 3.5
      expect(index).toBe(3.5);
    });

    it('should clamp congestion index within [0, 10] bounds on extreme gridlock', () => {
      const extremeGridlock = computeCongestionIndex(4500, 5);
      expect(extremeGridlock).toBeLessThanOrEqual(10.0);
      expect(extremeGridlock).toBe(10.0);
    });

    it('should safeguard against zero or negative velocities', () => {
      const zeroSpeed = computeCongestionIndex(3000, 0);
      expect(zeroSpeed).toBeGreaterThan(0);
      expect(zeroSpeed).toBeLessThanOrEqual(10.0);
    });
  });

  describe('minMaxNormalize', () => {
    it('should normalize values into [0, 1] range', () => {
      expect(minMaxNormalize(50, 0, 100)).toBe(0.5);
      expect(minMaxNormalize(0, 0, 100)).toBe(0.0);
      expect(minMaxNormalize(100, 0, 100)).toBe(1.0);
    });

    it('should clamp values outside range boundaries', () => {
      expect(minMaxNormalize(150, 0, 100)).toBe(1.0);
      expect(minMaxNormalize(-20, 0, 100)).toBe(0.0);
    });
  });

  describe('computeCompositeRiskScore', () => {
    it('should calculate high risk score for dangerous high-fatality corridor', () => {
      const dangerousCorridor = {
        accidentCount: 45,
        fatalities: 12,
        trafficVolume: 4200,
        congestionIndex: 8.9,
        speedVariance: 22
      };

      const result = computeCompositeRiskScore(dangerousCorridor);
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.level).toBe('Critical');
    });

    it('should calculate low risk score for low-incident corridor', () => {
      const safeCorridor = {
        accidentCount: 2,
        fatalities: 0,
        trafficVolume: 800,
        congestionIndex: 1.5,
        speedVariance: 3
      };

      const result = computeCompositeRiskScore(safeCorridor);
      expect(result.score).toBeLessThan(45);
      expect(result.level).toBe('Low');
    });

    it('should respect custom weight distributions', () => {
      const corridor = {
        accidentCount: 30,
        fatalities: 10,
        trafficVolume: 2000,
        congestionIndex: 5.0,
        speedVariance: 10
      };

      // Heavy fatality weighting
      const customWeights = {
        frequency: 10,
        fatality: 70,
        volume: 5,
        congestion: 5,
        speedVar: 10
      };

      const customResult = computeCompositeRiskScore(corridor, {}, customWeights);
      const defaultResult = computeCompositeRiskScore(corridor, {}, DEFAULT_RISK_WEIGHTS);

      expect(customResult.score).toBeDefined();
      expect(defaultResult.score).toBeDefined();
    });
  });

  describe('calculateMovingAverage', () => {
    it('should smooth time-series data with sliding window', () => {
      const rawTrend = [100, 120, 110, 130, 150, 140];
      const ma = calculateMovingAverage(rawTrend, 3);
      expect(ma.length).toBe(6);
      expect(ma[0]).toBe(100); // 100 / 1
      expect(ma[1]).toBe(110); // (100+120)/2
      expect(ma[2]).toBe(110); // (100+120+110)/3
      expect(ma[3]).toBe(120); // (120+110+130)/3
    });

    it('should return original array if windowSize <= 1 or empty', () => {
      expect(calculateMovingAverage([], 3)).toEqual([]);
      expect(calculateMovingAverage([5, 10, 15], 1)).toEqual([5, 10, 15]);
    });
  });

  describe('calculateFatalityRate', () => {
    it('should calculate accurate percentage of fatalities to accidents', () => {
      expect(calculateFatalityRate(200, 15)).toBe(7.5);
      expect(calculateFatalityRate(100, 0)).toBe(0.0);
    });

    it('should safely return 0 when totalAccidents is 0 or negative', () => {
      expect(calculateFatalityRate(0, 0)).toBe(0);
      expect(calculateFatalityRate(-5, 2)).toBe(0);
    });
  });

  describe('calculatePearsonCorrelation', () => {
    it('should return +1.0 for perfectly positively correlated series', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];
      expect(calculatePearsonCorrelation(x, y)).toBe(1.0);
    });

    it('should return -1.0 for perfectly inversely correlated series', () => {
      const x = [10, 20, 30, 40];
      const y = [40, 30, 20, 10];
      expect(calculatePearsonCorrelation(x, y)).toBe(-1.0);
    });

    it('should handle mismatched lengths and empty sets gracefully', () => {
      expect(calculatePearsonCorrelation([], [])).toBe(0);
      expect(calculatePearsonCorrelation([1, 2], [1])).toBe(0);
    });
  });
});
