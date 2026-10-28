"""
CityPulse - Analytics Service (FastAPI / Pandas Integration)
"""

import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

class AnalyticsService:
    _instance = None
    _df: Optional[pd.DataFrame] = None

    @classmethod
    def get_df(cls) -> pd.DataFrame:
        if cls._df is None:
            csv_path = "data/citypulse_engineered.csv"
            if not os.path.exists(csv_path):
                from scripts.feature_engineering import compute_engineered_features
                cls._df = compute_engineered_features()
            else:
                cls._df = pd.read_csv(csv_path)
        return cls._df

    @classmethod
    def filter_df(cls, city: str = "All", vehicle_type: str = "All", severity: str = "All", weather: str = "All") -> pd.DataFrame:
        df = cls.get_df()
        if city and city != "All":
            df = df[df["city"] == city]
        if vehicle_type and vehicle_type != "All":
            df = df[df["vehicle_type"] == vehicle_type]
        if severity and severity != "All":
            df = df[df["severity"] == severity]
        if weather and weather != "All":
            df = df[df["weather"] == weather]
        return df

    @classmethod
    def get_dashboard_data(cls, city: str = "All", vehicle_type: str = "All", severity: str = "All", weather: str = "All") -> Dict[str, Any]:
        df = cls.filter_df(city, vehicle_type, severity, weather)
        acc_df = df[df["accident_occurred"] == 1]

        # KPIs
        total_records = len(df)
        total_accidents = len(acc_df)
        avg_speed = round(float(df["average_speed"].mean()), 1) if not df.empty else 0.0
        avg_congestion = round(float(df["congestion_index"].mean()), 2) if not df.empty else 0.0
        fatal_accidents = int((acc_df["severity"] == "Fatal").sum())

        # Hourly trend
        hourly = acc_df.groupby("hour").size().reset_index(name="accidents")
        hourly_dict = [{"hour": f"{h:02d}:00", "accidents": int(hourly[hourly["hour"] == h]["accidents"].values[0]) if not hourly[hourly["hour"] == h].empty else 0} for h in range(24)]

        # Severity breakdown
        sev_counts = acc_df["severity"].value_counts().to_dict()
        severity_dist = [{"name": k, "value": int(v)} for k, v in sev_counts.items() if k != "None"]

        # Top roads
        top_roads_df = acc_df.groupby("road_name").size().reset_index(name="accidents").sort_values("accidents", ascending=False).head(7)
        top_roads = top_roads_df.to_dict(orient="records")

        # Vehicle distribution
        veh_counts = acc_df["vehicle_type"].value_counts().to_dict()
        vehicle_dist = [{"name": k, "value": int(v)} for k, v in veh_counts.items()]

        # Weather risk
        weather_counts = acc_df["weather"].value_counts().to_dict()
        weather_dist = [{"name": k, "value": int(v)} for k, v in weather_counts.items()]

        return {
            "kpis": {
                "total_records": total_records,
                "total_accidents": total_accidents,
                "avg_speed": avg_speed,
                "avg_congestion": avg_congestion,
                "fatal_accidents": fatal_accidents,
                "high_risk_zones": int(len(df["road_name"].unique()) // 3)
            },
            "hourly_trend": hourly_dict,
            "severity_dist": severity_dist,
            "top_roads": top_roads,
            "vehicle_dist": vehicle_dist,
            "weather_dist": weather_dist
        }
