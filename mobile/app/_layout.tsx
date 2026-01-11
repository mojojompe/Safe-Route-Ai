import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { RouteProvider } from '../src/context/RouteContext';
import { useEffect } from 'react';
import { View, ActivityIndicator, Alert, Platform } from 'react-native';
import { registerForPushNotificationsAsync } from '../src/services/notificationService';
import * as Notifications from 'expo-notifications';

const RootLayoutNav = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        // In a real app, send this token to backend: userService.updatePushToken(user.uid, token);
        console.log("Registered for push notifications:", token);
      }
    });

    // Handle foreground notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // Handle foreground notification
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user) {
      if (segments[0] !== '(tabs)') {
        router.replace('/(tabs)/map');
      }
    } else {
      if (segments[0] === '(tabs)') {
        router.replace('/');
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-950">
        <ActivityIndicator size="large" color="#32CD32" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteProvider>
        <RootLayoutNav />
      </RouteProvider>
    </AuthProvider>
  );
}
