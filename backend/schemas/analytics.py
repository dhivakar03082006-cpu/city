"""
CityPulse - Analytics Schemas
"""

from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class KpiMetrics(BaseModel):
    total_records: int
    total_accidents: int
    avg_speed: float
    avg_congestion: float
    fatal_accidents: int
    high_risk_zones: int

class HotspotRecord(BaseModel):
    road_name: str
    city: str
    area: str
    latitude: float
    longitude: float
    accidents: int
    fatalities: int
    severe: int
    traffic_volume: int
    congestion_index: float
    risk_score: float
    risk_level: str

class RecommendationItem(BaseModel):
    id: str
    category: str
    insight: str
    why_it_matters: str
    recommended_action: str
    priority: str
