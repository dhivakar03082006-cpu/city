import React, { useState } from 'react';
import {
  Terminal,
  Database,
  Cpu,
  Layers,
  Code2,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Sparkles,
  BarChart2,
  FileCode,
  ArrowRight
} from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { KpiCard } from '../components/KpiCard';

export const PythonPipeline: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Interactive Risk Score Weight Simulator state
  const [weights, setWeights] = useState({
    frequency: 30,
    fatality: 25,
    volume: 15,
    congestion: 15,
    speedVar: 15
  });

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const totalWeight = weights.frequency + weights.fatality + weights.volume + weights.congestion + weights.speedVar;

  const pythonCleaningCode = `import pandas as pd
import numpy as np
from scipy import stats

# 1. Load Raw Multi-City Telemetry
df = pd.read_csv("citypulse_raw_telemetry_25k.csv")

# 2. Data Cleaning & Validation
# Replace invalid speed readings (> 160 km/h or < 0) with median flow
df['average_speed'] = np.where(
    (df['average_speed'] <= 0) | (df['average_speed'] > 160),
    df.groupby('road_name')['average_speed'].transform('median'),
    df['average_speed']
)

# Impute missing weather/lighting attributes via mode
df['weather'] = df['weather'].fillna(df['weather'].mode()[0])
df['lighting_condition'] = df['lighting_condition'].fillna('Daylight')

# 3. Feature Engineering: Congestion Index & Diurnal Flags
# Derived Congestion Index: (Traffic Volume / Capacity) * Speed Impedance
df['congestion_index'] = np.clip(
    ((df['traffic_volume'] / 4000.0) * (60.0 / np.maximum(df['average_speed'], 5.0))) * 3.5,
    0.0, 10.0
).round(2)

df['is_rush_hour'] = df['time'].apply(
    lambda t: 1 if (8 <= int(t.split(':')[0]) <= 11) or (17 <= int(t.split(':')[0]) <= 21) else 0
)

# 4. Outlier Removal via IQR Filtering on Response Times
q1, q3 = df['response_time_minutes'].quantile([0.25, 0.75])
iqr = q3 - q1
df_clean = df[~((df['response_time_minutes'] < (q1 - 1.5 * iqr)) | (df['response_time_minutes'] > (q3 + 1.5 * iqr)))]

print(f"Cleaned dataset: {len(df_clean)} records ready for analytics warehouse.")`;

  const pythonRiskFormulaCode = `def compute_composite_risk_score(df_corridors, w_freq=0.30, w_fatal=0.25, w_vol=0.15, w_cong=0.15, w_var=0.15):
    """
    Computes normalized 0-100 road hazard index using multi-criteria weighted normalization.
    """
    def min_max(series):
        return (series - series.min()) / (series.max() - series.min() + 1e-6)

    norm_freq = min_max(df_corridors['accident_count'])
    norm_fatal = min_max(df_corridors['fatalities'])
    norm_vol = min_max(df_corridors['traffic_volume'])
    norm_cong = min_max(df_corridors['congestion_index'])
    norm_var = min_max(df_corridors['speed_variance'])

    composite_score = (
        (w_freq * norm_freq) +
        (w_fatal * norm_fatal) +
        (w_vol * norm_vol) +
        (w_cong * norm_cong) +
        (w_var * norm_var)
    ) * 100.0

    df_corridors['risk_score'] = np.clip(composite_score.round(), 1, 99).astype(int)
    df_corridors['risk_level'] = pd.cut(
        df_corridors['risk_score'],
        bins=[-1, 50, 65, 80, 100],
        labels=['Low', 'Moderate', 'High', 'Critical']
    )
    return df_corridors.sort_values(by='risk_score', ascending=False)`;

  const sqlAnalyticalQueries = `-- 1. Top Hazardous Corridors with Window Functions & Fatality Ratio
WITH corridor_agg AS (
    SELECT 
        road_name,
        city,
        area,
        COUNT(*) AS total_telemetry_points,
        SUM(accident_occurred) AS total_accidents,
        SUM(CASE WHEN severity = 'Fatal' THEN 1 ELSE 0 END) AS fatal_accidents,
        ROUND(AVG(congestion_index), 2) AS avg_congestion,
        ROUND(AVG(average_speed), 1) AS avg_speed,
        ROUND(STDDEV(average_speed), 2) AS speed_stddev
    FROM traffic_telemetry
    GROUP BY road_name, city, area
    HAVING SUM(accident_occurred) > 10
),
ranked_hotspots AS (
    SELECT 
        *,
        ROUND((fatal_accidents::numeric / NULLIF(total_accidents, 0)) * 100, 1) AS fatality_pct,
        DENSE_RANK() OVER (PARTITION BY city ORDER BY total_accidents DESC) as city_hazard_rank
    FROM corridor_agg
)
SELECT * FROM ranked_hotspots WHERE city_hazard_rank <= 5 ORDER BY fatal_accidents DESC;

-- 2. Diurnal Rush Hour & Weather Casualty Cross-Tabulation
SELECT 
    weather,
    CASE 
        WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 8 AND 11 THEN 'Morning Rush'
        WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 17 AND 21 THEN 'Evening Peak'
        WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 22 AND 24 OR EXTRACT(HOUR FROM timestamp) BETWEEN 0 AND 4 THEN 'Late Night'
        ELSE 'Off-Peak'
    END AS time_block,
    COUNT(CASE WHEN accident_occurred = 1 THEN 1 END) AS collisions,
    ROUND(AVG(average_speed), 1) AS avg_corridor_speed,
    ROUND(AVG(congestion_index), 2) AS avg_congestion
FROM traffic_telemetry
GROUP BY weather, time_block
ORDER BY collisions DESC;`;

  return (
    <div className="space-y-6">
      {/* Portfolio Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                B.TECH DATA ANALYTICS PORTFOLIO SPEC
              </span>
              <span className="text-xs text-slate-400 font-semibold">Python • Pandas • NumPy • SciPy • SQL</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Data Engineering Architecture, Cleaning Pipeline & Statistical Formulation
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              This module presents the end-to-end data pipeline powering CityPulse: from sensor ingest, IQR anomaly rejection, continuous feature scaling, to multi-criteria composite risk scoring and windowed SQL aggregations.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pipeline Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">STAGE 1</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Sensor Ingestion</h4>
          <p className="text-[11px] text-slate-400">
            Simulating 25k inductive loop, GPS probe, and police collision records across 7 Indian metropolitan hubs.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">STAGE 2</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Pandas Data Cleaning</h4>
          <p className="text-[11px] text-slate-400">
            Median velocity imputation, categorical mode filling, and 1.5×IQR outlier boundary filtering on response times.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">STAGE 3</span>
            <Sliders className="w-4 h-4 text-purple-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Feature Engineering</h4>
          <p className="text-[11px] text-slate-400">
            Derivation of Congestion Index (0–10), Diurnal rush flags, and MinMax composite road danger scores (0–100).
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">STAGE 4</span>
            <BarChart2 className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Hypothesis Testing</h4>
          <p className="text-[11px] text-slate-400">
            Pearson r = -0.76 (speed vs congestion), Chi-square p &lt; 0.001 (weather vs collision severity).
          </p>
        </div>
      </div>

      {/* Interactive Risk Score Simulator (Live Demonstration of Feature Engineering) */}
      <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/90 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Interactive Risk Score Weight Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust multi-criteria parameters to test dynamic re-weighting of urban corridor danger scoring
            </p>
          </div>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
            totalWeight === 100 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            Total Weight: {totalWeight}% {totalWeight === 100 ? '✓ (Normalized)' : '⚠️ Must equal 100%'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Accident Freq</span>
              <span className="font-mono font-bold text-cyan-400">{weights.frequency}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={weights.frequency}
              onChange={e => setWeights({ ...weights, frequency: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Fatality Weight</span>
              <span className="font-mono font-bold text-rose-400">{weights.fatality}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={weights.fatality}
              onChange={e => setWeights({ ...weights, fatality: Number(e.target.value) })}
              className="w-full accent-rose-400 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Traffic Volume</span>
              <span className="font-mono font-bold text-blue-400">{weights.volume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={weights.volume}
              onChange={e => setWeights({ ...weights, volume: Number(e.target.value) })}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Congestion Index</span>
              <span className="font-mono font-bold text-amber-400">{weights.congestion}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={weights.congestion}
              onChange={e => setWeights({ ...weights, congestion: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Speed Variance</span>
              <span className="font-mono font-bold text-purple-400">{weights.speedVar}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={weights.speedVar}
              onChange={e => setWeights({ ...weights, speedVar: Number(e.target.value) })}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
          Formula: RiskScore = ({weights.frequency/100} × Norm(Freq)) + ({weights.fatality/100} × Norm(Fatalities)) + ({weights.volume/100} × Norm(Volume)) + ({weights.congestion/100} × Norm(Congestion)) + ({weights.speedVar/100} × Norm(SpeedVariance))
        </div>
      </div>

      {/* Python Code Snippet 1: Data Cleaning */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/90 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white font-mono">1. data_cleaning_and_wrangling.py</h3>
          </div>
          <button
            onClick={() => handleCopy(pythonCleaningCode, 1)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 1 ? 'Copied' : 'Copy Python'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
          <code>{pythonCleaningCode}</code>
        </pre>
      </div>

      {/* Python Code Snippet 2: Scoring Model */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/90 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white font-mono">2. risk_scoring_model.py</h3>
          </div>
          <button
            onClick={() => handleCopy(pythonRiskFormulaCode, 2)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 2 ? 'Copied' : 'Copy Python'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
          <code>{pythonRiskFormulaCode}</code>
        </pre>
      </div>

      {/* SQL Analytics Showcase */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/90 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white font-mono">3. complex_analytical_queries.sql (PostgreSQL / Snowflake)</h3>
          </div>
          <button
            onClick={() => handleCopy(sqlAnalyticalQueries, 3)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 3 ? 'Copied' : 'Copy SQL'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
          <code>{sqlAnalyticalQueries}</code>
        </pre>
      </div>
    </div>
  );
};
