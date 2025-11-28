import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { createQueryClient } from '@/api/query-client';
import { FullScreenSplash } from '@/components/FullScreenSplash';

// Prevent native splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  // Create QueryClient once per app lifecycle
  // @see https://tanstack.com/query/v5/docs/framework/react/react-native
  const [queryClient] = useState(() => createQueryClient());

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // For iOS, hide native splash immediately since enableFullScreenImage_legacy handles it
  useEffect(() => {
    if (Platform.OS === 'ios') {
      // iOS uses native full-screen splash, so we can skip JS splash
      SplashScreen.hideAsync();
      setShowSplash(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="character-chart"
            options={{
              title: '캐릭터 매력 차트',
              headerShown: true,
            }}
          />
        </Stack>
        {showSplash && Platform.OS === 'android' && (
          <FullScreenSplash
            onAnimationComplete={handleSplashComplete}
            minimumDuration={1500}
          />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
