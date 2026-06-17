/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { WeatherState, WeatherData, FavoriteCity, WeatherConditionType } from "./types";
import { toast } from "sonner";

interface WeatherActions {
  fetchWeather: (query?: string, lat?: number, lon?: number) => Promise<void>;
  toggleUnit: () => void;
  setTheme: (theme: "light" | "dark" | "default") => void;
  addToFavorites: (city: string, country: string, lat: number, lon: number) => void;
  removeFromFavorites: (id: string) => void;
  togglePinFavorite: (id: string) => void;
  clearHistory: () => void;
}

const getStoredItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Local Storage Save Error:", err);
  }
};

export const useWeatherStore = create<WeatherState & WeatherActions>((set, get) => ({
  currentWeather: null,
  isLoading: false,
  searchHistory: getStoredItem<string[]>("ws_search_history", [
    "London",
    "Tokyo",
    "New York",
    "Sydney",
    "Cairo",
  ]),
  favorites: getStoredItem<FavoriteCity[]>("ws_favorites", [
    { id: "fav-1", city: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, isPinned: true },
    { id: "fav-2", city: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, isPinned: false },
    { id: "fav-3", city: "New York", country: "United States", lat: 40.7128, lon: -74.0060, isPinned: false },
  ]),
  unit: getStoredItem<"metric" | "imperial">("ws_unit", "metric"),
  theme: getStoredItem<"light" | "dark" | "default">("ws_theme", "default"),
  error: null,

  fetchWeather: async (query?: string, lat?: number, lon?: number) => {
    set({ isLoading: true, error: null });
    try {
      let url = "/api/weather";
      if (lat !== undefined && lon !== undefined) {
        url += `?lat=${lat}&lon=${lon}`;
      } else if (query) {
        url += `?q=${encodeURIComponent(query.trim())}`;
      } else {
        // Default initially searched location is San Francisco
        url += `?q=San%20Francisco`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch weather data for this location.");
      }

      const data = (await response.json()) as WeatherData;
      
      // Update Search History
      let updatedHistory = get().searchHistory;
      if (query && query.trim()) {
        const normalized = query.trim();
        updatedHistory = [
          normalized,
          ...updatedHistory.filter((h) => h.toLowerCase() !== normalized.toLowerCase()),
        ].slice(0, 10); // Keep last 10
        setStoredItem("ws_search_history", updatedHistory);
      }

      set({ 
        currentWeather: data, 
        isLoading: false,
        searchHistory: updatedHistory
      });

      // Show toast on success
      toast.success(`Atmosphere loaded for ${data.city}`);

      // Perform a background fetch of favorite cities weather to update previews
      const favList = get().favorites;
      const updatedFavs = await Promise.all(
        favList.map(async (fav) => {
          try {
            const previewRes = await fetch(`/api/weather?lat=${fav.lat}&lon=${fav.lon}`);
            if (previewRes.ok) {
              const preview = await previewRes.json();
              return {
                ...fav,
                temp: preview.temp,
                condition: preview.condition,
              };
            }
          } catch {
            // Ignore single favorite preview fails
          }
          return fav;
        })
      );
      set({ favorites: updatedFavs });
      setStoredItem("ws_favorites", updatedFavs);

    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Failed to load weather data", isLoading: false });
      toast.error(err.message || "City not found. Please try another search.");
    }
  },

  toggleUnit: () => {
    const nextUnit = get().unit === "metric" ? "imperial" : "metric";
    set({ unit: nextUnit });
    setStoredItem("ws_unit", nextUnit);
    toast.info(`Switched temperature scale to ${nextUnit === "metric" ? "Celsius" : "Fahrenheit"}`);
  },

  setTheme: (theme: "light" | "dark" | "default") => {
    set({ theme });
    setStoredItem("ws_theme", theme);
    toast.info(`Visual style updated to: ${theme}`);
  },

  addToFavorites: (city: string, country: string, lat: number, lon: number) => {
    const list = get().favorites;
    const exists = list.some((f) => f.city.toLowerCase() === city.toLowerCase());
    if (exists) {
      toast.info(`${city} is already pinned in your dashboard.`);
      return;
    }

    const newFav: FavoriteCity = {
      id: `fav-${Date.now()}`,
      city,
      country,
      lat,
      lon,
      isPinned: false,
    };

    const updated = [...list, newFav];
    set({ favorites: updated });
    setStoredItem("ws_favorites", updated);
    toast.success(`Added ${city} to Favorites`);

    // Fetch immediate preview
    get().fetchWeather(undefined, lat, lon);
  },

  removeFromFavorites: (id: string) => {
    const list = get().favorites;
    const removedCity = list.find((f) => f.id === id);
    const updated = list.filter((f) => f.id !== id);
    set({ favorites: updated });
    setStoredItem("ws_favorites", updated);
    if (removedCity) {
      toast.success(`Removed ${removedCity.city} from Favorites`);
    }
  },

  togglePinFavorite: (id: string) => {
    const list = get().favorites;
    const updated = list.map((f) => (f.id === id ? { ...f, isPinned: !f.isPinned } : f));
    // Sort so pinned are on top
    const sorted = [...updated].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    set({ favorites: sorted });
    setStoredItem("ws_favorites", sorted);
    toast.success("Favorites arrangement modified");
  },

  clearHistory: () => {
    set({ searchHistory: [] });
    setStoredItem("ws_search_history", []);
    toast.info("Cleared search history");
  },
}));
