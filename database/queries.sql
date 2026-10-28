-- ==========================================================
-- CITYPULSE: Analytical SQL Queries
-- Demonstrating Advanced SQL, Window Functions, CTEs & Aggregations
-- ==========================================================

-- 1. TOP ACCIDENT ROADS WITH SEVERITY BREAKDOWN
-- Identifies top 10 most hazardous roads with fatality ratios and composite risk
SELECT 
    r.road_id,
    r.road_name,
    c.city_name,
    COUNT(a.accident_id) AS total_accidents,
    SUM(CASE WHEN a.severity = 'Fatal' THEN 1 ELSE 0 END) AS fatal_count,
    SUM(CASE WHEN a.severity = 'Severe' THEN 1 ELSE 0 END) AS severe_count,
    ROUND(AVG(a.emergency_response_time_min), 2) AS avg_response_time_min,
    ROUND((SUM(CASE WHEN a.severity = 'Fatal' THEN 1.0 ELSE 0 END) / NULLIF(COUNT(a.accident_id), 0)) * 100, 2) AS fatality_rate_pct,
    DENSE_RANK() OVER (ORDER BY COUNT(a.accident_id) DESC, SUM(CASE WHEN a.severity = 'Fatal' THEN 1 ELSE 0 END) DESC) AS risk_rank
FROM roads r
JOIN cities c ON r.city_id = c.city_id
LEFT JOIN accidents a ON r.road_id = a.road_id
GROUP BY r.road_id, r.road_name, c.city_name
HAVING COUNT(a.accident_id) > 0
ORDER BY total_accidents DESC, fatal_count DESC
LIMIT 10;

-- 2. HIGHEST RISK CITIES COMPARATIVE BENCHMARK
-- Analyzes city-wide traffic volume, accident density, and congestion metrics
WITH CityTrafficStats AS (
    SELECT 
        c.city_id,
        c.city_name,
        COUNT(DISTINCT r.road_id) AS total_monitored_corridors,
        AVG(t.traffic_volume) AS avg_traffic_volume,
        AVG(t.average_speed_kmph) AS avg_speed_kmph,
        AVG(t.congestion_index) AS avg_congestion_index
    FROM cities c
    JOIN roads r ON c.city_id = r.city_id
    JOIN traffic_records t ON r.road_id = t.road_id
    GROUP BY c.city_id, c.city_name
),
CityAccidentStats AS (
    SELECT 
        c.city_id,
        COUNT(a.accident_id) AS total_accidents,
        SUM(a.fatalities) AS total_fatalities,
        AVG(a.emergency_response_time_min) AS avg_ems_response_min
    FROM cities c
    JOIN roads r ON c.city_id = r.city_id
    JOIN accidents a ON r.road_id = a.road_id
    GROUP BY c.city_id
)
SELECT 
    ts.city_name,
    ts.total_monitored_corridors,
    ROUND(ts.avg_traffic_volume, 0) AS avg_traffic_volume,
    ROUND(ts.avg_speed_kmph, 1) AS avg_speed_kmph,
    ROUND(ts.avg_congestion_index, 2) AS avg_congestion_index,
    COALESCE(acs.total_accidents, 0) AS total_accidents,
    COALESCE(acs.total_fatalities, 0) AS total_fatalities,
    ROUND(COALESCE(acs.avg_ems_response_min, 0), 1) AS avg_ems_response_min,
    ROUND((COALESCE(acs.total_accidents, 0)::NUMERIC / NULLIF(ts.total_monitored_corridors, 0)), 2) AS accident_rate_per_corridor
FROM CityTrafficStats ts
LEFT JOIN CityAccidentStats acs ON ts.city_id = acs.city_id
ORDER BY total_accidents DESC;

-- 3. MONTHLY ACCIDENT TREND & MONTH-OVER-MONTH (MoM) GROWTH
-- Uses Window functions (LAG) to calculate growth trajectory
WITH MonthlyAggregates AS (
    SELECT 
        DATE_TRUNC('month', timestamp) AS month_date,
        TO_CHAR(timestamp, 'Mon YYYY') AS formatted_month,
        COUNT(accident_id) AS monthly_accidents,
        SUM(CASE WHEN severity = 'Fatal' THEN 1 ELSE 0 END) AS monthly_fatalities
    FROM accidents
    GROUP BY DATE_TRUNC('month', timestamp), TO_CHAR(timestamp, 'Mon YYYY')
)
SELECT 
    formatted_month,
    monthly_accidents,
    monthly_fatalities,
    LAG(monthly_accidents, 1) OVER (ORDER BY month_date) AS prev_month_accidents,
    ROUND(
        ((monthly_accidents - LAG(monthly_accidents, 1) OVER (ORDER BY month_date))::NUMERIC / 
        NULLIF(LAG(monthly_accidents, 1) OVER (ORDER BY month_date), 0)) * 100, 
        2
    ) AS mom_growth_pct
FROM MonthlyAggregates
ORDER BY month_date ASC;

-- 4. VEHICLE ACCIDENT & FATALITY ANALYSIS
-- Multi-variable breakdown of collision probabilities and speed correlations
SELECT 
    a.vehicle_type,
    COUNT(a.accident_id) AS accident_count,
    ROUND(COUNT(a.accident_id) * 100.0 / SUM(COUNT(a.accident_id)) OVER (), 2) AS share_of_accidents_pct,
    SUM(a.fatalities) AS total_fatalities,
    ROUND(SUM(a.fatalities) * 100.0 / NULLIF(COUNT(a.accident_id), 0), 2) AS fatality_rate_pct,
    ROUND(AVG(t.average_speed_kmph), 1) AS pre_incident_avg_speed,
    MODE() WITHIN GROUP (ORDER BY a.primary_cause) AS dominant_cause
FROM accidents a
LEFT JOIN traffic_records t ON a.record_id = t.record_id
GROUP BY a.vehicle_type
ORDER BY accident_count DESC;

-- 5. AVERAGE EMERGENCY RESPONSE TIME BY SEVERITY & ZONE
SELECT 
    r.area_zone,
    a.severity,
    COUNT(a.accident_id) AS incident_count,
    ROUND(AVG(a.emergency_response_time_min), 2) AS avg_response_time_min,
    ROUND(MIN(a.emergency_response_time_min), 2) AS fastest_response_min,
    ROUND(MAX(a.emergency_response_time_min), 2) AS slowest_response_min,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY a.emergency_response_time_min)::NUMERIC, 2) AS median_response_min
FROM accidents a
JOIN roads r ON a.road_id = r.road_id
GROUP BY r.area_zone, a.severity
ORDER BY r.area_zone, avg_response_time_min DESC;

-- 6. PEAK ACCIDENT HOURS WITH DIURNAL RISK CLASSIFICATION
SELECT 
    EXTRACT(HOUR FROM timestamp) AS hour_of_day,
    COUNT(accident_id) AS total_accidents,
    SUM(CASE WHEN severity IN ('Severe', 'Fatal') THEN 1 ELSE 0 END) AS high_severity_count,
    ROUND(AVG(emergency_response_time_min), 2) AS avg_response_time,
    CASE 
        WHEN EXTRACT(HOUR FROM timestamp) IN (8, 9, 10) THEN 'Morning Peak'
        WHEN EXTRACT(HOUR FROM timestamp) IN (17, 18, 19, 20, 21) THEN 'Evening Peak'
        WHEN EXTRACT(HOUR FROM timestamp) IN (22, 23, 0, 1, 2, 3, 4) THEN 'Night / Low Light'
        ELSE 'Off-Peak Day'
    END AS diurnal_period
FROM accidents
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY total_accidents DESC;

-- 7. SEVERITY DISTRIBUTION BY ENVIRONMENTAL CONDITIONS (WEATHER & LIGHTING)
SELECT 
    weather_condition,
    lighting_condition,
    COUNT(accident_id) AS total_accidents,
    ROUND(AVG(CASE WHEN severity = 'Minor' THEN 1 ELSE 0 END) * 100, 1) AS minor_pct,
    ROUND(AVG(CASE WHEN severity = 'Moderate' THEN 1 ELSE 0 END) * 100, 1) AS moderate_pct,
    ROUND(AVG(CASE WHEN severity = 'Severe' THEN 1 ELSE 0 END) * 100, 1) AS severe_pct,
    ROUND(AVG(CASE WHEN severity = 'Fatal' THEN 1 ELSE 0 END) * 100, 1) AS fatal_pct
FROM accidents
GROUP BY weather_condition, lighting_condition
HAVING COUNT(accident_id) > 10
ORDER BY fatal_pct DESC, total_accidents DESC;

-- 8. HIGHEST RISK HOTSPOTS WITH COMPOSITE 0-100 RISK SCORE
SELECT 
    r.road_id,
    r.road_name,
    c.city_name,
    r.latitude,
    r.longitude,
    rs.total_risk_score,
    rs.risk_level,
    COUNT(DISTINCT a.accident_id) AS accident_count,
    SUM(COALESCE(a.fatalities, 0)) AS total_fatalities,
    ROUND(AVG(t.traffic_volume), 0) AS avg_traffic_volume,
    ROUND(AVG(t.congestion_index), 2) AS avg_congestion_index
FROM roads r
JOIN cities c ON r.city_id = c.city_id
JOIN risk_scores rs ON r.road_id = rs.road_id
LEFT JOIN accidents a ON r.road_id = a.road_id
LEFT JOIN traffic_records t ON r.road_id = t.road_id
GROUP BY r.road_id, r.road_name, c.city_name, r.latitude, r.longitude, rs.total_risk_score, rs.risk_level
ORDER BY rs.total_risk_score DESC
LIMIT 15;
