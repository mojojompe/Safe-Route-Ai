import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const MOCK_CONTACTS = [
    { id: '1', name: 'Mom', phone: '+234 801 234 5678', notify: true },
    { id: '2', name: 'John Doe (Brother)', phone: '+234 812 345 6789', notify: true },
    { id: '3', name: 'Sarah (Office)', phone: '+234 903 456 7890', notify: false },
]

export default function ContactsScreen() {
    const [search, setSearch] = useState('')

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Trusted Contacts</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Icon name="user-plus" size={22} color={Colors.brand.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={Colors.dark.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search contacts..."
                    placeholderTextColor={Colors.dark.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Emergency Dispatch (3)</Text>
                
                {MOCK_CONTACTS.map((contact, i) => (
                    <Animated.View key={contact.id} entering={FadeInUp.delay(i * 100).duration(400)}>
                        <View style={styles.contactCard}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
                            </View>
                            
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactName}>{contact.name}</Text>
                                <Text style={styles.contactPhone}>{contact.phone}</Text>
                            </View>
                            
                            <TouchableOpacity style={[styles.notifyBadge, !contact.notify && styles.notifyBadgeDisabled]}>
                                <Icon name={contact.notify ? "bell" : "bell-off"} size={14} color={contact.notify ? Colors.brand.primary : Colors.dark.textMuted} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                ))}

                <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.infoCard}>
                    <Icon name="shield-alert" size={24} color={Colors.brand.primary} />
                    <Text style={styles.infoText}>
                        Trusted contacts with the bell icon active will automatically receive an SMS alert containing your Live Session link whenever you start a journey or trigger an SOS.
                    </Text>
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
    addBtn: { padding: 8, marginRight: -8 },
    headerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
        backgroundColor: Colors.dark.card,
        marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
        paddingHorizontal: Spacing.md, paddingVertical: 12,
        borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.dark.border
    },
    searchInput: { flex: 1, fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.text },

    scroll: { padding: Spacing.lg, gap: Spacing.md },
    sectionTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.dark.textMuted, marginBottom: 4 },
    
    contactCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border
    },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: `${Colors.brand.primary}15`,
        alignItems: 'center', justifyContent: 'center',
        marginRight: Spacing.md
    },
    avatarText: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.brand.primary },
    contactInfo: { flex: 1, justifyContent: 'center' },
    contactName: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.dark.text, marginBottom: 2 },
    contactPhone: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },
    notifyBadge: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: `${Colors.brand.primary}15`,
        alignItems: 'center', justifyContent: 'center',
        marginLeft: Spacing.sm
    },
    notifyBadgeDisabled: {
        backgroundColor: Colors.dark.surface,
        borderWidth: 1, borderColor: Colors.dark.border
    },

    infoCard: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        backgroundColor: Colors.dark.surface,
        padding: Spacing.lg, borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border,
        marginTop: Spacing.xl
    },
    infoText: { flex: 1, fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted, lineHeight: 20 }
})
