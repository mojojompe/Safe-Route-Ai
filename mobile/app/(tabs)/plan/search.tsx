import React, { useState, useCallback, useRef } from 'react'
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'
import { placesApi, routeApi } from '@/services/api'
import axios from 'axios'

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_KEY

// ── Types ──────────────────────────────────────────────────────────────────────
type Place = {
    id: string
    place_name: string
    text: string
    center: [number, number]
}

type RouteOption = {
    id: number
    distance: string
    duration: string
    score: number
    risk: 'low' | 'moderate' | 'high'
    label: string
    steps: any[]
}

const RISK_COLOR = {
    low: Colors.risk.low,
    moderate: Colors.risk.medium,
    high: Colors.risk.high,
}

const POPULAR = [
    { text: 'Victoria Island', place_name: 'Victoria Island, Lagos', center: [3.4219, 6.4281] as [number, number] },
    { text: 'Lekki Phase 1', place_name: 'Lekki Phase 1, Lagos', center: [3.5057, 6.4499] as [number, number] },
    { text: 'Ikeja', place_name: 'Ikeja, Lagos', center: [3.3457, 6.6018] as [number, number] },
    { text: 'Lagos Island', place_name: 'Lagos Island, Lagos', center: [3.3792, 6.4541] as [number, number] },
    { text: 'Surulere', place_name: 'Surulere, Lagos', center: [3.3539, 6.4986] as [number, number] },
]

export default function RouteSearchScreen() {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [fromPlace, setFromPlace] = useState<Place | null>(null)
    const [toPlace, setToPlace] = useState<Place | null>(null)
    const [suggestions, setSuggestions] = useState<Place[]>([])
    const [activeField, setActiveField] = useState<'from' | 'to' | null>(null)
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [loadingRoute, setLoadingRoute] = useState(false)
    const [routes, setRoutes] = useState<RouteOption[]>([])
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // ── 3-source Geocoding (matches web frontend) ───────────────────────────────
    // Nominatim OSM → Nigeria DB → Mapbox — so all map tile places are searchable
    const handleSearch = useCallback((text: string, field: 'from' | 'to') => {
        if (field === 'from') setFrom(text)
        else setTo(text)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (text.length < 2) { setSuggestions([]); return }

        debounceRef.current = setTimeout(async () => {
            setLoadingSuggestions(true)
            try {
                const [nominatimRes, nigeriaRes, mapboxRes] = await Promise.allSettled([
                    // 1. Nominatim (OpenStreetMap) — richest Nigeria POI data
                    fetch(
                        `https://nominatim.openstreetmap.org/search?` +
                        new URLSearchParams({
                            q: text, format: 'json', addressdetails: '1',
                            limit: '6', countrycodes: 'ng', 'accept-language': 'en', dedupe: '1'
                        })
                    ).then(r => r.json()),

                    // 2. Nigeria DB — 107k verified schools + named roads
                    placesApi.search(text, 4).then(r => r.data),

                    // 3. Mapbox Geocoding — same data that renders on the map tiles
                    axios.get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json`,
                        { params: { access_token: MAPBOX_TOKEN, types: 'poi,address,place,locality,neighborhood', country: 'ng', proximity: '3.3792,6.5244', limit: 5, language: 'en' } }
                    ).then(r => r.data.features),
                ])

                // Normalize Nominatim
                const nominatimData = nominatimRes.status === 'fulfilled'
                    ? (nominatimRes.value as any[]).map((item: any) => ({
                        id: `nom-${item.place_id}`,
                        place_name: item.display_name,
                        text: item.name || item.display_name.split(',')[0],
                        center: [parseFloat(item.lon), parseFloat(item.lat)] as [number, number],
                    })) : []

                // Nigeria DB
                const nigeriaData = nigeriaRes.status === 'fulfilled'
                    ? (nigeriaRes.value as Place[]) : []

                // Mapbox — features already match our Place shape
                const mapboxData = mapboxRes.status === 'fulfilled'
                    ? (mapboxRes.value as any[]).map((f: any) => ({
                        id: f.id,
                        place_name: f.place_name,
                        text: f.text || f.place_name.split(',')[0],
                        center: f.center as [number, number],
                    })) : []

                // Merge + deduplicate (Mapbox first → Nominatim → Nigeria DB)
                const seen = new Set<string>()
                const merged = [...mapboxData, ...nominatimData, ...nigeriaData].filter(r => {
                    const key = (r.text || r.place_name).toLowerCase().trim().slice(0, 28)
                    if (seen.has(key)) return false
                    seen.add(key)
                    return true
                })

                setSuggestions(merged.slice(0, 10))
            } catch {
                setSuggestions([])
            } finally {
                setLoadingSuggestions(false)
            }
        }, 350)
    }, [])

    const selectPlace = (place: Place | typeof POPULAR[0], field: 'from' | 'to') => {
        const p = place as Place
        if (field === 'from') { setFrom(p.text || p.place_name); setFromPlace(p) }
        else { setTo(p.text || p.place_name); setToPlace(p) }
        setSuggestions([])
        setActiveField(null)
        Keyboard.dismiss()
    }

    // ── Route fetch ─────────────────────────────────────────────────────────────
    const handleGetRoute = async () => {
        if (!fromPlace || !toPlace) return
        setLoadingRoute(true)
        setRoutes([])
        try {
            const res = await routeApi.getOptions(fromPlace.center, toPlace.center, 'driving')
            setRoutes(res.data || [])
        } catch {
            // On API failure, show mock fallback so the UI is never empty
            setRoutes([{
                id: 0, distance: '—', duration: '—', score: 0,
                risk: 'high', label: 'Could not load route data. Check backend connection.', steps: []
            }])
        } finally {
            setLoadingRoute(false)
        }
    }

    const canSearch = !!fromPlace && !!toPlace

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plan Safe Route</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                    {/* From/To inputs */}
                    <Animated.View entering={FadeInDown.duration(400)} style={styles.inputsCard}>
                        {/* FROM */}
                        <View style={styles.inputRow}>
                            <View style={[styles.dot, { backgroundColor: Colors.brand.primary }]} />
                            <TextInput
                                style={styles.input}
                                placeholder="From — your starting point"
                                placeholderTextColor={Colors.dark.textMuted}
                                value={from}
                                onChangeText={t => handleSearch(t, 'from')}
                                onFocus={() => { setActiveField('from'); setSuggestions([]) }}
                            />
                            {from.length > 0 && (
                                <TouchableOpacity onPress={() => { setFrom(''); setFromPlace(null) }}>
                                    <Icon name="close" size={16} color={Colors.dark.textMuted} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.divider} />
                        {/* TO */}
                        <View style={styles.inputRow}>
                            <View style={[styles.dot, { backgroundColor: Colors.risk.high }]} />
                            <TextInput
                                style={styles.input}
                                placeholder="To — your destination"
                                placeholderTextColor={Colors.dark.textMuted}
                                value={to}
                                onChangeText={t => handleSearch(t, 'to')}
                                onFocus={() => { setActiveField('to'); setSuggestions([]) }}
                            />
                            {to.length > 0 && (
                                <TouchableOpacity onPress={() => { setTo(''); setToPlace(null) }}>
                                    <Icon name="close" size={16} color={Colors.dark.textMuted} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </Animated.View>

                    {/* Autocomplete suggestions */}
                    {(suggestions.length > 0 || loadingSuggestions) && (
                        <Animated.View entering={FadeInUp.duration(250)} style={styles.suggestionsCard}>
                            {loadingSuggestions ? (
                                <ActivityIndicator size="small" color={Colors.brand.primary} style={{ padding: Spacing.md }} />
                            ) : (
                                suggestions.map((s, i) => (
                                    <TouchableOpacity
                                        key={s.id || i}
                                        style={[styles.suggestionRow, i < suggestions.length - 1 && styles.suggBorder]}
                                        onPress={() => selectPlace(s, activeField || 'from')}
                                    >
                                        <Icon name="map-pin" size={16} color={Colors.dark.textMuted} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.suggText}>{s.text}</Text>
                                            <Text style={styles.suggSub}>{s.place_name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </Animated.View>
                    )}

                    {/* Popular places (shown when no input) */}
                    {suggestions.length === 0 && !loadingSuggestions && routes.length === 0 && (
                        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
                            <Text style={styles.sectionTitle}>Popular in Lagos</Text>
                            <View style={styles.popularGrid}>
                                {POPULAR.map((p, i) => (
                                    <TouchableOpacity
                                        key={p.text}
                                        style={styles.popularChip}
                                        onPress={() => selectPlace(p, activeField || 'to')}
                                    >
                                        <Icon name="map-pin" size={14} color={Colors.brand.primary} />
                                        <Text style={styles.popularText}>{p.text}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Get Route Button */}
                    <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                        <TouchableOpacity
                            style={[styles.goBtn, !canSearch && styles.goBtnDisabled]}
                            onPress={handleGetRoute}
                            disabled={!canSearch || loadingRoute}
                            activeOpacity={0.85}
                        >
                            {loadingRoute ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <>
                                    <Icon name="shield-check" size={20} color={canSearch ? '#000' : Colors.dark.textMuted} strokeWidth={2.5} />
                                    <Text style={[styles.goBtnText, !canSearch && { color: Colors.dark.textMuted }]}>
                                        Analyse Safe Route
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Route results */}
                    {routes.length > 0 && (
                        <Animated.View entering={FadeInDown.duration(450)} style={{ gap: Spacing.md }}>
                            <Text style={styles.sectionTitle}>Route Options</Text>
                            {routes.map((route, i) => (
                                <TouchableOpacity
                                    key={route.id}
                                    style={[styles.routeCard, { borderLeftColor: RISK_COLOR[route.risk] }]}
                                    activeOpacity={0.8}
                                    onPress={() => router.push({
                                        pathname: '/(tabs)/plan/breakdown' as any,
                                        params: {
                                            from: fromPlace?.text, to: toPlace?.text,
                                            score: route.score, distance: route.distance, duration: route.duration, risk: route.risk
                                        }
                                    })}
                                >
                                    <View style={styles.routeHeader}>
                                        <View style={[styles.routeRank, { backgroundColor: `${RISK_COLOR[route.risk]}20` }]}>
                                            <Text style={[styles.routeRankText, { color: RISK_COLOR[route.risk] }]}>
                                                {i === 0 ? '🛡️ Safest' : i === 1 ? '⚡ Fastest' : `Route ${i + 1}`}
                                            </Text>
                                        </View>
                                        <View style={styles.routeScore}>
                                            <Text style={[styles.routeScoreNum, { color: RISK_COLOR[route.risk] }]}>
                                                {route.score}%
                                            </Text>
                                            <Text style={styles.routeScoreLabel}>safe</Text>
                                        </View>
                                    </View>

                                    <View style={styles.routeStats}>
                                        <View style={styles.routeStat}>
                                            <Icon name="map-pin" size={14} color={Colors.dark.textMuted} />
                                            <Text style={styles.routeStatText}>{route.distance}</Text>
                                        </View>
                                        <View style={styles.routeStat}>
                                            <Icon name="clock" size={14} color={Colors.dark.textMuted} />
                                            <Text style={styles.routeStatText}>{route.duration}</Text>
                                        </View>
                                        <View style={[styles.riskBadge, { backgroundColor: `${RISK_COLOR[route.risk]}15` }]}>
                                            <Text style={[styles.riskText, { color: RISK_COLOR[route.risk] }]}>
                                                {route.risk.toUpperCase()} RISK
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.routeFooter}>
                                        <Text style={styles.routeFooterText}>Tap to view full breakdown →</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
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
    scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 80 },

    inputsCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border,
        overflow: 'hidden'
    },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
    dot: { width: 10, height: 10, borderRadius: 5 },
    input: { flex: 1, fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.text, paddingVertical: 4 },
    divider: { height: 1, backgroundColor: Colors.dark.border, marginLeft: Spacing.lg + 10 + Spacing.md },

    suggestionsCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border
    },
    suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: Spacing.md },
    suggBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    suggText: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.dark.text, marginBottom: 2 },
    suggSub: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.dark.textMuted },

    sectionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text },
    popularGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
    popularChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: Colors.dark.card, borderRadius: Radius.full,
        borderWidth: 1, borderColor: Colors.dark.border,
        paddingHorizontal: Spacing.md, paddingVertical: 10
    },
    popularText: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.dark.text },

    goBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        backgroundColor: Colors.brand.primary, paddingVertical: 18, borderRadius: Radius.full,
        shadowColor: Colors.brand.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10
    },
    goBtnDisabled: { backgroundColor: Colors.dark.card, shadowOpacity: 0 },
    goBtnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' },

    routeCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border, borderLeftWidth: 4,
        padding: Spacing.lg, gap: Spacing.md
    },
    routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    routeRank: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
    routeRankText: { fontFamily: Fonts.bold, fontSize: 13 },
    routeScore: { alignItems: 'flex-end' },
    routeScoreNum: { fontFamily: Fonts.black, fontSize: 24 },
    routeScoreLabel: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.dark.textMuted, marginTop: -2 },
    routeStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    routeStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    routeStatText: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },
    riskBadge: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
    riskText: { fontFamily: Fonts.bold, fontSize: 10, letterSpacing: 0.5 },
    routeFooter: { borderTopWidth: 1, borderTopColor: Colors.dark.border, paddingTop: Spacing.sm },
    routeFooterText: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.brand.primary }
})
