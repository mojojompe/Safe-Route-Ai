import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

export default function SessionScreen() {
    const [isSharing, setIsSharing] = useState(false)
    const sessionCode = "8X4-M2P"

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Live Session</Text>
                <TouchableOpacity style={styles.backBtn}>
                    <Icon name="more-vertical" size={24} color={Colors.dark.textMuted} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                
                {/* Map Placeholder */}
                <Animated.View entering={FadeInUp.duration(400)} style={styles.mapCard}>
                    <View style={styles.mapInner}>
                        <Icon name="map" size={48} color={Colors.tabs.live} />
                        <Text style={styles.mapText}>Live Tracking Map</Text>
                        <Text style={styles.mapSub}>Mapbox integration paused</Text>
                    </View>
                </Animated.View>

                {/* Session Details */}
                <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <View>
                            <Text style={styles.detailLabel}>Session Status</Text>
                            <Text style={[styles.detailValue, { color: isSharing ? Colors.tabs.live : Colors.dark.textMuted }]}>
                                {isSharing ? '🔴 LIVE' : '⚪ Offline'}
                            </Text>
                        </View>
                        <Switch
                            value={isSharing}
                            onValueChange={setIsSharing}
                            trackColor={{ false: Colors.dark.border, true: `${Colors.tabs.live}50` }}
                            thumbColor={isSharing ? Colors.tabs.live : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View>
                            <Text style={styles.detailLabel}>Session Code</Text>
                            <Text style={styles.codeText}>{sessionCode}</Text>
                        </View>
                        <TouchableOpacity style={styles.copyBtn}>
                            <Icon name="copy" size={20} color={Colors.dark.textMuted} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Connected Viewers */}
                <Animated.View entering={FadeInUp.delay(200).duration(400)}>
                    <Text style={styles.sectionTitle}>Connected Contacts (0)</Text>
                    <View style={styles.emptyContactsCard}>
                        <Icon name="users" size={32} color={Colors.dark.textMuted} />
                        <Text style={styles.emptyContactsText}>No one is currently watching</Text>
                        <Text style={styles.emptyContactsSub}>Share your code with trusted contacts so they can join.</Text>
                        
                        <TouchableOpacity style={styles.shareBtn}>
                            <Icon name="share-2" size={18} color="#000" strokeWidth={2.5} />
                            <Text style={styles.shareBtnText}>Share Link</Text>
                        </TouchableOpacity>
                    </View>
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
    backBtn: { padding: 8, marginHorizontal: -8 },
    headerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    scroll: { padding: Spacing.lg, gap: Spacing.lg },

    mapCard: {
        height: 250,
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border,
        overflow: 'hidden'
    },
    mapInner: {
        flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: `${Colors.tabs.live}10`
    },
    mapText: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    mapSub: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },

    detailsCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.lg
    },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted, marginBottom: 4 },
    detailValue: { fontFamily: Fonts.bold, fontSize: 16 },
    divider: { height: 1, backgroundColor: Colors.dark.border, marginVertical: Spacing.md },
    codeText: { fontFamily: Fonts.black, fontSize: 24, letterSpacing: 2, color: Colors.dark.text },
    copyBtn: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.dark.surface,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.dark.border
    },

    sectionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text, marginBottom: Spacing.sm },
    emptyContactsCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.xl, alignItems: 'center', gap: 12
    },
    emptyContactsText: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.text },
    emptyContactsSub: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted, textAlign: 'center', lineHeight: 20 },
    shareBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: Colors.brand.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.full,
        marginTop: 8
    },
    shareBtnText: { fontFamily: Fonts.bold, fontSize: 14, color: '#000' }
})
