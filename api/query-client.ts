import NetInfo from '@react-native-community/netinfo';
import {
  QueryClient,
  QueryCache,
  MutationCache,
  onlineManager,
  type Query,
  type Mutation,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Alert } from 'react-native';

/**
 * React Query Configuration
 *
 * QueryClient setup with React Native network status integration.
 * Includes QueryCache, MutationCache, and defaultOptions for comprehensive configuration.
 *
 * @see https://tanstack.com/query/v5/docs/framework/react/react-native
 * @see https://tanstack.com/query/v5/docs/reference/QueryClient
 */

// ============================================================================
// Types
// ============================================================================

/** HTTP status codes that should not trigger retry */
const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 422] as const;

type NonRetryableStatusCode = (typeof NON_RETRYABLE_STATUS_CODES)[number];

/** Error metadata for queries/mutations */
interface ErrorMeta {
  errorMessage?: string;
  showErrorToast?: boolean;
  silent?: boolean;
}

/** Extended Query with meta typing */
type QueryWithMeta = Query<unknown, unknown, unknown, readonly unknown[]> & {
  meta?: ErrorMeta;
};

/** Extended Mutation with meta typing */
type MutationWithMeta = Mutation<unknown, unknown, unknown, unknown> & {
  meta?: ErrorMeta;
};

/** Server error response structure */
interface ServerErrorResponse {
  message?: string;
  errorCode?: number;
}

/**
 * Server-defined error codes for special handling
 * These codes trigger specific UI actions (alerts, navigation, etc.)
 */
export const SERVER_ERROR_CODES = {
  /** 세션 만료 - 재로그인 필요 */
  SESSION_EXPIRED: 10033,
  /** 계정 잠금 */
  ACCOUNT_LOCKED: 10034,
  /** 서비스 점검 중 */
  MAINTENANCE_MODE: 10035,
  /** 강제 업데이트 필요 */
  FORCE_UPDATE_REQUIRED: 10036,
  /** 접근 권한 없음 */
  ACCESS_DENIED: 10037,
} as const;

export type ServerErrorCode = (typeof SERVER_ERROR_CODES)[keyof typeof SERVER_ERROR_CODES];

// ============================================================================
// Network Status Integration
// ============================================================================

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

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Check if an error should not be retried based on HTTP status code
 */
export function isNonRetryableError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return status !== undefined && NON_RETRYABLE_STATUS_CODES.includes(status as NonRetryableStatusCode);
  }
  return false;
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Network request failed';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Get HTTP status code from error if available
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }
  return undefined;
}

/**
 * Get server error code from error response if available
 */
export function getServerErrorCode(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ServerErrorResponse | undefined;
    return data?.errorCode;
  }
  return undefined;
}

// ============================================================================
// Cache Event Handlers
// ============================================================================

/**
 * Handle server-defined error codes with specific UI actions
 * @returns true if the error was handled, false otherwise
 */
function handleServerErrorCode(errorCode: number | undefined): boolean {
  if (errorCode === undefined) return false;

  switch (errorCode) {
    case SERVER_ERROR_CODES.SESSION_EXPIRED:
      Alert.alert(
        '세션 만료',
        '로그인이 만료되었습니다. 다시 로그인해주세요.',
        [
          {
            text: '확인',
            onPress: () => {
              // TODO: 로그아웃 처리 및 로그인 화면으로 이동
              // authService.logout();
              // navigation.reset({ routes: [{ name: 'Login' }] });
            },
          },
        ]
      );
      return true;

    case SERVER_ERROR_CODES.ACCOUNT_LOCKED:
      Alert.alert(
        '계정 잠금',
        '계정이 잠겼습니다. 고객센터에 문의해주세요.',
        [{ text: '확인' }]
      );
      return true;

    case SERVER_ERROR_CODES.MAINTENANCE_MODE:
      Alert.alert(
        '서비스 점검',
        '서비스 점검 중입니다. 잠시 후 다시 시도해주세요.',
        [{ text: '확인' }]
      );
      return true;

    case SERVER_ERROR_CODES.FORCE_UPDATE_REQUIRED:
      Alert.alert(
        '업데이트 필요',
        '새로운 버전이 있습니다. 앱을 업데이트해주세요.',
        [
          {
            text: '업데이트',
            onPress: () => {
              // TODO: 앱 스토어로 이동
              // Linking.openURL(Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL);
            },
          },
        ]
      );
      return true;

    case SERVER_ERROR_CODES.ACCESS_DENIED:
      Alert.alert(
        '접근 권한 없음',
        '해당 기능에 접근할 권한이 없습니다.',
        [{ text: '확인' }]
      );
      return true;

    default:
      return false;
  }
}

/**
 * Global query error handler
 * Called once per query failure (not per subscriber)
 */
function handleQueryError(error: Error, query: QueryWithMeta): void {
  // Skip silent errors
  if (query.meta?.silent) return;

  const status = getErrorStatus(error);
  const errorCode = getServerErrorCode(error);
  const message = query.meta?.errorMessage || getErrorMessage(error);

  // Handle server-defined error codes first
  if (handleServerErrorCode(errorCode)) {
    // Error was handled with Alert, skip default error handling
    if (__DEV__) {
      console.log('[QueryCache] Server error handled:', { errorCode, queryKey: query.queryKey });
    }
    return;
  }

  // Log error with context
  console.error('[QueryCache] Error:', {
    queryKey: query.queryKey,
    status,
    errorCode,
    message,
    error,
  });

  // TODO: Integrate with toast notification system
  // if (query.meta?.showErrorToast !== false) {
  //   toast.error(message);
  // }

  // TODO: Integrate with error reporting service
  // Sentry.captureException(error, { extra: { queryKey: query.queryKey } });
}

/**
 * Global query success handler
 */
function handleQuerySuccess(_data: unknown, query: QueryWithMeta): void {
  if (__DEV__) {
    console.log('[QueryCache] Success:', query.queryKey);
  }
}

/**
 * Global query settled handler (called on both success and error)
 */
function handleQuerySettled(
  _data: unknown,
  error: Error | null,
  query: QueryWithMeta
): void {
  if (__DEV__) {
    console.log('[QueryCache] Settled:', {
      queryKey: query.queryKey,
      success: !error,
    });
  }
}

/**
 * Global mutation error handler
 * MutationCache callback signature: (error, variables, onMutateResult, mutation, context)
 */
function handleMutationError(
  error: Error,
  _variables: unknown,
  _onMutateResult: unknown,
  mutation: MutationWithMeta
): void {
  // Skip silent errors
  if (mutation.meta?.silent) return;

  const status = getErrorStatus(error);
  const errorCode = getServerErrorCode(error);
  const message = mutation.meta?.errorMessage || getErrorMessage(error);

  // Handle server-defined error codes first
  if (handleServerErrorCode(errorCode)) {
    if (__DEV__) {
      console.log('[MutationCache] Server error handled:', {
        errorCode,
        mutationKey: mutation.options.mutationKey,
      });
    }
    return;
  }

  console.error('[MutationCache] Error:', {
    mutationKey: mutation.options.mutationKey,
    status,
    errorCode,
    message,
    error,
  });

  // TODO: Integrate with toast notification system
  // if (mutation.meta?.showErrorToast !== false) {
  //   toast.error(message);
  // }
}

/**
 * Global mutation success handler
 * MutationCache callback signature: (data, variables, onMutateResult, mutation, context)
 */
function handleMutationSuccess(
  _data: unknown,
  _variables: unknown,
  _onMutateResult: unknown,
  mutation: MutationWithMeta
): void {
  if (__DEV__) {
    console.log('[MutationCache] Success:', mutation.options.mutationKey);
  }
}

/**
 * Global mutation settled handler
 * MutationCache callback signature: (data, error, variables, onMutateResult, mutation, context)
 */
function handleMutationSettled(
  _data: unknown,
  error: Error | null,
  _variables: unknown,
  _onMutateResult: unknown,
  mutation: MutationWithMeta
): void {
  if (__DEV__) {
    console.log('[MutationCache] Settled:', {
      mutationKey: mutation.options.mutationKey,
      success: !error,
    });
  }
}

// ============================================================================
// Retry Logic
// ============================================================================

/** Maximum number of retry attempts */
const MAX_RETRY_COUNT = 3;

/** Base delay for exponential backoff (ms) */
const RETRY_BASE_DELAY = 1000;

/** Maximum retry delay (ms) */
const MAX_RETRY_DELAY = 30000;

/**
 * Determine if a failed query should be retried
 */
export function shouldRetryQuery(failureCount: number, error: Error): boolean {
  // Don't retry client errors (4xx)
  if (isNonRetryableError(error)) {
    return false;
  }

  // Retry up to MAX_RETRY_COUNT times
  return failureCount < MAX_RETRY_COUNT;
}

/**
 * Calculate retry delay with exponential backoff and jitter
 */
export function calculateRetryDelay(attemptIndex: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s...
  const exponentialDelay = RETRY_BASE_DELAY * Math.pow(2, attemptIndex);

  // Add jitter (±25%) to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);

  // Cap at maximum delay
  return Math.min(exponentialDelay + jitter, MAX_RETRY_DELAY);
}

// ============================================================================
// QueryClient Factory
// ============================================================================

/** Configuration options for createQueryClient */
export interface QueryClientConfig {
  /** Override staleTime (default: 1 minute) */
  staleTime?: number;
  /** Override gcTime (default: 5 minutes) */
  gcTime?: number;
  /** Override max retry count (default: 3) */
  maxRetries?: number;
  /** Enable verbose logging in production */
  verboseLogging?: boolean;
}

/**
 * Create a configured QueryClient instance
 *
 * Features:
 * - QueryCache with global error/success handlers
 * - MutationCache with global error/success handlers
 * - Smart retry logic with exponential backoff
 * - React Native network status integration
 *
 * @param config - Optional configuration overrides
 * @returns Configured QueryClient instance
 *
 * @example
 * ```tsx
 * const queryClient = createQueryClient();
 *
 * // With custom config
 * const queryClient = createQueryClient({
 *   staleTime: 30 * 1000,  // 30 seconds
 *   maxRetries: 5,
 * });
 * ```
 */
export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
  const {
    staleTime = 60 * 1000,      // 1 minute
    gcTime = 5 * 60 * 1000,     // 5 minutes
    maxRetries = MAX_RETRY_COUNT,
  } = config;

  return new QueryClient({
    // ========================================================================
    // QueryCache: Global query event handlers
    // ========================================================================
    queryCache: new QueryCache({
      onError: handleQueryError,
      onSuccess: handleQuerySuccess,
      onSettled: handleQuerySettled,
    }),

    // ========================================================================
    // MutationCache: Global mutation event handlers
    // ========================================================================
    mutationCache: new MutationCache({
      onError: handleMutationError,
      onSuccess: handleMutationSuccess,
      onSettled: handleMutationSettled,
    }),

    // ========================================================================
    // Default Options: Configuration for all queries and mutations
    // ========================================================================
    defaultOptions: {
      queries: {
        // ----- Freshness & Caching -----
        staleTime,
        gcTime,

        // ----- Retry Configuration -----
        retry: (failureCount, error) => {
          if (isNonRetryableError(error)) return false;
          return failureCount < maxRetries;
        },
        retryDelay: calculateRetryDelay,

        // ----- Refetch Behavior -----
        refetchOnWindowFocus: false,  // Disabled for React Native
        refetchOnReconnect: true,     // Important for mobile
        refetchOnMount: true,

        // ----- Network Mode -----
        networkMode: 'online',

        // ----- Structural Sharing -----
        structuralSharing: true,
      },

      mutations: {
        // ----- Retry Configuration -----
        retry: 1,
        retryDelay: calculateRetryDelay,

        // ----- Network Mode -----
        networkMode: 'online',
      },
    },
  });
}

// ============================================================================
// Exports
// ============================================================================

export { NON_RETRYABLE_STATUS_CODES, MAX_RETRY_COUNT, RETRY_BASE_DELAY, MAX_RETRY_DELAY };
export type { ErrorMeta };
