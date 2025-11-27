/**
 * Location and date header component
 */

import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Spacing } from '@/constants/weather-theme';
import { formatDateKorean } from '@/utils/date-utils';
import { ms, s } from '@/utils/responsive';
import type { LocationInfo } from '@/types/weather';

interface LocationHeaderProps {
  location: LocationInfo;
  date: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExamplesPress?: () => void;
  onRouteGroupsPress?: () => void;
  onCharacterChartPress?: () => void;
}

export function LocationHeader({
  location,
  date,
  onRefresh,
  isRefreshing,
  onExamplesPress,
  onRouteGroupsPress,
  onCharacterChartPress,
}: LocationHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Buttons */}
        <View style={styles.leftButtons}>
          {/* Examples Button */}
          {onExamplesPress && (
            <TouchableOpacity style={styles.examplesButton} onPress={onExamplesPress}>
              <Text style={styles.examplesIcon}>📚</Text>
            </TouchableOpacity>
          )}
          {/* Route Groups Guide Button */}
          {onRouteGroupsPress && (
            <TouchableOpacity style={styles.routeGroupsButton} onPress={onRouteGroupsPress}>
              <Text style={styles.routeGroupsIcon}>🎯</Text>
            </TouchableOpacity>
          )}
          {/* Character Chart Button */}
          {onCharacterChartPress && (
            <TouchableOpacity style={styles.chartButton} onPress={onCharacterChartPress}>
              <Text style={styles.chartIcon}>📊</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center: Location & Date */}
        <View style={styles.textContainer}>
          <Text style={styles.location}>
            {location.city} {location.district}
          </Text>
          <Text style={styles.date}>{formatDateKorean(date)}</Text>
        </View>

        {/* Refresh Button (Right) */}
        {onRefresh && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.refreshIcon}>🔄</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  location: {
    fontSize: ms(18),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  date: {
    fontSize: ms(13),
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  leftButtons: {
    flexDirection: 'row',
    gap: s(8),
  },
  examplesButton: {
    width: s(36),
    height: s(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  examplesIcon: {
    fontSize: ms(20, 0.3),
  },
  routeGroupsButton: {
    width: s(36),
    height: s(36),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderRadius: s(8),
  },
  routeGroupsIcon: {
    fontSize: ms(20, 0.3),
  },
  chartButton: {
    width: s(36),
    height: s(36),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: s(8),
  },
  chartIcon: {
    fontSize: ms(20, 0.3),
  },
  refreshButton: {
    width: s(36),
    height: s(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: ms(20, 0.3),
  },
});
