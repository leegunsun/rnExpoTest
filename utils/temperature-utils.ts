/**
 * Temperature utility functions
 */

import type { TemperatureComparison } from '@/types/weather';
import { WeatherColors } from '@/constants/weather-theme';

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Format temperature with unit
 */
export function formatTemperature(
  temp: number,
  unit: 'C' | 'F' = 'C',
  showUnit: boolean = true
): string {
  const value = unit === 'F' ? celsiusToFahrenheit(temp) : temp;
  const rounded = Math.round(value);
  return showUnit ? `${rounded}°${unit}` : `${rounded}°`;
}

/**
 * Calculate temperature difference
 */
export function getTemperatureDifference(current: number, previous: number): number {
  return current - previous;
}

/**
 * Determine if temperature change is significant (±2°C threshold)
 */
export function getTemperatureComparison(
  current: number,
  previous: number,
  threshold: number = 2
): TemperatureComparison {
  const diff = getTemperatureDifference(current, previous);

  if (Math.abs(diff) <= threshold) {
    return 'similar';
  }

  return diff > 0 ? 'warmer' : 'colder';
}

/**
 * Format temperature difference with sign
 */
export function formatTemperatureDifference(
  diff: number,
  unit: 'C' | 'F' = 'C',
  showUnit: boolean = true
): string {
  const value = unit === 'F' ? celsiusToFahrenheit(diff) : diff;
  const rounded = Math.round(value);
  const sign = rounded > 0 ? '+' : '';
  return showUnit ? `${sign}${rounded}°${unit}` : `${sign}${rounded}°`;
}

/**
 * Get temperature comparison arrow
 */
export function getTemperatureArrow(comparison: TemperatureComparison): string {
  switch (comparison) {
    case 'warmer':
      return '↗';
    case 'colder':
      return '↘';
    case 'similar':
      return '→';
  }
}

/**
 * Get temperature comparison text
 */
export function getTemperatureComparisonText(
  comparison: TemperatureComparison,
  language: 'ko' | 'en' = 'ko'
): string {
  if (language === 'ko') {
    switch (comparison) {
      case 'warmer':
        return '작년보다 따뜻해요';
      case 'colder':
        return '작년보다 추워요';
      case 'similar':
        return '작년과 비슷해요';
    }
  } else {
    switch (comparison) {
      case 'warmer':
        return 'Warmer than last year';
      case 'colder':
        return 'Colder than last year';
      case 'similar':
        return 'Similar to last year';
    }
  }
}

/**
 * Get temperature-based gradient colors
 * Based on modern weather app design 2025
 */
export function getTemperatureGradient(temp: number): readonly string[] {
  if (temp < 0) {
    return WeatherColors.temperature.freezing; // 영하: 진한 파란색
  } else if (temp < 10) {
    return WeatherColors.temperature.cold; // 0-10°C: 밝은 파란색
  } else if (temp < 20) {
    return WeatherColors.temperature.mild; // 10-20°C: 민트 → 노란색
  } else if (temp < 30) {
    return WeatherColors.temperature.warm; // 20-30°C: 주황
  } else {
    return WeatherColors.temperature.hot; // 30°C+: 빨간색
  }
}

/**
 * Get comparison color based on temperature difference
 */
export function getComparisonColor(comparison: TemperatureComparison): string {
  switch (comparison) {
    case 'warmer':
      return WeatherColors.comparison.warmer; // 초록색
    case 'colder':
      return WeatherColors.comparison.colder; // 파란색
    case 'similar':
      return WeatherColors.comparison.similar; // 회색
  }
}
