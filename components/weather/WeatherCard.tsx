/**
 * Individual weather card component for today or last year
 */

import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcons } from '@/constants/weather-theme';
import { formatTemperature } from '@/utils/temperature-utils';
import { getYearLabel } from '@/utils/date-utils';
import type { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  isToday?: boolean;
}

export function WeatherCard({ weather, isToday = false }: WeatherCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{getYearLabel(weather.date)}</Text>

      <View style={styles.iconRow}>
        <Text style={[styles.weatherIcon, isToday && styles.iconLarge]}>{WeatherIcons[weather.weatherCondition]}</Text>
      </View>

      <Text style={[styles.temperature, isToday ? styles.mainTemperature : styles.secondaryTemperature]}>
        {formatTemperature(weather.temperature)}
      </Text>

      <Text style={styles.feelsLike}>
        체감 {formatTemperature(weather.feelsLike)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  iconRow: {
    marginBottom: 4,
  },
  weatherIcon: {
    fontSize: 36,
  },
  iconLarge: {
    fontSize: 44,
  },
  temperature: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  mainTemperature: {
    fontSize: 48,
    lineHeight: 52,
  },
  secondaryTemperature: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '400',
    opacity: 0.8,
  },
  feelsLike: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
