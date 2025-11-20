/**
 * Weather details component (humidity, wind, AQI)
 * Human-friendly design: Dark translucent background with clear contrast
 */

import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Spacing, BorderRadius } from '@/constants/weather-theme';
import type { WeatherData } from '@/types/weather';

interface WeatherDetailsProps {
  weather: WeatherData;
}

interface DetailItemProps {
  label: string;
  value: string;
  icon: string;
}

function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  const getAQILevel = (aqi: number): string => {
    if (aqi <= 50) return '좋음';
    if (aqi <= 100) return '보통';
    if (aqi <= 150) return '나쁨';
    return '매우 나쁨';
  };

  const DetailsContent = (
    <>
      <DetailItem label="습도" value={`${weather.humidity}%`} icon="💧" />
      <DetailItem label="바람" value={`${weather.windSpeed}km/h`} icon="💨" />
      <DetailItem label="미세먼지" value={getAQILevel(weather.aqi)} icon="🌫️" />
    </>
  );

  return (
    <View style={styles.wrapper}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={40} tint="dark" style={styles.container}>
          {DetailsContent}
        </BlurView>
      ) : (
        <View style={[styles.container, styles.androidContainer]}>
          {DetailsContent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  androidContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
