"""
CityPulse - Dashboard & Analytics Routes
"""

from fastapi import APIRouter, Query
from backend.services.analytics_service import AnalyticsService
from typing import Optional

router = APIRouter()

@router.get("/")
def get_dashboard(
    city: Optional[str] = Query("All"),
    vehicle: Optional[str] = Query("All"),
    severity: Optional[str] = Query("All"),
    weather: Optional[str] = Query("All")
):
    return AnalyticsService.get_dashboard_data(city=city, vehicle_type=vehicle, severity=severity, weather=weather)
