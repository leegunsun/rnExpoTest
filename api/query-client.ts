import { QueryClient, onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

/**
 * React Query Configuration
 *
 * QueryClient setup with React Native network status integration.
 * Based on TanStack Query v5 official documentation for React Native.
 * @see https://tanstack.com/query/v5/docs/framework/react/react-native
 */

/**
 * Configure onlineManager for React Native
 * Bridges native network status into React Query's onlineManager
 * so queries automatically refetch on reconnect.
 */
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

/**
 * Create QueryClient with default options
 * @see https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-react-query-3
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Queries are considered fresh for 1 minute
        staleTime: 60 * 1000, // 1 minute

        // Garbage collection time - cache data for 5 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes

        // Retry failed requests
        retry: 2,

        // Refetch on window focus (useful for web)
        refetchOnWindowFocus: false,

        // Refetch on reconnect
        refetchOnReconnect: true,

        // Refetch on mount if data is stale
        refetchOnMount: true,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  });
}
