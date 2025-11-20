/**
 * Mock weather data for development
 * This will be replaced with real API calls
 */

import type { WeatherData, WeatherComparison } from '@/types/weather';
import { getCurrentDate, getLastYearDate } from '@/utils/date-utils';

/**
 * Generate mock weather data
 */
function generateMockWeatherData(date: string, isToday: boolean = false): WeatherData {
  // Simulate different weather conditions
  const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'] as const;
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

  // Generate realistic temperature based on season
  const dateObj = new Date(date);
  const month = dateObj.getMonth();
  let baseTemp = 15; // Default temperature

  // Seasonal temperature adjustment (Seoul, Korea)
  if (month >= 11 || month <= 2) {
    // Winter
    baseTemp = Math.random() * 10 - 5; // -5°C to 5°C
  } else if (month >= 3 && month <= 5) {
    // Spring
    baseTemp = Math.random() * 15 + 10; // 10°C to 25°C
  } else if (month >= 6 && month <= 8) {
    // Summer
    baseTemp = Math.random() * 10 + 25; // 25°C to 35°C
  } else {
    // Fall
    baseTemp = Math.random() * 15 + 10; // 10°C to 25°C
  }

  const temperature = Math.round(baseTemp);
  const feelsLike = Math.round(baseTemp + (Math.random() * 4 - 2)); // ±2°C

  return {
    date,
    temperature,
    feelsLike,
    weatherCondition: isToday
      ? (conditions[Math.floor(Math.random() * conditions.length)] as WeatherData['weatherCondition'])
      : randomCondition,
    humidity: Math.round(Math.random() * 40 + 30), // 30-70%
    windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
    aqi: Math.round(Math.random() * 100 + 20), // 20-120 AQI
  };
}

/**
 * Mock API call to get current and last year weather
 */
export async function getMockWeatherComparison(
  latitude?: number,
  longitude?: number
): Promise<WeatherComparison> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const todayDate = getCurrentDate();
  const lastYearDate = getLastYearDate();

  // For demo purposes, create noticeable difference
  const today = generateMockWeatherData(todayDate, true);
  const lastYear = generateMockWeatherData(lastYearDate);

  // Ensure there's a temperature difference for better demo
  if (Math.abs(today.temperature - lastYear.temperature) < 3) {
    lastYear.temperature = today.temperature + (Math.random() > 0.5 ? 5 : -5);
    lastYear.feelsLike = lastYear.temperature + (Math.random() * 4 - 2);
  }

  return {
    today,
    lastYear,
    lastUpdated: new Date(),
  };
}

/**
 * Mock sample data for testing different scenarios
 */
export const mockScenarios = {
  warmer: {
    today: {
      date: getCurrentDate(),
      temperature: 18,
      feelsLike: 16,
      weatherCondition: 'sunny' as const,
      humidity: 45,
      windSpeed: 12,
      aqi: 45,
    },
    lastYear: {
      date: getLastYearDate(),
      temperature: 12,
      feelsLike: 10,
      weatherCondition: 'cloudy' as const,
      humidity: 60,
      windSpeed: 15,
      aqi: 78,
    },
    lastUpdated: new Date(),
  },
  colder: {
    today: {
      date: getCurrentDate(),
      temperature: 8,
      feelsLike: 5,
      weatherCondition: 'rainy' as const,
      humidity: 75,
      windSpeed: 18,
      aqi: 62,
    },
    lastYear: {
      date: getLastYearDate(),
      temperature: 15,
      feelsLike: 13,
      weatherCondition: 'sunny' as const,
      humidity: 50,
      windSpeed: 10,
      aqi: 35,
    },
    lastUpdated: new Date(),
  },
  similar: {
    today: {
      date: getCurrentDate(),
      temperature: 14,
      feelsLike: 13,
      weatherCondition: 'cloudy' as const,
      humidity: 55,
      windSpeed: 14,
      aqi: 58,
    },
    lastYear: {
      date: getLastYearDate(),
      temperature: 15,
      feelsLike: 14,
      weatherCondition: 'cloudy' as const,
      humidity: 52,
      windSpeed: 13,
      aqi: 54,
    },
    lastUpdated: new Date(),
  },
} as const;
