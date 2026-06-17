/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Globe, Plus, Minus } from "lucide-react";

interface InteractiveMapProps {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  condition: string;
  unit: "metric" | "imperial";
  themeConfig: any;
  isDarkMode: boolean;
}

export function InteractiveMap({
  city,
  country,
  lat,
  lon,
  temp,
  condition,
  unit,
  themeConfig,
  isDarkMode,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markerInstanceRef = useRef<maplibregl.Marker | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  // Helper to construct a fully standardized MapLibre Style specification using custom raster tile sources
  const getMaplibreStyle = (satellite: boolean, darkMode: boolean): maplibregl.StyleSpecification => {
    let tileUrl = "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
    if (satellite) {
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}";
    }

    return {
      version: 8,
      sources: {
        "raster-tiles": {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: "© OpenStreetMap © CARTO © Esri",
        },
      },
      layers: [
        {
          id: "raster-layer",
          type: "raster",
          source: "raster-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  };

  // Initialize MapLibre map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Remove any pre-existing map element to prevent node duplication
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMaplibreStyle(isSatellite, isDarkMode),
      center: [lon, lat], // [longitude, latitude] for MapLibre
      zoom: 9,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run compile on mounting

  // Dynamically switch MapLibre style configurations when user switches theme or activates Satellite Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setStyle(getMaplibreStyle(isSatellite, isDarkMode));
  }, [isSatellite, isDarkMode]);

  // Handle flyTo rendering coordinates and dynamically generate Apple-style custom micro-pinned components
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const performMapActions = () => {
      // Smoothly zoom/fly to coordinate position
      map.flyTo({
        center: [lon, lat],
        zoom: 9,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });

      // Clear preceding marker
      if (markerInstanceRef.current) {
        markerInstanceRef.current.remove();
      }

      // Generate fully responsive custom styling for Marker
      const formattedTemp = `${temp}°${unit === "metric" ? "C" : "F"}`;
      const markerHtml = `
        <div class="relative flex flex-col items-center select-none cursor-pointer group">
          <!-- Floating Weather Glassmorphic Bubble -->
          <div class="px-3 py-1.5 rounded-2xl bg-slate-950/95 backdrop-blur text-white text-xs font-mono font-bold border border-white/20 shadow-2xl flex items-center space-x-1.5 whitespace-nowrap animate-bounce leading-none transition-transform hover:scale-110">
            <span class="text-[10px] text-sky-400 capitalize font-sans font-semibold">${condition}</span>
            <span class="text-white/30">|</span>
            <span class="text-emerald-400">${formattedTemp}</span>
          </div>
          <!-- Pin stem indicator -->
          <div class="w-1.5 h-3 bg-slate-950 border-r border-b border-white/10 -mt-1 transform rotate-45 shadow-lg"></div>
          <!-- Outer radar animation pulse -->
          <div class="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white absolute -bottom-1 left-[calc(50%-7px)] shadow animate-ping opacity-40"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white absolute -bottom-1 left-[calc(50%-7px)] shadow"></div>
        </div>
      `;

      // Instantiate HTML node container for Custom MapLibre Marker
      const el = document.createElement("div");
      el.className = "custom-weather-pin";
      el.innerHTML = markerHtml;

      const popupHtml = `
        <div class="p-2 space-y-1.5 text-slate-100 rounded-lg bg-slate-900 border border-slate-700/50 shadow-xl max-w-[200px]">
          <div class="font-sans font-bold border-b border-white/10 pb-1 text-white text-xs">${city}, ${country}</div>
          <div class="font-mono text-[10px] space-y-0.5 text-slate-300">
            <div>Coordinates: <strong class="text-sky-300">${lat.toFixed(4)}, ${lon.toFixed(4)}</strong></div>
            <div class="text-[9px] text-emerald-400 uppercase tracking-widest mt-1">Live active report</div>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        className: "custom-mapbox-popup",
      }).setHTML(popupHtml);

      const newMarker = new maplibregl.Marker({ element: el })
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(map);

      markerInstanceRef.current = newMarker;

      // Display the location details immediately
      popup.addTo(map);
    };

    // Only configure marker coordinates after style changes have loaded
    if (map.isStyleLoaded()) {
      performMapActions();
    } else {
      map.once("style.load", performMapActions);
    }

    // Adapt sizing logic on container ref recalculations
    const timer = setTimeout(() => {
      map.resize();
    }, 400);

    return () => clearTimeout(timer);
  }, [lat, lon, temp, condition, unit, city, country]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <motion.section
      id="interactive-weather-map"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`p-6 rounded-[32px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.glow} space-y-4`}
    >
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-emerald-500 animate-pulse" />
          <h3 className={`text-xs uppercase font-semibold font-mono tracking-widest ${themeConfig.textPrimary}`}>
            Interactive Weather Radar Map
          </h3>
        </div>

        {/* View Mode controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsSatellite(!isSatellite)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all border cursor-pointer hover:bg-white/10 ${
              isSatellite
                ? "bg-sky-500/20 text-sky-400 border-sky-400/30"
                : "bg-white/5 text-slate-400 border-white/5"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isSatellite ? "Satellite map: active" : "Map layers"}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Frame */}
      <div className="relative w-full h-[520px] rounded-[28px] overflow-hidden border border-white/5 shadow-inner">
        {/* Mapbox/MapLibre container */}
        <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#f8fafc]" />

        {/* Customized Floated Controls (Apple Styling) */}
        <div className="absolute right-4 top-4 flex flex-col items-end space-y-2 z-[1000] select-none">
          <div className="w-9 h-18 bg-[#090b11]/85 backdrop-blur-md text-white rounded-xl border border-white/15 overflow-hidden flex flex-col shadow-2xl">
            <div
              onClick={handleZoomIn}
              role="button"
              className="w-9 h-9 flex items-center justify-center hover:bg-white/15 active:scale-90 transition border-b border-white/10 cursor-pointer p-0 m-0"
              title="Zoom In"
            >
              <Plus className="w-4 h-4 text-white/90" />
            </div>
            <div
              onClick={handleZoomOut}
              role="button"
              className="w-9 h-9 flex items-center justify-center hover:bg-white/15 active:scale-90 transition cursor-pointer p-0 m-0"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4 text-white/90" />
            </div>
          </div>

          <div className="bg-[#090b11]/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15 text-[9px] font-mono tracking-wider text-white/90 font-bold max-w-[140px] text-center shadow-2xl">
            Lat: {lat.toFixed(3)}°<br />
            Lon: {lon.toFixed(3)}°
          </div>
        </div>

        {/* Dynamic Watermark Indicator */}
        <div className="absolute left-4 bottom-4 z-[1000] bg-slate-950/80 backdrop-blur border border-white/10 pointer-events-none px-3 py-1 rounded-full text-[8px] font-mono uppercase tracking-widest text-[#60A5FA]">
          WeatherSphere Sat Radar 
        </div>
      </div>
    </motion.section>
  );
}
