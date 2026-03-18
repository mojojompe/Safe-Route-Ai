import { Stack } from 'expo-router'

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="splash" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="otp-verify" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    )
}
