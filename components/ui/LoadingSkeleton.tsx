/**
 * Loading skeleton component
 */

import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Spacing, BorderRadius } from '@/constants/weather-theme';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
}: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface LoadingCardProps {
  style?: object;
}

export function LoadingCard({ style }: LoadingCardProps) {
  return (
    <View style={[styles.card, style]}>
      <LoadingSkeleton width="40%" height={24} style={styles.mb8} />
      <LoadingSkeleton width="60%" height={48} style={styles.mb16} />
      <LoadingSkeleton width="50%" height={20} style={styles.mb8} />
      <LoadingSkeleton width="70%" height={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  mb8: {
    marginBottom: Spacing.sm,
  },
  mb16: {
    marginBottom: Spacing.md,
  },
});
