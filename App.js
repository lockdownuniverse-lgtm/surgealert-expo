// App.js
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerForPushNotifications, useNotifications } from './src/services/notifications';
import { useLocation } from './src/hooks/useLocation';

export default function App() {
  const navigationRef = useRef(null);
  const { location }  = useLocation();

  // Register for push notifications once we have location
  useEffect(() => {
    if (location) {
      registerForPushNotifications(location);
    }
  }, [location?.lat, location?.lon]);

  // Wire up notification tap navigation
  useNotifications(navigationRef);

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator ref={navigationRef} />
    </>
  );
}
