/**
 * Main weather comparison card component
 * Human-friendly design: Dark translucent background with clear contrast
 */

import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { WeatherCard } from './WeatherCard';
import { ComparisonIndicator } from './ComparisonIndicator';
import { BorderRadius, Spacing } from '@/constants/weather-theme';
import { getTemperatureComparison } from '@/utils/temperature-utils';
import type { WeatherComparison } from '@/types/weather';

interface ComparisonCardProps {
  weatherData: WeatherComparison;
}

export function ComparisonCard({ weatherData }: ComparisonCardProps) {
  const { today, lastYear } = weatherData;
  const comparison = getTemperatureComparison(today.temperature, lastYear.temperature);

  const CardContent = (
    <>
      <View style={styles.weatherRow}>
        <WeatherCard weather={today} isToday />
      </View>

      <ComparisonIndicator
        todayTemp={today.temperature}
        lastYearTemp={lastYear.temperature}
        comparison={comparison}
      />

      <View style={styles.weatherRow}>
        <WeatherCard weather={lastYear} />
      </View>
    </>
  );

  return (
    <View style={styles.cardContainer}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={40} tint="dark" style={styles.card}>
          {CardContent}
        </BlurView>
      ) : (
        <View style={[styles.card, styles.androidCard]}>
          {CardContent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  androidCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  weatherRow: {
    flexDirection: 'row',
  },
});
