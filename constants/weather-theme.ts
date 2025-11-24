/**
 * Weather-specific theme constants extending base theme
 * Based on modern app design trends 2025
 */

import { moderateScale } from 'react-native-size-matters';

export const WeatherColors = {
  warmer: {
    primary: '#10B981',
    gradient: ['#10B981', '#34D399'],
    text: '#FFFFFF',
  },
  colder: {
    primary: '#3B82F6',
    gradient: ['#3B82F6', '#60A5FA'],
    text: '#FFFFFF',
  },
  similar: {
    primary: '#9CA3AF',
    gradient: ['#9CA3AF', '#D1D5DB'],
    text: '#FFFFFF',
  },
  // Temperature-based color system (영하 ~ 30°C+) - Natural and harmonious tones
  temperature: {
    freezing: ['#1e40af', '#3b82f6'], // 영하: 깊은 파란색 (차가운 겨울)
    cold: ['#0ea5e9', '#38bdf8'], // 0-10°C: 맑은 하늘색 (쌀쌀한 봄)
    mild: ['#10b981', '#34d399'], // 10-20°C: 신선한 초록 (쾌적한 날씨)
    warm: ['#f59e0b', '#fbbf24'], // 20-30°C: 따뜻한 황금색 (화창한 여름)
    hot: ['#ef4444', '#f87171'], // 30°C+: 생동감 있는 빨강 (무더운 날)
  },
  // Comparison colors - Harmonious with natural feeling
  comparison: {
    warmer: '#f59e0b', // 따뜻한 황금색: 따뜻해짐
    colder: '#3b82f6', // 맑은 파란색: 추워짐
    similar: '#8b5cf6', // 차분한 보라: 비슷함
  },
  weather: {
    sunny: '#FFD93D',
    cloudy: '#BDC3C7',
    rainy: '#3498DB',
    snowy: '#ECF0F1',
  },
  background: {
    light: '#F8F9FA',
    dark: '#1A1A2E',
  },
  card: {
    light: '#FFFFFF',
    dark: '#16213E',
  },
  text: {
    light: '#2C3E50',
    dark: '#FFFFFF',
  },
  textSecondary: {
    light: '#7F8C8D',
    dark: '#BDC3C7',
  },
} as const;

/**
 * Responsive Typography using react-native-size-matters
 * All font sizes automatically scale based on screen size
 * @example
 * import { Typography } from '@/constants/weather-theme';
 * const styles = StyleSheet.create({
 *   text: { ...Typography.mainTemperature }
 * });
 */
export const Typography = {
  mainTemperature: {
    fontSize: moderateScale(72), // 60-80px range for main temperature
    fontWeight: 'bold' as const,
    lineHeight: moderateScale(80),
  },
  secondaryTemperature: {
    fontSize: moderateScale(48), // 40-50px for secondary temperature
    fontWeight: '400' as const,
    lineHeight: moderateScale(56),
  },
  temperatureDiff: {
    fontSize: moderateScale(32), // 24-32px for difference display
    fontWeight: '600' as const,
    lineHeight: moderateScale(40),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '400' as const,
    opacity: 0.7,
    lineHeight: moderateScale(20),
  },
  location: {
    fontSize: moderateScale(20),
    fontWeight: '500' as const,
    lineHeight: moderateScale(28),
  },
  date: {
    fontSize: moderateScale(16),
    fontWeight: '400' as const,
    lineHeight: moderateScale(24),
  },
  weatherDetail: {
    fontSize: moderateScale(15),
    fontWeight: '500' as const,
    lineHeight: moderateScale(22),
  },
  weatherDetailValue: {
    fontSize: moderateScale(18),
    fontWeight: '600' as const,
    lineHeight: moderateScale(24),
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 12,
  md: 20,
  lg: 28, // Enhanced for soft UI trend
  xl: 36,
  full: 999,
} as const;

export const WeatherIcons = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
} as const;
