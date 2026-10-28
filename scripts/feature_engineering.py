"""
CityPulse - Feature Engineering & 0-100 Road Risk Scoring Model
Implements mathematical transformations, temporal features, and composite multi-factor risk weighting.
"""

import os
import pandas as pd
import numpy as np
from typing import Tuple

def compute_engineered_features(input_csv: str = "data/citypulse_cleaned.csv", output_csv: str = "data/citypulse_engineered.csv") -> pd.DataFrame:
    """
    Computes statistical and temporal features alongside the 0-100 Composite Road Risk Score.
    """
    if not os.path.exists(input_csv):
        print(f"{input_csv} not found, running clean_data pipeline first...")
        from scripts.clean_data import run_cleaning_pipeline
        df, _ = run_cleaning_pipeline()
    else:
        df = pd.read_csv(input_csv)

    # 1. Temporal Feature Extraction
    if 'datetime' not in df.columns:
        df['datetime'] = pd.to_datetime(df['date'].astype(str) + ' ' + df['time'].astype(str))
    else:
        df['datetime'] = pd.to_datetime(df['datetime'])

    df['hour'] = df['datetime'].dt.hour
    df['day_of_week'] = df['datetime'].dt.day_name()
    df['day_num'] = df['datetime'].dt.dayofweek
    df['month'] = df['datetime'].dt.month
    df['month_name'] = df['datetime'].dt.strftime('%b')
    df['is_weekend'] = df['day_num'].apply(lambda x: 1 if x >= 5 else 0)
    df['is_peak_hour'] = df['hour'].apply(lambda h: 1 if (8 <= h <= 10 or 17 <= h <= 21) else 0)

    # 2. Traffic & Speed Categorization
    df['traffic_category'] = pd.cut(
        df['traffic_volume'],
        bins=[-np.inf, 2500, 4500, 6500, np.inf],
        labels=['Low', 'Moderate', 'High', 'Congested Gridlock']
    )
    
    df['speed_category'] = pd.cut(
        df['average_speed'],
        bins=[-np.inf, 20, 40, 60, np.inf],
        labels=['Severe Slowdown (<20 km/h)', 'Slow Urban (20-40)', 'Moderate (40-60)', 'Fast / Highway (>60)']
    )

    # 3. COMPOSITE 0-100 ROAD RISK SCORING MODEL
    # Aggregated road-level metrics for risk synthesis
    road_stats = df.groupby('road_name').agg(
        total_records=('record_id', 'count'),
        total_accidents=('accident_occurred', 'sum'),
        fatal_count=('severity', lambda s: (s == 'Fatal').sum()),
        severe_count=('severity', lambda s: (s == 'Severe').sum()),
        avg_volume=('traffic_volume', 'mean'),
        avg_speed=('average_speed', 'mean'),
        avg_congestion=('congestion_index', 'mean')
    ).reset_index()

    # Calculate Accident Rate per 1000 telemetry cycles
    road_stats['accident_rate'] = (road_stats['total_accidents'] / road_stats['total_records']) * 1000
    
    # Sub-component score weights (Normalized 0 to 100 components)
    # Component 1: Accident Frequency Score (30% weight)
    max_acc_rate = max(1.0, road_stats['accident_rate'].max())
    road_stats['score_freq'] = (road_stats['accident_rate'] / max_acc_rate) * 30.0

    # Component 2: Fatality & Severe Weight (25% weight)
    road_stats['fatality_ratio'] = (road_stats['fatal_count'] * 3.0 + road_stats['severe_count'] * 1.5) / np.maximum(1, road_stats['total_accidents'])
    max_fatality_ratio = max(0.1, road_stats['fatality_ratio'].max())
    road_stats['score_fatality'] = (road_stats['fatality_ratio'] / max_fatality_ratio) * 25.0

    # Component 3: Traffic Volume Exposure (15% weight)
    max_vol = max(100.0, road_stats['avg_volume'].max())
    road_stats['score_volume'] = (road_stats['avg_volume'] / max_vol) * 15.0

    # Component 4: Congestion Friction (15% weight)
    road_stats['score_congestion'] = (road_stats['avg_congestion'] / 10.0) * 15.0

    # Component 5: Speed Variance / Highway Speed Danger (15% weight)
    road_stats['score_speed'] = (road_stats['avg_speed'] / 100.0) * 15.0

    # Total Raw Score
    road_stats['raw_risk_score'] = (
        road_stats['score_freq'] +
        road_stats['score_fatality'] +
        road_stats['score_volume'] +
        road_stats['score_congestion'] +
        road_stats['score_speed']
    )

    # Min-Max Normalization to ensure full 0 - 100 spread with realistic calibration
    min_score = road_stats['raw_risk_score'].min()
    max_score = road_stats['raw_risk_score'].max()
    road_stats['risk_score'] = 15.0 + ((road_stats['raw_risk_score'] - min_score) / (max_score - min_score)) * 80.0
    road_stats['risk_score'] = road_stats['risk_score'].round(1)

    # Classification Thresholds:
    # 0 - 25: Low
    # 26 - 50: Moderate
    # 51 - 75: High
    # 76 - 100: Critical
    def classify_risk(score: float) -> str:
        if score <= 25.0:
            return "Low"
        elif score <= 50.0:
            return "Moderate"
        elif score <= 75.0:
            return "High"
        else:
            return "Critical"

    road_stats['risk_level'] = road_stats['risk_score'].apply(classify_risk)

    # Merge risk score back to dataframe
    df = df.merge(
        road_stats[['road_name', 'risk_score', 'risk_level', 'score_freq', 'score_fatality', 'score_volume', 'score_congestion', 'score_speed']],
        on='road_name',
        how='left'
    )

    # Save to CSV
    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    df.to_csv(output_csv, index=False)
    print(f"Feature engineering completed. 0-100 Risk scores computed for {len(road_stats)} corridors.")
    return df

if __name__ == "__main__":
    df = compute_engineered_features()
    print("Sample Risk Scores:")
    print(df[['road_name', 'city', 'risk_score', 'risk_level']].drop_duplicates().head(10))
