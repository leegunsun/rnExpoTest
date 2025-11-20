/**
 * Weather service interface
 * This provides an abstraction layer for weather data fetching
 * Ready for real API integration
 */

import type { WeatherData, WeatherComparison } from '@/types/weather';
import { getMockWeatherComparison } from './mock-weather-data';

/**
 * Weather API interface
 * Implement this interface when connecting to real weather API
 */
export interface WeatherAPI {
  /**
   * Get current weather data
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Current weather data
   */
  getCurrentWeather(lat: number, lon: number): Promise<WeatherData>;

  /**
   * Get historical weather data
   * @param lat - Latitude
   * @param lon - Longitude
   * @param date - Date in YYYY-MM-DD format
   * @returns Historical weather data
   */
  getHistoricalWeather(lat: number, lon: number, date: string): Promise<WeatherData>;
}

/**
 * Configuration for weather service
 */
interface WeatherServiceConfig {
  useMockData: boolean;
  apiKey?: string;
  baseUrl?: string;
}

/**
 * Weather service class
 * Provides a unified interface for weather data
 */
class WeatherService {
  private config: WeatherServiceConfig;

  constructor(config: WeatherServiceConfig = { useMockData: true }) {
    this.config = config;
  }

  /**
   * Get weather comparison (today vs last year)
   * @param latitude - Location latitude
   * @param longitude - Location longitude
   * @returns Weather comparison data
   */
  async getWeatherComparison(
    latitude: number,
    longitude: number
  ): Promise<WeatherComparison> {
    if (this.config.useMockData) {
      return getMockWeatherComparison(latitude, longitude);
    }

    // TODO: Implement real API call
    // Example implementation:
    /*
    const today = await this.getCurrentWeather(latitude, longitude);
    const lastYearDate = getLastYearDate();
    const lastYear = await this.getHistoricalWeather(latitude, longitude, lastYearDate);

    return {
      today,
      lastYear,
      lastUpdated: new Date(),
    };
    */

    throw new Error('Real API not implemented yet. Set useMockData to true.');
  }

  /**
   * TODO: Implement real API calls
   *
   * Recommended API options:
   * 1. OpenWeatherMap (https://openweathermap.org/api)
   *    - Current weather: /data/2.5/weather
   *    - Historical: /data/2.5/onecall/timemachine
   *
   * 2. WeatherAPI (https://www.weatherapi.com/)
   *    - Current: /v1/current.json
   *    - Historical: /v1/history.json
   *
   * 3. Korean Meteorological Administration (기상청)
   *    - Open API: https://data.go.kr
   *    - 단기예보, 중기예보, 과거 기상 데이터
   *
   * Example integration:
   *
   * private async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
   *   const response = await fetch(
   *     `${this.config.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.config.apiKey}`
   *   );
   *   const data = await response.json();
   *
   *   return {
   *     date: getCurrentDate(),
   *     temperature: data.main.temp,
   *     feelsLike: data.main.feels_like,
   *     weatherCondition: mapWeatherCondition(data.weather[0].main),
   *     humidity: data.main.humidity,
   *     windSpeed: data.wind.speed,
   *     aqi: await this.getAQI(lat, lon),
   *   };
   * }
   */

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<WeatherServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const weatherService = new WeatherService({ useMockData: true });

/**
 * Example usage:
 *
 * // Using mock data (default)
 * const data = await weatherService.getWeatherComparison(37.5665, 126.9780);
 *
 * // Switch to real API (when ready)
 * weatherService.updateConfig({
 *   useMockData: false,
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.openweathermap.org/data/2.5'
 * });
 */
