/**
 * Store 모듈 진입점
 *
 * 모든 Zustand 스토어를 이 파일에서 re-export합니다.
 *
 * @example
 * import { useLocationStore, useWeatherStore } from '@/store';
 */

// Location Store
export {
  useLocationStore,
  selectLocation,
  selectIsLoading as selectLocationIsLoading,
  selectError as selectLocationError,
  selectCoords,
  selectLocationWithLoading,
} from './location-store';

// Weather Store
export {
  useWeatherStore,
  selectWeatherData,
  selectIsLoading as selectWeatherIsLoading,
  selectIsRefreshing,
  selectError as selectWeatherError,
  selectTodayWeather,
  selectLastYearWeather,
  selectTemperatureDiff,
} from './weather-store';
