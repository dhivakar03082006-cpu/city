-- ==========================================================
-- CITYPULSE: Urban Traffic & Accident Intelligence Platform
-- PostgreSQL Relational Database Schema
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Authentication & Access Management)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'analyst',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100) NOT NULL,
    center_latitude DECIMAL(10, 6) NOT NULL,
    center_longitude DECIMAL(10, 6) NOT NULL,
    population_million DECIMAL(4, 2),
    traffic_density_rank INT
);

-- 3. Urban Roads / Corridors Table
CREATE TABLE IF NOT EXISTS roads (
    road_id SERIAL PRIMARY KEY,
    city_id INT REFERENCES cities(city_id) ON DELETE CASCADE,
    road_name VARCHAR(200) NOT NULL,
    area_zone VARCHAR(150) NOT NULL,
    road_type VARCHAR(50) DEFAULT 'Arterial', -- Expressway, Arterial, Collector, Local
    speed_limit_kmph INT DEFAULT 60,
    lanes INT DEFAULT 4,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_road_city UNIQUE (road_name, city_id)
);

-- 4. Traffic Records Table (Time-series Traffic Telemetry)
CREATE TABLE IF NOT EXISTS traffic_records (
    record_id VARCHAR(64) PRIMARY KEY,
    road_id INT REFERENCES roads(road_id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    traffic_volume INT NOT NULL CHECK (traffic_volume >= 0),
    average_speed_kmph DECIMAL(5, 2) NOT NULL CHECK (average_speed_kmph >= 0),
    congestion_index DECIMAL(4, 2) NOT NULL CHECK (congestion_index >= 0 AND congestion_index <= 10),
    vehicle_type VARCHAR(50) NOT NULL,
    weather_condition VARCHAR(50) NOT NULL,
    road_condition VARCHAR(50) NOT NULL,
    lighting_condition VARCHAR(50) NOT NULL
);

-- 5. Accidents Table (Accident Logs & Severity Metrics)
CREATE TABLE IF NOT EXISTS accidents (
    accident_id VARCHAR(64) PRIMARY KEY,
    record_id VARCHAR(64) REFERENCES traffic_records(record_id) ON DELETE SET NULL,
    road_id INT REFERENCES roads(road_id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    severity VARCHAR(30) NOT NULL CHECK (severity IN ('Minor', 'Moderate', 'Severe', 'Fatal')),
    vehicle_type VARCHAR(50) NOT NULL,
    primary_cause VARCHAR(100) NOT NULL,
    casualties INT DEFAULT 0 CHECK (casualties >= 0),
    fatalities INT DEFAULT 0 CHECK (fatalities >= 0),
    emergency_response_time_min DECIMAL(5, 2),
    weather_condition VARCHAR(50),
    road_condition VARCHAR(50),
    lighting_condition VARCHAR(50)
);

-- 6. Road Risk Scores Table (Engineered 0-100 Risk Metric)
CREATE TABLE IF NOT EXISTS risk_scores (
    score_id SERIAL PRIMARY KEY,
    road_id INT REFERENCES roads(road_id) ON DELETE CASCADE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accident_frequency_score DECIMAL(5, 2),
    fatality_weight_score DECIMAL(5, 2),
    traffic_volume_score DECIMAL(5, 2),
    speed_risk_score DECIMAL(5, 2),
    congestion_score DECIMAL(5, 2),
    weather_risk_score DECIMAL(5, 2),
    road_condition_score DECIMAL(5, 2),
    total_risk_score DECIMAL(5, 2) NOT NULL CHECK (total_risk_score >= 0 AND total_risk_score <= 100),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical'))
);

-- Indices for high-performance querying and spatial searches
CREATE INDEX IF NOT EXISTS idx_traffic_road_time ON traffic_records(road_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_traffic_timestamp ON traffic_records(timestamp);
CREATE INDEX IF NOT EXISTS idx_accidents_road ON accidents(road_id);
CREATE INDEX IF NOT EXISTS idx_accidents_severity ON accidents(severity);
CREATE INDEX IF NOT EXISTS idx_accidents_timestamp ON accidents(timestamp);
CREATE INDEX IF NOT EXISTS idx_roads_city ON roads(city_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_road ON risk_scores(road_id, total_risk_score);
