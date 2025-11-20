/**
 * Main screen - Weather Time Machine
 * Displays today's weather vs last year's weather comparison
 * Single screen layout without scrolling
 */

import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { LocationHeader } from '@/components/weather/LocationHeader';
import { ComparisonCard } from '@/components/weather/ComparisonCard';
import { WeatherDetails } from '@/components/weather/WeatherDetails';
import { useLocation } from '@/hooks/use-location';
import { useWeatherComparison } from '@/hooks/use-weather-comparison';
import { getCurrentDate } from '@/utils/date-utils';
import { Spacing } from '@/constants/weather-theme';

export default function HomeScreen() {
  // Location hook
  const { location, isLoading: locationLoading } = useLocation();

  // Weather data hook
  const {
    weatherData,
    isLoading: weatherLoading,
    isRefreshing,
    refresh,
  } = useWeatherComparison({
    latitude: location?.coords.latitude ?? 37.5665,
    longitude: location?.coords.longitude ?? 126.978,
    enabled: !!location,
  });

  // Loading state
  const isLoading = locationLoading || weatherLoading;

  // Get current temperature for gradient background
  const currentTemperature = weatherData?.today.temperature ?? 20;

  return (
    <GradientBackground temperature={currentTemperature}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Loading State */}
        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>날씨 정보를 불러오는 중...</Text>
          </View>
        )}

        {/* Error State */}
        {!isLoading && !weatherData && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>날씨 정보를 불러올 수 없습니다</Text>
            <Text style={styles.errorSubtext}>새로고침 버튼을 눌러주세요</Text>
          </View>
        )}

        {/* Main Weather Content - Flat Structure with Flex */}
        {!isLoading && weatherData && location && (
          <>
            {/* 1. Location Header (flex: 1) */}
            <View style={styles.headerWrapper}>
              <LocationHeader
                location={location}
                date={getCurrentDate()}
                onRefresh={refresh}
                isRefreshing={isRefreshing}
              />
            </View>

            {/* 2. Comparison Card (flex: 7) */}
            <View style={styles.comparisonWrapper}>
              <ComparisonCard weatherData={weatherData} />
            </View>

            {/* 3. Weather Details (flex: 2) */}
            <View style={styles.detailsWrapper}>
              <WeatherDetails weather={weatherData.today} />
            </View>
          </>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Flat structure: All three components at the same level
  headerWrapper: {
    flex: 1, // 10% of screen (AppBar)
    justifyContent: 'center',
  },
  comparisonWrapper: {
    flex: 7, // 70% of screen (Main Content)
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  detailsWrapper: {
    flex: 2, // 20% of screen (Bottom Details)
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});
