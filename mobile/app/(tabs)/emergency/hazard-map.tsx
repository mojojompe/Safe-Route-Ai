import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'
import { reportApi } from '@/services/api'

const MOCK_HAZARDS = [
    { id: '1', type: 'Armed Robbery', time: '2 hrs ago', location: 'Third Mainland Bridge, Lagos', risk: 'high', reporterType: 'Community Alert', description: 'Armed men robbing motorists at gunpoint near the tollgate.' },
    { id: '2', type: 'Road Accident', time: '4 hrs ago', location: 'Lagos-Ibadan Expressway, KM 42', risk: 'high', reporterType: 'FRSC', description: 'Multiple vehicles involved. Emergency services are on scene.' },
    { id: '3', type: 'Potholes', time: '1 day ago', location: 'Eko Bridge, Lagos Island', risk: 'moderate', reporterType: 'Community Alert', description: 'Large, dangerous potholes in the second lane. Drive slowly.' },
    { id: '4', type: 'Flash Flood', time: '5 hrs ago', location: 'Ikorodu Road by Ketu', risk: 'moderate', reporterType: 'Community Alert', description: 'Road flooded after heavy rainfall. Most vehicles turning back.' },
]

const RISK_COLOR = {
    high: Colors.risk.high,
    moderate: Colors.risk.medium,
    low: Colors.risk.low,
}

export default function HazardMapScreen() {
    const [filter, setFilter] = useState<'all' | 'high' | 'moderate'>('all')
    const [hazards, setHazards] = useState(MOCK_HAZARDS)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHazards = async () => {
            try {
                const res = await reportApi.getAll(7)
                if (res.data && res.data.length > 0) {
                    setHazards(res.data)
                }
            } catch {
                // Keep mock data as graceful fallback
            } finally {
                setLoading(false)
            }
        }
        fetchHazards()
    }, [])



    const filtered = hazards.filter(h => filter === 'all' || h.risk === filter)

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Community Hazard Map</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Map placeholder */}
            <View style={styles.mapCard}>
                <Icon name="map" size={48} color={Colors.tabs.emergency} />
                <Text style={styles.mapText}>Live Hazard Map</Text>
                <Text style={styles.mapSub}>Mapbox integration pending build phase</Text>
            </View>

            {/* Filter pills */}
            <View style={styles.filterRow}>
                {(['all', 'high', 'moderate'] as const).map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterPill, filter === f && { backgroundColor: Colors.tabs.emergency, borderColor: Colors.tabs.emergency }]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && { color: '#000' }]}>
                            {f === 'all' ? 'All' : f === 'high' ? '🔴 High Risk' : '🟡 Moderate'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.tabs.emergency} style={{ marginTop: 40 }} />
                ) : filtered.map((hazard, i) => (
                    <Animated.View key={hazard.id} entering={FadeInUp.delay(i * 80).duration(400)}>
                        <View style={[styles.hazardCard, { borderLeftColor: RISK_COLOR[hazard.risk as keyof typeof RISK_COLOR] }]}>
                            <View style={styles.hazardHeader}>
                                <View style={[styles.riskDot, { backgroundColor: RISK_COLOR[hazard.risk as keyof typeof RISK_COLOR] }]} />
                                <Text style={styles.hazardType}>{hazard.type}</Text>
                                <Text style={styles.hazardTime}>{hazard.time}</Text>
                            </View>
                            <View style={styles.locRow}>
                                <Icon name="map-pin" size={14} color={Colors.dark.textMuted} />
                                <Text style={styles.hazardLoc}>{hazard.location}</Text>
                            </View>
                            <Text style={styles.hazardDesc}>{hazard.description}</Text>
                            <View style={styles.reporterRow}>
                                <Icon name="user-check" size={12} color={Colors.dark.textMuted} />
                                <Text style={styles.hazardReporter}>Reported by: {hazard.reporterType}</Text>
                            </View>
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>

            {/* Report FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(tabs)/emergency/report' as any)}
            >
                <Icon name="plus" size={24} color="#000" strokeWidth={3} />
            </TouchableOpacity>
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

    mapCard: {
        height: 180, backgroundColor: Colors.dark.card, margin: Spacing.lg, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: `${Colors.tabs.emergency}30`,
        alignItems: 'center', justifyContent: 'center', gap: 8
    },
    mapText: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text },
    mapSub: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },

    filterRow: {
        flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md
    },
    filterPill: {
        paddingHorizontal: Spacing.md, paddingVertical: 8,
        borderRadius: Radius.full, backgroundColor: Colors.dark.card,
        borderWidth: 1, borderColor: Colors.dark.border
    },
    filterText: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.dark.textMuted },

    scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },

    hazardCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border,
        borderLeftWidth: 4, padding: Spacing.md, gap: 8
    },
    hazardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    riskDot: { width: 8, height: 8, borderRadius: 4 },
    hazardType: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.dark.text, flex: 1 },
    hazardTime: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    hazardLoc: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted, flex: 1 },
    hazardDesc: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.text, lineHeight: 20 },
    reporterRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    hazardReporter: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted },

    fab: {
        position: 'absolute', bottom: 32, right: 24,
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: Colors.tabs.emergency,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.tabs.emergency, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12
    }
})
