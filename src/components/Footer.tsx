/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Sparkles, Shield, Clock, Compass } from "lucide-react";
import { DynamicThemeConfig } from "../utils";

interface FooterProps {
  themeConfig?: DynamicThemeConfig;
  isDarkMode?: boolean;
}

export function Footer({ themeConfig, isDarkMode = true }: FooterProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="pt-12 pb-6 border-t border-dashed border-slate-300 dark:border-white/10 select-none text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center space-x-2">
            <Compass className={`w-4 h-4 animate-pulse ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`} />
            <span className={`text-xs font-bold tracking-wider uppercase font-sans ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
              WeatherSphere Dashboard
            </span>
          </div>
          <p className={`text-[11px] leading-relaxed font-sans ${isDarkMode ? "text-slate-400 font-medium" : "text-slate-800 font-semibold"}`}>
            WeatherSphere is a premium weather visualization experience inspired by Apple Weather designs, pairing highly polished user interfaces with predictive weather telemetry and AI-powered briefing insights.
          </p>
        </div>

        <div className={`flex flex-col space-y-2 font-sans text-xs tracking-wide ${isDarkMode ? "text-slate-400" : "text-slate-800"}`}>
          <div className="flex items-center space-x-1.5 font-medium">
            <Clock className={`w-3.5 h-3.5 ${isDarkMode ? "text-blue-400" : "text-blue-700"}`} />
            <span>Local Reading: <strong className={`${isDarkMode ? "text-emerald-400" : "text-emerald-800"} font-mono text-sm`}>{currentTime || "12:00:00 PM"}</strong></span>
          </div>
          <p className={`text-[10px] font-sans ${isDarkMode ? "text-slate-500 opacity-75" : "text-slate-700 font-semibold"}`}>
            © 2026 WeatherSphere. Portfolio Demonstration. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
