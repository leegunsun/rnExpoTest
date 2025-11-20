/**
 * Location and date header component
 */

import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Spacing } from '@/constants/weather-theme';
import { formatDateKorean } from '@/utils/date-utils';
import type { LocationInfo } from '@/types/weather';

interface LocationHeaderProps {
  location: LocationInfo;
  date: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function LocationHeader({ location, date, onRefresh, isRefreshing }: LocationHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.location}>
            {location.city} {location.district}
          </Text>
          <Text style={styles.date}>{formatDateKorean(date)}</Text>
        </View>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  refreshButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  refreshIcon: {
    fontSize: 20,
  },
});
