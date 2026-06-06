// src/services/notifications.js
// Expo Notifications replaces the Firebase FCM setup entirely.
// Call setup() once in App.js on mount.

import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { registerDeviceToken } from './api';

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

// Register for push notifications and send token to our backend
export async function registerForPushNotifications(location) {
  if (!Device.isDevice) {
    console.log('[push] Must use physical device for push notifications');
    return null;
  }

  // Android needs a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('crowd_alerts', {
      name:          'Crowd Alerts',
      importance:    Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:    '#D85A30',
      sound:         true,
    });
  }

  // Request permission
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('[push] Permission not granted');
    return null;
  }

  // Get Expo push token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('[push] Expo push token:', token.slice(0, 30) + '…');

  // Register with our backend
  if (location) {
    try {
      await registerDeviceToken({
        token,
        lat:      location.lat,
        lon:      location.lon,
        platform: Platform.OS,
      });
    } catch (err) {
      console.warn('[push] Failed to register token with backend:', err.message);
    }
  }

  return token;
}

// Hook — use this in App.js to wire up notification listeners
export function useNotifications(navigationRef) {
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener     = useRef();

  useEffect(() => {
    // Fires when a notification is received while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(n => {
      setNotification(n);
    });

    // Fires when user taps a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.alertId) {
        navigationRef.current?.navigate('AlertDetail', {
          alert: { id: parseInt(data.alertId), ...data },
        });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { notification };
}
