/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { DailyForecastItem } from "../types";
import { formatTemp, getWeatherIcon } from "../utils";
import { CalendarDays, CloudRain } from "lucide-react";

interface TenDayForecastProps {
  dailyData: DailyForecastItem[];
  unit: "metric" | "imperial";
  themeConfig: any;
}

export function TenDayForecast({ dailyData, unit, themeConfig }: TenDayForecastProps) {
  // Find extreme limits of the full 10-day dataset to scale the range capsules
  const tempsMin = dailyData.map((d) => d.tempMin);
  const tempsMax = dailyData.map((d) => d.tempMax);
  const globalMin = Math.min(...tempsMin);
  const globalMax = Math.max(...tempsMax);
  const tempRangeFull = globalMax - globalMin;

  return (
    <motion.section
      id="daily-forecast-deck"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className={`p-6 rounded-[32px] border ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.glow} ${themeConfig.textPrimary} space-y-4`}
    >
      <div className={`flex items-center space-x-2 pb-2 border-b border-dashed border-slate-300 dark:border-white/10 select-none font-sans`}>
        <CalendarDays className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        <h3 className={`text-xs uppercase font-bold font-sans tracking-wide ${themeConfig.textPrimary}`}>
          10-DAY FORECAST
        </h3>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-white/5">
        {dailyData.map((day, idx) => {
          const DayIcon = getWeatherIcon(day.condition);

          // Calculate capsule offsets
          const leftPercent = tempRangeFull > 0 
            ? ((day.tempMin - globalMin) / tempRangeFull) * 100 
            : 0;
          const widthPercent = tempRangeFull > 0 
            ? ((day.tempMax - day.tempMin) / tempRangeFull) * 100 
            : 100;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 3 }}
              className="flex items-center justify-between py-3.5 space-x-4 select-none font-sans"
            >
              {/* Day title & Date */}
              <div className="w-24 flex flex-col items-start leading-tight shrink-0">
                <span className={`text-xs font-semibold font-sans uppercase tracking-wide tracking-tight ${themeConfig.textPrimary}`}>
                   {day.day}
                </span>
                <span className={`text-[10px] font-sans tracking-tight ${themeConfig.textSecondary} opacity-80`}>
                  {day.date}
                </span>
              </div>

              {/* Condition Icon & precipitation chance status */}
              <div className="flex items-center space-x-2 w-16 shrink-0">
                <DayIcon className="w-5 h-5 text-sky-500 dark:text-sky-300 stroke-[1.5]" />
                {day.rainChance > 0 && (
                  <span className={`text-[9px] font-bold font-sans tracking-wider uppercase ${themeConfig.textSecondary}`}>
                    {day.rainChance}%
                  </span>
                )}
              </div>

              {/* Range sliders - Apple style visual indicators */}
              <div className="flex-1 flex items-center space-x-3">
                {/* Low Temp text */}
                <span className={`text-xs font-mono w-7 text-right ${themeConfig.textSecondary} opacity-80`}>
                  {formatTemp(day.tempMin, unit).replace(/[a-z]/ig, "").trim()}°
                </span>

                {/* Range bar background track */}
                <div className="flex-1 h-2 rounded-full bg-slate-300/40 dark:bg-black/40 relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400 opacity-90 shadow"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(8, widthPercent)}%`,
                    }}
                  />
                  {/* Small circle reflecting current temperature on the "Today" bar */}
                  {idx === 0 && (
                    <div
                      className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-900 -top-0.5"
                      style={{
                        left: `${Math.max(
                          0,
                          Math.min(95, ((day.tempMin + (day.tempMax - day.tempMin)/2 - globalMin) / tempRangeFull) * 100)
                        )}%`,
                      }}
                    />
                  )}
                </div>

                {/* High Temp text */}
                <span className={`text-xs font-bold font-mono w-7 text-left ${themeConfig.textPrimary}`}>
                  {formatTemp(day.tempMax, unit).replace(/[a-z]/ig, "").trim()}°
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
