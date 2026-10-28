"""
CityPulse - SQLAlchemy Models
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), default="analyst")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Road(Base):
    __tablename__ = "roads"
    
    road_id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), index=True, nullable=False)
    road_name = Column(String(200), index=True, nullable=False)
    area = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_limit = Column(Integer, default=60)
    risk_score = Column(Float, default=50.0)
    risk_level = Column(String(50), default="Moderate")

class TrafficRecord(Base):
    __tablename__ = "traffic_records"
    
    record_id = Column(String(64), primary_key=True, index=True)
    date = Column(String(20), index=True, nullable=False)
    time = Column(String(10), nullable=False)
    city = Column(String(100), index=True, nullable=False)
    area = Column(String(150), nullable=False)
    road_name = Column(String(200), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    traffic_volume = Column(Integer, nullable=False)
    average_speed = Column(Float, nullable=False)
    congestion_index = Column(Float, nullable=False)
    vehicle_type = Column(String(50), index=True, nullable=False)
    accident_occurred = Column(Integer, default=0, index=True)
    severity = Column(String(50), default="None", index=True)
    weather = Column(String(50), default="Clear", index=True)
    road_condition = Column(String(50), default="Dry")
    lighting_condition = Column(String(50), default="Daylight")
    response_time_min = Column(Float, default=0.0)
    cause = Column(String(100), default="None")
