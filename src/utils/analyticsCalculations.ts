/**
 * CityPulse - Analytical Calculations & Statistical Engine
 * Provides pure, deterministic functions for urban risk scoring,
 * parametric statistics, congestion indices, moving averages, and hypothesis testing.
 */

import { RiskLevelType } from '../types/index';

export interface ParametricStats {
  mean: number;
  median: number;
  std_dev: number;
  p95: number;
  skewness: number;
}

export interface RiskScoreWeights {
  frequency: number;   // default: 30%
  fatality: number;    // default: 25%
  volume: number;      // default: 15%
  congestion: number;  // default: 15%
  speedVar: number;    // default: 15%
}

export const DEFAULT_RISK_WEIGHTS: RiskScoreWeights = {
  frequency: 30,
  fatality: 25,
  volume: 15,
  congestion: 15,
  speedVar: 15
};

/**
 * Calculates parametric statistics for a numerical series:
 * Mean, Median, Sample Standard Deviation, 95th Percentile, Fisher-Pearson Skewness
 */
export function computeParametricStats(arr: number[]): ParametricStats {
  if (!arr || arr.length === 0) {
    return { mean: 0, median: 0, std_dev: 0, p95: 0, skewness: 0 };
  }

  const n = arr.length;
  const sorted = [...arr].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Median (Q2)
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Variance & Sample Standard Deviation
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const std_dev = Math.sqrt(variance);

  // 95th Percentile (nearest rank)
  const p95Idx = Math.min(n - 1, Math.floor(0.95 * n));
  const p95 = sorted[p95Idx];

  // Fisher-Pearson Skewness
  let skewness = 0;
  if (std_dev > 0 && n > 2) {
    const m3 = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n;
    skewness = Number((m3 / Math.pow(std_dev, 3)).toFixed(2));
  }

  return {
    mean: Number(mean.toFixed(1)),
    median: Number(median.toFixed(1)),
    std_dev: Number(std_dev.toFixed(1)),
    p95: Number(p95.toFixed(1)),
    skewness
  };
}

/**
 * Computes the 0-10 Congestion Index from hourly volume and speed
 * Formula: ((volume / 4000) * (60 / max(speed, 5))) * 3.5 clamped in [0, 10]
 */
export function computeCongestionIndex(volume: number, averageSpeed: number): number {
  const safeSpeed = Math.max(averageSpeed, 5.0);
  const safeVolume = Math.max(volume, 0);
  const raw = ((safeVolume / 4000.0) * (60.0 / safeSpeed)) * 3.5;
  const clamped = Math.min(Math.max(raw, 0.0), 10.0);
  return Number(clamped.toFixed(2));
}

/**
 * Normalizes a value between min and max into [0, 1]
 */
export function minMaxNormalize(value: number, min: number, max: number): number {
  if (max <= min) return 0.5;
  const clamped = Math.min(Math.max(value, min), max);
  return (clamped - min) / (max - min);
}

/**
 * Computes composite 0-100 hazard risk score for an urban corridor
 */
export function computeCompositeRiskScore(
  metrics: {
    accidentCount: number;
    fatalities: number;
    trafficVolume: number;
    congestionIndex: number;
    speedVariance: number;
  },
  bounds: {
    maxAccidents?: number;
    maxFatalities?: number;
    maxVolume?: number;
    maxCongestion?: number;
    maxSpeedVariance?: number;
  } = {},
  weights: RiskScoreWeights = DEFAULT_RISK_WEIGHTS
): { score: number; level: RiskLevelType } {
  const maxAcc = bounds.maxAccidents || 50;
  const maxFat = bounds.maxFatalities || 15;
  const maxVol = bounds.maxVolume || 4500;
  const maxCong = bounds.maxCongestion || 10;
  const maxVar = bounds.maxSpeedVariance || 25;

  const totalWeight = (weights.frequency + weights.fatality + weights.volume + weights.congestion + weights.speedVar) || 100;
  const wFreq = weights.frequency / totalWeight;
  const wFat = weights.fatality / totalWeight;
  const wVol = weights.volume / totalWeight;
  const wCong = weights.congestion / totalWeight;
  const wVar = weights.speedVar / totalWeight;

  const nFreq = minMaxNormalize(metrics.accidentCount, 0, maxAcc);
  const nFat = minMaxNormalize(metrics.fatalities, 0, maxFat);
  const nVol = minMaxNormalize(metrics.trafficVolume, 500, maxVol);
  const nCong = minMaxNormalize(metrics.congestionIndex, 0, maxCong);
  const nVar = minMaxNormalize(metrics.speedVariance, 0, maxVar);

  const rawScore = (
    (wFreq * nFreq) +
    (wFat * nFat) +
    (wVol * nVol) +
    (wCong * nCong) +
    (wVar * nVar)
  ) * 100.0;

  const score = Math.min(Math.max(Math.round(rawScore), 1), 99);

  let level: RiskLevelType = 'Low';
  if (score >= 80) level = 'Critical';
  else if (score >= 65) level = 'High';
  else if (score >= 45) level = 'Moderate';

  return { score, level };
}

/**
 * Computes rolling / moving average of a numeric array with specified window size
 */
export function calculateMovingAverage(data: number[], windowSize = 3): number[] {
  if (!data || data.length === 0) return [];
  if (windowSize <= 1) return [...data];

  return data.map((_, idx, arr) => {
    const start = Math.max(0, idx - windowSize + 1);
    const windowSlice = arr.slice(start, idx + 1);
    const avg = windowSlice.reduce((sum, v) => sum + v, 0) / windowSlice.length;
    return Number(avg.toFixed(1));
  });
}

/**
 * Calculates fatality percentage with division-by-zero safeguarding
 */
export function calculateFatalityRate(totalAccidents: number, fatalities: number): number {
  if (!totalAccidents || totalAccidents <= 0) return 0;
  return Number(((fatalities / totalAccidents) * 100).toFixed(1));
}

/**
 * Calculates Pearson correlation coefficient (r) between two continuous variable series
 */
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (!x.length || !y.length || x.length !== y.length) return 0;
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  if (denX === 0 || denY === 0) return 0;
  return Number((num / (Math.sqrt(denX) * Math.sqrt(denY))).toFixed(3));
}
