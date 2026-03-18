import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'

export default function LiveScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                    <Text style={styles.title}>Live Share</Text>
                    <Text style={styles.sub}>Real-time journey sharing with trusted contacts</Text>
                </Animated.View>

                {/* Status card */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: Colors.dark.textMuted }]} />
                        <Text style={styles.statusText}>No active session</Text>
                    </View>
                    <Text style={styles.statusSub}>Start sharing to let your contacts track your journey live</Text>
                </Animated.View>

                {/* Action buttons */}
                <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.startBtn}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(tabs)/live/session' as any)}
                    >
                        <Text style={styles.startIcon}>📡</Text>
                        <Text style={styles.startText}>Start Sharing</Text>
                        <Text style={styles.startSub}>Create a session code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.joinBtn}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(tabs)/live/session' as any)}
                    >
                        <Text style={styles.startIcon}>🔗</Text>
                        <Text style={styles.joinText}>Join Session</Text>
                        <Text style={styles.joinSub}>Enter a session code</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Contacts */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <View style={styles.rowHeader}>
                        <Text style={styles.sectionTitle}>Trusted Contacts</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/live/contacts' as any)}>
                            <Text style={styles.viewAll}>Manage →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.emptyIcon}>👥</Text>
                        <Text style={styles.emptyText}>Add trusted contacts to share your journey with</Text>
                        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/live/contacts' as any)}>
                            <Text style={styles.addBtnText}>Add Contacts</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* How it works */}
                <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.howCard}>
                    <Text style={styles.howTitle}>How Live Share Works</Text>
                    {[
                        ['1️⃣', 'Start a session and get a 6-character code'],
                        ['2️⃣', 'Share the code with your trusted contacts'],
                        ['3️⃣', 'They join and see your real-time location on a map'],
                        ['4️⃣', 'They get alerted if you deviate from your route'],
                    ].map(([icon, text]) => (
                        <View key={text} style={styles.howRow}>
                            <Text style={styles.howIcon}>{icon}</Text>
                            <Text style={styles.howText}>{text}</Text>
                        </View>
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
    statusCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing.md, gap: 4,
    },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusDot: { width: 10, height: 10, borderRadius: 5 },
    statusText: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.dark.textMuted },
    statusSub: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },
    actionsRow: { flexDirection: 'row', gap: Spacing.sm },
    startBtn: {
        flex: 1, backgroundColor: Colors.tabs.live + '18',
        borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.tabs.live + '40',
        padding: Spacing.md, alignItems: 'center', gap: 4,
    },
    joinBtn: {
        flex: 1, backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.md, alignItems: 'center', gap: 4,
    },
    startIcon: { fontSize: 28 },
    startText: { fontFamily: Fonts.bold, color: Colors.tabs.live, fontSize: 14 },
    joinText: { fontFamily: Fonts.bold, color: Colors.dark.text, fontSize: 14 },
    startSub: { fontFamily: Fonts.regular, color: Colors.tabs.live + 'aa', fontSize: 11 },
    joinSub: { fontFamily: Fonts.regular, color: Colors.dark.textMuted, fontSize: 11 },
    rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    sectionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text },
    viewAll: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.brand.primary },
    card: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.xl, alignItems: 'center', gap: 8,
    },
    emptyIcon: { fontSize: 36 },
    emptyText: { fontFamily: Fonts.regular, color: Colors.dark.textMuted, fontSize: 14, textAlign: 'center' },
    addBtn: {
        marginTop: 4, backgroundColor: Colors.brand.primary,
        borderRadius: Radius.full, paddingHorizontal: Spacing.lg, paddingVertical: 10,
    },
    addBtnText: { fontFamily: Fonts.bold, color: '#000', fontSize: 13 },
    howCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing.lg, gap: 12,
    },
    howTitle: { fontFamily: Fonts.bold, color: Colors.dark.text, fontSize: 14 },
    howRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    howIcon: { fontSize: 16 },
    howText: { fontFamily: Fonts.regular, color: Colors.dark.textMuted, fontSize: 13, flex: 1, lineHeight: 18 },
})
