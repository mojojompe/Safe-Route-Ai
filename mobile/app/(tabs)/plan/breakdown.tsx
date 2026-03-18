import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const MOCK_ROUTE = {
    from: "Lekki Phase 1",
    to: "Ikeja City Mall",
    distance: "28 km",
    duration: "45 mins",
    safetyScore: 82, // Safe
    riskLevel: "Low Risk",
    segments: [
        { id: '1', name: "Lekki-Epe Expressway", risk: "Low", icon: "shield-check", color: Colors.risk.low, desc: "Clear roads, well lit." },
        { id: '2', name: "Third Mainland Bridge", risk: "Moderate", icon: "alert-triangle", color: Colors.risk.medium, desc: "Heavy traffic expected. Moderate accident reports today." },
        { id: '3', name: "Ikorodu Road", risk: "Low", icon: "shield-check", color: Colors.risk.low, desc: "Smooth traffic." },
        { id: '4', name: "Mobolaji Bank Anthony Way", risk: "High", icon: "siren", color: Colors.risk.high, desc: "Potholes and recent robbery report near the underbridge. Proceed with caution." }
    ]
}

export default function RouteBreakdownScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Route Breakdown</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                
                {/* Route Overview Card */}
                <Animated.View entering={FadeInDown.duration(400)} style={styles.overviewCard}>
                    <View style={styles.routePoints}>
                        <View style={styles.point}>
                            <Icon name="map-pin" size={16} color={Colors.brand.primary} strokeWidth={3} />
                            <Text style={styles.pointText}>{MOCK_ROUTE.from}</Text>
                        </View>
                        <View style={styles.dashedLine} />
                        <View style={styles.point}>
                            <Icon name="map-pin" size={16} color={Colors.risk.high} strokeWidth={2.5} />
                            <Text style={styles.pointText}>{MOCK_ROUTE.to}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statCol}>
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={styles.statValue}>{MOCK_ROUTE.distance}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statCol}>
                            <Text style={styles.statLabel}>Est. Time</Text>
                            <Text style={styles.statValue}>{MOCK_ROUTE.duration}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statCol}>
                            <Text style={styles.statLabel}>Trust Score</Text>
                            <Text style={[styles.statValue, { color: Colors.brand.primary }]}>{MOCK_ROUTE.safetyScore}%</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Section Title */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                    <Text style={styles.sectionTitle}>Street-by-Street Analysis</Text>
                </Animated.View>

                {/* Segments */}
                <View style={styles.segmentsWrapper}>
                    {MOCK_ROUTE.segments.map((seg, index) => (
                        <Animated.View key={seg.id} entering={FadeInUp.delay(150 + (index * 100)).duration(400)} style={styles.segment}>
                            {/* Timeline Indicator */}
                            <View style={styles.timeline}>
                                <View style={[styles.timelineDot, { borderColor: seg.color }]} />
                                {index !== MOCK_ROUTE.segments.length - 1 && <View style={styles.timelineLine} />}
                            </View>

                            {/* Segment Content */}
                            <View style={styles.segmentCard}>
                                <View style={styles.segmentHeader}>
                                    <Text style={styles.segmentName}>{seg.name}</Text>
                                    <View style={[styles.riskBadge, { backgroundColor: `${seg.color}20`, borderColor: `${seg.color}40` }]}>
                                        <Text style={[styles.riskText, { color: seg.color }]}>{seg.risk}</Text>
                                    </View>
                                </View>
                                <View style={styles.segmentBodyRow}>
                                    <Icon name={seg.icon as any} size={18} color={seg.color} strokeWidth={2} />
                                    <Text style={styles.segmentDesc}>{seg.desc}</Text>
                                </View>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* Start Navigation Button */}
                <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.navBtn} 
                        activeOpacity={0.8}
                        onPress={() => router.push('/(tabs)/plan/map' as any)}
                    >
                        <Text style={styles.navBtnText}>Start Safe Navigation</Text>
                        <Icon name="navigator" size={20} color="#000" strokeWidth={2} />
                    </TouchableOpacity>
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
    scroll: { padding: Spacing.lg, paddingBottom: 100 },

    overviewCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    routePoints: { marginBottom: Spacing.lg },
    point: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    pointText: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.dark.text },
    dashedLine: { 
        height: 20, width: 2, backgroundColor: Colors.dark.border, 
        marginLeft: 7, marginVertical: 4, borderRadius: 1 
    },
    statsRow: { 
        flexDirection: 'row', justifyContent: 'space-between',
        paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.dark.border
    },
    statCol: { alignItems: 'center', flex: 1 },
    statLabel: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted, marginBottom: 4 },
    statValue: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text },
    divider: { width: 1, backgroundColor: Colors.dark.border },

    sectionTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text, marginBottom: Spacing.lg },
    segmentsWrapper: { paddingLeft: 8 },
    segment: { flexDirection: 'row', marginBottom: Spacing.md },
    timeline: { alignItems: 'center', width: 20, marginRight: Spacing.md },
    timelineDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, backgroundColor: Colors.dark.bg, zIndex: 2 },
    timelineLine: { width: 2, flex: 1, backgroundColor: Colors.dark.border, marginTop: -4, marginBottom: -10 },
    
    segmentCard: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.md,
    },
    segmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    segmentName: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.text, flex: 1, paddingRight: 8 },
    riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
    riskText: { fontFamily: Fonts.bold, fontSize: 11 },
    segmentBodyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    segmentDesc: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted, flex: 1, lineHeight: 20 },

    footer: { marginTop: Spacing.xl },
    navBtn: {
        backgroundColor: Colors.brand.primary,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 18, borderRadius: Radius.full,
        shadowColor: Colors.brand.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
    },
    navBtnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' }
})
