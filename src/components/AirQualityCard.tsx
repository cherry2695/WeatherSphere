/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { AirQualityData } from "../types";
import { getAQIColor } from "../utils";
import { Wind, ShieldAlert, Sparkles } from "lucide-react";

interface AirQualityCardProps {
  aqiData: AirQualityData;
  themeConfig: any;
  isDarkMode?: boolean;
}

export function AirQualityCard({ aqiData, themeConfig, isDarkMode = true }: AirQualityCardProps) {
  const { label, color, hex, desc } = getAQIColor(aqiData.aqi);

  // Compute exact coordinates of the sliding dial pointer on the 40px radius arc
  const percentage = aqiData.aqi / 5;
  const angleRad = Math.PI - (percentage * Math.PI); // starts left (Math.PI/180 degrees) down to right (0)
  const cx = 50 + 40 * Math.cos(angleRad);
  const cy = 50 - 40 * Math.sin(angleRad); // SVG coordinates start from top-left, so we subtract from 50 (center y)

  return (
    <motion.section
      id="air-quality-panel"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-[32px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.glow} space-y-6`}
    >
      <div className="flex items-center space-x-2 select-none">
        <Wind className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: "12s" }} />
        <h3 className={`text-xs uppercase font-bold font-sans tracking-wider ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          AIR QUALITY INDEX
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radial air quality arc gauge layout */}
        <div className="flex flex-col items-center justify-center p-5 border border-slate-300/40 dark:border-white/5 rounded-2xl bg-black/5 dark:bg-white/5 shadow-inner">
          <div className="relative w-48 h-28 flex flex-col justify-end items-center">
            {/* Semicircle SVG Arc */}
            <svg viewBox="0 0 100 55" className="w-full h-full filter drop-shadow-sm select-none overflow-visible">
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />   {/* Emerald */}
                  <stop offset="25%" stopColor="#eab308" />  {/* Yellow */}
                  <stop offset="50%" stopColor="#f97316" />  {/* Orange */}
                  <stop offset="75%" stopColor="#ef4444" />  {/* Red */}
                  <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Background thin guide track */}
              <path
                d="M10,50 A40,40 0 0,1 90,50"
                fill="none"
                stroke={isDarkMode ? "rgba(255, 255, 255, 0.15)" : "#cbd5e1"}
                strokeWidth="7"
                strokeLinecap="round"
              />
              
              {/* Foreground animated gradient arc representing actual level */}
              <motion.path
                d="M10,50 A40,40 0 0,1 90,50"
                fill="none"
                stroke="url(#aqiGrad)"
                strokeWidth="7.5"
                strokeLinecap="round"
                strokeDasharray="125.66"
                initial={{ strokeDashoffset: 125.66 }}
                animate={{ strokeDashoffset: 125.66 * (1 - percentage) }}
                transition={{ type: "spring", stiffness: 45, damping: 15 }}
              />

              {/* Minimalist dashed reference line pointing to current level */}
              <line
                x1="50"
                y1="50"
                x2={cx}
                y2={cy}
                stroke={hex}
                strokeWidth="0.75"
                strokeDasharray="2 2"
                opacity="0.6"
              />

              {/* Dynamic glowing cursor sliding dot */}
              <motion.circle
                cx={cx}
                cy={cy}
                r="5.5"
                fill="#ffffff"
                stroke={hex}
                strokeWidth="2.5"
                initial={{ scale: 0 }}
                animate={{ cx, cy, scale: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
                filter="url(#glow)"
              />

              {/* Center sleek core pivot */}
              <circle cx="50" cy="50" r="2.5" fill={isDarkMode ? "#64748b" : "#94a3b8"} />
            </svg>
          </div>

          <div className="text-center mt-3 select-none">
            <span className={`px-3.5 py-1 rounded-full text-xs font-bold font-sans tracking-wide ${color}`}>
              AQI: {label} ({aqiData.aqi}/5)
            </span>
            <div className={`text-[10px] uppercase font-bold font-sans tracking-widest mt-2.5 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              {desc}
            </div>
          </div>
        </div>

        {/* Dynamic Advisory recommendation box */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-300/40 dark:border-white/5 relative flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className={`text-[11px] uppercase font-sans font-extrabold tracking-wider block ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                Air Quality Advisory
              </span>
              <p className={`text-xs leading-relaxed font-sans font-medium ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}>
                {aqiData.recommendation}
              </p>
            </div>
          </div>

          {/* Micro particulate metric grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "PM2.5", val: aqiData.pm25, unit: "µg/m³" },
              { label: "PM10", val: aqiData.pm10, unit: "µg/m³" },
              { label: "OZone", val: aqiData.o3, unit: "µg/m³" },
              { label: "CO", val: aqiData.co, unit: "mg/m³" },
              { label: "SO2", val: aqiData.so2, unit: "µg/m³" },
              { label: "NO2", val: aqiData.no2, unit: "µg/m³" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="p-2 border border-slate-300/40 dark:border-white/5 bg-black/5 dark:bg-white/5 rounded-xl flex flex-col items-center justify-center text-center select-none"
              >
                <span className={`text-[10px] font-extrabold font-sans tracking-wider uppercase ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {metric.label}
                </span>
                <span className={`text-xs font-bold font-mono ${themeConfig.textPrimary}`}>
                  {metric.val}
                </span>
                <span className={`text-[9px] font-medium font-sans tracking-tight ${isDarkMode ? "text-slate-500" : "text-slate-600"}`}>
                  {metric.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
