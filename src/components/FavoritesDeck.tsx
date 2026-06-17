/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FavoriteCity } from "../types";
import { formatTemp, getWeatherIcon } from "../utils";
import { Star, Pin, Trash2, MapPin, Heart } from "lucide-react";

interface FavoritesDeckProps {
  favorites: FavoriteCity[];
  onSelectCity: (city: string, lat: number, lon: number) => void;
  onRemoveFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  unit: "metric" | "imperial";
  themeConfig: any;
}

export function FavoritesDeck({
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onTogglePin,
  unit,
  themeConfig,
}: FavoritesDeckProps) {
  return (
    <section id="favorites-deck" className="space-y-4">
      <div className="flex items-center space-x-2 px-1 select-none">
        <Heart className="w-4 h-4 text-rose-500" />
        <h3 className={`text-xs uppercase font-bold font-sans tracking-wider ${themeConfig.textPrimary}`}>
          SAVED LOCATIONS
        </h3>
      </div>

      {favorites.length === 0 ? (
        <div className={`p-8 rounded-[28px] border text-center font-sans text-xs ${themeConfig.cardBg} ${themeConfig.cardBorder}`}>
          <MapPin className="w-8 h-8 mx-auto text-slate-400 mb-2 stroke-[1.2] opacity-60" />
          <p className="text-slate-500 dark:text-slate-400 font-sans font-semibold">No saved locations</p>
          <p className="opacity-60 text-[10px] mt-1 font-sans">Use the pin button on searched cities to book them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <AnimatePresence initial={false}>
            {favorites.map((fav) => {
              const FavIcon = fav.condition ? getWeatherIcon(fav.condition) : Star;
              return (
                <motion.div
                  key={fav.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -3 }}
                  className={`p-5 rounded-[24px] border flex flex-col justify-between h-40 cursor-pointer shadow-md select-none group relative overflow-hidden transition-all ${
                    fav.isPinned 
                      ? `${themeConfig.cardBg} border-sky-500 dark:border-sky-450 ring-2 ring-sky-500/15` 
                      : `${themeConfig.cardBg} ${themeConfig.cardBorder}`
                  }`}
                  onClick={() => onSelectCity(fav.city, fav.lat, fav.lon)}
                >
                  {/* Decorative background halo */}
                  <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-[#3b82f6]/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Top card bar */}
                  <div className="flex items-start justify-between gap-3 relative z-10 w-full">
                    <div className="space-y-0.5 min-w-0 flex-1 text-left">
                      <div className={`text-sm font-bold font-sans tracking-tight flex items-center gap-1.5 truncate ${themeConfig.textPrimary}`}>
                        {fav.city}
                        {fav.isPinned && (
                          <Pin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300 rotate-45 animate-pulse shrink-0" />
                        )}
                      </div>
                      <div className={`text-[10px] font-sans font-semibold tracking-wide uppercase truncate ${themeConfig.textSecondary} opacity-80`}>
                        {fav.country}
                      </div>
                    </div>

                    {/* Controller icons on card hover */}
                    <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onTogglePin(fav.id)}
                        className={`p-1.5 rounded-full border transition active:scale-90 cursor-pointer shrink-0 ${
                          fav.isPinned
                            ? "text-sky-600 dark:text-sky-300 border-sky-500/30 bg-sky-500/15"
                            : `${themeConfig.textSecondary} border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 bg-black/5 dark:bg-white/5 hover:text-slate-900 dark:hover:text-white`
                        }`}
                        title={fav.isPinned ? "Unpin city" : "Pin city on top"}
                      >
                        <Pin className="w-3.5 h-3.5 rotate-45" />
                      </button>
                      <button
                        onClick={() => onRemoveFavorite(fav.id)}
                        className={`p-1.5 rounded-full border border-slate-300 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-rose-500/30 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-450 active:scale-90 transition cursor-pointer shrink-0 ${themeConfig.textSecondary}`}
                        title="Remove Favorite"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Atmospheric quick visual preview */}
                  {fav.temp !== undefined ? (
                    <div className="flex items-end justify-between mt-4 relative z-10 w-full">
                      <div className="flex items-center space-x-2 min-w-0">
                        <FavIcon className="w-8 h-8 text-sky-600 dark:text-sky-300 stroke-[1.25] shrink-0" />
                        <span className={`text-[11px] font-sans font-semibold tracking-wide capitalize truncate ${themeConfig.textSecondary}`}>
                          {fav.condition}
                        </span>
                      </div>
                      <div className={`text-2xl font-light font-sans tracking-tight leading-none shrink-0 ${themeConfig.textPrimary}`}>
                        {formatTemp(fav.temp, unit)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-[10px] font-sans text-slate-400/60 uppercase italic">
                      <span>Syncing weather...</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
