import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const SETTINGS = [
    {
        title: 'Account',
        items: [
            { icon: 'user', label: 'Edit Profile', desc: 'Update your name, phone, photo' },
            { icon: 'lock', label: 'Change Password', desc: 'Update your account password' },
            { icon: 'mail', label: 'Email Preferences', desc: 'Manage emails from Safe Route AI' },
        ]
    },
    {
        title: 'Privacy',
        items: [
            { icon: 'shield', label: 'Data Sharing', desc: 'Control what data Safe Route AI uses' },
            { icon: 'map-pin-off', label: 'Location History', desc: 'Manage saved location data' },
        ]
    },
    {
        title: 'Danger Zone',
        items: [
            { icon: 'trash-2', label: 'Delete Account', desc: 'Permanently remove your account', danger: true },
        ]
    }
]

export default function SettingsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {SETTINGS.map(section => (
                    <View key={section.title}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionCard}>
                            {section.items.map((item, i) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={[styles.row, i < section.items.length - 1 && styles.rowBorder]}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        if ((item as any).danger) {
                                            Alert.alert('Delete Account', 'Are you sure? This cannot be undone.', [
                                                { text: 'Cancel', style: 'cancel' },
                                                { text: 'Delete', style: 'destructive' }
                                            ])
                                        }
                                    }}
                                >
                                    <View style={[styles.iconBox, (item as any).danger && { backgroundColor: `${Colors.risk.high}15` }]}>
                                        <Icon name={item.icon as any} size={20} color={(item as any).danger ? Colors.risk.high : Colors.dark.textMuted} strokeWidth={2} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.rowLabel, (item as any).danger && { color: Colors.risk.high }]}>{item.label}</Text>
                                        <Text style={styles.rowDesc}>{item.desc}</Text>
                                    </View>
                                    <Icon name="chevron-right" size={18} color={Colors.dark.border} />
                                </TouchableOpacity>
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
    row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.text, marginBottom: 2 },
    rowDesc: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted }
})
