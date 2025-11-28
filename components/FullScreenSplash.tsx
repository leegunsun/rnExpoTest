import { Image, StyleSheet, View, Dimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

interface FullScreenSplashProps {
  onAnimationComplete: () => void;
  minimumDuration?: number;
}

export function FullScreenSplash({
  onAnimationComplete,
  minimumDuration = 1500
}: FullScreenSplashProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    const hideNativeSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideNativeSplash();

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)();
        }
      });
    }, minimumDuration);

    return () => clearTimeout(timer);
  }, [minimumDuration, onAnimationComplete, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image
        source={require('@/assets/images/splash.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A1A2E',
    zIndex: 9999,
  },
  image: {
    width: width,
    height: height,
  },
});
