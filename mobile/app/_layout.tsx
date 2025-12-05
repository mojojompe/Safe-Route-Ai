import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { RouteProvider } from '../src/context/RouteContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

const RootLayoutNav = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    // const inTabsGroup = segments[0] === '(tabs)'; // Not strictly needed if we just redirect to tabs if user is there

    if (user) {
      // Redirect to map if not already there
      // Note: Simple check to avoid loops. 
      // Ideally we check if we are NOT in (tabs)
      if (segments[0] !== '(tabs)') {
        router.replace('/(tabs)/map');
      }
    } else {
      // If not logged in
      // If they are trying to access protected routes (tabs), send them back
      if (segments[0] === '(tabs)') {
        router.replace('/');
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-950">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
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
