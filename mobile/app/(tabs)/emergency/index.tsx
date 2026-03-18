import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'

const QUICK_DIAL = [
    { emoji: '🚔', label: 'Police', number: '199', color: '#3b82f6' },
    { emoji: '🏥', label: 'Medical', number: '112', color: '#22c55e' },
    { emoji: '🛣️', label: 'FRSC', number: '122', color: '#f59e0b' },
    { emoji: '🔥', label: 'Fire', number: '767', color: '#ef4444' },
]

export default function EmergencyScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                    <Text style={styles.title}>Emergency</Text>
                    <Text style={styles.sub}>Stay calm. Help is one tap away.</Text>
                </Animated.View>

                {/* SOS Big Button */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.sosWrap}>
                    <TouchableOpacity
                        style={styles.sosBtn}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(tabs)/emergency/sos' as any)}
                    >
                        <View style={styles.sosPulse} />
                        <Text style={styles.sosIcon}>🆘</Text>
                        <Text style={styles.sosTxt}>SOS</Text>
                        <Text style={styles.sosSub}>Tap & hold to alert contacts</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* I'm Safe */}
                <Animated.View entering={FadeInDown.delay(150).duration(400)}>
                    <TouchableOpacity style={styles.safeBtn} activeOpacity={0.85}>
                        <Text style={{ fontSize: 18 }}>✅</Text>
                        <Text style={styles.safeTxt}>I'm Safe — Notify Contacts</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Quick dial grid */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <Text style={styles.sectionTitle}>Quick Dial</Text>
                    <View style={styles.dialGrid}>
                        {QUICK_DIAL.map((d, i) => (
                            <Animated.View key={d.label} entering={FadeInDown.delay(200 + i * 60).duration(350)}>
                                <TouchableOpacity
                                    style={[styles.dialCard, { borderColor: d.color + '40' }]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.dialEmoji}>{d.emoji}</Text>
                                    <Text style={styles.dialLabel}>{d.label}</Text>
                                    <Text style={[styles.dialNum, { color: d.color }]}>{d.number}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* Sub pages */}
                <Animated.View entering={FadeInDown.delay(320).duration(400)} style={styles.linksGroup}>
                    {[
                        { icon: '🗺️', label: 'Community Hazard Map', sub: 'See reported incidents near you', href: '/(tabs)/emergency/hazard-map' },
                        { icon: '📝', label: 'Report a Hazard', sub: 'Alert the community', href: '/(tabs)/emergency/report' },
                    ].map(item => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.linkCard}
                            activeOpacity={0.8}
                            onPress={() => router.push(item.href as any)}
                        >
                            <Text style={styles.linkIcon}>{item.icon}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.linkLabel}>{item.label}</Text>
                                <Text style={styles.linkSub}>{item.sub}</Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    scroll: { padding: Spacing.lg, gap: Spacing.md },
    header: { gap: 4 },
    title: { fontFamily: Fonts.black, fontSize: 26, color: Colors.dark.text },
    sub: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted },
    sosWrap: { alignItems: 'center', paddingVertical: Spacing.sm },
    sosBtn: {
        width: 180, height: 180, borderRadius: 90,
        backgroundColor: Colors.risk.highBg,
        borderWidth: 3, borderColor: Colors.risk.high,
        alignItems: 'center', justifyContent: 'center', gap: 4,
    },
    sosPulse: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100,
        backgroundColor: Colors.risk.high + '20',
    },
    sosIcon: { fontSize: 44 },
    sosTxt: { fontFamily: Fonts.black, fontSize: 22, color: Colors.risk.high, letterSpacing: 3 },
    sosSub: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.risk.high + 'aa', textAlign: 'center' },
    safeBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        backgroundColor: Colors.brand.dim, borderRadius: Radius.full,
        borderWidth: 1, borderColor: Colors.brand.primary + '40', paddingVertical: 14,
    },
    safeTxt: { fontFamily: Fonts.bold, color: Colors.brand.primary, fontSize: 15 },
    sectionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text, marginBottom: Spacing.sm },
    dialGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    dialCard: {
        flex: 1, minWidth: '44%',
        backgroundColor: Colors.dark.card, borderRadius: Radius.md,
        borderWidth: 1, padding: Spacing.md, alignItems: 'center', gap: 4,
    },
    dialEmoji: { fontSize: 28 },
    dialLabel: { fontFamily: Fonts.semibold, color: Colors.dark.text, fontSize: 13 },
    dialNum: { fontFamily: Fonts.black, fontSize: 20 },
    linksGroup: { gap: Spacing.sm },
    linkCard: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing.md,
    },
    linkIcon: { fontSize: 24 },
    linkLabel: { fontFamily: Fonts.bold, color: Colors.dark.text, fontSize: 14 },
    linkSub: { fontFamily: Fonts.regular, color: Colors.dark.textMuted, fontSize: 12, marginTop: 2 },
    arrow: { fontFamily: Fonts.black, color: Colors.dark.textMuted, fontSize: 20 },
})
