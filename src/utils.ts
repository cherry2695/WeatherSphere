/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherConditionType } from "./types";
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  Moon,
  CloudFog,
  LucideIcon,
  Compass,
} from "lucide-react";

export function formatTemp(celsius: number, unit: "metric" | "imperial"): string {
  if (unit === "imperial") {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatWind(ms: number, unit: "metric" | "imperial"): string {
  if (unit === "imperial") {
    const mph = Math.round(ms * 2.23694);
    return `${mph} mph`;
  }
  return `${ms.toFixed(1)} m/s`;
}

export function formatVisibility(km: number, unit: "metric" | "imperial"): string {
  if (unit === "imperial") {
    const miles = Math.round(km * 0.621371);
    return `${miles} mi`;
  }
  return `${km.toFixed(1)} km`;
}

export function getWeatherIcon(condition: WeatherConditionType): LucideIcon {
  switch (condition) {
    case "Sunny":
      return Sun;
    case "Cloudy":
      return Cloud;
    case "Rain":
      return CloudRain;
    case "Snow":
      return Snowflake;
    case "Thunderstorm":
      return CloudLightning;
    case "Night":
      return Moon;
    case "Mist":
      return CloudFog;
    default:
      return Sun;
  }
}

export interface DynamicThemeConfig {
  gradient: string; // Tailwind background gradient classes
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  glow: string;
}

/**
 * Returns specific Apple Weather-inspired atmospheric styles based on environment modes and conditions.
 */
export function getThemeConfig(
  condition: WeatherConditionType,
  isDarkForce?: boolean
): DynamicThemeConfig {
  // If no explicit dark state is passed, we check document class
  const isDark = isDarkForce ?? (typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : true);

  if (isDark) {
    switch (condition) {
      case "Sunny":
        return {
          gradient: "from-[#071A35] via-[#0F2B5B] to-[#123A7A]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/70",
          accent: "text-blue-300 bg-blue-500/20 border-white/10",
          glow: "shadow-2xl shadow-blue-500/5",
        };
      case "Cloudy":
        return {
          gradient: "from-[#0C1E36] via-[#1A2E4C] to-[#253D5C]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/60",
          accent: "text-slate-400 bg-white/10 border-white/10",
          glow: "shadow-lg shadow-black/10",
        };
      case "Rain":
        return {
          gradient: "from-[#061427] via-[#0E2342] to-[#15325C]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/70",
          accent: "text-sky-350 bg-sky-500/20 border-white/10",
          glow: "shadow-lg shadow-sky-500/10",
        };
      case "Snow":
        return {
          gradient: "from-[#0A1A2E] via-[#102A45] to-[#1D3C5E]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/70",
          accent: "text-cyan-300 bg-cyan-400/20 border-white/10",
          glow: "shadow-lg shadow-cyan-300/5",
        };
      case "Thunderstorm":
        return {
          gradient: "from-[#050B1B] via-[#0E162F] to-[#1C1F45]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/70",
          accent: "text-indigo-300 bg-indigo-500/20 border-white/10",
          glow: "shadow-lg shadow-indigo-500/10",
        };
      case "Night":
        return {
          gradient: "from-[#040E1E] via-[#09172E] to-[#112547]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/70",
          accent: "text-amber-300 bg-amber-400/20 border-white/10",
          glow: "shadow-lg shadow-amber-500/5",
        };
      case "Mist":
        return {
          gradient: "from-[#08182D] via-[#122742] to-[#1C3656]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/70",
          accent: "text-teal-350 bg-teal-500/20 border-white/10",
          glow: "shadow-lg shadow-teal-500/5",
        };
      default:
        return {
          gradient: "from-[#071A35] via-[#0F2B5B] to-[#123A7A]",
          cardBg: "bg-white/5 backdrop-blur-md",
          cardBorder: "border-white/10",
          textPrimary: "text-white",
          textSecondary: "text-white/70",
          accent: "text-blue-300 bg-blue-500/20 border-white/10",
          glow: "shadow-2xl shadow-blue-500/5",
        };
    }
  } else {
    // LIGHT MODE configuration matching Apple Bright Sky visual style
    switch (condition) {
      case "Sunny":
        return {
          gradient: "from-[#DCEEFF] via-[#B8DCFF] to-[#87CEFA]",
          cardBg: "bg-[rgba(255,255,255,0.73)]",
          cardBorder: "border-[rgba(255,255,255,0.48)]",
          textPrimary: "text-[#0F172A]",
          textSecondary: "text-[#334155]",
          accent: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20",
          glow: "shadow-lg shadow-blue-300/15",
        };
      case "Cloudy":
        return {
          gradient: "from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8]",
          cardBg: "bg-[rgba(255,255,255,0.72)]",
          cardBorder: "border-[rgba(255,255,255,0.52)]",
          textPrimary: "text-[#0F172A]",
          textSecondary: "text-[#475569]",
          accent: "text-[#475569] bg-[#475569]/10 border-[#475569]/20",
          glow: "shadow-md shadow-gray-400/10",
        };
      case "Rain":
        return {
          gradient: "from-[#C8D9E6] via-[#A3BCC9] to-[#7495A7]",
          cardBg: "bg-[rgba(255,255,255,0.7)]",
          cardBorder: "border-[rgba(255,255,255,0.5)]",
          textPrimary: "text-[#0c1a30]",
          textSecondary: "text-[#475569]",
          accent: "text-[#0284C7] bg-[#0284C7]/15 border-[#0284C7]/20",
          glow: "shadow-md shadow-sky-500/10",
        };
      case "Snow":
        return {
          gradient: "from-[#EBF3F9] via-[#D3E5F3] to-[#AECBDE]",
          cardBg: "bg-[rgba(255,255,255,0.75)]",
          cardBorder: "border-[rgba(255,255,255,0.6)]",
          textPrimary: "text-[#0f233a]",
          textSecondary: "text-[#4b5563]",
          accent: "text-[#0d9488] bg-[#0d9488]/10 border-[#0d9488]/20",
          glow: "shadow-md shadow-cyan-500/10",
        };
      case "Thunderstorm":
        return {
          gradient: "from-[#D4D9E2] via-[#ACB7C4] to-[#718096]",
          cardBg: "bg-[rgba(255,255,255,0.68)]",
          cardBorder: "border-[rgba(255,255,255,0.45)]",
          textPrimary: "text-[#1e1e38]",
          textSecondary: "text-[#5e4b85]",
          accent: "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20",
          glow: "shadow-[#6366f1]/10 shadow-lg",
        };
      case "Night":
        return {
          gradient: "from-[#111e3b] via-[#0a142c] to-[#040a1c]",
          cardBg: "bg-[rgba(15,23,42,0.8)] backdrop-blur-2xl",
          cardBorder: "border-[rgba(255,255,255,0.06)]",
          textPrimary: "text-[#ffffff]",
          textSecondary: "text-[#94a3b8]",
          accent: "text-amber-400 bg-amber-400/10 border-amber-400/20",
          glow: "shadow-lg shadow-amber-500/5",
        };
      case "Mist":
        return {
          gradient: "from-[#E2EAF4] via-[#CDD9E8] to-[#B0C4DE]",
          cardBg: "bg-[rgba(255,255,255,0.72)]",
          cardBorder: "border-[rgba(255,255,255,0.5)]",
          textPrimary: "text-[#1e293b]",
          textSecondary: "text-[#475569]",
          accent: "text-[#059669] bg-[#059669]/10 border-[#059669]/20",
          glow: "shadow-sm shadow-emerald-400/10",
        };
      default:
        return {
          gradient: "from-[#DCEEFF] via-[#B8DCFF] to-[#87CEFA]",
          cardBg: "bg-[rgba(255,255,255,0.73)]",
          cardBorder: "border-[rgba(255,255,255,0.48)]",
          textPrimary: "text-[#0F172A]",
          textSecondary: "text-[#334155]",
          accent: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20",
          glow: "shadow-lg shadow-blue-300/15",
        };
    }
  }
}
export function getAQIColor(aqi: number) {
  switch (aqi) {
    case 1:
      return { label: "Good", color: "bg-emerald-500 text-white", hex: "#10b981", desc: "Air pristine" };
    case 2:
      return { label: "Fair", color: "bg-yellow-500 text-gray-900", hex: "#eab308", desc: "Slight particulate density" };
    case 3:
      return { label: "Moderate", color: "bg-orange-500 text-white", hex: "#f97316", desc: "Acceptable but present" };
    case 4:
      return { label: "Poor", color: "bg-red-500 text-white", hex: "#ef4444", desc: "Limit intensive outdoor work" };
    case 5:
      return { label: "Very Poor", color: "bg-purple-600 text-white", hex: "#7c3aed", desc: "Hazardous advisory warning" };
    default:
      return { label: "Good", color: "bg-emerald-500 text-white", hex: "#10b981", desc: "Air pristine" };
  }
}
