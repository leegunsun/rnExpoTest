/**
 * Custom hook for weather comparison data
 *
 * 이 훅은 Zustand Store를 래핑하여 기존 인터페이스를 유지합니다.
 * Location Store와 Weather Store를 연동하여 사용합니다.
 *
 * 학습 포인트:
 * 1. 여러 스토어 조합 사용
 * 2. 의존성 기반 데이터 페칭
 * 3. useShallow로 리렌더링 최적화
 */

import { useEffect, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWeatherStore } from '@/store/weather-store';
import type { WeatherComparison } from '@/types/weather';

// ============================================================
// 타입 정의
// ============================================================

interface UseWeatherComparisonProps {
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 데이터 페칭 활성화 여부 */
  enabled?: boolean;
}

interface UseWeatherComparisonReturn {
  /** 날씨 비교 데이터 */
  weatherData: WeatherComparison | null;
  /** 초기 로딩 상태 */
  isLoading: boolean;
  /** 새로고침 상태 */
  isRefreshing: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 데이터 새로고침 함수 */
  refresh: () => Promise<void>;
}

// ============================================================
// 훅 구현
// ============================================================

/**
 * 날씨 비교 데이터 훅
 *
 * 내부적으로 Zustand Weather Store를 사용하지만,
 * 기존과 동일한 인터페이스를 제공합니다.
 *
 * @example
 * function WeatherScreen() {
 *   const { location } = useLocation();
 *
 *   const {
 *     weatherData,
 *     isLoading,
 *     isRefreshing,
 *     refresh
 *   } = useWeatherComparison({
 *     latitude: location?.coords.latitude ?? 0,
 *     longitude: location?.coords.longitude ?? 0,
 *     enabled: !!location,
 *   });
 *
 *   // ...
 * }
 */
export function useWeatherComparison({
  latitude,
  longitude,
  enabled = true,
}: UseWeatherComparisonProps): UseWeatherComparisonReturn {
  // 학습 포인트: useShallow
  // 여러 상태를 한 번에 선택할 때 사용
  // 내부 값이 같으면 리렌더링 방지
  const { weatherData, isLoading, isRefreshing, error, fetchWeather, refresh: storeRefresh } =
    useWeatherStore(
      useShallow((state) => ({
        weatherData: state.weatherData,
        isLoading: state.isLoading,
        isRefreshing: state.isRefreshing,
        error: state.error,
        fetchWeather: state.fetchWeather,
        refresh: state.refresh,
      }))
    );

  /**
   * 새로고침 함수
   * - 현재 좌표로 데이터 새로고침
   */
  const refresh = useCallback(async () => {
    if (!enabled) return;
    await storeRefresh(latitude, longitude);
  }, [enabled, latitude, longitude, storeRefresh]);

  // 마운트 및 좌표 변경 시 데이터 페칭
  useEffect(() => {
    if (enabled && latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude, enabled, fetchWeather]);

  return {
    weatherData,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}

// ============================================================
// 추가 훅들 (학습용)
// ============================================================

/**
 * 날씨 데이터만 가져오는 훅
 *
 * @example
 * function TemperatureDisplay() {
 *   const weatherData = useWeatherData();
 *   return <Text>{weatherData?.today.temperature}°</Text>;
 * }
 */
export function useWeatherData() {
  return useWeatherStore((state) => state.weatherData);
}

/**
 * 오늘 날씨만 가져오는 훅
 *
 * 학습 포인트: 깊은 선택
 * - 중첩된 데이터에서 필요한 부분만 선택
 * - lastYear 변경 시에도 리렌더링 안 함
 */
export function useTodayWeather() {
  return useWeatherStore((state) => state.weatherData?.today);
}

/**
 * 작년 날씨만 가져오는 훅
 */
export function useLastYearWeather() {
  return useWeatherStore((state) => state.weatherData?.lastYear);
}

/**
 * 온도 차이만 가져오는 훅
 *
 * @example
 * function TemperatureDiff() {
 *   const diff = useTemperatureDiff();
 *   if (diff === null) return null;
 *
 *   const sign = diff > 0 ? '+' : '';
 *   return <Text>{sign}{diff}°</Text>;
 * }
 */
export function useTemperatureDiff() {
  return useWeatherStore((state) => {
    const data = state.weatherData;
    if (!data) return null;
    return data.today.temperature - data.lastYear.temperature;
  });
}

/**
 * 날씨 로딩 상태만 가져오는 훅
 */
export function useWeatherLoading() {
  return useWeatherStore((state) => state.isLoading);
}

/**
 * 날씨 새로고침 상태만 가져오는 훅
 */
export function useWeatherRefreshing() {
  return useWeatherStore((state) => state.isRefreshing);
}

/**
 * 날씨 에러만 가져오는 훅
 */
export function useWeatherError() {
  return useWeatherStore((state) => state.error);
}

/**
 * 날씨 액션만 가져오는 훅
 *
 * @example
 * function RefreshButton() {
 *   const { fetchWeather, refresh } = useWeatherActions();
 *   // 상태 변경에 영향받지 않음
 * }
 */
export function useWeatherActions() {
  return useWeatherStore(
    useShallow((state) => ({
      fetchWeather: state.fetchWeather,
      refresh: state.refresh,
      fetchWeatherFromCurrentLocation: state.fetchWeatherFromCurrentLocation,
      reset: state.reset,
    }))
  );
}
