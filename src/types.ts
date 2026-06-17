/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WeatherConditionType =
  | "Sunny"
  | "Cloudy"
  | "Rain"
  | "Snow"
  | "Thunderstorm"
  | "Night"
  | "Mist";

export interface HourlyForecastItem {
  time: string;
  temp: number;
  condition: WeatherConditionType;
  rainChance: number;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  condition: WeatherConditionType;
  tempMax: number;
  tempMin: number;
  rainChance: number;
}

export interface AirQualityData {
  aqi: number; // 1 (Good) to 5 (Very Poor)
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number; // µg/m³
  so2: number; // µg/m³
  co: number; // mg/m³
  o3: number; // µg/m³
  recommendation: string;
}

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  condition: WeatherConditionType;
  description: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  visibility: number;
  dewPoint: number;
  uvIndex: number;
  clouds: number;
  sunrise: string;
  sunset: string;
  currentTime: string;
  currentDate: string;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQualityData;
  aiBriefing: string;
}

export interface FavoriteCity {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  isPinned: boolean;
  temp?: number;
  condition?: WeatherConditionType;
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  isLoading: boolean;
  searchHistory: string[];
  favorites: FavoriteCity[];
  unit: "metric" | "imperial";
  theme: "light" | "dark" | "default"; // default follows active climate gradient
  error: string | null;
}
