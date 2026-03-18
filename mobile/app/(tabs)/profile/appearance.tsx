import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const THEMES = [
    { id: 'dark', label: 'Dark Mode', icon: 'moon', desc: 'Easier on the eyes at night', active: true },
    { id: 'light', label: 'Light Mode', icon: 'sun', desc: 'Bright and clear for daytime', active: false },
    { id: 'system', label: 'System Default', icon: 'smartphone', desc: 'Follows your device setting', active: false },
]

const MAP_STYLES = [
    { id: 'standard', label: 'Standard Dark', accent: '#1a2230' },
    { id: 'satellite', label: 'Satellite', accent: '#2d4a30' },
    { id: 'traffic', label: 'Traffic View', accent: '#2d1a1a' },
]

export default function AppearanceScreen() {
    const [theme, setTheme] = useState('dark')
    const [mapStyle, setMapStyle] = useState('standard')

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Appearance</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>App Theme</Text>
                <View style={styles.card}>
                    {THEMES.map((t, i) => (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.themeRow, i < THEMES.length - 1 && styles.rowBorder]}
                            onPress={() => setTheme(t.id)}
                        >
                            <View style={[styles.iconBox, theme === t.id && { backgroundColor: `${Colors.brand.primary}15` }]}>
                                <Icon name={t.icon as any} size={20} color={theme === t.id ? Colors.brand.primary : Colors.dark.textMuted} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.themeLabel, theme === t.id && { color: Colors.brand.primary }]}>{t.label}</Text>
                                <Text style={styles.themeDesc}>{t.desc}</Text>
                            </View>
                            {theme === t.id && <Icon name="check-circle" size={20} color={Colors.brand.primary} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Map Style</Text>
                <View style={styles.mapStyleRow}>
                    {MAP_STYLES.map(ms => (
                        <TouchableOpacity
                            key={ms.id}
                            style={[styles.mapStyleCard, mapStyle === ms.id && styles.mapStyleCardActive]}
                            onPress={() => setMapStyle(ms.id)}
                        >
                            <View style={[styles.mapPreview, { backgroundColor: ms.accent }]} />
                            <Text style={[styles.mapStyleLabel, mapStyle === ms.id && { color: Colors.brand.primary }]}>{ms.label}</Text>
                        </TouchableOpacity>
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
    sectionTitle: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.dark.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    card: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border
    },
    themeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
    themeLabel: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.text, marginBottom: 2 },
    themeDesc: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },

    mapStyleRow: { flexDirection: 'row', gap: Spacing.sm },
    mapStyleCard: {
        flex: 1, borderRadius: Radius.md, overflow: 'hidden',
        borderWidth: 2, borderColor: Colors.dark.border, backgroundColor: Colors.dark.card
    },
    mapStyleCardActive: { borderColor: Colors.brand.primary },
    mapPreview: { height: 80 },
    mapStyleLabel: { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.dark.textMuted, textAlign: 'center', padding: 8 }
})
