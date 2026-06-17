/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useWeatherStore } from "./store";
import { getThemeConfig } from "./utils";
import { Navbar } from "./components/Navbar";
import { WeatherHero } from "./components/WeatherHero";
import { CurrentWeather } from "./components/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast";
import { TenDayForecast } from "./components/TenDayForecast";
import { AirQualityCard } from "./components/AirQualityCard";
import { InteractiveMap } from "./components/InteractiveMap";
import { FavoritesDeck } from "./components/FavoritesDeck";
import { SavedLocationsPage } from "./components/SavedLocationsPage";
import { WeatherInsights } from "./components/WeatherInsights";
import { WeatherSphereSkeleton } from "./components/SkeletonLoader";
import { Footer } from "./components/Footer";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Compass, AlertCircle } from "lucide-react";

export default function App() {
  const {
    currentWeather,
    isLoading,
    searchHistory,
    favorites,
    unit,
    error,
    fetchWeather,
    toggleUnit,
    addToFavorites,
    removeFromFavorites,
    togglePinFavorite,
    clearHistory,
  } = useWeatherStore();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "saved">("dashboard");

  // Initialize Theme classes on mount
  useEffect(() => {
    const isDarkGlobal = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDarkGlobal);
    
    // Seed initial weather report (San Francisco is our signature baseline)
    fetchWeather("San Francisco");
  }, []);

  // Update DOM classes when dark mode state changes
  const handleToggleTheme = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Obtain localized micro-climates using Navigator Geo API
  const handleGeolocationFetch = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser or inside this frame.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(undefined, latitude, longitude);
      },
      (error) => {
        console.error("GPS fetch error:", error);
        toast.error("Unable to retrieve location. Please check device permissions.");
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  // Get active dynamic theme styling based on the retrieved weather condition
  const fallbackCondition = currentWeather?.condition || "Sunny";
  const themeConfig = getThemeConfig(fallbackCondition, isDarkMode);

  // Helper to check if current city is already in favorites
  const isCityFavorited = currentWeather 
    ? favorites.some((f) => f.city.toLowerCase() === currentWeather.city.toLowerCase()) 
    : false;

  const handleFavoriteToggle = () => {
    if (!currentWeather) return;
    if (isCityFavorited) {
      const favItem = favorites.find((f) => f.city.toLowerCase() === currentWeather.city.toLowerCase());
      if (favItem) removeFromFavorites(favItem.id);
    } else {
      addToFavorites(
        currentWeather.city,
        currentWeather.country,
        currentWeather.lat,
        currentWeather.lon
      );
    }
  };

  // Convert Tailwind classes ("from-[#071A35] via-[#0F2B5B] to-[#123A7A]") into standard CSS gradient parameters with commas
  const getLinearGradientValue = (gradStr: string) => {
    return gradStr
      .split(" ")
      .map((part) => {
        const match = part.match(/\[#([A-Fa-f0-9]+)\]/);
        if (match) return `#${match[1]}`;
        return part.replace("from-", "").replace("via-", "").replace("to-", "");
      })
      .join(", ");
  };

  return (
    <motion.div
      id="weathersphere-root-canvas"
      animate={{
        backgroundImage: `linear-gradient(to bottom, ${getLinearGradientValue(themeConfig.gradient)})`
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{
        backgroundAttachment: "fixed",
      }}
      className={`min-h-screen text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8 flex flex-col justify-between transition-colors duration-1000 relative`}
    >
      {/* Absolute faint background weather noise / overlay stars */}
      {fallbackCondition === "Night" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-40 pointer-events-none" />
      )}
      
      <div className="max-w-7xl mx-auto w-full space-y-8 select-text">
        {/* Navigation / Search Bar Header */}
        <Navbar
          onSearch={(city) => fetchWeather(city)}
          onGeolocation={handleGeolocationFetch}
          onToggleUnit={toggleUnit}
          unit={unit}
          recentSearches={searchHistory}
          onSelectRecent={(city) => fetchWeather(city)}
          onClearRecent={clearHistory}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          isLoading={isLoading}
          themeConfig={themeConfig}
        />

        {/* View Switcher Tabs (Dashboard vs Saved Locations) */}
        <div className="flex items-center justify-center space-x-2 p-1.5 bg-slate-100/10 dark:bg-white/5 rounded-2xl max-w-sm mx-auto backdrop-blur-md border border-slate-300/10 dark:border-white/10 shrink-0 select-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-sans font-bold tracking-wide transition-all duration-200 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white shadow-md scale-[1.01]"
                : `${themeConfig.textSecondary} hover:bg-black/5 dark:hover:bg-white/5`
            }`}
          >
            Dashboard View
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-sans font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 duration-200 cursor-pointer ${
              activeTab === "saved"
                ? "bg-blue-600 text-white shadow-md scale-[1.01]"
                : `${themeConfig.textSecondary} hover:bg-black/5 dark:hover:bg-white/5`
            }`}
          >
            Saved Library
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
              activeTab === "saved" ? "bg-white/20 text-white" : "bg-black/10 dark:bg-white/10 text-slate-400"
            }`}>
              {favorites.length}
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center space-x-3 max-w-lg mx-auto shadow-xl font-sans"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="text-xs font-sans">
                <strong>Notice:</strong> {error}. Using local fallback weather.
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <WeatherSphereSkeleton key="skeleton" />
          ) : activeTab === "saved" ? (
            <SavedLocationsPage
              key="saved-locations"
              favorites={favorites}
              onSelectCity={(city, lat, lon) => fetchWeather(undefined, lat, lon)}
              onRemoveFavorite={removeFromFavorites}
              onTogglePin={togglePinFavorite}
              unit={unit}
              isDarkMode={isDarkMode}
              onGoToDashboard={() => setActiveTab("dashboard")}
            />
          ) : currentWeather ? (
            <motion.div
              key={currentWeather.city}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Massive Apple Hero Forecast Card */}
              <WeatherHero
                data={currentWeather}
                unit={unit}
                themeConfig={themeConfig}
                onPinFavorite={handleFavoriteToggle}
                isFavorited={isCityFavorited}
              />

              {/* Sub grid: Left is forecasts, Right is stats dials & Interactive Map */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left wing - 10 Day forecasting lines */}
                <div className="lg:col-span-1 flex flex-col space-y-8">
                  <TenDayForecast
                    dailyData={currentWeather.daily}
                    unit={unit}
                    themeConfig={themeConfig}
                  />

                  {/* Quick-favorites deck nested natively */}
                  <FavoritesDeck
                    favorites={favorites.length > 0 ? [favorites[favorites.length - 1]] : []}
                    onSelectCity={(city, lat, lon) => fetchWeather(undefined, lat, lon)}
                    onRemoveFavorite={removeFromFavorites}
                    onTogglePin={togglePinFavorite}
                    unit={unit}
                    themeConfig={themeConfig}
                  />

                  {/* Dynamic Weather Insights (Outdoor Fitness Advisor & Climatology Almanac) */}
                  <WeatherInsights
                    data={currentWeather}
                    unit={unit}
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    className="flex-1 flex flex-col"
                  />
                </div>

                {/* Right wing - Horizontal Scrolling Forecast, Air Quality, Map, Indicators */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Hourly Scrolling Card + Line Chart */}
                  <HourlyForecast
                    hourlyData={currentWeather.hourly}
                    unit={unit}
                    themeConfig={themeConfig}
                  />

                  {/* Highlights Grid of Apple Widgets (Humidity, wind, UV etc.) */}
                  <CurrentWeather
                    data={currentWeather}
                    unit={unit}
                    themeConfig={themeConfig}
                  />

                  {/* Air Quality Gauge & pollutant levels cards */}
                  <AirQualityCard
                    aqiData={currentWeather.airQuality}
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                  />

                  {/* Interactive GIS Weather Map (Leaflet rendering with custom pin popup) */}
                  <InteractiveMap
                    city={currentWeather.city}
                    country={currentWeather.country}
                    lat={currentWeather.lat}
                    lon={currentWeather.lon}
                    temp={currentWeather.temp}
                    condition={currentWeather.condition}
                    unit={unit}
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="py-24 text-center text-slate-400 font-sans text-xs flex flex-col items-center justify-center space-y-3">
              <Compass className="w-8 h-8 text-sky-400 animate-spin" />
              <span>Fetching weather data from around the globe...</span>
            </div>
          )}
        </AnimatePresence>

        {/* Footnote information panel */}
        <Footer themeConfig={themeConfig} isDarkMode={isDarkMode} />
      </div>

      {/* Styled Rich toaster */}
      <Toaster richColors closeButton position="top-right" theme={isDarkMode ? "dark" : "light"} />
    </motion.div>
  );
}
