/**
 * Temperature comparison indicator component
 * Human-friendly design: Prominent color-coded comparison
 */

import { View, Text, StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '@/constants/weather-theme';
import {
  getTemperatureDifference,
  formatTemperatureDifference,
  getTemperatureArrow,
  getTemperatureComparisonText,
  getComparisonColor,
} from '@/utils/temperature-utils';
import type { TemperatureComparison } from '@/types/weather';

interface ComparisonIndicatorProps {
  todayTemp: number;
  lastYearTemp: number;
  comparison: TemperatureComparison;
}

export function ComparisonIndicator({
  todayTemp,
  lastYearTemp,
  comparison,
}: ComparisonIndicatorProps) {
  const diff = getTemperatureDifference(todayTemp, lastYearTemp);
  const arrow = getTemperatureArrow(comparison);
  const text = getTemperatureComparisonText(comparison);
  const comparisonColor = getComparisonColor(comparison);

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <View style={[styles.content, { backgroundColor: `${comparisonColor}25` }]}>
        <Text style={[styles.arrow, { color: comparisonColor }]}>{arrow}</Text>
        <Text style={[styles.difference, { color: '#FFFFFF' }]}>
          {formatTemperatureDifference(diff)}
        </Text>
        <Text style={styles.description}>{text}</Text>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    marginVertical: 2,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 4,
  },
  content: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: '70%',
  },
  arrow: {
    fontSize: 24,
    marginBottom: 2,
  },
  difference: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
