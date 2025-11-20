/**
 * Custom hook for weather comparison data
 * Manages weather data fetching and state
 */

import { useState, useEffect, useCallback } from 'react';
import type { WeatherComparison } from '@/types/weather';
import { weatherService } from '@/services/weather-service';

interface UseWeatherComparisonProps {
  latitude: number;
  longitude: number;
  enabled?: boolean;
}

interface UseWeatherComparisonReturn {
  weatherData: WeatherComparison | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage weather comparison data
 */
export function useWeatherComparison({
  latitude,
  longitude,
  enabled = true,
}: UseWeatherComparisonProps): UseWeatherComparisonReturn {
  const [weatherData, setWeatherData] = useState<WeatherComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch weather comparison data
   */
  const fetchWeatherData = useCallback(
    async (isRefresh: boolean = false) => {
      if (!enabled) return;

      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const data = await weatherService.getWeatherComparison(latitude, longitude);
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err instanceof Error ? err.message : '날씨 정보를 가져올 수 없습니다');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [latitude, longitude, enabled]
  );

  /**
   * Refresh weather data (for pull-to-refresh)
   */
  const refresh = useCallback(async () => {
    await fetchWeatherData(true);
  }, [fetchWeatherData]);

  // Fetch data on mount and when coordinates change
  useEffect(() => {
    if (enabled && latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude, enabled, fetchWeatherData]);

  return {
    weatherData,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
