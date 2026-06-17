/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { WeatherData } from "../types";
import { formatTemp, formatWind, formatVisibility } from "../utils";
import {
  Compass,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunset,
  Sunrise,
  Wind,
  Cloudy,
  Activity,
} from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData;
  unit: "metric" | "imperial";
  themeConfig: any;
}

export function CurrentWeather({ data, unit, themeConfig }: CurrentWeatherProps) {
  // UV Index description mapping
  const getUVStatus = (uv: number) => {
    if (uv <= 2) return { text: "Low", desc: "No protection required." };
    if (uv <= 5) return { text: "Moderate", desc: "Wear sunscreen & shades." };
    if (uv <= 7) return { text: "High", desc: "Cover up and avoid noon sun." };
    return { text: "Very High", desc: "Unprotected skin will burn quickly." };
  };

  const getVisibilityStatus = (vis: number) => {
    if (vis >= 10) return "Excellent perfect sight.";
    if (vis >= 6) return "Good visibility line.";
    if (vis >= 3) return "Moderate mist / fog haze.";
    return "Poor visual thickness.";
  };

  const uvInfo = getUVStatus(data.uvIndex);

  // Widget animations setup
  const widgetVariants = {
    hover: { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.25, ease: "easeOut" } 
    }
  };

  return (
    <section id="weather-highlights" className="space-y-4">
      <div className="flex items-center space-x-2 px-1 select-none">
        <Activity className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        <h3 className={`text-xs uppercase font-bold font-sans tracking-wider ${themeConfig.textPrimary}`}>
          WEATHER DETAILS
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* UV Index Widget */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between h-44 cursor-default relative overflow-hidden`}
        >
          <div className="flex items-center justify-between opacity-90">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              UV index
            </span>
            <span className={`text-xs font-mono font-bold ${themeConfig.textPrimary}`}>{data.uvIndex}</span>
          </div>

          <div className="space-y-1">
            <div className={`text-2xl font-light font-sans tracking-wide ${themeConfig.textPrimary}`}>
              {uvInfo.text}
            </div>
            {/* Colored UV bar */}
            <div className="relative w-full h-1 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 rounded-full"
                style={{ width: "100%" }}
              />
              <div
                className="absolute h-2.5 w-2.5 rounded-full bg-white border border-slate-900 -top-0.5"
                style={{ left: `${Math.min(100, (data.uvIndex / 11) * 100)}%` }}
              />
            </div>
          </div>

          <div className={`text-[10px] leading-relaxed font-sans font-medium ${themeConfig.textSecondary} opacity-90`}>
            {uvInfo.desc}
          </div>
        </motion.div>

        {/* Wind Widget */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between h-44 cursor-default`}
        >
          <div className="flex items-center opacity-90 justify-between">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Wind className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Wind Speed
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className={`text-3xl font-light font-sans tracking-tight leading-none ${themeConfig.textPrimary}`}>
                {formatWind(data.windSpeed, unit).replace(/[a-z]/ig, "").trim()}
              </div>
              <span className={`text-[10px] font-sans tracking-wider uppercase font-semibold ${themeConfig.textSecondary} opacity-80`}>
                {unit === "metric" ? "m/s Beaufort" : "mph Speed"}
              </span>
            </div>

            {/* Compass element */}
            <div className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center relative bg-slate-100/60 dark:bg-white/5 shadow-inner">
              <span className={`text-[8px] absolute top-0.5 font-sans font-bold ${themeConfig.textPrimary}`}>N</span>
              <Compass className="w-5 h-5 text-sky-500 dark:text-sky-400 stroke-[1.2]" />
            </div>
          </div>

          <div className={`text-[10px] uppercase font-sans tracking-wide flex justify-between select-none font-semibold ${themeConfig.textSecondary} opacity-90`}>
            <span>Gust Limits: <strong className={`font-mono ${themeConfig.textPrimary}`}>{formatWind(data.windSpeed * 1.25, unit)}</strong></span>
          </div>
        </motion.div>

        {/* Humidity & Dew Point Widget */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between h-44 cursor-default`}
        >
          <div className="flex items-center opacity-90 justify-between">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Droplets className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Humidity
            </span>
            <span className={`text-xs font-mono font-bold ${themeConfig.textPrimary}`}>{data.humidity}%</span>
          </div>

          <div className="space-y-1">
            <div className={`text-2xl font-light font-sans tracking-tight leading-none ${themeConfig.textPrimary}`}>
              {data.humidity}% Relative
            </div>
            {/* Gauge progress bar */}
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${data.humidity}%` }} />
            </div>
          </div>

          <div className={`text-[10px] leading-relaxed font-sans ${themeConfig.textSecondary} font-medium opacity-95`}>
            Dew point is calculated at ≈ <strong className={`font-mono ${themeConfig.textPrimary}`}>{formatTemp(data.dewPoint, unit)}</strong>.
          </div>
        </motion.div>

        {/* Air Pressure Widget */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between h-44 cursor-default`}
        >
          <div className="flex items-center opacity-90 justify-between">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Gauge className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              Pressure
            </span>
          </div>

          <div className="space-y-1 border-none bg-transparent">
            <div className={`text-3xl font-light font-sans tracking-tight leading-none ${themeConfig.textPrimary}`}>
              <span className="font-mono">{data.pressure}</span> hPa
            </div>
            <span className={`text-[10px] font-sans tracking-wider uppercase font-semibold ${themeConfig.textSecondary} opacity-80`}>
              {data.pressure > 1013 ? "High Pressure System" : "Low Cyclonic System"}
            </span>
          </div>

          <div className={`text-[10px] leading-relaxed font-sans ${themeConfig.textSecondary} font-medium opacity-90`}>
            Atmospheric density is stable.
          </div>
        </motion.div>

        {/* Visibility Widget */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between h-44 cursor-default`}
        >
          <div className="flex items-center opacity-90 justify-between">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Eye className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              Visibility
            </span>
          </div>

          <div className="space-y-1">
            <div className={`text-3xl font-light font-sans tracking-tight leading-none ${themeConfig.textPrimary}`}>
              {formatVisibility(data.visibility, unit)}
            </div>
            <span className={`text-[10px] font-sans tracking-wider uppercase font-semibold ${themeConfig.textSecondary} opacity-80`}>
              Clean air distance index
            </span>
          </div>

          <div className={`text-[10px] leading-relaxed font-sans ${themeConfig.textSecondary} font-semibold opacity-95`}>
            {getVisibilityStatus(data.visibility)}
          </div>
        </motion.div>

        {/* Sunrise / Sunset Sun Track Widget (Apple Solar Arc layout) */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between h-44 cursor-default`}
        >
          <div className="flex items-center opacity-90 justify-between">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Sunrise className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              SUNRISE & SUNSET
            </span>
          </div>

          <div className={`flex items-center justify-between text-xs font-sans ${themeConfig.textSecondary}`}>
            <div className="flex items-center space-x-1.5">
              <Sunrise className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <div className="flex flex-col">
                <span className={`text-[9px] uppercase font-bold tracking-wider ${themeConfig.textSecondary} opacity-70`}>Sunrise</span>
                <span className={`font-mono text-[11px] font-semibold ${themeConfig.textPrimary}`}>{data.sunrise}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sunset className="w-4 h-4 text-orange-500 dark:text-orange-450" />
              <div className="flex flex-col">
                <span className={`text-[9px] uppercase font-bold tracking-wider ${themeConfig.textSecondary} opacity-70`}>Sunset</span>
                <span className={`font-mono text-[11px] font-semibold ${themeConfig.textPrimary}`}>{data.sunset}</span>
              </div>
            </div>
          </div>

          {/* Visual Day Solar Arc Simulation */}
          <div className="relative h-6 w-full mt-2">
            <svg viewBox="0 0 100 20" className="w-full h-full text-slate-300 dark:text-white/10">
              <path d="M5,18 C30,2 70,2 95,18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
              {/* Highlight active sun position */}
              <circle cx="50" cy="8" r="3" className="fill-amber-400 filter drop-shadow animate-pulse" />
              <circle cx="50" cy="8" r="3" className="fill-amber-400 filter drop-shadow" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
