/**
 * Responsive scaling utilities using react-native-size-matters
 * Based on design size: 375x812 (iPhone 11 Pro standard)
 */

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

/**
 * 너비 기준 반응형 스케일링
 * @param size 디자인 기준 크기
 * @returns 화면 너비에 비례하여 스케일링된 크기
 *
 * @example
 * const styles = StyleSheet.create({
 *   container: { width: s(100) } // 375px 기준 100 → 실제 화면에 맞게 조정
 * });
 */
export const s = (size: number): number => scale(size);

/**
 * 높이 기준 반응형 스케일링
 * @param size 디자인 기준 크기
 * @returns 화면 높이에 비례하여 스케일링된 크기
 *
 * @example
 * const styles = StyleSheet.create({
 *   container: { height: vs(200) } // 812px 기준 200 → 실제 화면에 맞게 조정
 * });
 */
export const vs = (size: number): number => verticalScale(size);

/**
 * 적당한 반응형 스케일링 (폰트, 아이콘에 적합)
 * 너비 기준으로 스케일링하되 factor로 과도한 확대/축소 방지
 * @param size 디자인 기준 크기
 * @param factor 스케일 적용 비율 (기본값: 0.5, 범위: 0~1)
 * @returns 적당하게 스케일링된 크기
 *
 * @example
 * const styles = StyleSheet.create({
 *   text: { fontSize: ms(16) },      // 기본 factor 0.5
 *   icon: { fontSize: ms(24, 0.3) }  // factor 0.3으로 더 보수적 스케일링
 * });
 */
export const ms = (size: number, factor?: number): number => moderateScale(size, factor);

/**
 * 반응형 스케일링 헬퍼 - 별칭
 */
export const responsive = {
  /** 너비 기준 스케일링 */
  width: s,
  /** 높이 기준 스케일링 */
  height: vs,
  /** 적당한 스케일링 (폰트/아이콘) */
  moderate: ms,
  /** 폰트 전용 (기본 factor 0.5) */
  font: (size: number) => ms(size, 0.5),
  /** 아이콘 전용 (기본 factor 0.3) */
  icon: (size: number) => ms(size, 0.3),
} as const;

/**
 * 디자인 기준 크기
 * react-native-size-matters는 기본적으로 다음 크기를 기준으로 함:
 * - 너비: 350 (하지만 일반적으로 375 권장)
 * - 높이: 680 (하지만 일반적으로 812 권장)
 *
 * 필요시 ScaledSheet와 함께 커스텀 기준 크기 설정 가능
 */
export const DESIGN_WIDTH = 375;
export const DESIGN_HEIGHT = 812;
