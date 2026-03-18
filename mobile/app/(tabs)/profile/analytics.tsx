import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const WEEKLY_DATA = [55, 72, 60, 90, 82, 95, 88]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MAX_BAR = 100

export default function AnalyticsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Safety Analytics</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Average score card */}
                <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
                    <Text style={styles.heroLabel}>Average Safety Score</Text>
                    <Text style={styles.heroScore}>82<Text style={styles.heroUnit}>/100</Text></Text>
                    <View style={styles.heroBadge}>
                        <Icon name="shield-check" size={14} color={Colors.brand.primary} />
                        <Text style={styles.heroBadgeText}>Consistently Safe Traveller</Text>
                    </View>
                </Animated.View>

                {/* Weekly bar chart */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
                    <Text style={styles.cardTitle}>This Week</Text>
                    <View style={styles.barChart}>
                        {WEEKLY_DATA.map((val, i) => (
                            <View key={i} style={styles.barCol}>
                                <View style={styles.barTrack}>
                                    <Animated.View
                                        entering={FadeInUp.delay(200 + i * 80).duration(500)}
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${(val / MAX_BAR) * 100}%`,
                                                backgroundColor: val >= 80 ? Colors.risk.low : val >= 60 ? Colors.risk.medium : Colors.risk.high
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barDay}>{DAYS[i]}</Text>
                                <Text style={styles.barVal}>{val}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Stats grid */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.statsGrid}>
                    {[
                        { icon: 'map', label: 'Total Routes', value: '24', color: Colors.tabs.plan },
                        { icon: 'shield-check', label: 'Safe Trips', value: '21', color: Colors.risk.low },
                        { icon: 'alert-triangle', label: 'Risky Routes', value: '3', color: Colors.risk.high },
                        { icon: 'clock', label: 'Travel Hours', value: '18h', color: Colors.tabs.live },
                    ].map(stat => (
                        <View key={stat.label} style={styles.statCard}>
                            <View style={[styles.statIconBox, { backgroundColor: `${stat.color}15` }]}>
                                <Icon name={stat.icon as any} size={20} color={stat.color} strokeWidth={2} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
        borderBottomWidth: 1, borderBottomColor: Colors.dark.border
    },
    backBtn: { padding: 8, marginLeft: -8 },
    headerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    scroll: { padding: Spacing.lg, gap: Spacing.lg },

    heroCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: `${Colors.brand.primary}30`,
        padding: Spacing.xl, alignItems: 'center', gap: 8
    },
    heroLabel: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted },
    heroScore: { fontFamily: Fonts.black, fontSize: 64, color: Colors.brand.primary },
    heroUnit: { fontFamily: Fonts.regular, fontSize: 28, color: Colors.dark.textMuted },
    heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    heroBadgeText: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.brand.primary },

    card: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing.lg
    },
    cardTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text, marginBottom: Spacing.lg },
    barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
    barCol: { alignItems: 'center', flex: 1, gap: 4 },
    barTrack: { height: 90, width: 20, justifyContent: 'flex-end' },
    bar: { width: '100%', borderRadius: 4 },
    barDay: { fontFamily: Fonts.semibold, fontSize: 11, color: Colors.dark.textMuted },
    barVal: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.dark.textMuted },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    statCard: {
        flex: 1, minWidth: '45%', backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.md, alignItems: 'flex-start', gap: 6
    },
    statIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statValue: { fontFamily: Fonts.black, fontSize: 22, color: Colors.dark.text },
    statLabel: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted }
})
