/**
 * Cross-platform shadow utilities
 * Handles the deprecation of shadow* props on web by using boxShadow
 */

import { Platform, ViewStyle } from 'react-native';

interface ShadowOptions {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
}

/**
 * Creates cross-platform shadow styles
 * Uses boxShadow for web, native shadow props for iOS/Android
 */
export function createShadow({
  color = '#000',
  offsetX = 0,
  offsetY = 4,
  opacity = 0.3,
  radius = 8,
  elevation = 8,
}: ShadowOptions = {}): ViewStyle {
  if (Platform.OS === 'web') {
    // Convert to CSS boxShadow for web
    // Parse color to get rgba values
    const rgbaColor = hexToRgba(color, opacity);
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px ${rgbaColor}`,
    } as ViewStyle;
  }

  // Native shadow props for iOS/Android
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: elevation,
  };
}

/**
 * Predefined shadow presets for common use cases
 */
export const shadows = {
  /** Subtle shadow for cards and containers */
  sm: createShadow({
    offsetY: 1,
    opacity: 0.05,
    radius: 2,
    elevation: 1,
  }),

  /** Default shadow for floating elements */
  md: createShadow({
    offsetY: 2,
    opacity: 0.1,
    radius: 4,
    elevation: 2,
  }),

  /** Pronounced shadow for elevated UI */
  lg: createShadow({
    offsetY: 4,
    opacity: 0.2,
    radius: 8,
    elevation: 4,
  }),

  /** Strong shadow for FABs and modals */
  xl: createShadow({
    offsetY: 8,
    opacity: 0.3,
    radius: 12,
    elevation: 8,
  }),

  /** No shadow */
  none: {} as ViewStyle,
};

/**
 * Convert hex color to rgba string
 */
function hexToRgba(hex: string, alpha: number): string {
  // Handle shorthand hex
  let fullHex = hex.replace('#', '');
  if (fullHex.length === 3) {
    fullHex = fullHex.split('').map(c => c + c).join('');
  }

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
