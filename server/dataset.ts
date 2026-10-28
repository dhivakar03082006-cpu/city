/**
 * CityPulse - In-Memory High-Performance Analytics Dataset
 * Synthesizes 25,000+ realistic traffic and accident data points with complete temporal,
 * spatial, meteorological, and behavioral attributes across 7 Indian metropolitan hubs.
 */

import { TrafficRecord, SeverityType, VehicleType, WeatherType, RoadConditionType, LightingConditionType } from '../src/types/index';

interface RoadMeta {
  name: string;
  area: string;
  lat: number;
  lon: number;
  speedLimit: number;
  riskMultiplier: number;
}

interface CityMeta {
  name: string;
  lat: number;
  lon: number;
  baseVolume: number;
  congestionBias: number;
  roads: RoadMeta[];
}

export const CITIES_CONFIG: Record<string, CityMeta> = {
  Chennai: {
    name: "Chennai",
    lat: 13.0827,
    lon: 80.2707,
    baseVolume: 4200,
    congestionBias: 1.1,
    roads: [
      { name: "Anna Salai (Mount Road)", area: "Central Business District", lat: 13.0604, lon: 80.2496, speedLimit: 50, riskMultiplier: 1.25 },
      { name: "OMR (IT Corridor)", area: "South Technology Zone", lat: 12.9150, lon: 80.2280, speedLimit: 70, riskMultiplier: 1.35 },
      { name: "GST Road (Airport Corridor)", area: "South-West Transit", lat: 12.9815, lon: 80.1636, speedLimit: 60, riskMultiplier: 1.40 },
      { name: "Poonamallee High Road", area: "West Commercial", lat: 13.0784, lon: 80.2182, speedLimit: 50, riskMultiplier: 1.15 },
      { name: "Inner Ring Road (Jawaharlal Nehru)", area: "Central-West Belt", lat: 13.0850, lon: 80.2050, speedLimit: 60, riskMultiplier: 1.20 },
      { name: "ECR (East Coast Road)", area: "Coastal Scenic Corridor", lat: 12.8900, lon: 80.2450, speedLimit: 80, riskMultiplier: 1.48 },
      { name: "Velachery Main Road", area: "South Transit", lat: 12.9780, lon: 80.2180, speedLimit: 45, riskMultiplier: 1.12 }
    ]
  },
  Bengaluru: {
    name: "Bengaluru",
    lat: 12.9716,
    lon: 77.5946,
    baseVolume: 4900,
    congestionBias: 1.38,
    roads: [
      { name: "Outer Ring Road (Silk Board - Marathahalli)", area: "Tech Corridor", lat: 12.9172, lon: 77.6400, speedLimit: 60, riskMultiplier: 1.62 },
      { name: "Hosur Road (Electronic City Flyover)", area: "South Industrial", lat: 12.8452, lon: 77.6602, speedLimit: 70, riskMultiplier: 1.32 },
      { name: "Old Airport Road", area: "East Corridor", lat: 12.9600, lon: 77.6500, speedLimit: 50, riskMultiplier: 1.22 },
      { name: "Bellary Road (Airport Expressway)", area: "North High-Speed", lat: 13.0500, lon: 77.5900, speedLimit: 80, riskMultiplier: 1.38 },
      { name: "Bannerghatta Road", area: "South Suburb", lat: 12.8900, lon: 77.5950, speedLimit: 45, riskMultiplier: 1.18 },
      { name: "Kanakapura Road", area: "South-West Corridor", lat: 12.8800, lon: 77.5500, speedLimit: 60, riskMultiplier: 1.12 }
    ]
  },
  Hyderabad: {
    name: "Hyderabad",
    lat: 17.3850,
    lon: 78.4867,
    baseVolume: 4100,
    congestionBias: 1.18,
    roads: [
      { name: "Nehru Outer Ring Road (ORR)", area: "Cyberabad Expressway", lat: 17.4400, lon: 78.3500, speedLimit: 100, riskMultiplier: 1.45 },
      { name: "Hitech City Main Road", area: "Madhapur Tech Zone", lat: 17.4435, lon: 78.3772, speedLimit: 50, riskMultiplier: 1.18 },
      { name: "PVNR Expressway (Airport Corridor)", area: "South-West Elevated", lat: 17.3600, lon: 78.4300, speedLimit: 70, riskMultiplier: 1.28 },
      { name: "Banjara Hills Road No. 1", area: "Central West", lat: 17.4156, lon: 78.4482, speedLimit: 45, riskMultiplier: 1.08 },
      { name: "Secunderabad - Medchal Highway (NH 44)", area: "North Logistics", lat: 17.5200, lon: 78.4900, speedLimit: 70, riskMultiplier: 1.36 }
    ]
  },
  Mumbai: {
    name: "Mumbai",
    lat: 19.0760,
    lon: 72.8777,
    baseVolume: 5300,
    congestionBias: 1.45,
    roads: [
      { name: "Western Express Highway (WEH)", area: "Western Suburbs Arterial", lat: 19.1136, lon: 72.8697, speedLimit: 70, riskMultiplier: 1.55 },
      { name: "Eastern Express Highway (EEH)", area: "Eastern Suburbs Arterial", lat: 19.0800, lon: 72.9200, speedLimit: 70, riskMultiplier: 1.38 },
      { name: "Bandra-Worli Sea Link", area: "Coastal Bridge", lat: 19.0330, lon: 72.8150, speedLimit: 80, riskMultiplier: 1.15 },
      { name: "Sion-Panvel Expressway", area: "Navi Mumbai Gateway", lat: 19.0400, lon: 72.9800, speedLimit: 80, riskMultiplier: 1.48 },
      { name: "SV Road (Swami Vivekananda)", area: "Suburban Commercial", lat: 19.1400, lon: 72.8400, speedLimit: 40, riskMultiplier: 1.22 }
    ]
  },
  Delhi: {
    name: "Delhi",
    lat: 28.6139,
    lon: 77.2090,
    baseVolume: 5600,
    congestionBias: 1.32,
    roads: [
      { name: "Ring Road (AIIMS - Ashram)", area: "South-Central Core", lat: 28.5700, lon: 77.2200, speedLimit: 60, riskMultiplier: 1.48 },
      { name: "Delhi-Noida Direct (DND) Flyway", area: "East Corridor", lat: 28.5800, lon: 77.2900, speedLimit: 80, riskMultiplier: 1.28 },
      { name: "Delhi-Gurgaon Expressway (NH 48)", area: "South-West Gateway", lat: 28.5200, lon: 77.0900, speedLimit: 80, riskMultiplier: 1.52 },
      { name: "Outer Ring Road (Mukarba Chowk)", area: "North Industrial", lat: 28.7300, lon: 77.1600, speedLimit: 70, riskMultiplier: 1.42 },
      { name: "Mathura Road (Badarpur Border)", area: "South-East Arterial", lat: 28.5000, lon: 77.3000, speedLimit: 60, riskMultiplier: 1.32 }
    ]
  },
  Pune: {
    name: "Pune",
    lat: 18.5204,
    lon: 73.8567,
    baseVolume: 3900,
    congestionBias: 1.15,
    roads: [
      { name: "Pune-Bangalore Highway (Katraj-Dehu Bypass)", area: "West Bypass", lat: 18.5500, lon: 73.7800, speedLimit: 80, riskMultiplier: 1.42 },
      { name: "Nagar Road (Kalyani Nagar - Viman Nagar)", area: "East Corridor", lat: 18.5600, lon: 73.9100, speedLimit: 50, riskMultiplier: 1.28 },
      { name: "Hinjewadi IT Park Main Road", area: "West Tech Park", lat: 18.5900, lon: 73.7400, speedLimit: 45, riskMultiplier: 1.32 },
      { name: "Senapati Bapat Road", area: "Central Commercial", lat: 18.5300, lon: 73.8300, speedLimit: 45, riskMultiplier: 1.06 }
    ]
  },
  Kochi: {
    name: "Kochi",
    lat: 9.9312,
    lon: 76.2673,
    baseVolume: 2900,
    congestionBias: 1.05,
    roads: [
      { name: "Edappally - Vyttila Bypass (NH 66)", area: "Central Bypass", lat: 9.9800, lon: 76.3100, speedLimit: 60, riskMultiplier: 1.38 },
      { name: "Seaport-Airport Road", area: "Kakkanad Transit", lat: 10.0100, lon: 76.3500, speedLimit: 70, riskMultiplier: 1.32 },
      { name: "MG Road Kochi", area: "Downtown", lat: 9.9700, lon: 76.2800, speedLimit: 40, riskMultiplier: 1.12 },
      { name: "Infopark Expressway", area: "East IT Zone", lat: 10.0150, lon: 76.3650, speedLimit: 60, riskMultiplier: 1.18 }
    ]
  }
};

const VEHICLE_CONFIG: { type: VehicleType; weight: number; accidentPropensity: number; fatalityRisk: number }[] = [
  { type: "Motorcycle", weight: 0.40, accidentPropensity: 1.65, fatalityRisk: 1.8 },
  { type: "Car", weight: 0.32, accidentPropensity: 1.0, fatalityRisk: 0.7 },
  { type: "Auto", weight: 0.12, accidentPropensity: 1.15, fatalityRisk: 1.1 },
  { type: "Truck", weight: 0.08, accidentPropensity: 0.85, fatalityRisk: 2.4 },
  { type: "Bus", weight: 0.05, accidentPropensity: 0.75, fatalityRisk: 1.6 },
  { type: "Other", weight: 0.03, accidentPropensity: 0.9, fatalityRisk: 1.0 }
];

const WEATHER_CONFIG: { name: WeatherType; weight: number; riskFactor: number }[] = [
  { name: "Clear", weight: 0.60, riskFactor: 1.0 },
  { name: "Rain", weight: 0.22, riskFactor: 1.85 },
  { name: "Fog", weight: 0.08, riskFactor: 2.10 },
  { name: "Drizzle", weight: 0.07, riskFactor: 1.35 },
  { name: "Stormy", weight: 0.03, riskFactor: 2.60 }
];

const CAUSES_LIST = [
  "Overspeeding",
  "Distracted Driving (Phone Use)",
  "Drunk Driving",
  "Wet Surface & Skidding",
  "Signal Violation",
  "Lane Indiscipline / Sudden Swerve",
  "Poor Visibility",
  "Mechanical Failure / Brake Fault",
  "Pedestrian Jaywalking"
];

// Seeded pseudorandom generator for deterministic, high-performance dataset creation
function pseudoRandom(seed: number) {
  let s = Math.sin(seed) * 10000;
  return s - Math.floor(s);
}

export function buildSyntheticDataset(count: number = 25000): TrafficRecord[] {
  const records: TrafficRecord[] = [];
  const cityKeys = Object.keys(CITIES_CONFIG);
  const cityWeights = [1.2, 1.4, 1.1, 1.5, 1.5, 1.0, 0.7];

  const startDate = new Date(2025, 0, 1).getTime();
  const endDate = new Date(2026, 6, 31).getTime();
  const timeSpan = endDate - startDate;

  const hourlyWeights = [
    1.2, 0.8, 0.5, 0.4, 0.6, 1.5, 3.2, 6.5, 9.8, 8.5, 5.5, 4.8,
    5.2, 5.0, 5.6, 6.8, 8.5, 10.2, 9.5, 7.8, 6.2, 4.5, 3.0, 2.0
  ];
  const totalHourlyWeight = hourlyWeights.reduce((a, b) => a + b, 0);

  for (let i = 1; i <= count; i++) {
    const r1 = pseudoRandom(i * 13 + 7);
    const r2 = pseudoRandom(i * 29 + 11);
    const r3 = pseudoRandom(i * 37 + 19);
    const r4 = pseudoRandom(i * 43 + 23);
    const r5 = pseudoRandom(i * 59 + 31);
    const r6 = pseudoRandom(i * 67 + 41);

    // Date & Time
    const timestampMs = startDate + Math.floor(r1 * timeSpan);
    const dateObj = new Date(timestampMs);
    const dateStr = dateObj.toISOString().split('T')[0];

    // Hourly distribution
    let hourAcc = r2 * totalHourlyWeight;
    let hour = 12;
    for (let h = 0; h < 24; h++) {
      hourAcc -= hourlyWeights[h];
      if (hourAcc <= 0) {
        hour = h;
        break;
      }
    }
    const minute = Math.floor(r3 * 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // City Selection
    let cityAcc = r4 * 8.4;
    let cityIndex = 0;
    for (let c = 0; c < cityWeights.length; c++) {
      cityAcc -= cityWeights[c];
      if (cityAcc <= 0) {
        cityIndex = c;
        break;
      }
    }
    const cityName = cityKeys[cityIndex] || "Chennai";
    const cityMeta = CITIES_CONFIG[cityName];
    const roadIndex = Math.floor(r5 * cityMeta.roads.length);
    const road = cityMeta.roads[roadIndex] || cityMeta.roads[0];

    // Jitter coordinates
    const latJitter = (r6 - 0.5) * 0.007;
    const lonJitter = (pseudoRandom(i * 71) - 0.5) * 0.007;
    const latitude = Number((road.lat + latJitter).toFixed(6));
    const longitude = Number((road.lon + lonJitter).toFixed(6));

    // Weather
    const month = dateObj.getMonth();
    const isMonsoon = month >= 5 && month <= 8; // June to Sept
    let weather: WeatherType = "Clear";
    const weatherRoll = pseudoRandom(i * 79 + 3);
    if (isMonsoon && weatherRoll < 0.42) {
      weather = weatherRoll < 0.30 ? "Rain" : (weatherRoll < 0.38 ? "Drizzle" : "Stormy");
    } else {
      let wAcc = weatherRoll;
      for (const w of WEATHER_CONFIG) {
        wAcc -= w.weight;
        if (wAcc <= 0) {
          weather = w.name;
          break;
        }
      }
    }

    // Road Condition
    let roadCondition: RoadConditionType = "Dry";
    if (weather === "Rain" || weather === "Stormy" || weather === "Drizzle") {
      roadCondition = pseudoRandom(i * 83) < 0.88 ? "Wet" : "Potholes / Damaged";
    } else {
      const rcRoll = pseudoRandom(i * 89);
      if (rcRoll > 0.90) roadCondition = "Potholes / Damaged";
      else if (rcRoll > 0.82) roadCondition = "Under Construction";
    }

    // Lighting
    let lighting: LightingConditionType = "Daylight";
    if (hour >= 6 && hour < 18) {
      lighting = "Daylight";
    } else if ((hour >= 18 && hour < 20) || (hour >= 5 && hour < 6)) {
      lighting = "Twilight / Dusk";
    } else {
      lighting = pseudoRandom(i * 97) < 0.82 ? "Dark with Streetlights" : "Dark without Streetlights";
    }

    // Vehicle Type
    let vehAcc = pseudoRandom(i * 101);
    let vehicleType: VehicleType = "Car";
    let vehMeta = VEHICLE_CONFIG[1];
    for (const v of VEHICLE_CONFIG) {
      vehAcc -= v.weight;
      if (vehAcc <= 0) {
        vehicleType = v.type;
        vehMeta = v;
        break;
      }
    }

    // Traffic volume & speed dynamics
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 21);
    const baseVol = cityMeta.baseVolume * cityMeta.congestionBias;
    const timeMult = isPeak ? 1.62 : (hour < 5 ? 0.38 : 0.95);
    const weatherSlowdown = (weather === "Rain" || weather === "Stormy" || weather === "Fog") ? 0.85 : 1.0;
    
    const trafficVolume = Math.max(200, Math.floor(baseVol * timeMult * (0.8 + pseudoRandom(i * 103) * 0.4)));
    const volRatio = trafficVolume / (baseVol * 1.5);
    const rawCongestion = Math.min(9.8, Math.max(0.8, volRatio * 7.5 + (weatherSlowdown < 1.0 ? 1.4 : 0) + (pseudoRandom(i * 107) - 0.5)));
    const congestionIndex = Number(rawCongestion.toFixed(2));

    const speedReduction = (congestionIndex / 10.0) * 0.65;
    const avgSpeed = Number(Math.max(12.0, (road.speedLimit * (1 - speedReduction) * weatherSlowdown + (pseudoRandom(i * 109) - 0.5) * 6)).toFixed(1));

    // Accident probability
    const pBase = 0.055;
    const pRoad = road.riskMultiplier;
    const pVeh = vehMeta.accidentPropensity;
    const pWeather = (weather === "Rain" || weather === "Stormy" || weather === "Fog") ? 1.85 : 1.0;
    const pLight = lighting === "Dark without Streetlights" ? 1.75 : (lighting === "Dark with Streetlights" ? 1.2 : 1.0);
    const pSpeeding = (avgSpeed > road.speedLimit * 0.95 && isPeak) ? 1.55 : 1.0;

    const accidentProb = pBase * pRoad * pVeh * pWeather * pLight * pSpeeding * 0.52;
    const accidentOccurred = pseudoRandom(i * 113) < accidentProb ? 1 : 0;

    let severity: SeverityType = "None";
    let cause = "None";
    let responseTime = 0.0;

    if (accidentOccurred === 1) {
      // Determine Severity
      const sevRoll = pseudoRandom(i * 127);
      if (avgSpeed > 55 || vehicleType === "Truck" || vehicleType === "Motorcycle") {
        if (sevRoll < 0.12) severity = "Fatal";
        else if (sevRoll < 0.38) severity = "Severe";
        else if (sevRoll < 0.72) severity = "Moderate";
        else severity = "Minor";
      } else {
        if (sevRoll < 0.05) severity = "Fatal";
        else if (sevRoll < 0.20) severity = "Severe";
        else if (sevRoll < 0.55) severity = "Moderate";
        else severity = "Minor";
      }

      // Cause assignment
      if (weather === "Rain" || weather === "Stormy") {
        cause = pseudoRandom(i * 131) < 0.6 ? "Wet Surface & Skidding" : "Poor Visibility";
      } else if (lighting === "Dark without Streetlights") {
        cause = pseudoRandom(i * 137) < 0.5 ? "Poor Visibility" : "Pedestrian Jaywalking";
      } else if (avgSpeed > road.speedLimit) {
        cause = "Overspeeding";
      } else {
        const causeIndex = Math.floor(pseudoRandom(i * 139) * CAUSES_LIST.length);
        cause = CAUSES_LIST[causeIndex];
      }

      // Response Time
      const baseResponse = 7.5 + (congestionIndex * 1.5);
      const fatalDelay = severity === "Fatal" ? 2.5 : 0;
      responseTime = Number(Math.max(3.5, baseResponse + fatalDelay + (pseudoRandom(i * 149) - 0.5) * 3).toFixed(1));
    }

    records.push({
      record_id: `CP-REC-${i.toString().padStart(6, '0')}`,
      date: dateStr,
      time: timeStr,
      city: cityName,
      area: road.area,
      road_name: road.name,
      latitude,
      longitude,
      traffic_volume: trafficVolume,
      average_speed: avgSpeed,
      congestion_index: congestionIndex,
      vehicle_type: vehicleType,
      accident_occurred: accidentOccurred,
      severity,
      weather,
      road_condition: roadCondition,
      lighting_condition: lighting,
      response_time_min: responseTime,
      cause,
      hour,
      day_of_week: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObj.getDay()]
    });
  }

  return records;
}

// Global cached dataset instance
export const GLOBAL_DATASET = buildSyntheticDataset(25000);
