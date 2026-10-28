"""
CityPulse - Data Cleaning & Preprocessing Pipeline
Demonstrating Pandas, NumPy, Outlier Treatment, Missing Value Imputation, and Type Standardization.
"""

import os
import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any

def run_cleaning_pipeline(input_csv: str = "data/citypulse_data.csv", output_csv: str = "data/citypulse_cleaned.csv") -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Executes an end-to-end data cleaning and validation pipeline.
    """
    if not os.path.exists(input_csv):
        print(f"Input file {input_csv} not found, generating sample dataset first...")
        import scripts.generate_data as gd
        data = gd.generate_synthetic_dataset(26000)
        os.makedirs(os.path.dirname(input_csv), exist_ok=True)
        pd.DataFrame(data).to_csv(input_csv, index=False)

    df = pd.read_csv(input_csv)
    initial_rows = len(df)
    
    # 1. Duplicate Detection & Removal
    duplicate_count = df.duplicated(subset=['record_id']).sum()
    df = df.drop_duplicates(subset=['record_id']).reset_index(drop=True)
    
    # 2. DateTime Standardization & Parsing
    df['datetime'] = pd.to_datetime(df['date'] + ' ' + df['time'], errors='coerce')
    df['date'] = pd.to_datetime(df['date']).dt.date
    
    # 3. Missing Value Handling & Imputation
    missing_before = df.isnull().sum().to_dict()
    
    # Numeric imputation with median / conditional group means
    df['traffic_volume'] = df['traffic_volume'].fillna(df.groupby(['city', 'road_name'])['traffic_volume'].transform('median'))
    df['average_speed'] = df['average_speed'].fillna(df.groupby(['road_name'])['average_speed'].transform('median'))
    df['congestion_index'] = df['congestion_index'].fillna(df['congestion_index'].median())
    
    # Categorical imputation
    df['weather'] = df['weather'].fillna('Clear')
    df['road_condition'] = df['road_condition'].fillna('Dry')
    df['lighting_condition'] = df['lighting_condition'].fillna('Daylight')
    df['severity'] = df['severity'].fillna('None')
    df['cause'] = df['cause'].fillna('None')
    
    # 4. Statistical Outlier Detection & Capping using IQR Method
    outliers_detected = {}
    numeric_cols = ['traffic_volume', 'average_speed', 'congestion_index', 'response_time_min']
    
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        # Identify outliers
        outlier_mask = (df[col] < lower_bound) | (df[col] > upper_bound)
        outliers_detected[col] = int(outlier_mask.sum())
        
        # Soft capping (Winsorization)
        df[col] = np.clip(df[col], a_min=max(0, lower_bound), a_max=upper_bound)

    # 5. Type Consistency & Validation
    df['accident_occurred'] = df['accident_occurred'].astype(int)
    df['traffic_volume'] = df['traffic_volume'].astype(int)
    df['average_speed'] = df['average_speed'].round(2)
    df['congestion_index'] = df['congestion_index'].round(2)
    df['response_time_min'] = df['response_time_min'].round(2)

    # Save cleaned file
    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    df.to_csv(output_csv, index=False)
    
    report = {
        "initial_rows": initial_rows,
        "cleaned_rows": len(df),
        "duplicates_removed": int(duplicate_count),
        "missing_values_handled": missing_before,
        "outliers_capped_by_iqr": outliers_detected,
        "numeric_summary": df[numeric_cols].describe().to_dict()
    }
    
    print(f"Data Cleaning Completed. Processed {len(df)} rows. Saved to {output_csv}.")
    return df, report

if __name__ == "__main__":
    df, summary = run_cleaning_pipeline()
    print("Pipeline Summary:", summary)
