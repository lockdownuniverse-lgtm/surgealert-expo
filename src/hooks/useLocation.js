// src/hooks/useLocation.js
// Uses expo-location instead of react-native-geolocation-service.
// API is identical to the original — returns { location, error, loading }.

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let subscriber;
    let mounted = true;

    (async () => {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (mounted) {
          setError('Location permission denied');
          setLoading(false);
        }
        return;
      }

      // Get initial position fast
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (mounted) {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
        return;
      }

      // Watch for movement (update every 50m)
      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 50,
        },
        (pos) => {
          if (mounted) {
            setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          }
        }
      );
    })();

    return () => {
      mounted = false;
      subscriber?.remove();
    };
  }, []);

  return { location, error, loading };
}
