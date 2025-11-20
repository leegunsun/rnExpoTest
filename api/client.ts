import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * API Client Configuration
 *
 * Axios instance with interceptors for authentication and error handling.
 * Based on TanStack Query v5 and Axios official documentation.
 */

// Storage keys
const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';

// Base API configuration
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api' // Development
  : 'https://api.example.com';   // Production

/**
 * Create Axios instance with default configuration
 * @see https://github.com/axios/axios-docs - Instance creation
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get stored authentication token
 */
async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Store authentication token
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to set auth token:', error);
  }
}

/**
 * Clear authentication tokens
 */
export async function clearAuthTokens(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error('Failed to clear auth tokens:', error);
  }
}

/**
 * Refresh authentication token
 * @returns New access token
 */
async function refreshAuthToken(): Promise<string | null> {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Call your token refresh endpoint
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Store new tokens
    await setAuthToken(accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    await clearAuthTokens();
    return null;
  }
}

/**
 * Request Interceptor
 * Automatically adds authentication token to requests
 * @see https://github.com/axios/axios-docs - Request interceptors
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles authentication errors and token refresh
 * @see https://github.com/axios/axios-docs - Response interceptors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest) {
      try {
        // Attempt to refresh token
        const newToken = await refreshAuthToken();

        if (newToken) {
          // Retry original request with new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and redirect to login (implement navigation logic)
        await clearAuthTokens();
        // TODO: Navigate to login screen
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        originalError: error,
      });
    }

    // Handle other error status codes
    const errorMessage =
      (error.response?.data as { message?: string })?.message || error.message;
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

/**
 * API Error type for better error handling
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Type-safe error handler
 */
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return {
      message: (error.response?.data as { message?: string })?.message || error.message,
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
}
