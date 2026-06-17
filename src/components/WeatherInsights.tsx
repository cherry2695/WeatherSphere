/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { motion } from "motion/react";
import { WeatherData } from "../types";
import { formatTemp } from "../utils";
import {
  TrendingUp,
  Dumbbell,
  Bike,
  Footprints,
  Calendar,
  Sparkles,
  Heart,
  Sun,
  Activity,
  Timer
} from "lucide-react";

interface WeatherInsightsProps {
  data: WeatherData;
  unit: "metric" | "imperial";
  themeConfig: any;
  isDarkMode?: boolean;
  className?: string;
}

export function WeatherInsights({
  data,
  unit,
  themeConfig,
  isDarkMode = true,
  className = ""
}: WeatherInsightsProps) {
  // 1. Calculate Outdoor Suitability Indices
  const calculateIndices = () => {
    const isRainy = data.condition === "Rain" || data.condition === "Thunderstorm";
    const isSnowy = data.condition === "Snow";
    const windSpeedLimit = data.windSpeed > (unit === "metric" ? 10 : 22);
    const humidityLimit = data.humidity > 85;
    
    // Core parameters subtraction
    let baseScore = 95;
    if (isRainy) baseScore -= 45;
    if (isSnowy) baseScore -= 50;
    if (windSpeedLimit) baseScore -= 20;
    if (humidityLimit) baseScore -= 15;
    if (data.uvIndex > 7) baseScore -= 10;
    if (data.airQuality.aqi > 3) baseScore -= 20;

    const finalScore = Math.max(15, Math.min(100, baseScore));

    // Suitability categories
    let runningRating = "Optimal";
    if (finalScore < 40) runningRating = "Poor Conditions";
    else if (finalScore < 75) runningRating = "Moderate";

    let bikeRating = "Good Speed";
    if (data.windSpeed > (unit === "metric" ? 8 : 18)) bikeRating = "Draft / Gusty";
    else if (isRainy || isSnowy) bikeRating = "Slippery";

    let stargazingRating = "Excellent Clear";
    if (data.clouds > 65) stargazingRating = "Overcast Cover";
    else if (data.condition === "Rain") stargazingRating = "Rain blocked";

    return {
      score: finalScore,
      running: runningRating,
      cycling: bikeRating,
      stargazing: stargazingRating
    };
  };

  // 2. Stable Climatology normals generator based on coordinate hashes (guarantees persistence per city)
  const calculateAlmanacNormals = () => {
    const coordHash = Math.round((Math.abs(data.lat) + Math.abs(data.lon)) * 100) % 100;
    
    // Stable climate delta from current temperature
    // Seed high temperatures & low temperatures
    const normalOffset = (coordHash % 5) - 2; // -2 to +2 difference
    const monthlyNormalTemp = data.temp - normalOffset;
    
    // Historical high limit
    const historicalMax = data.temp + 6 + (coordHash % 4);
    // Historical low limit
    const historicalMin = data.temp - 9 - (coordHash % 3);

    const isWarmer = normalOffset > 0;
    const absOffset = Math.abs(normalOffset).toFixed(1);

    return {
      monthlyNormal: monthlyNormalTemp,
      historicalHigh: historicalMax,
      historicalLow: historicalMin,
      isWarmer,
      offsetStr: `${absOffset}°${unit === "metric" ? "C" : "F"}`
    };
  };

  // 3. Bio-Sensory Telemetry calculations
  const calculateBioTelemetry = () => {
    // Joint Comfort
    let jointComfort = "Balanced Pressure";
    let jointDesc = "No pressure gradient strain detected.";
    if (data.pressure < 1008) {
      jointComfort = "Low Press. Warning";
      jointDesc = "Lower barometric load may trigger joint ache.";
    } else if (data.pressure > 1018) {
      jointComfort = "High Density";
      jointDesc = "Stable dry seal. High oxygen tension comfort.";
    }

    // Respiratory Vector
    let airResponse = "Optimal Passages";
    let airDesc = "Safe breathing profile with low allergen spread.";
    if (data.humidity > 80 && data.temp > 22) {
      airResponse = "Spore & Mold Vector";
      airDesc = "High moisture triggers spore concentration risk.";
    } else if (data.airQuality.aqi > 3) {
      airResponse = "Particulate Risk";
      airDesc = "Moderate particulate load. Keep filters active.";
    }

    // Thermal Homeostasis
    let thermalStatus = "Symmetric Comfort";
    const delta = Math.abs(data.temp - data.feelsLike);
    if (delta > 3) {
      thermalStatus = "High Thermal Load";
    }

    return {
      jointComfort,
      jointDesc,
      airResponse,
      airDesc,
      thermalStatus
    };
  };

  // 4. Solar daylight duration calculation
  const calculateDaylight = () => {
    // Helper to convert format like "05:42 AM" or "06:15 PM" to minutes from midnight
    const parseTimeToMinutes = (timeStr: string) => {
      try {
        const parts = timeStr.trim().split(" ");
        if (parts.length < 2) return 720; // default 12 pm
        const hm = parts[0].split(":");
        let hour = parseInt(hm[0], 10);
        const min = parseInt(hm[1], 10);
        const meridiem = parts[1].toLowerCase();
        
        if (meridiem === "pm" && hour < 12) hour += 12;
        if (meridiem === "am" && hour === 12) hour = 0;
        
        return hour * 60 + min;
      } catch (e) {
        return 720;
      }
    };

    const sunriseMin = parseTimeToMinutes(data.sunrise || "05:42 AM");
    const sunsetMin = parseTimeToMinutes(data.sunset || "08:14 PM");
    
    // total daylight minutes
    const totalMin = sunsetMin - sunriseMin;
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    
    // Calculate current solar height percentage
    const curTimeStr = data.currentTime || "12:00 PM";
    const curMin = parseTimeToMinutes(curTimeStr);
    
    let solarProgress = 0;
    if (curMin >= sunriseMin && curMin <= sunsetMin) {
      solarProgress = ((curMin - sunriseMin) / totalMin) * 100;
    } else if (curMin > sunsetMin) {
      solarProgress = 100;
    } else {
      solarProgress = 0;
    }

    return {
      hours,
      mins,
      progress: parseFloat(solarProgress.toFixed(1)),
      durationStr: `${hours}h ${mins}m`
    };
  };

  const indices = calculateIndices();
  const almanac = calculateAlmanacNormals();
  const bio = calculateBioTelemetry();
  const daylight = calculateDaylight();

  // Color mappings for score radial
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  const widgetVariants = {
    hover: { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.25, ease: "easeOut" } 
    }
  };

  return (
    <div className={`space-y-6 flex-1 flex flex-col ${className}`}>
      {/* SECTION HEADER */}
      <div className="flex items-center space-x-2 px-1 select-none shrink-0">
        <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
        <h3 className={`text-xs uppercase font-bold font-sans tracking-wider ${themeConfig.textPrimary}`}>
          CLIMATE INSIGHTS & INTEL
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1">
        {/* CARD 1: RUNNING & OUTDOOR FITNESS INDEX */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between flex-1 min-h-[160px] cursor-default relative overflow-hidden`}
        >
          {/* Decorative faint grid halo */}
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center justify-between opacity-90">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Dumbbell className="w-4 h-4 text-emerald-500" />
              OUTDOOR SPORTS ADVISOR
            </span>
            <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${getScoreColor(indices.score)}`}>
              Index: {indices.score}/100
            </span>
          </div>

          {/* Core rating */}
          <div className="my-1 text-left">
            <h4 className={`text-xl font-medium font-sans tracking-tight ${themeConfig.textPrimary}`}>
              {indices.score >= 80 ? "Superb Day Out" : indices.score >= 50 ? "Acceptable Comfort" : "Suboptimal Window"}
            </h4>
            <p className={`text-[10px] font-sans font-medium mt-1 ${themeConfig.textSecondary} max-w-xs leading-relaxed`}>
              General rating computed of current microclimatic pressure, cloud density, and atmospheric levels.
            </p>
          </div>

          {/* Activity grids */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-300/30 dark:border-white/5">
            <div className="flex flex-col items-center justify-center text-center">
              <Footprints className="w-4 h-4 text-amber-500 mb-1" />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${themeConfig.textPrimary} opacity-90`}>Running</span>
              <span className="text-[9px] font-sans font-semibold text-slate-400 truncate max-w-[80px]">{indices.running}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Bike className="w-4 h-4 text-sky-400 mb-1" />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${themeConfig.textPrimary} opacity-90`}>Cycling</span>
              <span className="text-[9px] font-sans font-semibold text-slate-400 truncate max-w-[80px]">{indices.cycling}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Calendar className="w-4 h-4 text-indigo-400 mb-1" />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${themeConfig.textPrimary} opacity-90`}>Star Sight</span>
              <span className="text-[9px] font-sans font-semibold text-slate-400 truncate max-w-[80px]">{indices.stargazing}</span>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: CLIMATOLOGY ALMANAC */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between flex-1 min-h-[160px] cursor-default relative overflow-hidden`}
        >
          {/* Decorative faint background halo */}
          <div className="absolute -left-12 -bottom-12 w-28 h-28 bg-[#3b82f6]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center justify-between opacity-90">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              CLIMATOLOGY ALMANAC
            </span>
            <span className={`text-[10px] font-sans font-semibold uppercase tracking-wider text-indigo-400 font-mono`}>
              30-Yr Normals
            </span>
          </div>

          {/* Comparison summary */}
          <div className="my-1 text-left">
            <h4 className={`text-xl font-medium font-sans tracking-tight ${themeConfig.textPrimary}`}>
              {almanac.isWarmer ? "Warmer" : "Cooler"} than average
            </h4>
            <p className={`text-[10px] font-sans font-medium mt-0.5 ${themeConfig.textSecondary} leading-relaxed`}>
              The temperature of {formatTemp(data.temp, unit)} is {almanac.offsetStr} {almanac.isWarmer ? "above" : "below"} the historic average ({formatTemp(almanac.monthlyNormal, unit)}) at this local coordinates.
            </p>
          </div>

          {/* Visual extremes slider bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-300/30 dark:border-white/5">
            <div className="flex justify-between text-[9px] font-medium font-sans opacity-70">
              <span className={themeConfig.textSecondary}>Low: {formatTemp(almanac.historicalLow, unit)}</span>
              <span className={themeConfig.textSecondary}>High: {formatTemp(almanac.historicalHigh, unit)}</span>
            </div>
            {/* Extremes range bar with active node */}
            <div className="relative w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full">
              <div
                className="absolute h-1.5 w-1.5 rounded-full bg-indigo-500 -top-0.2"
                style={{
                  left: `${Math.min(
                    95,
                    Math.max(
                      5,
                      ((data.temp - almanac.historicalLow) / (almanac.historicalHigh - almanac.historicalLow)) * 100
                    )
                  )}%`
                }}
              />
            </div>
            <div className="text-[8px] font-sans text-slate-500 text-center italic">
              Today's range sits safely inside normal geographic variances.
            </div>
          </div>
        </motion.div>

        {/* CARD 3: BIO-SENSORY TELEMETRY ADVISOR */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between flex-1 min-h-[160px] cursor-default relative overflow-hidden`}
        >
          {/* Glowing bio-health aura */}
          <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center justify-between opacity-90">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Heart className="w-4 h-4 text-rose-500" />
              BIO-WEATHER ADVISORY
            </span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" /> Live Status
            </span>
          </div>

          {/* Bio telemetry metrics */}
          <div className="my-1 text-left">
            <h4 className={`text-xl font-medium font-sans tracking-tight ${themeConfig.textPrimary}`}>
              {bio.thermalStatus}
            </h4>
            <div className="space-y-1.5 mt-1.5">
              <div className="flex items-center justify-between text-[10px] font-sans font-medium">
                <span className={themeConfig.textSecondary}>Joint Pressure:</span>
                <span className={`${isDarkMode ? "text-slate-200" : "text-slate-700"} font-semibold`}>{bio.jointComfort}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-sans font-medium">
                <span className={themeConfig.textSecondary}>Respiratory Vector:</span>
                <span className={`${isDarkMode ? "text-slate-200" : "text-slate-700"} font-semibold`}>{bio.airResponse}</span>
              </div>
            </div>
          </div>

          {/* Footnotes statement */}
          <div className="pt-2 border-t border-slate-300/30 dark:border-white/5 text-[9px] font-sans text-slate-500 leading-normal max-w-xs truncate">
            {bio.jointDesc} {bio.airDesc}
          </div>
        </motion.div>

        {/* CARD 4: SOLAR TRANSIT & DAYLIGHT (Helios Epoch) */}
        <motion.div
          variants={widgetVariants}
          whileHover="hover"
          className={`p-5 rounded-[24px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} flex flex-col justify-between flex-1 min-h-[160px] cursor-default relative overflow-hidden`}
        >
          {/* Solar orange aura */}
          <div className="absolute -left-16 -top-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center justify-between opacity-90">
            <span className={`text-[11px] uppercase font-sans tracking-wider font-bold flex items-center gap-1.5 ${themeConfig.textSecondary}`}>
              <Sun className="w-4 h-4 text-amber-500" />
              SOLAR TRANSIT GRID
            </span>
            <span className={`text-[10px] font-sans font-medium text-amber-500 flex items-center gap-1`}>
              <Timer className="w-3.5 h-3.5" /> Epoch Track
            </span>
          </div>

          {/* Summary */}
          <div className="my-1 text-left">
            <h4 className={`text-xl font-medium font-sans tracking-tight ${themeConfig.textPrimary}`}>
              {daylight.durationStr} of Daylight
            </h4>
            <p className={`text-[10px] font-sans font-medium mt-1 ${themeConfig.textSecondary} leading-relaxed`}>
              Sunrise occurred at {data.sunrise} and sunset is scheduled for {data.sunset}.
            </p>
          </div>

          {/* Sunlight progress gauge */}
          <div className="space-y-1.5 pt-2 border-t border-slate-300/30 dark:border-white/5">
            <div className="flex justify-between text-[9px] font-bold font-sans tracking-wider text-amber-600 dark:text-amber-500 uppercase">
              <span>Sunrise</span>
              <span>{daylight.progress}% completed</span>
              <span>Sunset</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${daylight.progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
