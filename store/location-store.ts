/**
 * Location Store - Zustand를 활용한 위치 상태 관리
 *
 * 학습 포인트:
 * 1. create() - 스토어 생성
 * 2. persist middleware - AsyncStorage 연동으로 상태 지속
 * 3. 비동기 액션 - async/await로 비동기 작업 처리
 * 4. 선택적 구독 - 필요한 상태만 선택하여 리렌더링 최적화
 * 5. TypeScript 타이핑 - 타입 안전성 확보
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import type { LocationInfo } from '@/types/weather';

// ============================================================
// 타입 정의
// ============================================================

/** 위치 권한 상태 */
type PermissionStatus = 'undetermined' | 'granted' | 'denied';

/** Location Store 상태 인터페이스 */
interface LocationState {
  // === State ===
  /** 현재 위치 정보 */
  location: LocationInfo | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 위치 권한 상태 */
  permissionStatus: PermissionStatus;
  /** 마지막 업데이트 시간 */
  lastUpdated: Date | null;
}

/** Location Store 액션 인터페이스 */
interface LocationActions {
  // === Actions ===
  /** 위치 권한 요청 및 현재 위치 가져오기 */
  requestLocation: () => Promise<void>;
  /** 위치 직접 설정 (테스트 또는 수동 입력용) */
  setLocation: (location: LocationInfo) => void;
  /** 에러 설정/초기화 */
  setError: (error: string | null) => void;
  /** 스토어 초기화 */
  reset: () => void;
}

/** 전체 스토어 타입 */
type LocationStore = LocationState & LocationActions;

// ============================================================
// 상수
// ============================================================

/** 기본 위치 (서울) - 권한 거부 시 사용 */
const DEFAULT_LOCATION: LocationInfo = {
  city: '서울시',
  district: '강남구',
  coords: {
    latitude: 37.5665,
    longitude: 126.978,
  },
};

/** 초기 상태 */
const initialState: LocationState = {
  location: null,
  isLoading: false,
  error: null,
  permissionStatus: 'undetermined',
  lastUpdated: null,
};

// ============================================================
// 스토어 생성
// ============================================================

/**
 * Location Store
 *
 * @example
 * // 컴포넌트에서 사용
 * function MyComponent() {
 *   // 전체 상태 구독
 *   const { location, isLoading, requestLocation } = useLocationStore();
 *
 *   // 선택적 구독 (리렌더링 최적화)
 *   const location = useLocationStore((state) => state.location);
 *   const isLoading = useLocationStore((state) => state.isLoading);
 *
 *   // 액션만 가져오기 (상태 변경 시 리렌더링 안 함)
 *   const requestLocation = useLocationStore((state) => state.requestLocation);
 * }
 */
export const useLocationStore = create<LocationStore>()(
  // persist 미들웨어: 상태를 AsyncStorage에 저장
  persist(
    (set, get) => ({
      // === 초기 상태 ===
      ...initialState,

      // === 액션 구현 ===

      /**
       * 위치 권한 요청 및 현재 위치 가져오기
       * - 권한 요청 → 위치 가져오기 → 주소 변환 순서로 진행
       * - 각 단계에서 실패 시 적절한 폴백 처리
       */
      requestLocation: async () => {
        // 로딩 시작
        set({ isLoading: true, error: null });

        try {
          // 1. 위치 권한 요청
          const { status } = await Location.requestForegroundPermissionsAsync();

          if (status !== 'granted') {
            console.log('📍 위치 권한 거부됨, 기본 위치(서울) 사용');
            set({
              location: DEFAULT_LOCATION,
              isLoading: false,
              permissionStatus: 'denied',
              lastUpdated: new Date(),
            });
            return;
          }

          set({ permissionStatus: 'granted' });

          // 2. 현재 위치 가져오기
          try {
            const position = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            const { latitude, longitude } = position.coords;

            // 3. 역지오코딩으로 주소 변환
            try {
              const [address] = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
              });

              set({
                location: {
                  city: address?.city || address?.region || '현재 위치',
                  district: address?.district || address?.subregion || '',
                  coords: { latitude, longitude },
                },
                isLoading: false,
                lastUpdated: new Date(),
              });
            } catch (geocodeError) {
              // 역지오코딩 실패 시 좌표만 사용
              console.log('📍 주소 변환 실패, 좌표만 사용');
              set({
                location: {
                  city: '현재 위치',
                  district: '',
                  coords: { latitude, longitude },
                },
                isLoading: false,
                lastUpdated: new Date(),
              });
            }
          } catch (positionError) {
            // 위치 서비스 불가 (시뮬레이터/웹)
            console.log('📍 위치 서비스 불가, 기본 위치(서울) 사용');
            set({
              location: DEFAULT_LOCATION,
              isLoading: false,
              lastUpdated: new Date(),
            });
          }
        } catch (err) {
          // 권한 요청 자체 실패
          console.log('📍 위치 접근 실패, 기본 위치(서울) 사용');
          set({
            location: DEFAULT_LOCATION,
            isLoading: false,
            error: err instanceof Error ? err.message : '위치를 가져올 수 없습니다',
            lastUpdated: new Date(),
          });
        }
      },

      /**
       * 위치 직접 설정
       * - 테스트 또는 사용자가 직접 위치를 입력할 때 사용
       */
      setLocation: (location) =>
        set({
          location,
          lastUpdated: new Date(),
        }),

      /**
       * 에러 설정/초기화
       */
      setError: (error) => set({ error }),

      /**
       * 스토어 초기화
       * - 로그아웃이나 앱 초기화 시 사용
       */
      reset: () => set(initialState),
    }),
    {
      // persist 설정
      name: 'location-storage', // AsyncStorage 키 이름
      storage: createJSONStorage(() => AsyncStorage),
      // 저장할 상태만 선택 (위치 정보만 저장, 로딩/에러는 저장 안 함)
      partialize: (state) => ({
        location: state.location,
        permissionStatus: state.permissionStatus,
      }),
    }
  )
);

// ============================================================
// 선택자 (Selectors) - 리렌더링 최적화를 위한 헬퍼
// ============================================================

/**
 * 학습 포인트: 선택자 (Selector)
 *
 * Zustand에서 선택자를 사용하면 해당 상태가 변경될 때만 컴포넌트가 리렌더링됩니다.
 * 이는 React의 useMemo와 비슷한 효과를 제공합니다.
 *
 * @example
 * // 비효율적 - 모든 상태 변경 시 리렌더링
 * const { location } = useLocationStore();
 *
 * // 효율적 - location 변경 시에만 리렌더링
 * const location = useLocationStore(selectLocation);
 */

/** 위치 정보만 선택 */
export const selectLocation = (state: LocationStore) => state.location;

/** 로딩 상태만 선택 */
export const selectIsLoading = (state: LocationStore) => state.isLoading;

/** 에러만 선택 */
export const selectError = (state: LocationStore) => state.error;

/** 좌표만 선택 */
export const selectCoords = (state: LocationStore) => state.location?.coords;

/** 위치 + 로딩 상태 조합 선택 */
export const selectLocationWithLoading = (state: LocationStore) => ({
  location: state.location,
  isLoading: state.isLoading,
});

// ============================================================
// 스토어 외부에서 액션 호출 (비-React 환경)
// ============================================================

/**
 * 학습 포인트: 스토어 외부 접근
 *
 * Zustand 스토어는 React 컴포넌트 외부에서도 접근 가능합니다.
 * 이는 유틸리티 함수나 서비스에서 상태를 읽거나 변경할 때 유용합니다.
 *
 * @example
 * // 서비스 파일에서 현재 위치 가져오기
 * import { useLocationStore } from '@/store/location-store';
 *
 * function someUtilityFunction() {
 *   const location = useLocationStore.getState().location;
 *   // ...
 * }
 *
 * // 이벤트 핸들러에서 위치 업데이트
 * useLocationStore.getState().requestLocation();
 */
