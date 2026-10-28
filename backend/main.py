"""
CityPulse - FastAPI Main Application Entrypoint
Provides RESTful APIs for Urban Traffic & Accident Intelligence Platform
"""

import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from backend.api import auth, dashboard, traffic, accidents, risk, analytics
from backend.services.analytics_service import AnalyticsService

app = FastAPI(
    title="CityPulse Urban Traffic & Accident Intelligence API",
    description="Backend API for high-resolution traffic telemetry, accident severity analytics, geospatial risk mapping, and machine-learned road risk scoring.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(traffic.router, prefix="/api/traffic", tags=["Traffic Analytics"])
app.include_router(accidents.router, prefix="/api/accidents", tags=["Accident Analytics"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk & Hotspots"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Deep Analytics & EDA"])

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "CityPulse Intelligence Engine", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
