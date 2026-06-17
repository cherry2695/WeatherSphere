/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { WeatherData } from "../types";
import { formatTemp, getWeatherIcon, getThemeConfig } from "../utils";
import { Calendar, MapPin, Sparkles, Navigation } from "lucide-react";

interface WeatherHeroProps {
  data: WeatherData;
  unit: "metric" | "imperial";
  themeConfig: any;
  onPinFavorite: () => void;
  isFavorited: boolean;
}

export function WeatherHero({
  data,
  unit,
  themeConfig,
  onPinFavorite,
  isFavorited,
}: WeatherHeroProps) {
  const IconComponent = getWeatherIcon(data.condition);
  const isDarkCard = themeConfig.textPrimary === "text-white" || themeConfig.textPrimary === "text-[#ffffff]";

  // Dynamic Island style content based on weather state
  const getDynamicIslandMessage = () => {
    if (data.condition === "Thunderstorm") {
      return "Severe Lightning Alert: Outdoor operations restricted.";
    }
    if (data.condition === "Rain") {
      return "Active Precipitation: Ambient high-humidity cooling.";
    }
    if (data.uvIndex >= 8) {
      return "Extreme UV Alert: Dynamic Atmosphere sunscreen advised.";
    }
    if (data.airQuality.aqi >= 4) {
      return "Suboptimal AQI Alert: Protect airways.";
    }
    return "Atmosphere Clear: Pristine meteorological conditions.";
  };

  return (
    <motion.section
      id="weather-hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative w-full rounded-[36px] overflow-hidden p-6 md:p-10 border transition-all duration-700 ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.glow} ${themeConfig.textPrimary}`}
    >
      {/* Background soft ambient halo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic Island Pill (Apple Dynamic Island Design Language) */}
      <div className="flex justify-center mb-6">
        <motion.div
          id="apple-dynamic-island"
          initial={{ width: 140, height: 32 }}
          animate={{ width: "auto", height: "auto" }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-[#090b11] dark:bg-black/95 text-white flex items-center px-4 py-2 rounded-full border border-white/10 shadow-2xl pointer-events-auto cursor-default space-x-2 text-[11px] font-sans tracking-wide max-w-full"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span className={`font-bold shrink-0 uppercase text-xs ${data.condition === "Thunderstorm" || data.condition === "Rain" ? "text-amber-400" : "text-sky-400"}`}>
            {data.condition}
          </span>
          <span className="text-white/35">|</span>
          <span className="text-white/85 line-clamp-1 text-left select-none">{getDynamicIslandMessage()}</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Geographic location and big temperature */}
        <div className="text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3.5 md:space-y-0 md:space-x-8 justify-center md:justify-start">
            <div className="inline-flex items-center space-x-3 opacity-95 mx-auto md:mx-0">
              <MapPin className="w-6 h-6 text-rose-500 shrink-0" />
              <span className={`text-[24px] md:text-3xl font-sans font-semibold tracking-tight ${themeConfig.textPrimary}`}>
                {data.city}, {data.country}
              </span>
            </div>
            
            <button
              id="favorite-pin-btn"
              onClick={onPinFavorite}
              className={`inline-flex items-center self-center px-4 py-2 ml-0 md:ml-3 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                isFavorited
                  ? isDarkCard
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/30"
                    : "bg-amber-500/15 text-amber-700 border-amber-500/30 font-extrabold"
                  : isDarkCard
                    ? "bg-white/10 text-slate-200 border-white/10 hover:bg-white/15 hover:text-white"
                    : "bg-black/5 text-slate-800 border-slate-300 hover:bg-black/10 hover:text-slate-950 hover:border-slate-400"
              }`}
            >
              {isFavorited ? "★ Saved Location" : "☆ Save Location"}
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            <h1 className={`text-[10px] font-bold uppercase tracking-widest block leading-none select-none font-sans ${isDarkCard ? "text-sky-400" : "text-sky-600 font-extrabold"}`}>
              CURRENT CONDITIONS
            </h1>
            <div className="flex items-baseline justify-center md:justify-start select-none">
              <span className={`text-8xl md:text-[112px] font-sans font-light tracking-tighter block leading-none antialiased ${themeConfig.textPrimary}`}>
                {formatTemp(data.temp, unit).replace(/[A-Z]/g, "")}
              </span>
              <span className={`text-4xl md:text-5xl font-light font-sans tracking-wide leading-none select-none pl-1 ${themeConfig.textSecondary}`}>
                {unit === "metric" ? "°C" : "°F"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-4 text-sm md:text-base font-sans tracking-wide select-none">
            <span className={themeConfig.textSecondary}>
              High <strong className={`font-mono font-medium ${themeConfig.textPrimary}`}>{formatTemp(data.tempMax, unit)}</strong>
            </span>
            <span className="opacity-40">|</span>
            <span className={themeConfig.textSecondary}>
              Low <strong className={`font-mono font-medium ${themeConfig.textPrimary}`}>{formatTemp(data.tempMin, unit)}</strong>
            </span>
            <span className="opacity-40">|</span>
            <span className={themeConfig.textSecondary}>
              Feels like <strong className={`font-mono font-medium ${themeConfig.textPrimary}`}>{formatTemp(data.feelsLike, unit)}</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
            <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border shadow-sm ${
              isDarkCard
                ? "bg-white/5 border-white/10 text-white/85"
                : "bg-black/5 border-slate-300 text-slate-800"
            }`}>
              <Calendar className={`w-4.5 h-4.5 ${isDarkCard ? "text-sky-400" : "text-sky-600"}`} />
              <span>{data.currentDate}</span>
            </span>
          </div>
        </div>

        {/* Visual weather state overlay & AI Meteorological summary */}
        <div className="flex flex-col items-center md:items-end justify-center text-center md:text-right space-y-6">
          <div className="flex flex-col items-center md:items-end select-none">
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <IconComponent className={`w-24 h-24 stroke-[1.25] filter drop-shadow-xl ${themeConfig.textPrimary}`} />
              <div className="absolute -inset-1 blur-md bg-blue-400 opacity-20 pointer-events-none rounded-full" />
            </motion.div>
            <h2 className={`text-2xl font-light font-display tracking-tight mt-3 capitalize ${themeConfig.textPrimary}`}>
              {data.description}
            </h2>
          </div>

          {/* AI Intelligence Advisory Briefing box */}
          <div className={`p-5 rounded-[24px] w-full max-w-sm border backdrop-blur-md relative overflow-hidden text-left shadow-xl space-y-2.5 ${
            themeConfig.cardBg
          } ${themeConfig.cardBorder}`}>
            <div className="absolute -right-3 -bottom-3 opacity-15 pointer-events-none animate-pulse">
              <Sparkles className="w-16 h-16 text-yellow-400" />
            </div>
            
            <div className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest ${
              isDarkCard ? "text-sky-400" : "text-sky-600 font-extrabold"
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
              <span>AI WEATHER BRIEFING</span>
            </div>
            <p className={`text-xs leading-relaxed font-sans tracking-wide font-medium ${themeConfig.textSecondary}`}>
              {data.aiBriefing || "Analyzing satellite and atmospheric models..."}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
