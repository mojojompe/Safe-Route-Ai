import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const SECTIONS = [
    {
        title: 'Safety Alerts',
        items: [
            { key: 'high_risk', label: 'High-Risk Area Alerts', desc: 'Notify when entering a dangerous zone', default: true },
            { key: 'sos_notify', label: 'SOS Alert Confirmations', desc: 'Confirm when contacts are notified', default: true },
        ]
    },
    {
        title: 'Journey Updates',
        items: [
            { key: 'route_start', label: 'Journey Start Reminder', desc: 'Prompt before beginning navigation', default: false },
            { key: 'deviation', label: 'Route Deviation Alerts', desc: 'Notify if you go off the safe route', default: true },
        ]
    },
    {
        title: 'Community',
        items: [
            { key: 'hazard_near', label: 'Nearby Hazard Reports', desc: 'Get alerted when a hazard is near you', default: true },
            { key: 'community_updates', label: 'Community Updates', desc: 'Tips and safety updates for Lagos', default: false },
        ]
    }
]

export default function NotificationsScreen() {
    const [settings, setSettings] = useState<Record<string, boolean>>(
        Object.fromEntries(SECTIONS.flatMap(s => s.items.map(i => [i.key, i.default])))
    )

    const toggle = (key: string) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {SECTIONS.map(section => (
                    <View key={section.title}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionCard}>
                            {section.items.map((item, i) => (
                                <View key={item.key} style={[styles.row, i < section.items.length - 1 && styles.rowBorder]}>
                                    <View style={{ flex: 1, paddingRight: Spacing.md }}>
                                        <Text style={styles.rowLabel}>{item.label}</Text>
                                        <Text style={styles.rowDesc}>{item.desc}</Text>
                                    </View>
                                    <Switch
                                        value={settings[item.key]}
                                        onValueChange={() => toggle(item.key)}
                                        trackColor={{ false: Colors.dark.border, true: `${Colors.brand.primary}50` }}
                                        thumbColor={settings[item.key] ? Colors.brand.primary : '#f4f3f4'}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
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
    scroll: { padding: Spacing.lg, gap: Spacing.md },
    sectionTitle: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.dark.textMuted, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
    sectionCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border
    },
    row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    rowLabel: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.text, marginBottom: 2 },
    rowDesc: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted }
})
