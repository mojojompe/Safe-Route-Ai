import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold, Lexend_900Black } from '@expo-google-fonts/lexend'
import * as SplashScreen from 'expo-splash-screen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
    const { resolved } = useThemeStore()
    const { loadFromStorage } = useAuthStore()

    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_600SemiBold,
        Lexend_700Bold,
        Lexend_900Black,
    })

    useEffect(() => {
        if (fontsLoaded) {
            loadFromStorage().then(() => SplashScreen.hideAsync())
        }
    }, [fontsLoaded])

    if (!fontsLoaded) return null

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </QueryClientProvider>
        </GestureHandlerRootView>
    )
}
