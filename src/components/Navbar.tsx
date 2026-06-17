/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Navigation, Sun, Moon, Sparkles, RefreshCw, Layers, History, Trash2 } from "lucide-react";
import { toast } from "sonner";
import brandLogoImg from "../assets/images/weather_logo_1781356889108.jpg";

interface NavbarProps {
  onSearch: (city: string) => void;
  onGeolocation: () => void;
  onToggleUnit: () => void;
  unit: "metric" | "imperial";
  recentSearches: string[];
  onSelectRecent: (city: string) => void;
  onClearRecent: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isLoading: boolean;
  themeConfig: any;
}

export function Navbar({
  onSearch,
  onGeolocation,
  onToggleUnit,
  unit,
  recentSearches,
  onSelectRecent,
  onClearRecent,
  isDarkMode,
  onToggleTheme,
  isLoading,
  themeConfig,
}: NavbarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a valid city name.");
      return;
    }
    onSearch(query.trim());
    setQuery("");
  };

  const handleGeoTrigger = () => {
    toast.info("Acquiring localized micro-climate GPS coordinates...");
    onGeolocation();
  };

  return (
    <header className="space-y-6">
      {/* Front header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center space-x-3 select-none">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0 border border-slate-200/50 dark:border-white/10">
            <img 
              src={brandLogoImg} 
              alt="WeatherSphere Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className={`text-2xl font-bold font-display tracking-tight flex items-center gap-1.5 ${themeConfig.textPrimary}`}>
              WeatherSphere
            </h1>
            <p className={`text-[10px] uppercase font-sans tracking-widest font-bold opacity-80 ${themeConfig.textSecondary}`}>
              Real-Time Weather Intelligence
            </p>
          </div>
        </div>

        {/* Global Toolbar and Controls */}
        <div className="flex items-center space-x-2.5 select-none">
          {/* Geolocation trigger */}
          <button
            onClick={handleGeoTrigger}
            disabled={isLoading}
            className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer shadow-sm ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.textPrimary} hover:opacity-85`}
            title="Locate via GPS"
          >
            <Navigation className="w-4 h-4" />
          </button>

          {/* Unit Switcher Button toggle */}
          <button
            onClick={onToggleUnit}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border font-sans text-xs font-semibold cursor-pointer transition-all duration-200 shadow-sm ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.textPrimary} hover:opacity-85`}
            title="Switch temperature unit"
          >
            <span className={unit === "metric" ? "font-bold" : "opacity-40"}>°C</span>
            <span className="opacity-20">|</span>
            <span className={unit === "imperial" ? "font-bold" : "opacity-40"}>°F</span>
          </button>

          {/* Style Dark / Light switcher toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer shadow-sm ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.textPrimary} hover:opacity-85`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600 dark:text-sky-300" />}
          </button>
        </div>
      </div>

      {/* Main Search Input Panel */}
      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto w-full">
        <div className="relative flex items-center">
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Search city (e.g. Reykjavik, Bengaluru, Sydney)..."
            className={`w-full py-3.5 pl-12 pr-[110px] rounded-2xl border font-sans text-sm tracking-wide transition-all duration-300 shadow-md focus:outline-none ${
              isDarkMode 
                ? "bg-white/5 text-white border-white/10 focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 placeholder-white/40" 
                : "bg-white/80 text-slate-900 border-slate-300/80 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 placeholder-slate-500/70"
            }`}
          />
          <Search className={`absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none ${isDarkMode ? "text-white/40" : "text-slate-500/70"}`} />
          
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-sans font-bold transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
          </button>
        </div>
      </form>

      {/* Persistent search chips */}
      {recentSearches.length > 0 && (
        <div className="flex items-center space-x-2 select-none overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <div className={`flex items-center space-x-1 font-sans text-[10px] uppercase tracking-wider font-bold shrink-0 ${themeConfig.textPrimary} opacity-90`}>
            <History className="w-3.5 h-3.5" />
            <span>Recent:</span>
          </div>

          <div className="flex space-x-1.5 overflow-x-auto py-0.5">
            {recentSearches.map((city) => (
              <button
                key={city}
                onClick={() => onSelectRecent(city)}
                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-sans tracking-wide font-semibold active:scale-95 transition-all cursor-pointer border ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.textPrimary} hover:opacity-80`}
              >
                {city}
              </button>
            ))}
          </div>

          <span className={`shrink-0 text-xs ${isDarkMode ? "text-white/20" : "text-slate-400"}`}>|</span>

          <button
            onClick={onClearRecent}
            className={`text-[9px] uppercase font-sans tracking-widest font-bold flex items-center space-x-1 cursor-pointer shrink-0 transition-colors ${
              isDarkMode ? "text-rose-400/80 hover:text-rose-400" : "text-rose-600 hover:text-rose-800"
            }`}
            title="Clear history"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        </div>
      )}
    </header>
  );
}
