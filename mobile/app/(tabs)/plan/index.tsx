import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { useAuthStore } from '@/stores/authStore'
import { Icon } from '@/components/ui/Icon'

const QUICK_TOOLS = [
    { icon: 'route' as const, label: 'Breakdown', href: '/(tabs)/plan/breakdown', color: Colors.tabs.plan },
    { icon: 'history' as const, label: 'History', href: '/(tabs)/plan/history', color: Colors.tabs.live },
    { icon: 'favorites' as const, label: 'Favorites', href: '/(tabs)/plan/favorites', color: '#f59e0b' },
    { icon: 'navigator' as const, label: 'Arlo AI', href: '/(tabs)/plan/navigator', color: Colors.brand.primary },
]

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning 🌤️'
    if (h < 17) return 'Good afternoon ☀️'
    return 'Good evening 🌙'
}

export default function PlanScreen() {
    const { user } = useAuthStore()

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.name}>{user?.name?.split(' ')[0] || 'Traveller'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.avatar}>
                        <Icon name="profile" size={22} color={Colors.dark.textMuted} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Search card */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                    <TouchableOpacity
                        style={styles.searchCard}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(tabs)/plan/search' as any)}
                    >
                        <Icon name="search" size={18} color={Colors.dark.textMuted} />
                        <Text style={styles.searchText}>Where are you going?</Text>
                        <View style={styles.searchTag}>
                            <Icon name="shield-check" size={12} color={Colors.brand.primary} />
                            <Text style={styles.searchTagText}>Safe Route</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(150).duration(400)}>
                    <TouchableOpacity
                        style={styles.mapCard}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(tabs)/plan/map' as any)}
                    >
                        <View style={styles.mapPlaceholder}>
                            <Icon name="map" size={40} color={Colors.tabs.plan} />
                            <Text style={styles.mapLabel}>Tap to open live map</Text>
                        </View>
                        <View style={styles.safetyBadge}>
                            <View style={[styles.dot, { backgroundColor: Colors.risk.low }]} />
                            <Text style={styles.badgeText}>Lagos — Low Risk</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Quick tools grid */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <Text style={styles.sectionTitle}>Quick Access</Text>
                    <View style={styles.toolsGrid}>
                        {QUICK_TOOLS.map((t, i) => (
                            <Animated.View key={t.label} entering={FadeInRight.delay(i * 60).duration(350)}>
                                <TouchableOpacity
                                    style={styles.toolCard}
                                    activeOpacity={0.8}
                                    onPress={() => router.push(t.href as any)}
                                >
                                    <View style={[styles.toolIconBox, { backgroundColor: `${t.color}15` }]}>
                                        <Icon name={t.icon} size={22} color={t.color} strokeWidth={2} />
                                    </View>
                                    <Text style={styles.toolLabel}>{t.label}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* Recent safety tip */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.tipCard}>
                    <Text style={styles.tipBadge}>🛡️ Safety Tip</Text>
                    <Text style={styles.tipText}>
                        Avoid Third Mainland Bridge after 10PM. Visibility is low and robbery incidents spike after dusk.
                    </Text>
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    scroll: { padding: Spacing.lg, gap: Spacing.md },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    greeting: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },
    name: { fontFamily: Fonts.black, fontSize: 24, color: Colors.dark.text, marginTop: 2 },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.dark.card,
        borderWidth: 1, borderColor: Colors.dark.border,
        alignItems: 'center', justifyContent: 'center',
    },
    searchCard: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.dark.border,
        paddingHorizontal: Spacing.lg, paddingVertical: 14,
    },
    searchText: { fontFamily: Fonts.regular, color: Colors.dark.textMuted, fontSize: 15, flex: 1 },
    searchTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${Colors.brand.primary}15`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
    searchTagText: { fontFamily: Fonts.bold, fontSize: 11, color: Colors.brand.primary },
    mapCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border,
        overflow: 'hidden',
    },
    mapPlaceholder: {
        height: 180, alignItems: 'center', justifyContent: 'center', gap: 8,
        borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
        backgroundColor: `${Colors.tabs.plan}08`
    },
    mapLabel: { fontFamily: Fonts.semibold, color: Colors.dark.textMuted, fontSize: 14 },
    safetyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: Spacing.md },
    dot: { width: 8, height: 8, borderRadius: 4 },
    badgeText: { fontFamily: Fonts.semibold, color: Colors.dark.text, fontSize: 13 },
    sectionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text, marginBottom: Spacing.sm },
    toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    toolCard: {
        flex: 1, minWidth: '45%',
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.md, alignItems: 'center', gap: 8,
    },
    toolIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    toolLabel: { fontFamily: Fonts.semibold, color: Colors.dark.text, fontSize: 13 },
    tipCard: {
        backgroundColor: Colors.brand.dim,
        borderRadius: Radius.md, borderWidth: 1, borderColor: `${Colors.brand.primary}40`,
        padding: Spacing.md, gap: 6,
    },
    tipBadge: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.brand.primary },
    tipText: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted, lineHeight: 20 },
})
