"""
CityPulse - Traffic, Accidents, Risk & Deep Analytics Routes
"""

from fastapi import APIRouter, Query, Response
from backend.services.analytics_service import AnalyticsService
import scripts.analytics as sa
from typing import Optional
import json
import io
import csv

traffic_router = APIRouter()
accidents_router = APIRouter()
risk_router = APIRouter()
analytics_router = APIRouter()

@traffic_router.get("/")
def get_traffic_metrics(city: str = "All", vehicle: str = "All"):
    df = AnalyticsService.filter_df(city=city, vehicle_type=vehicle)
    return {
        "kpis": {
            "avg_volume": int(df["traffic_volume"].mean()) if not df.empty else 0,
            "peak_volume": int(df["traffic_volume"].max()) if not df.empty else 0,
            "avg_speed": round(float(df["average_speed"].mean()), 1) if not df.empty else 0.0,
            "congestion_index": round(float(df["congestion_index"].mean()), 2) if not df.empty else 0.0
        },
        "traffic_by_city": df.groupby("city")["traffic_volume"].mean().round(0).to_dict() if not df.empty else {},
        "traffic_by_vehicle": df.groupby("vehicle_type")["traffic_volume"].count().to_dict() if not df.empty else {}
    }

@accidents_router.get("/")
def get_accident_metrics(city: str = "All", severity: str = "All"):
    df = AnalyticsService.filter_df(city=city, severity=severity)
    acc_df = df[df["accident_occurred"] == 1]
    return {
        "kpis": {
            "total_accidents": len(acc_df),
            "fatal_accidents": int((acc_df["severity"] == "Fatal").sum()),
            "severe_accidents": int((acc_df["severity"] == "Severe").sum()),
            "moderate_accidents": int((acc_df["severity"] == "Moderate").sum()),
            "avg_response_time": round(float(acc_df["response_time_min"].mean()), 1) if not acc_df.empty else 0.0
        },
        "causes": acc_df["cause"].value_counts().to_dict() if not acc_df.empty else {},
        "weather": acc_df["weather"].value_counts().to_dict() if not acc_df.empty else {},
        "road_condition": acc_df["road_condition"].value_counts().to_dict() if not acc_df.empty else {},
        "lighting": acc_df["lighting_condition"].value_counts().to_dict() if not acc_df.empty else {}
    }

@risk_router.get("/hotspots")
def get_hotspots():
    results = sa.run_statistical_analysis()
    return results["top_hotspots"]

@risk_router.get("/map")
def get_risk_map_points(city: str = "All"):
    df = AnalyticsService.filter_df(city=city)
    sample_acc = df[df["accident_occurred"] == 1].head(100)
    return sample_acc.to_dict(orient="records")

@analytics_router.get("/insights")
def get_insights():
    results = sa.run_statistical_analysis()
    return results["insights_and_actions"]
