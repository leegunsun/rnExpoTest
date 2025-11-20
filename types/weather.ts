/**
 * Weather data type definitions for Weather Time Machine
 */

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export interface WeatherData {
  date: string; // YYYY-MM-DD
  temperature: number;
  feelsLike: number;
  weatherCondition: WeatherCondition;
  humidity: number; // percentage
  windSpeed: number; // km/h
  aqi: number; // Air Quality Index
}

export interface LocationInfo {
  city: string;
  district: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export interface WeatherComparison {
  today: WeatherData;
  lastYear: WeatherData;
  lastUpdated: Date;
}

export interface AppState {
  location: LocationInfo;
  weatherData: WeatherComparison | null;
  ui: {
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
  };
  preferences: {
    temperatureUnit: 'C' | 'F';
    useLocation: boolean;
  };
}

export type TemperatureComparison = 'warmer' | 'colder' | 'similar';
