"""
CityPulse - Synthetic Dataset Generator
Generates 25,000+ realistic urban traffic telemetry and accident incident records
across 7 major Indian metropolitan cities with accurate geographic coordinates and
statistically modeled behavioral, environmental, and temporal dependencies.
"""

import random
import datetime
import math
import json
import os
import csv
from typing import List, Dict, Any

# Target Cities with authentic road networks and GPS centers
CITIES = {
    "Chennai": {
        "lat": 13.0827, "lon": 80.2707, "base_volume": 4200, "congestion_bias": 1.1,
        "roads": [
            {"name": "Anna Salai (Mount Road)", "area": "Central", "lat": 13.0604, "lon": 80.2496, "speed_limit": 50, "risk_mult": 1.25},
            {"name": "OMR (IT Corridor)", "area": "South", "lat": 12.9150, "lon": 80.2280, "speed_limit": 70, "risk_mult": 1.35},
            {"name": "GST Road (Airport Corridor)", "area": "South-West", "lat": 12.9815, "lon": 80.1636, "speed_limit": 60, "risk_mult": 1.40},
            {"name": "Poonamallee High Road", "area": "West", "lat": 13.0784, "lon": 80.2182, "speed_limit": 50, "risk_mult": 1.15},
            {"name": "Inner Ring Road (Jawaharlal Nehru)", "area": "Central-West", "lat": 13.0850, "lon": 80.2050, "speed_limit": 60, "risk_mult": 1.20},
            {"name": "ECR (East Coast Road)", "area": "Coastal South", "lat": 12.8900, "lon": 80.2450, "speed_limit": 80, "risk_mult": 1.45},
            {"name": "Velachery Main Road", "area": "South", "lat": 12.9780, "lon": 80.2180, "speed_limit": 45, "risk_mult": 1.10}
        ]
    },
    "Bengaluru": {
        "lat": 12.9716, "lon": 77.5946, "base_volume": 4800, "congestion_bias": 1.35,
        "roads": [
            {"name": "Outer Ring Road (Silk Board - Marathahalli)", "area": "Tech Corridor", "lat": 12.9172, "lon": 77.6400, "speed_limit": 60, "risk_mult": 1.55},
            {"name": "Hosur Road (Electronic City Flyover)", "area": "South", "lat": 12.8452, "lon": 77.6602, "speed_limit": 70, "risk_mult": 1.30},
            {"name": "Old Airport Road", "area": "East", "lat": 12.9600, "lon": 77.6500, "speed_limit": 50, "risk_mult": 1.20},
            {"name": "Bellary Road (Airport Expressway)", "area": "North", "lat": 13.0500, "lon": 77.5900, "speed_limit": 80, "risk_mult": 1.35},
            {"name": "Bannerghatta Road", "area": "South", "lat": 12.8900, "lon": 77.5950, "speed_limit": 45, "risk_mult": 1.15},
            {"name": "Kanakapura Road", "area": "South-West", "lat": 12.8800, "lon": 77.5500, "speed_limit": 60, "risk_mult": 1.10}
        ]
    },
    "Hyderabad": {
        "lat": 17.3850, "lon": 78.4867, "base_volume": 4000, "congestion_bias": 1.15,
        "roads": [
            {"name": "Nehru Outer Ring Road (ORR)", "area": "Cyberabad Perimeter", "lat": 17.4400, "lon": 78.3500, "speed_limit": 100, "risk_mult": 1.40},
            {"name": "Hitech City Main Road", "area": "Madhapur Tech Zone", "lat": 17.4435, "lon": 78.3772, "speed_limit": 50, "risk_mult": 1.15},
            {"name": "PVNR Expressway (Airport Corridor)", "area": "South-West", "lat": 17.3600, "lon": 78.4300, "speed_limit": 70, "risk_mult": 1.25},
            {"name": "Banjara Hills Road No. 1", "area": "Central West", "lat": 17.4156, "lon": 78.4482, "speed_limit": 45, "risk_mult": 1.05},
            {"name": "Secunderabad - Medchal Highway (NH 44)", "area": "North", "lat": 17.5200, "lon": 78.4900, "speed_limit": 70, "risk_mult": 1.35}
        ]
    },
    "Mumbai": {
        "lat": 19.0760, "lon": 72.8777, "base_volume": 5200, "congestion_bias": 1.4,
        "roads": [
            {"name": "Western Express Highway (WEH)", "area": "Western Suburbs", "lat": 19.1136, "lon": 72.8697, "speed_limit": 70, "risk_mult": 1.50},
            {"name": "Eastern Express Highway (EEH)", "area": "Eastern Suburbs", "lat": 19.0800, "lon": 72.9200, "speed_limit": 70, "risk_mult": 1.35},
            {"name": "Bandra-Worli Sea Link", "area": "Coastal Central", "lat": 19.0330, "lon": 72.8150, "speed_limit": 80, "risk_mult": 1.10},
            {"name": "Sion-Panvel Expressway", "area": "Navi Mumbai Gateway", "lat": 19.0400, "lon": 72.9800, "speed_limit": 80, "risk_mult": 1.45},
            {"name": "SV Road (Swami Vivekananda)", "area": "Suburbs Local", "lat": 19.1400, "lon": 72.8400, "speed_limit": 40, "risk_mult": 1.20}
        ]
    },
    "Delhi": {
        "lat": 28.6139, "lon": 77.2090, "base_volume": 5500, "congestion_bias": 1.3,
        "roads": [
            {"name": "Ring Road (AIIMS - Ashram)", "area": "South-Central", "lat": 28.5700, "lon": 77.2200, "speed_limit": 60, "risk_mult": 1.45},
            {"name": "Delhi-Noida Direct (DND) Flyway", "area": "East Corridor", "lat": 28.5800, "lon": 77.2900, "speed_limit": 80, "risk_mult": 1.25},
            {"name": "Delhi-Gurgaon Expressway (NH 48)", "area": "South-West Corridor", "lat": 28.5200, "lon": 77.0900, "speed_limit": 80, "risk_mult": 1.50},
            {"name": "Outer Ring Road (Mukarba Chowk)", "area": "North", "lat": 28.7300, "lon": 77.1600, "speed_limit": 70, "risk_mult": 1.40},
            {"name": "Mathura Road (Badarpur Border)", "area": "South-East", "lat": 28.5000, "lon": 77.3000, "speed_limit": 60, "risk_mult": 1.30}
        ]
    },
    "Pune": {
        "lat": 18.5204, "lon": 73.8567, "base_volume": 3800, "congestion_bias": 1.1,
        "roads": [
            {"name": "Pune-Bangalore Highway (Katraj-Dehu Bypass)", "area": "West Bypass", "lat": 18.5500, "lon": 73.7800, "speed_limit": 80, "risk_mult": 1.40},
            {"name": "Nagar Road (Kalyani Nagar - Viman Nagar)", "area": "East Corridor", "lat": 18.5600, "lon": 73.9100, "speed_limit": 50, "risk_mult": 1.25},
            {"name": "Hinjewadi IT Park Main Road", "area": "West Tech Zone", "lat": 18.5900, "lon": 73.7400, "speed_limit": 45, "risk_mult": 1.30},
            {"name": "Senapati Bapat Road", "area": "Central", "lat": 18.5300, "lon": 73.8300, "speed_limit": 45, "risk_mult": 1.05}
        ]
    },
    "Kochi": {
        "lat": 9.9312, "lon": 76.2673, "base_volume": 2800, "congestion_bias": 1.0,
        "roads": [
            {"name": "Edappally - Vyttila Bypass (NH 66)", "area": "Central Bypass", "lat": 9.9800, "lon": 76.3100, "speed_limit": 60, "risk_mult": 1.35},
            {"name": "Seaport-Airport Road", "area": "Kakkanad Corridor", "lat": 10.0100, "lon": 76.3500, "speed_limit": 70, "risk_mult": 1.30},
            {"name": "MG Road Kochi", "area": "Downtown", "lat": 9.9700, "lon": 76.2800, "speed_limit": 40, "risk_mult": 1.10},
            {"name": "Infopark Expressway", "area": "East IT Zone", "lat": 10.0150, "lon": 76.3650, "speed_limit": 60, "risk_mult": 1.15}
        ]
    }
}

VEHICLES = [
    {"type": "Motorcycle", "weight": 0.40, "accident_propensity": 1.65, "fatality_risk": 1.8},
    {"type": "Car", "weight": 0.32, "accident_propensity": 1.0, "fatality_risk": 0.7},
    {"type": "Auto", "weight": 0.12, "accident_propensity": 1.15, "fatality_risk": 1.1},
    {"type": "Truck", "weight": 0.08, "accident_propensity": 0.85, "fatality_risk": 2.4},
    {"type": "Bus", "weight": 0.05, "accident_propensity": 0.75, "fatality_risk": 1.6},
    {"type": "Other", "weight": 0.03, "accident_propensity": 0.9, "fatality_risk": 1.0}
]

WEATHER_CONDITIONS = [
    {"name": "Clear", "weight": 0.60, "risk_factor": 1.0},
    {"name": "Rain", "weight": 0.22, "risk_factor": 1.85},
    {"name": "Fog", "weight": 0.08, "risk_factor": 2.10},
    {"name": "Drizzle", "weight": 0.07, "risk_factor": 1.35},
    {"name": "Stormy", "weight": 0.03, "risk_factor": 2.60}
]

ROAD_CONDITIONS = [
    {"name": "Dry", "weight": 0.65, "risk_factor": 1.0},
    {"name": "Wet", "weight": 0.23, "risk_factor": 1.70},
    {"name": "Under Construction", "weight": 0.07, "risk_factor": 1.95},
    {"name": "Potholes / Damaged", "weight": 0.05, "risk_factor": 2.20}
]

CAUSES = [
    "Overspeeding",
    "Distracted Driving (Phone Use)",
    "Drunk Driving",
    "Wet Surface & Skidding",
    "Signal Violation",
    "Lane Indiscipline / Sudden Swerve",
    "Poor Visibility",
    "Mechanical Failure / Brake Fault",
    "Pedestrian Jaywalking"
]

def get_weighted_choice(items: list, weight_key: str = "weight"):
    weights = [item[weight_key] for item in items]
    return random.choices(items, weights=weights, k=1)[0]

def generate_synthetic_dataset(num_records: int = 26000) -> List[Dict[str, Any]]:
    """
    Generates realistic, physically and temporally coherent traffic and accident records.
    """
    records = []
    start_date = datetime.date(2025, 1, 1)
    end_date = datetime.date(2026, 7, 31)
    days_range = (end_date - start_date).days

    city_names = list(CITIES.keys())
    city_weights = [1.2, 1.4, 1.1, 1.5, 1.5, 1.0, 0.7] # Population & activity weight

    for i in range(1, num_records + 1):
        record_id = f"CP-REC-{i:06d}"
        
        # Date & Time distribution
        random_day_offset = random.randint(0, days_range)
        cur_date = start_date + datetime.timedelta(days=random_day_offset)
        hour = random.choices(
            range(24),
            weights=[1.2, 0.8, 0.5, 0.4, 0.6, 1.5, 3.2, 6.5, 9.8, 8.5, 5.5, 4.8, 
                     5.2, 5.0, 5.6, 6.8, 8.5, 10.2, 9.5, 7.8, 6.2, 4.5, 3.0, 2.0]
        )[0]
        minute = random.randint(0, 59)
        cur_time = f"{hour:02d}:{minute:02d}"
        
        # Spatial assignment
        city_name = random.choices(city_names, weights=city_weights)[0]
        city_meta = CITIES[city_name]
        road = random.choice(city_meta["roads"])
        
        # Jitter coordinates slightly along the road corridor
        lat_jitter = (random.random() - 0.5) * 0.008
        lon_jitter = (random.random() - 0.5) * 0.008
        latitude = round(road["lat"] + lat_jitter, 6)
        longitude = round(road["lon"] + lon_jitter, 6)
        
        # Weather & Road environment
        # Rainy season peak between June-September
        month = cur_date.month
        is_monsoon = month in [6, 7, 8, 9]
        if is_monsoon and random.random() < 0.45:
            weather = random.choice(["Rain", "Drizzle", "Stormy"])
        else:
            weather = get_weighted_choice(WEATHER_CONDITIONS)["name"]
            
        if weather in ["Rain", "Drizzle", "Stormy"]:
            road_cond = random.choices(["Wet", "Dry", "Potholes / Damaged"], weights=[0.85, 0.05, 0.10])[0]
        else:
            road_cond = get_weighted_choice(ROAD_CONDITIONS)["name"]

        # Lighting Condition based on hour
        if 6 <= hour < 18:
            lighting = "Daylight"
        elif 18 <= hour < 20 or 5 <= hour < 6:
            lighting = "Twilight / Dusk"
        else:
            lighting = random.choices(["Dark with Streetlights", "Dark without Streetlights"], weights=[0.8, 0.2])[0]

        # Traffic dynamics modeling
        is_peak = (8 <= hour <= 10) or (17 <= hour <= 21)
        base_vol = city_meta["base_volume"] * city_meta["congestion_bias"]
        time_mult = 1.65 if is_peak else (0.35 if hour < 5 else 0.95)
        weather_slowdown = 0.85 if weather in ["Rain", "Stormy", "Fog"] else 1.0
        
        traffic_volume = int(max(150, (base_vol * time_mult * random.uniform(0.75, 1.25))))
        
        # Congestion index calculation (0 - 10 scale)
        vol_ratio = traffic_volume / (base_vol * 1.5)
        raw_congestion = min(9.9, max(0.8, (vol_ratio * 7.5 + (1.5 if weather_slowdown < 1.0 else 0) + random.uniform(-0.5, 0.5))))
        congestion_index = round(raw_congestion, 2)
        
        # Average Speed inversely related to congestion & speed limit
        free_flow_speed = road["speed_limit"] * random.uniform(0.9, 1.15)
        speed_reduction = (congestion_index / 10.0) * 0.65
        avg_speed = max(10.0, round(free_flow_speed * (1 - speed_reduction) * weather_slowdown + random.uniform(-3, 3), 1))

        # Vehicle Type distribution
        vehicle_meta = get_weighted_choice(VEHICLES)
        vehicle_type = vehicle_meta["type"]

        # ACCIDENT PROBABILITY ENGINE (Realistic non-linear model)
        # Factors: Road risk multiplier, congestion vs speed, lighting, weather, vehicle type
        p_base = 0.055
        p_road = road["risk_mult"]
        p_veh = vehicle_meta["accident_propensity"]
        p_weather = 1.9 if weather in ["Rain", "Stormy", "Fog"] else 1.0
        p_light = 1.75 if lighting == "Dark without Streetlights" else (1.2 if lighting == "Dark with Streetlights" else 1.0)
        p_speeding = 1.6 if avg_speed > road["speed_limit"] * 0.95 and is_peak else 1.0
        
        composite_accident_prob = p_base * p_road * p_veh * p_weather * p_light * p_speeding * 0.55
        accident_occurred = random.random() < composite_accident_prob

        severity = "None"
        cause = "None"
        response_time = 0.0
        
        if accident_occurred:
            # Determine Severity: Minor, Moderate, Severe, Fatal
            severity_weights = [0.48, 0.32, 0.14, 0.06]
            if avg_speed > 60:
                severity_weights = [0.25, 0.35, 0.25, 0.15]
            if vehicle_type == "Motorcycle":
                severity_weights[2] += 0.08
                severity_weights[3] += 0.05
            if weather in ["Rain", "Fog"] or lighting == "Dark without Streetlights":
                severity_weights[3] += 0.04
            
            # Normalize weights
            total_w = sum(severity_weights)
            norm_weights = [w / total_w for w in severity_weights]
            severity = random.choices(["Minor", "Moderate", "Severe", "Fatal"], weights=norm_weights)[0]

            # Cause assignment
            if weather in ["Rain", "Stormy"]:
                cause = random.choices(["Wet Surface & Skidding", "Poor Visibility", "Overspeeding", "Lane Indiscipline / Sudden Swerve"], weights=[0.5, 0.2, 0.2, 0.1])[0]
            elif lighting == "Dark without Streetlights":
                cause = random.choices(["Poor Visibility", "Overspeeding", "Drunk Driving", "Pedestrian Jaywalking"], weights=[0.45, 0.25, 0.2, 0.1])[0]
            elif avg_speed > road["speed_limit"]:
                cause = "Overspeeding"
            else:
                cause = random.choice(CAUSES)

            # Response time modeling (affected by congestion and zone)
            base_response = 8.0 + (congestion_index * 1.6)
            if severity == "Fatal":
                base_response += random.uniform(1.0, 5.0) # often complex incident
            response_time = round(max(3.5, base_response + random.uniform(-2.0, 4.0)), 1)

        record = {
            "record_id": record_id,
            "date": cur_date.strftime("%Y-%m-%d"),
            "time": cur_time,
            "city": city_name,
            "area": road["area"],
            "road_name": road["name"],
            "latitude": latitude,
            "longitude": longitude,
            "traffic_volume": traffic_volume,
            "average_speed": avg_speed,
            "congestion_index": congestion_index,
            "vehicle_type": vehicle_type,
            "accident_occurred": int(accident_occurred),
            "severity": severity,
            "weather": weather,
            "road_condition": road_cond,
            "lighting_condition": lighting,
            "response_time_min": response_time,
            "cause": cause
        }
        records.append(record)

    return records

if __name__ == "__main__":
    print("Generating CityPulse synthetic dataset of 26,000 records...")
    data = generate_synthetic_dataset(26000)
    
    os.makedirs("data", exist_ok=True)
    csv_file = "data/citypulse_data.csv"
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(data[0].keys()))
        writer.writeheader()
        writer.writerows(data)
    
    print(f"Dataset successfully generated and written to {csv_file} with {len(data)} rows.")
