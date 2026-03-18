import { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { router } from 'expo-router'
import Animated, {
    useSharedValue, useAnimatedStyle, withTiming, withSequence,
    withDelay, Easing, runOnJS, type SharedValue,
} from 'react-native-reanimated'
import { Colors, Fonts } from '@/constants/Colors'
import { useAuthStore } from '@/stores/authStore'

const { width, height } = Dimensions.get('window')

// Safe Route AI logo as inline SVG-equivalent shapes in RN
function Logo({ scale }: { scale: SharedValue<number> }) {
    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))
    return (
        <Animated.View style={[styles.logoWrap, style]}>
            {/* Outer glow ring */}
            <View style={styles.outerRing} />
            {/* Map pin body */}
            <View style={styles.pinBody} />
            {/* Pin hole */}
            <View style={styles.pinHole} />
        </Animated.View>
    )
}

export default function SplashScreen() {
    const { user } = useAuthStore()
    const scale = useSharedValue(0.3)
    const opacity = useSharedValue(0)
    const titleOpacity = useSharedValue(0)
    const titleY = useSharedValue(20)

    const navigate = () => {
        router.replace(user ? '/(tabs)/plan' : '/(auth)/onboarding')
    }

    useEffect(() => {
        // Logo bounces in
        scale.value = withSequence(
            withTiming(1.15, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
            withTiming(1, { duration: 200 })
        )
        opacity.value = withTiming(1, { duration: 500 })

        // Title fades in after logo
        titleOpacity.value = withDelay(500, withTiming(1, { duration: 400 }))
        titleY.value = withDelay(500, withTiming(0, { duration: 400 }))

        // Auto-navigate after 2.5s
        const timeout = setTimeout(() => runOnJS(navigate)(), 2500)
        return () => clearTimeout(timeout)
    }, [])

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleY.value }],
    }))

    return (
        <View style={styles.container}>
            {/* Glow background */}
            <View style={styles.glow} />
            <Logo scale={scale} />
            <Animated.View style={[styles.textWrap, titleStyle]}>
                <Text style={styles.title}>Safe Route AI</Text>
                <Text style={styles.sub}>Navigate Safely</Text>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.bg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: Colors.brand.glow,
        opacity: 0.4,
    },
    logoWrap: {
        width: 100,
        height: 120,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    outerRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.brand.primary,
        backgroundColor: Colors.brand.dim,
    },
    pinBody: {
        width: 60,
        height: 80,
        borderRadius: 30,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: Colors.brand.primary,
        marginTop: 10,
        // Triangle point (simulated with border)
        borderBottomWidth: 24,
        borderBottomColor: Colors.brand.primary,
        // We'll just render a rounded rect as pin head
    },
    pinHole: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.dark.bg,
        top: 28,
    },
    textWrap: {
        alignItems: 'center',
        marginTop: 32,
    },
    title: {
        fontSize: 28,
        fontFamily: Fonts.black,
        color: Colors.dark.text,
        letterSpacing: -0.5,
    },
    sub: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.brand.primary,
        marginTop: 4,
        letterSpacing: 1,
    },
})
