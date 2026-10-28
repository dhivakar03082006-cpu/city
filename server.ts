/**
 * CityPulse - Express Application Server & API Gateway
 * Integrates Vite middleware in development and serves full RESTful analytics endpoints.
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { AnalyticsEngine, QueryFilters } from './server/analyticsEngine';
import { CITIES_CONFIG, GLOBAL_DATASET } from './server/dataset';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe Lazy Gemini Client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      try {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (err) {
        console.error("Gemini initialization warning:", err);
      }
    }
    return aiClient;
  }

  // --- 1. HEALTH & METRICS ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      service: 'CityPulse Intelligence API',
      version: '1.0.0',
      dataset_size: GLOBAL_DATASET.length,
      cities_monitored: Object.keys(CITIES_CONFIG).length
    });
  });

  // --- 2. AUTHENTICATION (JWT Mock Demo) ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'demo@citypulse.com' && password === 'demo123') {
      res.json({
        token: 'cp_jwt_token_auth_bearer_sample_98472910',
        user: {
          id: 'usr-001',
          email: 'demo@citypulse.com',
          full_name: 'Lead Intelligence Analyst',
          role: 'Senior Urban Data Scientist',
          organization: 'CityPulse Traffic AI Labs'
        }
      });
      return;
    }

    if (email && password && password.length >= 6) {
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      res.json({
        token: `cp_jwt_token_${Date.now()}`,
        user: {
          id: `usr-${Date.now()}`,
          email,
          full_name: capitalized,
          role: 'Traffic Safety Analyst',
          organization: 'Metropolitan Transport Authority'
        }
      });
      return;
    }

    res.status(401).json({ error: 'Invalid email or password. Use demo@citypulse.com / demo123' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, full_name, password } = req.body;
    if (!email || !full_name || !password || password.length < 6) {
      res.status(400).json({ error: 'Please provide valid registration fields.' });
      return;
    }

    res.json({
      token: `cp_jwt_token_new_${Date.now()}`,
      user: {
        id: `usr-${Date.now()}`,
        email,
        full_name,
        role: 'Registered Safety Analyst',
        organization: 'Urban Intelligence Division'
      }
    });
  });

  // Helper to extract query filters
  function parseFilters(req: express.Request): QueryFilters {
    return {
      city: req.query.city as string || 'All',
      dateRange: req.query.dateRange as string || 'all',
      vehicleType: req.query.vehicleType as string || 'All',
      severity: req.query.severity as string || 'All',
      weather: req.query.weather as string || 'All',
      searchQuery: req.query.search as string || ''
    };
  }

  // --- 3. DASHBOARD ANALYTICS ---
  app.get('/api/dashboard', (req, res) => {
    const filters = parseFilters(req);
    const kpis = AnalyticsEngine.getKpis(filters);
    const hotspots = AnalyticsEngine.getHotspots(filters).slice(0, 8);
    const timeAnalysis = AnalyticsEngine.getTimeAnalysis(filters);
    const vehicles = AnalyticsEngine.getVehicleAnalytics(filters);
    const trends = AnalyticsEngine.getTrendAnalysis(filters).slice(-8);
    const insights = AnalyticsEngine.getInsights(filters).slice(0, 4);

    // Weather severity matrix
    const data = AnalyticsEngine.filterRecords(filters);
    const weatherMap: Record<string, { total: number; fatal: number; severe: number }> = {};
    for (const r of data) {
      if (r.accident_occurred === 1) {
        if (!weatherMap[r.weather]) weatherMap[r.weather] = { total: 0, fatal: 0, severe: 0 };
        weatherMap[r.weather].total++;
        if (r.severity === 'Fatal') weatherMap[r.weather].fatal++;
        if (r.severity === 'Severe') weatherMap[r.weather].severe++;
      }
    }

    const weatherDist = Object.entries(weatherMap).map(([weather, stats]) => ({
      name: weather,
      total: stats.total,
      fatal: stats.fatal,
      severe: stats.severe
    }));

    res.json({
      kpis,
      hotspots,
      hourly_trend: timeAnalysis.hourlyDistribution,
      top_roads: hotspots.map(h => ({ name: h.road_name, accidents: h.accidents, risk_score: h.risk_score, city: h.city })),
      vehicle_dist: vehicles.map(v => ({ name: v.vehicle_type, value: v.accident_count, share: v.share_pct })),
      weather_dist: weatherDist,
      recent_trends: trends,
      ai_insights: insights
    });
  });

  // --- 4. TRAFFIC ANALYTICS ---
  app.get('/api/traffic', (req, res) => {
    const filters = parseFilters(req);
    const data = AnalyticsEngine.filterRecords(filters);
    const kpis = AnalyticsEngine.getKpis(filters);
    const timeAnalysis = AnalyticsEngine.getTimeAnalysis(filters);

    // Traffic by City
    const cityVolMap: Record<string, { volSum: number; speedSum: number; congSum: number; count: number }> = {};
    for (const r of data) {
      if (!cityVolMap[r.city]) cityVolMap[r.city] = { volSum: 0, speedSum: 0, congSum: 0, count: 0 };
      cityVolMap[r.city].volSum += r.traffic_volume;
      cityVolMap[r.city].speedSum += r.average_speed;
      cityVolMap[r.city].congSum += r.congestion_index;
      cityVolMap[r.city].count++;
    }

    const cityStats = Object.entries(cityVolMap).map(([city, stats]) => ({
      city,
      avg_volume: Math.round(stats.volSum / Math.max(1, stats.count)),
      avg_speed: Number((stats.speedSum / Math.max(1, stats.count)).toFixed(1)),
      avg_congestion: Number((stats.congSum / Math.max(1, stats.count)).toFixed(2))
    }));

    res.json({
      kpis: {
        avg_volume: Math.round(data.reduce((a, b) => a + b.traffic_volume, 0) / Math.max(1, data.length)),
        peak_volume: Math.max(...data.map(d => d.traffic_volume), 0),
        avg_speed: kpis.avg_speed,
        congestion_index: kpis.avg_congestion
      },
      city_stats: cityStats,
      hourly_pattern: timeAnalysis.hourlyDistribution,
      day_pattern: timeAnalysis.dayDistribution
    });
  });

  // --- 5. ACCIDENT ANALYTICS ---
  app.get('/api/accidents', (req, res) => {
    const filters = parseFilters(req);
    const data = AnalyticsEngine.filterRecords(filters);
    const accidents = data.filter(r => r.accident_occurred === 1);
    const kpis = AnalyticsEngine.getKpis(filters);

    const causeMap: Record<string, number> = {};
    const roadCondMap: Record<string, number> = {};
    const lightingMap: Record<string, number> = {};
    const severityMap: Record<string, number> = {};

    for (const a of accidents) {
      causeMap[a.cause] = (causeMap[a.cause] || 0) + 1;
      roadCondMap[a.road_condition] = (roadCondMap[a.road_condition] || 0) + 1;
      lightingMap[a.lighting_condition] = (lightingMap[a.lighting_condition] || 0) + 1;
      severityMap[a.severity] = (severityMap[a.severity] || 0) + 1;
    }

    res.json({
      kpis: {
        total_accidents: kpis.total_accidents,
        fatal_accidents: kpis.fatal_accidents,
        severe_accidents: kpis.severe_accidents,
        moderate_accidents: kpis.moderate_accidents,
        minor_accidents: kpis.minor_accidents,
        avg_response_time: kpis.avg_response_time
      },
      causes: Object.entries(causeMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      road_conditions: Object.entries(roadCondMap).map(([name, value]) => ({ name, value })),
      lighting_conditions: Object.entries(lightingMap).map(([name, value]) => ({ name, value })),
      severity_distribution: Object.entries(severityMap).map(([name, value]) => ({ name, value }))
    });
  });

  // --- 6. RISK MAP POINTS ---
  app.get('/api/risk-map', (req, res) => {
    const filters = parseFilters(req);
    const hotspots = AnalyticsEngine.getHotspots(filters);
    const data = AnalyticsEngine.filterRecords(filters);

    // Include detailed sample accidents for the map pins
    const sampleIncidents = data
      .filter(r => r.accident_occurred === 1)
      .slice(0, 150)
      .map(r => ({
        record_id: r.record_id,
        road_name: r.road_name,
        city: r.city,
        area: r.area,
        lat: r.latitude,
        lon: r.longitude,
        severity: r.severity,
        cause: r.cause,
        vehicle_type: r.vehicle_type,
        weather: r.weather,
        traffic_volume: r.traffic_volume,
        speed: r.average_speed,
        congestion: r.congestion_index,
        time: `${r.date} ${r.time}`
      }));

    res.json({
      hotspots,
      incidents: sampleIncidents,
      cities: CITIES_CONFIG
    });
  });

  // --- 7. HOTSPOTS RANKING ---
  app.get('/api/hotspots', (req, res) => {
    const filters = parseFilters(req);
    const hotspots = AnalyticsEngine.getHotspots(filters);
    res.json(hotspots);
  });

  // --- 8. TIME ANALYSIS ---
  app.get('/api/time-analysis', (req, res) => {
    const filters = parseFilters(req);
    const timeAnalysis = AnalyticsEngine.getTimeAnalysis(filters);
    res.json(timeAnalysis);
  });

  // --- 9. VEHICLE ANALYTICS ---
  app.get('/api/vehicles', (req, res) => {
    const filters = parseFilters(req);
    const vehicles = AnalyticsEngine.getVehicleAnalytics(filters);
    res.json(vehicles);
  });

  // --- 10. TREND ANALYSIS ---
  app.get('/api/trends', (req, res) => {
    const filters = parseFilters(req);
    const trends = AnalyticsEngine.getTrendAnalysis(filters);
    res.json(trends);
  });

  // --- 11. INSIGHTS & RECOMMENDATIONS ---
  app.get('/api/insights', (req, res) => {
    const filters = parseFilters(req);
    const insights = AnalyticsEngine.getInsights(filters);
    const stats = AnalyticsEngine.getStatisticalSummary(filters);
    res.json({
      insights,
      statistical_summary: stats
    });
  });

  // --- 12. DATA EXPLORER & PAGINATION ---
  app.get('/api/data', (req, res) => {
    const filters = parseFilters(req);
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '25', 10);
    const sortBy = req.query.sortBy as string || 'date';
    const sortOrder = req.query.sortOrder as string || 'desc';

    let records = [...AnalyticsEngine.filterRecords(filters)];

    // Sort records
    records.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
    });

    const total = records.length;
    const startIndex = (page - 1) * limit;
    const paginated = records.slice(startIndex, startIndex + limit);

    res.json({
      records: paginated,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  });

  // --- 13. CSV EXPORT ---
  app.get('/api/export', (req, res) => {
    const filters = parseFilters(req);
    const csvContent = AnalyticsEngine.generateCsv(filters);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="citypulse_traffic_data_${filters.city || 'all'}.csv"`);
    res.send(csvContent);
  });

  // --- 14. GEMINI AI URBAN SAFETY REASONING (Optional Smart Feature) ---
  app.post('/api/ai-insights', async (req, res) => {
    const { corridor, city, riskScore, dominantCause } = req.body;
    const client = getGeminiClient();

    if (!client) {
      res.json({
        ai_generated: false,
        summary: `Strategic Traffic Mitigation for ${corridor} (${city})`,
        analysis: `With a composite risk rating of ${riskScore}/100 and primary hazard '${dominantCause}', this corridor requires priority engineering interventions including lane realignment and automated sensor speed controls.`
      });
      return;
    }

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an urban traffic engineer and traffic safety expert. Provide a concise, highly professional 3-bullet action plan for ${corridor} in ${city} which has a road risk score of ${riskScore}/100 and high accident cause of "${dominantCause}". Focus on geometric design, intelligent transport systems (ITS), and enforcement.`
      });

      res.json({
        ai_generated: true,
        summary: `AI Intelligence Advisory: ${corridor}`,
        analysis: response.text
      });
    } catch (err: any) {
      res.json({
        ai_generated: false,
        summary: `Strategic Mitigation: ${corridor}`,
        analysis: `Prioritize ITS deployment, high-visibility crosswalks, and smart signal re-timing to alleviate friction in ${city}.`
      });
    }
  });

  // --- VITE MIDDLEWARE / SPA FALLBACK ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CityPulse Analytics Server live on http://0.0.0.0:${PORT}`);
  });
}

startServer();
