import { GradientBackground } from '@/components/ui/GradientBackground';
import { LocationHeader } from '@/components/weather/LocationHeader';
import { WeatherDetails } from '@/components/weather/WeatherDetails';
import { Spacing } from '@/constants/weather-theme';
import { useLocation } from '@/hooks/use-location';
import { useWeatherComparison } from '@/hooks/use-weather-comparison';
import { getCurrentDate } from '@/utils/date-utils';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // Router for navigation
  const router = useRouter();

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

  // Navigate to examples menu
  const handleExamplesPress = () => {
    // Route groups (examples) are not included in URL paths
    // The actual path to app/(examples)/index.tsx is implementation-dependent
    // Try using the screen name directly or a specific example route
    router.push('/layout-examples'); // Or create a proper route outside of route groups
  };

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

        {/* Main Weather Content - Spacer Pattern */}
        {!isLoading && weatherData && location && (
          <>
            {/* 1. Location Header - Top */}
            <LocationHeader
              location={location}
              date={getCurrentDate()}
              onRefresh={refresh}
              isRefreshing={isRefreshing}
              onExamplesPress={handleExamplesPress}
            />

            {/* 2. Spacer - Takes all remaining space */}
            <View style={{ flex: 1 }} />

            {/* 3. Weather Details - Bottom */}
            <WeatherDetails weather={weatherData.today} />
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
