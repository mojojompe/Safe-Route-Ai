import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const MOCK_FAVS = [
    { id: '1', title: 'Home', address: '14b Admiralty Way, Lekki', icon: 'home' },
    { id: '2', title: 'Office', address: 'Tech Hub, Yaba', icon: 'briefcase' },
    { id: '3', title: 'Gym', address: 'Fitness Central, VI', icon: 'zap' },
]

export default function FavoritesScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Routes</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Icon name="plus" size={20} color={Colors.brand.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {MOCK_FAVS.map((item, i) => (
                    <Animated.View key={item.id} entering={FadeInUp.delay(i * 100).duration(400)}>
                        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                            <View style={styles.iconBox}>
                                <Icon name={item.icon as any} size={20} color={Colors.brand.primary} strokeWidth={2} />
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.address}>{item.address}</Text>
                            </View>
                            <Icon name="chevron-right" size={20} color={Colors.dark.textMuted} />
                        </TouchableOpacity>
                    </Animated.View>
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
    addBtn: { padding: 8, marginRight: -8 },
    headerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    scroll: { padding: Spacing.lg, gap: Spacing.md },
    
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.lg,
    },
    iconBox: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: `${Colors.brand.primary}15`,
        alignItems: 'center', justifyContent: 'center',
        marginRight: Spacing.md
    },
    content: { flex: 1, justifyContent: 'center' },
    title: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.dark.text, marginBottom: 2 },
    address: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted }
})
