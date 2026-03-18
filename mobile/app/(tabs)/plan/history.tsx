import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const MOCK_HISTORY = [
    { id: '1', date: 'Today, 8:30 AM', from: 'Lekki Phase 1', to: 'Victoria Island', score: 95, duration: '22m', risk: 'low' },
    { id: '2', date: 'Yesterday, 5:15 PM', from: 'Ikeja', to: 'Surulere', score: 68, duration: '1h 10m', risk: 'moderate' },
    { id: '3', date: 'Mon, 12 Oct', from: 'Yaba', to: 'Oshodi', score: 45, duration: '45m', risk: 'high' },
    { id: '4', date: 'Sun, 11 Oct', from: 'Ajah', to: 'Lekki Phase 1', score: 90, duration: '35m', risk: 'low' },
]

export default function JourneyHistoryScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Journey History</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {MOCK_HISTORY.map((item, i) => (
                    <Animated.View key={item.id} entering={FadeInUp.delay(i * 100).duration(400)}>
                        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.date}>{item.date}</Text>
                                <View style={[styles.scoreBadge, { backgroundColor: item.risk === 'low' ? Colors.risk.low + '20' : item.risk === 'moderate' ? Colors.risk.medium + '20' : Colors.risk.high + '20' }]}>
                                    <Icon name={item.risk === 'high' ? 'alert-triangle' : 'shield-check'} size={12} color={item.risk === 'low' ? Colors.risk.low : item.risk === 'moderate' ? Colors.risk.medium : Colors.risk.high} />
                                    <Text style={[styles.scoreText, { color: item.risk === 'low' ? Colors.risk.low : item.risk === 'moderate' ? Colors.risk.medium : Colors.risk.high }]}>

                                        {item.score}% Safe
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.routeContainer}>
                                <View style={styles.dots}>
                                    <View style={[styles.dot, { backgroundColor: Colors.brand.primary }]} />
                                    <View style={styles.line} />
                                    <View style={[styles.dot, { backgroundColor: Colors.risk.high }]} />
                                </View>
                                <View style={styles.places}>
                                    <Text style={styles.placeText}>{item.from}</Text>
                                    <View style={{ height: 16 }} />
                                    <Text style={styles.placeText}>{item.to}</Text>
                                </View>
                                <View style={styles.duration}>
                                    <Icon name="clock" size={14} color={Colors.dark.textMuted} />
                                    <Text style={styles.durationText}>{item.duration}</Text>
                                </View>
                            </View>
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
    headerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.dark.text },
    scroll: { padding: Spacing.lg, gap: Spacing.md },
    
    card: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border,
        padding: Spacing.lg,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    date: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },
    scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
    scoreText: { fontFamily: Fonts.bold, fontSize: 11 },
    
    routeContainer: { flexDirection: 'row', alignItems: 'stretch' },
    dots: { alignItems: 'center', width: 16, marginRight: Spacing.md, paddingVertical: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    line: { width: 2, flex: 1, backgroundColor: Colors.dark.border, marginVertical: 4, borderRadius: 1 },
    places: { flex: 1, justifyContent: 'space-between' },
    placeText: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.text },
    duration: { justifyContent: 'center', alignItems: 'flex-end', gap: 4, paddingLeft: Spacing.md },
    durationText: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted }
})
