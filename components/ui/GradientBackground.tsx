/**
 * Dynamic gradient background based on current temperature
 * Modern design 2025: Temperature-based color system
 */

import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { getTemperatureGradient } from '@/utils/temperature-utils';

interface GradientBackgroundProps {
  temperature: number;
  children: React.ReactNode;
}

export function GradientBackground({ temperature, children }: GradientBackgroundProps) {
  const colors = getTemperatureGradient(temperature);

  return (
    <LinearGradient colors={colors as any} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
