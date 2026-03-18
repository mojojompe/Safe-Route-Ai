import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

export default function AboutScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Logo + Version */}
                <View style={styles.logoCard}>
                    <View style={styles.logoBox}>
                        <Icon name="shield-check" size={48} color={Colors.brand.primary} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.appName}>Safe Route AI</Text>
                    <Text style={styles.version}>Version 1.0.0 (Beta)</Text>
                    <Text style={styles.tagline}>Navigate Nigeria. Stay Safe.</Text>
                </View>

                {/* Info rows */}
                <View style={styles.card}>
                    {[
                        { icon: 'globe', label: 'Website', value: 'saferoute.ai' },
                        { icon: 'mail', label: 'Support', value: 'saferouteai@gmail.com' },
                        { icon: 'file-text', label: 'Privacy Policy', value: 'saferoute.ai/privacy' },
                        { icon: 'book-open', label: 'Terms of Service', value: 'saferoute.ai/terms' },
                    ].map((row, i, arr) => (
                        <TouchableOpacity key={row.label} style={[styles.row, i < arr.length - 1 && styles.rowBorder]}>
                            <View style={styles.iconBox}>
                                <Icon name={row.icon as any} size={18} color={Colors.dark.textMuted} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowLabel}>{row.label}</Text>
                                <Text style={styles.rowValue}>{row.value}</Text>
                            </View>
                            <Icon name="chevron-right" size={16} color={Colors.dark.border} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.footer}>
                    Built with ♥ in Lagos, Nigeria.{'\n'}© 2025 Safe Route AI. All rights reserved.
                </Text>
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

    logoCard: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.xl ?? 24,
        borderWidth: 1, borderColor: `${Colors.brand.primary}20`,
        padding: Spacing.xl, alignItems: 'center', gap: 8
    },
    logoBox: {
        width: 80, height: 80, borderRadius: 24, backgroundColor: `${Colors.brand.primary}10`,
        alignItems: 'center', justifyContent: 'center', marginBottom: 8
    },
    appName: { fontFamily: Fonts.black, fontSize: 24, color: Colors.dark.text },
    version: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },
    tagline: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.brand.primary },

    card: {
        backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.dark.text, marginBottom: 2 },
    rowValue: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },

    footer: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.border, textAlign: 'center', lineHeight: 20 }
})
