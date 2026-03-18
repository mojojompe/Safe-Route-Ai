import { Tabs } from 'expo-router'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
    useSharedValue, useAnimatedStyle, withSpring, withTiming
} from 'react-native-reanimated'
import { Colors, Fonts } from '@/constants/Colors'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'

const TABS = [
    { name: 'plan', label: 'Plan', icon: '🗺️', href: '/(tabs)/plan' },
    { name: 'live', label: 'Live', icon: '📡', href: '/(tabs)/live' },
    { name: 'emergency', label: 'Emergency', icon: '🚨', href: '/(tabs)/emergency' },
    { name: 'profile', label: 'Profile', icon: '👤', href: '/(tabs)/profile' },
]

const ACCENT: Record<string, string> = {
    plan: Colors.tabs.plan,
    live: Colors.tabs.live,
    emergency: Colors.tabs.emergency,
    profile: Colors.tabs.profile,
}

function TabButton({ tab, focused }: { tab: typeof TABS[0]; focused: boolean }) {
    const scale = useSharedValue(1)
    const accent = ACCENT[tab.name]

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))

    const onPress = () => {
        scale.value = withSpring(0.88, {}, () => { scale.value = withSpring(1) })
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push(tab.href as any)
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.tabBtn}>
            <Animated.View style={[styles.tabInner, animStyle]}>
                {/* Pill background for active tab */}
                {focused && (
                    <Animated.View style={[styles.pill, { backgroundColor: `${accent}20`, borderColor: `${accent}40` }]} />
                )}
                <Text style={[styles.tabIcon, focused && { transform: [{ scale: 1.1 }] }]}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, { color: focused ? accent : Colors.dark.textMuted }]}>
                    {tab.label}
                </Text>
                {focused && <View style={[styles.dot, { backgroundColor: accent }]} />}
            </Animated.View>
        </TouchableOpacity>
    )
}

function CustomTabBar({ state, descriptors }: any) {
    const insets = useSafeAreaInsets()

    return (
        <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            {TABS.map((tab, i) => (
                <TabButton key={tab.name} tab={tab} focused={state.index === i} />
            ))}
        </View>
    )
}

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="plan/index" />
            <Tabs.Screen name="live/index" />
            <Tabs.Screen name="emergency/index" />
            <Tabs.Screen name="profile/index" />
        </Tabs>
    )
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        paddingTop: 8,
        paddingHorizontal: 8,
    },
    tabBtn: { flex: 1, alignItems: 'center' },
    tabInner: { alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, minWidth: 60 },
    pill: {
        position: 'absolute',
        inset: 0,
        borderRadius: 14,
        borderWidth: 1,
    },
    tabIcon: { fontSize: 22, marginBottom: 2 },
    tabLabel: { fontFamily: Fonts.semibold, fontSize: 11 },
    dot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
})
