/**
 * Custom hook for location services
 * Handles permission requests and location fetching
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import type { LocationInfo } from '@/types/weather';

interface UseLocationReturn {
  location: LocationInfo | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
}

/**
 * Default location (Seoul, Korea) used when permission is denied
 */
const DEFAULT_LOCATION: LocationInfo = {
  city: '서울시',
  district: '강남구',
  coords: {
    latitude: 37.5665,
    longitude: 126.978,
  },
};

/**
 * Hook to manage location services
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request location permission and fetch current location
   */
  const requestLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('📍 Location permission denied, using default location (Seoul)');
        setLocation(DEFAULT_LOCATION);
        setIsLoading(false);
        return;
      }

      // Get current position with timeout and error handling
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = position.coords;

        // Reverse geocoding to get address
        try {
          const [address] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          if (address) {
            setLocation({
              city: address.city || address.region || '서울시',
              district: address.district || address.subregion || '강남구',
              coords: { latitude, longitude },
            });
          } else {
            // If geocoding fails, use coordinates with default names
            setLocation({
              city: '현재 위치',
              district: '',
              coords: { latitude, longitude },
            });
          }
        } catch (geocodeError) {
          console.log('📍 Geocoding unavailable, using coordinates only');
          setLocation({
            city: '현재 위치',
            district: '',
            coords: { latitude, longitude },
          });
        }
      } catch (positionError) {
        // Location services unavailable (common in web/simulator)
        console.log('📍 Location services unavailable, using default location (Seoul)');
        setLocation(DEFAULT_LOCATION);
      }
    } catch (err) {
      // Permission request failed
      console.log('📍 Location access failed, using default location (Seoul)');
      setLocation(DEFAULT_LOCATION);
    } finally {
      setIsLoading(false);
    }
  };

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  return {
    location,
    isLoading,
    error,
    requestLocation,
  };
}
