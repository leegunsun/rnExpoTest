/**
 * Weather Store - Zustand를 활용한 날씨 상태 관리
 *
 * 학습 포인트:
 * 1. 기본 스토어 (persist 없음) - Location Store와 비교
 * 2. subscribeWithSelector - 선택적 구독으로 성능 최적화
 * 3. 스토어 간 연동 - Location Store와 연계
 * 4. computed 값 패턴 - 파생 상태 계산
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { WeatherComparison, TemperatureComparison } from '@/types/weather';
import { weatherService } from '@/services/weather-service';
import { useLocationStore } from './location-store';

// ============================================================
// 타입 정의
// ============================================================

/** Weather Store 상태 인터페이스 */
interface WeatherState {
  // === State ===
  /** 날씨 비교 데이터 */
  weatherData: WeatherComparison | null;
  /** 초기 로딩 상태 */
  isLoading: boolean;
  /** 새로고침 상태 */
  isRefreshing: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/** Weather Store 액션 인터페이스 */
interface WeatherActions {
  // === Actions ===
  /** 날씨 데이터 가져오기 */
  fetchWeather: (latitude: number, longitude: number) => Promise<void>;
  /** 날씨 데이터 새로고침 */
  refresh: (latitude: number, longitude: number) => Promise<void>;
  /** 현재 위치 기반으로 날씨 가져오기 (Location Store 연동) */
  fetchWeatherFromCurrentLocation: () => Promise<void>;
  /** 스토어 초기화 */
  reset: () => void;
}

/** Computed(파생) 값 인터페이스 */
interface WeatherComputed {
  // === Computed ===
  /** 현재 온도 */
  currentTemperature: number | null;
  /** 작년 온도 */
  lastYearTemperature: number | null;
  /** 온도 차이 */
  temperatureDifference: number | null;
  /** 온도 비교 결과 */
  temperatureComparison: TemperatureComparison | null;
}

/** 전체 스토어 타입 */
type WeatherStore = WeatherState & WeatherActions & WeatherComputed;

// ============================================================
// 상수
// ============================================================

/** 초기 상태 */
const initialState: WeatherState = {
  weatherData: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

// ============================================================
// 헬퍼 함수
// ============================================================

/**
 * 온도 비교 결과 계산
 * @param todayTemp 오늘 온도
 * @param lastYearTemp 작년 온도
 * @returns 비교 결과 ('warmer' | 'colder' | 'similar')
 */
function calculateTemperatureComparison(
  todayTemp: number,
  lastYearTemp: number
): TemperatureComparison {
  const diff = todayTemp - lastYearTemp;
  if (diff > 2) return 'warmer';
  if (diff < -2) return 'colder';
  return 'similar';
}

// ============================================================
// 스토어 생성
// ============================================================

/**
 * Weather Store
 *
 * subscribeWithSelector 미들웨어 사용:
 * - 특정 상태 변경만 구독 가능
 * - 외부에서 상태 변화 감지 가능
 *
 * @example
 * // 컴포넌트에서 사용
 * function WeatherDisplay() {
 *   const weatherData = useWeatherStore((state) => state.weatherData);
 *   const fetchWeather = useWeatherStore((state) => state.fetchWeather);
 *
 *   // computed 값 사용
 *   const tempDiff = useWeatherStore((state) => state.temperatureDifference);
 * }
 *
 * // 외부에서 구독 (예: 로깅, 분석)
 * useWeatherStore.subscribe(
 *   (state) => state.weatherData,
 *   (weatherData) => console.log('날씨 데이터 변경:', weatherData)
 * );
 */
export const useWeatherStore = create<WeatherStore>()(
  subscribeWithSelector((set, get) => ({
    // === 초기 상태 ===
    ...initialState,

    // === Computed 값 (getter 패턴) ===
    // 참고: Zustand는 진정한 computed를 지원하지 않으므로
    // get()을 통해 현재 상태에서 계산합니다.

    get currentTemperature() {
      return get().weatherData?.today.temperature ?? null;
    },

    get lastYearTemperature() {
      return get().weatherData?.lastYear.temperature ?? null;
    },

    get temperatureDifference() {
      const data = get().weatherData;
      if (!data) return null;
      return data.today.temperature - data.lastYear.temperature;
    },

    get temperatureComparison() {
      const data = get().weatherData;
      if (!data) return null;
      return calculateTemperatureComparison(
        data.today.temperature,
        data.lastYear.temperature
      );
    },

    // === 액션 구현 ===

    /**
     * 날씨 데이터 가져오기
     * - 초기 로딩 시 사용
     */
    fetchWeather: async (latitude, longitude) => {
      set({ isLoading: true, error: null });

      try {
        const data = await weatherService.getWeatherComparison(latitude, longitude);
        set({ weatherData: data, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : '날씨 정보를 가져올 수 없습니다',
          isLoading: false,
        });
      }
    },

    /**
     * 날씨 데이터 새로고침
     * - Pull-to-refresh 등에서 사용
     * - 기존 데이터를 유지하면서 새 데이터로 교체
     */
    refresh: async (latitude, longitude) => {
      set({ isRefreshing: true, error: null });

      try {
        const data = await weatherService.getWeatherComparison(latitude, longitude);
        set({ weatherData: data, isRefreshing: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : '날씨 정보를 가져올 수 없습니다',
          isRefreshing: false,
        });
      }
    },

    /**
     * 현재 위치 기반으로 날씨 가져오기
     *
     * 학습 포인트: 스토어 간 연동
     * - 다른 스토어(Location Store)의 상태를 읽어와 사용
     * - 이 패턴으로 스토어 간 의존성을 관리할 수 있음
     */
    fetchWeatherFromCurrentLocation: async () => {
      const location = useLocationStore.getState().location;

      if (!location) {
        set({ error: '위치 정보가 없습니다' });
        return;
      }

      const { latitude, longitude } = location.coords;
      await get().fetchWeather(latitude, longitude);
    },

    /**
     * 스토어 초기화
     */
    reset: () => set(initialState),
  }))
);

// ============================================================
// 선택자 (Selectors)
// ============================================================

/** 날씨 데이터 선택 */
export const selectWeatherData = (state: WeatherStore) => state.weatherData;

/** 로딩 상태 선택 */
export const selectIsLoading = (state: WeatherStore) => state.isLoading;

/** 새로고침 상태 선택 */
export const selectIsRefreshing = (state: WeatherStore) => state.isRefreshing;

/** 에러 선택 */
export const selectError = (state: WeatherStore) => state.error;

/** 오늘 날씨만 선택 */
export const selectTodayWeather = (state: WeatherStore) => state.weatherData?.today;

/** 작년 날씨만 선택 */
export const selectLastYearWeather = (state: WeatherStore) => state.weatherData?.lastYear;

/** 온도 차이 선택 */
export const selectTemperatureDiff = (state: WeatherStore) => {
  if (!state.weatherData) return null;
  return state.weatherData.today.temperature - state.weatherData.lastYear.temperature;
};

// ============================================================
// 구독 헬퍼 (외부 사이드 이펙트용)
// ============================================================

/**
 * 학습 포인트: subscribeWithSelector 활용
 *
 * subscribeWithSelector 미들웨어를 사용하면
 * 특정 상태 변경 시에만 콜백을 실행할 수 있습니다.
 *
 * @example
 * // 날씨 데이터 변경 시 분석 이벤트 전송
 * const unsubscribe = useWeatherStore.subscribe(
 *   (state) => state.weatherData,
 *   (weatherData, prevWeatherData) => {
 *     if (weatherData && !prevWeatherData) {
 *       analytics.track('weather_loaded');
 *     }
 *   }
 * );
 *
 * // 구독 해제
 * unsubscribe();
 */
