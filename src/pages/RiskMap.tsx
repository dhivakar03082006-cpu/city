import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Flame,
  AlertTriangle,
  Layers,
  Sliders,
  Maximize2,
  Navigation,
  Eye,
  ShieldAlert,
  Info,
  Car,
  Wind
} from 'lucide-react';
import { FilterState, Hotspot } from '../types/index';
import { ApiService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { HotspotModal } from '../components/HotspotModal';
import { FilterBar } from '../components/FilterBar';

interface RiskMapProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [mapData, setMapData] = useState<{ hotspots: Hotspot[]; incidents: any[]; cities: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'critical' | 'incidents'>('all');
  const [inspectedIncident, setInspectedIncident] = useState<any | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    async function loadMapData() {
      setLoading(true);
      try {
        const res = await ApiService.getRiskMapData(filters);
        if (mounted) setMapData(res);
      } catch (err) {
        console.error('Failed to load risk map data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMapData();
    return () => {
      mounted = false;
    };
  }, [filters]);

  // Leaflet map initialization
  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    let L: any;
    try {
      L = (window as any).L;
    } catch {
      return;
    }

    if (!L) {
      import('leaflet').then((leafletModule) => {
        initializeMap(leafletModule.default || leafletModule);
      }).catch(err => console.error("Leaflet dynamic import error:", err));
    } else {
      initializeMap(L);
    }

    function initializeMap(leaflet: any) {
      if (!leafletMapRef.current && mapContainerRef.current) {
        // Initial center (India default or city default)
        const initialLat = filters.city === 'Mumbai' ? 19.0760 :
                           filters.city === 'Delhi' ? 28.7041 :
                           filters.city === 'Chennai' ? 13.0827 :
                           filters.city === 'Hyderabad' ? 17.3850 :
                           filters.city === 'Pune' ? 18.5204 :
                           filters.city === 'Kolkata' ? 22.5726 : 12.9716; // Bengaluru default
        const initialLon = filters.city === 'Mumbai' ? 72.8777 :
                           filters.city === 'Delhi' ? 77.1025 :
                           filters.city === 'Chennai' ? 80.2707 :
                           filters.city === 'Hyderabad' ? 78.4867 :
                           filters.city === 'Pune' ? 73.8567 :
                           filters.city === 'Kolkata' ? 88.3639 : 77.5946;

        const map = leaflet.map(mapContainerRef.current, {
          center: [initialLat, initialLon],
          zoom: filters.city !== 'All' ? 12 : 6,
          zoomControl: true,
          attributionControl: false
        });

        // High quality dark tile layer from CartoDB Dark Matter
        leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd'
        }).addTo(map);

        markersGroupRef.current = leaflet.layerGroup().addTo(map);
        leafletMapRef.current = map;
      }
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map center & markers when data or filters change
  useEffect(() => {
    if (!leafletMapRef.current || !mapData) return;
    const leaflet = (window as any).L;
    if (!leaflet) return;

    const map = leafletMapRef.current;
    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();
    }

    // Set view according to selected city
    if (filters.city && filters.city !== 'All' && mapData.cities && mapData.cities[filters.city]) {
      const cityConf = mapData.cities[filters.city];
      map.setView([cityConf.lat, cityConf.lon], 12);
    } else {
      map.setView([20.5937, 78.9629], 5);
    }

    // Filter hotspots based on layer
    const hotspotsToRender = mapData.hotspots.filter(h => {
      if (activeLayer === 'critical') return h.risk_score >= 70;
      return true;
    });

    // Render Hotspot Zone Circles
    hotspotsToRender.forEach((h: Hotspot) => {
      const color = h.risk_score >= 80 ? '#ef4444' :
                    h.risk_score >= 65 ? '#f59e0b' :
                    h.risk_score >= 50 ? '#06b6d4' : '#10b981';

      const circle = leaflet.circleMarker([h.latitude, h.longitude], {
        radius: Math.max(12, h.risk_score / 3.5),
        color: color,
        fillColor: color,
        fillOpacity: 0.45,
        weight: 2
      });

      const popupContent = `
        <div style="font-family: inherit; min-width: 200px; padding: 4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; background: rgba(6,182,212,0.2); color: #22d3ee; padding: 2px 6px; border-radius: 4px;">RANK #${h.rank}</span>
            <span style="font-size: 12px; font-weight: 800; color: ${color};">${h.risk_score}/100</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #fff; margin: 0 0 2px 0;">${h.road_name}</h4>
          <p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0;">${h.area}, ${h.city}</p>
          <div style="font-size: 11px; color: #cbd5e1; border-top: 1px solid #334155; padding-top: 6px; line-height: 1.5;">
            <div>💥 Collisions: <b>${h.accidents}</b> (${h.fatalities} fatal)</div>
            <div>🚗 Congestion: <b>${h.avg_congestion}/10</b></div>
            <div>⚠️ Primary Cause: <span style="color: #f59e0b;">${h.dominant_cause}</span></div>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent);
      circle.on('click', () => {
        setSelectedHotspot(h);
      });

      markersGroupRef.current.addLayer(circle);
    });

    // Render individual incident pins if layer active or 'all'
    if (activeLayer === 'incidents' || activeLayer === 'all') {
      const sampleIncidents = mapData.incidents.slice(0, 80);
      sampleIncidents.forEach((inc: any) => {
        const pinColor = inc.severity === 'Fatal' ? '#ef4444' :
                         inc.severity === 'Severe' ? '#f59e0b' : '#38bdf8';

        const dot = leaflet.circleMarker([inc.lat, inc.lon], {
          radius: inc.severity === 'Fatal' ? 6 : 4,
          color: '#ffffff',
          weight: 1,
          fillColor: pinColor,
          fillOpacity: 0.85
        });

        dot.bindTooltip(`<b>${inc.severity} Collision</b><br/>${inc.road_name}<br/>${inc.cause}`, {
          direction: 'top',
          className: 'glass-panel'
        });

        dot.on('click', () => {
          setInspectedIncident(inc);
        });

        markersGroupRef.current.addLayer(dot);
      });
    }
  }, [mapData, activeLayer, filters.city]);

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Geospatial Corridor Risk & Hazard Mapping
            </h2>
            <p className="text-xs text-slate-400">
              Interactive GIS telemetry overlays calibrated to 0–100 composite road danger indices
            </p>
          </div>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5" /> Layer:
          </span>
          <button
            id="map-layer-all"
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeLayer === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Corridors & Pins
          </button>
          <button
            id="map-layer-critical"
            onClick={() => setActiveLayer('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeLayer === 'critical'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical Zones (&gt;70)
          </button>
          <button
            id="map-layer-incidents"
            onClick={() => setActiveLayer('incidents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeLayer === 'incidents'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Collisions Overlay
          </button>
        </div>
      </div>

      {/* Main Map + Side Corridor Ranking Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Leaflet Map Container */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-800 relative h-[620px] bg-slate-950 shadow-2xl">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Floating Legend */}
          <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-md text-xs space-y-1.5 shadow-xl pointer-events-auto">
            <p className="font-bold text-[11px] text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              Risk Index Classification
            </p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              <span className="text-slate-300 font-semibold">Critical Risk (80–100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">High Risk (65–79)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Moderate (50–64)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Low / Managed (&lt;50)</span>
            </div>
          </div>

          {/* Map Top-Right Active City Badge */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md text-xs font-mono text-cyan-300 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Target: {filters.city === 'All' ? 'All Monitored Metros' : filters.city}</span>
          </div>
        </div>

        {/* Side Panel: Top Corridors in View & Inspector */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              Top Hazardous Corridors
            </h3>

            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
              {mapData?.hotspots?.slice(0, 6).map((h: Hotspot) => (
                <div
                  key={h.road_name}
                  onClick={() => {
                    setSelectedHotspot(h);
                    if (leafletMapRef.current) {
                      leafletMapRef.current.flyTo([h.latitude, h.longitude], 14, { duration: 1.2 });
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between gap-2"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-200 truncate">{h.road_name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{h.area}, {h.city}</p>
                  </div>
                  <RiskBadge level={h.risk_level} score={h.risk_score} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Inspected Incident Details or Info */}
          {inspectedIncident ? (
            <div className="glass-card rounded-2xl p-4 border border-cyan-500/30 bg-slate-900/90 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  RECORD #{inspectedIncident.record_id}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  inspectedIncident.severity === 'Fatal' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {inspectedIncident.severity}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{inspectedIncident.road_name}</h4>
              <div className="text-[11px] text-slate-300 space-y-1">
                <p>⚠️ <b>Cause:</b> {inspectedIncident.cause}</p>
                <p>🚗 <b>Vehicle:</b> {inspectedIncident.vehicle_type}</p>
                <p>🌧️ <b>Weather:</b> {inspectedIncident.weather}</p>
                <p>⚡ <b>Flow Speed:</b> {inspectedIncident.speed} km/h</p>
                <p>🕒 <b>Time:</b> {inspectedIncident.time}</p>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 text-center space-y-2">
              <Info className="w-5 h-5 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-300 font-semibold">Interactive Hotspot Telemetry</p>
              <p className="text-[11px] text-slate-400">
                Click any circle on the GIS map to zoom into the road geometry and inspect accident drivers.
              </p>
            </div>
          )}
        </div>
      </div>

      <HotspotModal hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />
    </div>
  );
};
