import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { useAuthStore } from '@/stores/authStore'

const MENU = [
    { icon: '📊', label: 'Analytics', sub: 'Your safety stats', href: '/(tabs)/profile/analytics' },
    { icon: '🏆', label: 'Achievements', sub: 'Badges & milestones', href: '/(tabs)/profile/achievements' },
    { icon: '🔔', label: 'Notifications', sub: 'Alert preferences', href: '/(tabs)/profile/notifications' },
    { icon: '🎨', label: 'Appearance', sub: 'Theme & map style', href: '/(tabs)/profile/appearance' },
    { icon: '⚙️', label: 'Settings', sub: 'Account & privacy', href: '/(tabs)/profile/settings' },
    { icon: 'ℹ️', label: 'About', sub: 'App info & licenses', href: '/(tabs)/profile/about' },
]

export default function ProfileScreen() {
    const { user, logout } = useAuthStore()

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Profile hero */}
                <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
                    <View style={styles.avatarWrap}>
                        <Text style={styles.avatarIcon}>👤</Text>
                        <View style={styles.tierBadge}>
                            <Text style={styles.tierEmoji}>🛡️</Text>
                        </View>
                    </View>
                    <Text style={styles.name}>{user?.name || 'Traveller'}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <View style={styles.tierPill}>
                        <Text style={styles.tierText}>{user?.safetyTier || 'Commuter'}</Text>
                    </View>
                </Animated.View>

                {/* Stats row */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsRow}>
                    {[
                        { label: 'Routes', value: '0' },
                        { label: 'Avg Score', value: '—' },
                        { label: 'Safe Trips', value: '0' },
                    ].map(s => (
                        <View key={s.label} style={styles.statItem}>
                            <Text style={styles.statValue}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Menu */}
                <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.menuCard}>
                    {MENU.map((item, i) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[styles.menuRow, i < MENU.length - 1 && styles.menuBorder]}
                            activeOpacity={0.7}
                            onPress={() => router.push(item.href as any)}
                        >
                            <Text style={styles.menuIcon}>{item.icon}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <Text style={styles.menuSub}>{item.sub}</Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                {/* Sign out */}
                <Animated.View entering={FadeInDown.delay(250).duration(400)}>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        activeOpacity={0.85}
                        onPress={async () => {
                            await logout()
                            router.replace('/(auth)/login')
                        }}
                    >
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
    hero: { alignItems: 'center', paddingVertical: Spacing.md },
    avatarWrap: { position: 'relative', marginBottom: 14 },
    avatarIcon: { fontSize: 64 },
    tierBadge: {
        position: 'absolute', bottom: 0, right: -4,
        backgroundColor: Colors.brand.primary, borderRadius: 10, padding: 2,
    },
    tierEmoji: { fontSize: 12 },
    name: { fontFamily: Fonts.black, fontSize: 22, color: Colors.dark.text },
    email: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted, marginTop: 2 },
    tierPill: {
        marginTop: 10, backgroundColor: Colors.brand.dim,
        borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.brand.primary + '60',
        paddingHorizontal: 16, paddingVertical: 5,
    },
    tierText: { fontFamily: Fonts.bold, color: Colors.brand.primary, fontSize: 13 },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border, overflow: 'hidden',
    },
    statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
    statValue: { fontFamily: Fonts.black, fontSize: 22, color: Colors.dark.text },
    statLabel: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted, marginTop: 2 },
    menuCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border, overflow: 'hidden',
    },
    menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: Spacing.md },
    menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    menuIcon: { fontSize: 20, width: 28, textAlign: 'center' },
    menuLabel: { fontFamily: Fonts.semibold, color: Colors.dark.text, fontSize: 15 },
    menuSub: { fontFamily: Fonts.regular, color: Colors.dark.textMuted, fontSize: 12, marginTop: 1 },
    arrow: { fontFamily: Fonts.black, color: Colors.dark.textMuted, fontSize: 20 },
    logoutBtn: {
        borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.risk.high + '40',
        backgroundColor: Colors.risk.highBg, paddingVertical: 14, alignItems: 'center',
    },
    logoutText: { fontFamily: Fonts.bold, color: Colors.risk.high, fontSize: 15 },
})
