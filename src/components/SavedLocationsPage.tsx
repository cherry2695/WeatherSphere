/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FavoriteCity } from "../types";
import { formatTemp, getWeatherIcon, getThemeConfig } from "../utils";
import { 
  Heart, 
  Pin, 
  Trash2, 
  Compass, 
  CloudSnow, 
  Droplets, 
  Wind, 
  Search, 
  ExternalLink,
  MapPin,
  Sparkles
} from "lucide-react";

interface SavedLocationsPageProps {
  key?: string;
  favorites: FavoriteCity[];
  onSelectCity: (city: string, lat: number, lon: number) => void;
  onRemoveFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  unit: "metric" | "imperial";
  isDarkMode: boolean;
  onGoToDashboard: () => void;
}

export function SavedLocationsPage({
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onTogglePin,
  unit,
  isDarkMode,
  onGoToDashboard,
}: SavedLocationsPageProps) {
  
  // Sort pinned cities first, then recently added (by id descending or simply array order)
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // For tie breakers, keep original or by ID if possible
    return b.id.localeCompare(a.id);
  });

  const handleCardClick = (city: string, lat: number, lon: number) => {
    onSelectCity(city, lat, lon);
    onGoToDashboard();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 min-h-[500px]"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            Saved Locations Library
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
            Manage your personal global climate directory. Tap on any city to inspect detailed micro-climates.
          </p>
        </div>

        <button
          onClick={onGoToDashboard}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-sans font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md active:scale-95 cursor-pointer max-w-max"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Back to Weather Station</span>
        </button>
      </div>

      {sortedFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-slate-400 dark:text-slate-500 stroke-[1.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No saved locations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pin your favorite travel destinations, local municipalities, and overseas regions to monitor them here.
            </p>
          </div>
          <button
            onClick={onGoToDashboard}
            className="px-4 py-2 rounded-xl border border-blue-500/30 text-blue-500 hover:bg-blue-500/5 text-xs font-sans font-bold transition active:scale-95 cursor-pointer"
          >
            Explore Cities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {sortedFavorites.map((fav) => {
              const condition = fav.condition || "Sunny";
              const cardTheme = getThemeConfig(condition, isDarkMode);
              const FavIcon = getWeatherIcon(condition);

              return (
                <motion.div
                  key={fav.id}
                  layoutId={`fav-card-${fav.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => handleCardClick(fav.city, fav.lat, fav.lon)}
                  className={`relative p-6 rounded-[28px] border cursor-pointer select-none overflow-hidden transition-shadow shadow-lg group flex flex-col justify-between h-52 bg-gradient-to-br ${
                    isDarkMode 
                      ? "from-slate-900/60 to-slate-900/40 border-white/10 hover:shadow-sky-500/5 hover:border-white/20" 
                      : "from-white to-slate-50/50 border-slate-200 hover:shadow-slate-300/45 hover:border-slate-300"
                  } ${fav.isPinned ? "ring-2 ring-sky-500/40" : ""}`}
                >
                  {/* Atmospheric background aura */}
                  <div className={`absolute -right-16 -bottom-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20 ${
                    condition === "Sunny" ? "bg-amber-400" :
                    condition === "Cloudy" ? "bg-slate-400" :
                    condition === "Rain" ? "bg-blue-500" :
                    condition === "Snow" ? "bg-sky-200" :
                    condition === "Thunderstorm" ? "bg-purple-500" :
                    condition === "Mist" ? "bg-teal-300" : "bg-sky-400"
                  }`} />

                  {/* Top Bar */}
                  <div className="flex items-start justify-between w-full relative z-10">
                    <div className="space-y-1 text-left min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold font-display tracking-tight flex items-center gap-1.5 truncate ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                          {fav.city}
                        </span>
                        {fav.isPinned && (
                          <Pin className="w-3.5 h-3.5 text-sky-500 rotate-45 shrink-0" />
                        )}
                      </div>
                      <p className={`text-[10px] font-sans font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {fav.country}
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div 
                      className="flex items-center space-x-1.5 shrink-0 relative z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onTogglePin(fav.id)}
                        className={`p-2 rounded-full border transition active:scale-90 cursor-pointer ${
                          fav.isPinned
                            ? "text-sky-500 border-sky-500/20 bg-sky-500/10"
                            : "text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-700 dark:hover:text-white"
                        }`}
                        title={fav.isPinned ? "Unpin Location" : "Pin Location"}
                      >
                        <Pin className="w-3.5 h-3.5 rotate-45" />
                      </button>
                      
                      <button
                        onClick={() => onRemoveFavorite(fav.id)}
                        className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition active:scale-90 cursor-pointer"
                        title="Remove Location"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Stats Row */}
                  <div className="flex items-end justify-between w-full relative z-10 pt-4">
                    {/* Condition details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <FavIcon className={`w-10 h-10 stroke-[1.25] ${
                          condition === "Sunny" ? "text-amber-500" :
                          condition === "Rain" ? "text-blue-500" :
                          condition === "Snow" ? "text-sky-400" :
                          condition === "Thunderstorm" ? "text-purple-500" : "text-sky-400"
                        }`} />
                        <div>
                          <div className={`text-xs font-sans font-bold tracking-tight capitalize ${
                            isDarkMode ? "text-slate-200" : "text-slate-800"
                          }`}>
                            {fav.condition || "Sunny"}
                          </div>
                          <div className={`text-[10px] font-sans font-semibold opacity-75 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                            Lat: {fav.lat.toFixed(2)} | Lon: {fav.lon.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Numeric Temperature Block */}
                    <div className="text-right flex flex-col justify-end">
                      <div className={`text-4xl font-light font-display tracking-tight leading-none ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                        {fav.temp !== undefined ? formatTemp(fav.temp, unit) : "—"}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider font-bold text-sky-500 hover:underline mt-1 flex items-center justify-end gap-1 select-none">
                        <span>Details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
