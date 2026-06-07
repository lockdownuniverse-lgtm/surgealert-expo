// App.js
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerForPushNotifications, useNotifications } from './src/services/notifications';
import { useLocation } from './src/hooks/useLocation';

export default function App() {
  const navigationRef = useRef(null);
  const { location }  = useLocation();

  const [fontsLoaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (location) {
      registerForPushNotifications(location);
    }
  }, [location?.lat, location?.lon]);

  useNotifications(navigationRef);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator ref={navigationRef} />
    </>
  );
}
