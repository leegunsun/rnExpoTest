/**
 * Custom hook for location services
 *
 * 이 훅은 Zustand Store를 래핑하여 기존 인터페이스를 유지합니다.
 * 이렇게 하면 기존 코드의 변경을 최소화하면서 마이그레이션할 수 있습니다.
 *
 * 학습 포인트:
 * 1. 스토어를 훅으로 래핑하는 패턴
 * 2. 기존 인터페이스 유지하며 구현 교체
 * 3. useEffect로 초기 데이터 로딩
 * 4. 선택적 구독으로 성능 최적화
 */

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useLocationStore } from '@/store/location-store';
import type { LocationInfo } from '@/types/weather';

// ============================================================
// 타입 정의
// ============================================================

interface UseLocationReturn {
  /** 현재 위치 정보 */
  location: LocationInfo | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 위치 재요청 함수 */
  requestLocation: () => Promise<void>;
}

// ============================================================
// 훅 구현
// ============================================================

/**
 * 위치 서비스 훅
 *
 * 내부적으로 Zustand Store를 사용하지만,
 * 기존과 동일한 인터페이스를 제공합니다.
 *
 * @example
 * function MyComponent() {
 *   const { location, isLoading, error, requestLocation } = useLocation();
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error} />;
 *
 *   return <LocationDisplay location={location} />;
 * }
 */
export function useLocation(): UseLocationReturn {
  // 학습 포인트: useShallow
  // useShallow를 사용하면 객체 내부의 값이 같으면 리렌더링을 방지합니다.
  // 여러 상태를 한 번에 선택할 때 유용합니다.
  const { location, isLoading, error, requestLocation } = useLocationStore(
    useShallow((state) => ({
      location: state.location,
      isLoading: state.isLoading,
      error: state.error,
      requestLocation: state.requestLocation,
    }))
  );

  // 마운트 시 위치 요청 (위치가 없을 때만)
  useEffect(() => {
    if (!location && !isLoading) {
      requestLocation();
    }
  }, [location, isLoading, requestLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
  };
}

// ============================================================
// 추가 훅들 (학습용)
// ============================================================

/**
 * 위치 좌표만 가져오는 훅
 *
 * 학습 포인트: 선택적 구독
 * - 좌표만 필요할 때 사용
 * - 다른 상태(city, district 등)가 변경되어도 리렌더링 안 함
 *
 * @example
 * function MapComponent() {
 *   const coords = useLocationCoords();
 *   // 좌표만 사용하므로 city/district 변경 시 리렌더링 안 함
 *   return <Map center={coords} />;
 * }
 */
export function useLocationCoords() {
  return useLocationStore((state) => state.location?.coords);
}

/**
 * 위치 로딩 상태만 가져오는 훅
 *
 * @example
 * function LoadingIndicator() {
 *   const isLoading = useLocationLoading();
 *   return isLoading ? <Spinner /> : null;
 * }
 */
export function useLocationLoading() {
  return useLocationStore((state) => state.isLoading);
}

/**
 * 위치 에러만 가져오는 훅
 *
 * @example
 * function ErrorBanner() {
 *   const error = useLocationError();
 *   return error ? <Banner type="error">{error}</Banner> : null;
 * }
 */
export function useLocationError() {
  return useLocationStore((state) => state.error);
}

/**
 * 위치 액션만 가져오는 훅
 *
 * 학습 포인트: 액션만 선택
 * - 액션은 참조가 안정적이므로 리렌더링을 유발하지 않음
 * - 이벤트 핸들러에서 위치 업데이트가 필요할 때 유용
 *
 * @example
 * function RefreshButton() {
 *   const requestLocation = useLocationActions();
 *   // 이 컴포넌트는 위치 상태가 변경되어도 리렌더링되지 않음
 *   return <Button onPress={requestLocation}>위치 새로고침</Button>;
 * }
 */
export function useLocationActions() {
  return useLocationStore((state) => state.requestLocation);
}
