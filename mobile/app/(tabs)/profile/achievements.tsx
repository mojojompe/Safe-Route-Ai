import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const ACHIEVEMENTS = [
    { id: '1', title: 'Safe Starter', desc: 'Complete your first safe journey', icon: 'shield', earned: true, color: Colors.brand.primary },
    { id: '2', title: 'Early Bird', desc: 'Travel before 7AM safely 5 times', icon: 'sunrise', earned: true, color: '#f59e0b' },
    { id: '3', title: 'Night Owl Safe', desc: 'Travel after 10PM safely', icon: 'moon', earned: true, color: '#8b5cf6' },
    { id: '4', title: 'Road Warrior', desc: 'Complete 25 journeys total', icon: 'map', earned: false, color: Colors.tabs.live },
    { id: '5', title: 'Community Hero', desc: 'Submit 5 hazard reports', icon: 'heart', earned: false, color: Colors.risk.high },
    { id: '6', title: 'Streak Master', desc: 'Maintain a 14-day safe streak', icon: 'zap', earned: false, color: '#f59e0b' },
]

export default function AchievementsScreen() {
    const earned = ACHIEVEMENTS.filter(a => a.earned).length

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Achievements</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Progress banner */}
                <View style={styles.banner}>
                    <View>
                        <Text style={styles.bannerCount}>{earned}/{ACHIEVEMENTS.length}</Text>
                        <Text style={styles.bannerLabel}>Badges Earned</Text>
                    </View>
                    <Icon name="award" size={48} color={Colors.brand.primary} strokeWidth={1.5} />
                </View>

                <Text style={styles.sectionTitle}>All Badges</Text>
                <View style={styles.grid}>
                    {ACHIEVEMENTS.map((item, i) => (
                        <Animated.View key={item.id} entering={FadeInUp.delay(i * 80).duration(400)}>
                            <View style={[styles.badge, !item.earned && styles.badgeLocked]}>
                                <View style={[styles.badgeIcon, { backgroundColor: item.earned ? `${item.color}20` : Colors.dark.surface, borderColor: item.earned ? `${item.color}40` : Colors.dark.border }]}>
                                    <Icon name={item.icon as any} size={28} color={item.earned ? item.color : Colors.dark.border} strokeWidth={item.earned ? 2 : 1.5} />
                                </View>
                                {!item.earned && (
                                    <View style={styles.lockOverlay}>
                                        <Icon name="lock" size={14} color={Colors.dark.border} />
                                    </View>
                                )}
                                <Text style={[styles.badgeTitle, !item.earned && styles.lockedText]}>{item.title}</Text>
                                <Text style={styles.badgeDesc}>{item.desc}</Text>
                            </View>
                        </Animated.View>
                    ))}
                </View>
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

    banner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: `${Colors.brand.primary}10`, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: `${Colors.brand.primary}30`, padding: Spacing.lg
    },
    bannerCount: { fontFamily: Fonts.black, fontSize: 40, color: Colors.brand.primary },
    bannerLabel: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted },

    sectionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    badge: {
        flex: 1, minWidth: '45%', backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.md, alignItems: 'center', gap: 8, position: 'relative'
    },
    badgeLocked: { opacity: 0.6 },
    badgeIcon: {
        width: 60, height: 60, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2
    },
    lockOverlay: {
        position: 'absolute', top: 10, right: 10
    },
    badgeTitle: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.dark.text, textAlign: 'center' },
    lockedText: { color: Colors.dark.textMuted },
    badgeDesc: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.dark.textMuted, textAlign: 'center', lineHeight: 16 }
})
