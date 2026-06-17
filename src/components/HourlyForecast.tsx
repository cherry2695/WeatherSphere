/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HourlyForecastItem } from "../types";
import { formatTemp, getWeatherIcon } from "../utils";
import { Clock, ChevronLeft, ChevronRight, Activity, TrendingUp } from "lucide-react";

interface HourlyForecastProps {
  hourlyData: HourlyForecastItem[];
  unit: "metric" | "imperial";
  themeConfig: any;
}

export function HourlyForecast({ hourlyData, unit, themeConfig }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Slicing first 12 hours for the hourly scroll deck represent the nearest forecast cycle
  const displayHours = hourlyData.slice(0, 12);

  // Format dataset for Recharts
  const chartData = displayHours.map((h) => ({
    time: h.time.replace(":00", ""),
    temp: unit === "imperial" ? Math.round((h.temp * 9) / 5 + 32) : h.temp,
    rain: h.rainChance,
  }));

  const scrollLeftValue = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRightValue = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <motion.section
      id="hourly-forecast-deck"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`p-6 rounded-[32px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.glow} space-y-6 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <Clock className="w-4.5 h-4.5 text-emerald-500" />
          <h3 className={`text-xs uppercase font-bold font-sans tracking-wider ${themeConfig.textPrimary}`}>
            HOURLY FORECAST
          </h3>
        </div>

        {/* Scroll action controllers */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={scrollLeftValue}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/5 active:scale-95 transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/5 cursor-pointer bg-black/5 dark:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRightValue}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/5 active:scale-95 transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/5 cursor-pointer bg-black/5 dark:bg-white/5"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll bar */}
      <div
        ref={scrollRef}
        className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory touch-pan-x"
        style={{ scrollbarWidth: "none" }}
      >
        {displayHours.map((hour, idx) => {
          const HourIcon = getWeatherIcon(hour.condition);
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className={`min-w-[84px] py-4 px-2 rounded-2xl flex flex-col items-center justify-between space-y-3 border text-center snap-start ${
                idx === 0 
                  ? "bg-blue-500/10 border-blue-400/30 shadow-lg shadow-blue-500/5" 
                  : `bg-black/5 dark:bg-white/5 border-slate-200/50 dark:border-white/5`
              }`}
            >
              <div className={`text-[10px] font-sans font-semibold tracking-wider select-none uppercase ${themeConfig.textSecondary} opacity-80`}>
                {idx === 0 ? "Now" : hour.time.replace(":00", "")}
              </div>

              <motion.div
                animate={{ rotate: hour.condition === "Sunny" ? [0, 15, 0] : 0 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <HourIcon className="w-7 h-7 text-sky-500 dark:text-sky-300" />
              </motion.div>

              <div className={`text-sm font-bold font-sans tracking-wide ${themeConfig.textPrimary}`}>
                {formatTemp(hour.temp, unit)}
              </div>

              {hour.rainChance > 0 ? (
                <div className="text-[9px] font-bold font-sans text-cyan-500 dark:text-cyan-400 tracking-wider">
                  {hour.rainChance}% rain
                </div>
              ) : (
                <div className={`text-[9px] font-sans font-medium tracking-wide select-none ${themeConfig.textSecondary} opacity-50`}>
                  Clear
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Recharts Area temperature cycle chart panel */}
      <div className={`pt-2 border-t border-dashed border-slate-300 dark:border-white/10 relative`}>
        <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-wider mb-4 select-none uppercase font-sans text-sky-600 dark:text-sky-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>TEMPERATURE TREND (NEXT 12 HOURS)</span>
        </div>

        <div className="h-28 w-full block select-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 9, fontFamily: "Inter" }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 9, fontFamily: "Inter" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#090b11] border border-white/10 px-3 py-1.5 rounded-xl font-sans text-[10px] text-white space-y-0.5 shadow-2xl">
                        <div>Temp: <strong className="text-blue-400">{payload[0].value}°</strong></div>
                        {payload[1] && (
                          <div>Rain: <span className="text-sky-400">{payload[1].value}%</span></div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tempGrad)"
              />
              <Area
                type="monotone"
                dataKey="rain"
                stroke="#0ea5e9"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}
