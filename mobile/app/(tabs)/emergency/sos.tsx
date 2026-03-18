import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence,
    FadeInDown, FadeInUp, interpolate
} from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { Icon } from '@/components/ui/Icon'

const COUNTDOWN_SECONDS = 5

export default function SosScreen() {
    const [isCountingDown, setIsCountingDown] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)
    const [triggered, setTriggered] = useState(false)

    const pulseAnim = useSharedValue(1)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        // Pulse animation when triggered
        if (isCountingDown) {
            pulseAnim.value = withRepeat(
                withSequence(withTiming(1.15, { duration: 400 }), withTiming(1, { duration: 400 })), -1
            )
        } else {
            pulseAnim.value = withTiming(1)
        }
    }, [isCountingDown])

    useEffect(() => {
        if (isCountingDown) {
            timerRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!)
                        setTriggered(true)
                        setIsCountingDown(false)
                        Vibration.vibrate([0, 500, 200, 500, 200, 500])
                        return 0
                    }
                    Vibration.vibrate(100)
                    return prev - 1
                })
            }, 1000)
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [isCountingDown])

    const handleStart = () => {
        setSecondsLeft(COUNTDOWN_SECONDS)
        setIsCountingDown(true)
        setTriggered(false)
    }

    const handleCancel = () => {
        clearInterval(timerRef.current!)
        setIsCountingDown(false)
        setSecondsLeft(COUNTDOWN_SECONDS)
    }

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }]
    }))

    if (triggered) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.center}>
                    <Animated.View entering={FadeInDown.duration(600)} style={styles.triggeredIcon}>
                        <Icon name="siren" size={60} color={Colors.risk.high} />
                    </Animated.View>
                    <Animated.Text entering={FadeInUp.delay(200).duration(500)} style={styles.triggeredTitle}>
                        SOS Triggered!
                    </Animated.Text>
                    <Animated.Text entering={FadeInUp.delay(400).duration(500)} style={styles.triggeredSub}>
                        Your trusted contacts are being alerted with your live location.{'\n'}Emergency services have been notified.
                    </Animated.Text>
                    <Animated.View entering={FadeInUp.delay(600).duration(400)}>
                        <TouchableOpacity style={styles.safeBtn} onPress={() => router.back()}>
                            <Icon name="shield-check" size={20} color="#000" strokeWidth={2.5} />
                            <Text style={styles.safeBtnText}>I'm Safe — Cancel SOS</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { handleCancel(); router.back() }} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color={Colors.dark.text} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SOS</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.center}>
                {/* Pulse ring behind button */}
                <Animated.View style={[styles.pulseOuter, pulseStyle]}>
                    <View style={styles.pulseInner}>
                        <TouchableOpacity
                            style={styles.sosBtn}
                            onPress={isCountingDown ? handleCancel : handleStart}
                            activeOpacity={0.8}
                        >
                            {isCountingDown ? (
                                <Text style={styles.countdownNum}>{secondsLeft}</Text>
                            ) : (
                                <>
                                    <Icon name="alert-triangle" size={44} color={Colors.risk.high} strokeWidth={2} />
                                    <Text style={styles.sosTxt}>SOS</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Text style={styles.instructionText}>
                    {isCountingDown
                        ? `Sending alert in ${secondsLeft}s — tap to cancel`
                        : 'Tap to start a 5-second SOS countdown'}
                </Text>

                {isCountingDown && (
                    <Animated.View entering={FadeInUp.duration(300)}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>

            {/* What happens on SOS */}
            <View style={styles.stepsCard}>
                {[
                    { icon: 'phone-call', text: 'Your trusted contacts receive an emergency call' },
                    { icon: 'map-pin', text: 'Your exact GPS location is shared in real time' },
                    { icon: 'shield-alert', text: 'Nearest emergency services are alerted' }
                ].map((step) => (
                    <View key={step.text} style={styles.stepRow}>
                        <Icon name={step.icon as any} size={18} color={Colors.risk.high} strokeWidth={2} />
                        <Text style={styles.stepText}>{step.text}</Text>
                    </View>
                ))}
            </View>
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
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl, padding: Spacing.lg },

    pulseOuter: {
        width: 240, height: 240, borderRadius: 120,
        backgroundColor: `${Colors.risk.high}10`,
        alignItems: 'center', justifyContent: 'center'
    },
    pulseInner: {
        width: 200, height: 200, borderRadius: 100,
        backgroundColor: `${Colors.risk.high}20`,
        alignItems: 'center', justifyContent: 'center'
    },
    sosBtn: {
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: Colors.risk.high,
        alignItems: 'center', justifyContent: 'center', gap: 4,
        shadowColor: Colors.risk.high, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20
    },
    countdownNum: { fontFamily: Fonts.black, fontSize: 64, color: '#fff' },
    sosTxt: { fontFamily: Fonts.black, fontSize: 24, color: '#fff', letterSpacing: 4 },

    instructionText: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.textMuted, textAlign: 'center' },
    cancelBtn: {
        paddingHorizontal: Spacing.xxl ?? 32, paddingVertical: 12,
        borderRadius: Radius.full, backgroundColor: Colors.dark.card,
        borderWidth: 1, borderColor: Colors.dark.border
    },
    cancelBtnText: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.dark.text },

    stepsCard: {
        margin: Spacing.lg, backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg, borderWidth: 1, borderColor: `${Colors.risk.high}30`,
        padding: Spacing.lg, gap: Spacing.md
    },
    stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    stepText: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted, flex: 1, lineHeight: 20 },

    // Triggered state
    triggeredIcon: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: `${Colors.risk.high}15`,
        alignItems: 'center', justifyContent: 'center'
    },
    triggeredTitle: { fontFamily: Fonts.black, fontSize: 32, color: Colors.risk.high, textAlign: 'center' },
    triggeredSub: { fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.textMuted, textAlign: 'center', lineHeight: 24 },
    safeBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: Colors.brand.primary, paddingHorizontal: 28, paddingVertical: 16, borderRadius: Radius.full,
        shadowColor: Colors.brand.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12
    },
    safeBtnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' }
})
