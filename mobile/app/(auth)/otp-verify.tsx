import { useState, useRef, useEffect } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, Alert
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { StatusBar } from 'expo-status-bar'
import { Icon } from '@/components/ui/Icon'

const CODE_LENGTH = 6
const OTP_EXPIRY_SECS = 180

export default function OtpVerify() {
    const { email, mode } = useLocalSearchParams<{ email: string; mode: 'signup' | 'reset' }>()
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [timer, setTimer] = useState(OTP_EXPIRY_SECS)
    const inputRefs = useRef<(TextInput | null)[]>([])
    const { setUser } = useAuthStore()

    useEffect(() => {
        const interval = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTimer = (secs: number) =>
        `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`

    const onDigit = (val: string, idx: number) => {
        if (!/^\d?$/.test(val)) return
        const next = [...code]
        next[idx] = val
        setCode(next)
        if (val && idx < CODE_LENGTH - 1) inputRefs.current[idx + 1]?.focus()
    }

    const onKeyPress = (key: string, idx: number) => {
        if (key === 'Backspace' && !code[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus()
        }
    }

    const verify = async () => {
        const full = code.join('')
        if (full.length < CODE_LENGTH) {
            Alert.alert('Incomplete', 'Enter the full 6-digit code.')
            return
        }
        setLoading(true)
        try {
            const res = await authApi.verifyOtp(email, full, mode || 'signup')
            if (mode === 'reset') {
                router.replace({ pathname: '/(auth)/forgot-password', params: { email, step: 'new-password', code: full } })
            } else {
                await setUser(res.data.user, res.data.token)
                router.replace('/(tabs)/plan')
            }
        } catch (err: any) {
            Alert.alert('Invalid Code', err?.response?.data?.error || 'The code is incorrect or expired.')
        } finally {
            setLoading(false)
        }
    }

    const resend = async () => {
        setResending(true)
        try {
            await authApi.resendOtp(email, mode || 'signup')
            setTimer(OTP_EXPIRY_SECS)
            setCode(Array(CODE_LENGTH).fill(''))
            inputRefs.current[0]?.focus()
            Alert.alert('Code Sent', 'A new OTP has been sent to your email.')
        } catch {
            Alert.alert('Error', 'Could not resend code. Try again.')
        } finally {
            setResending(false)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Animated.View entering={FadeInDown.springify()} style={styles.inner}>

                <View style={styles.iconWrap}>
                    <Icon name="mail" size={36} color={Colors.brand.primary} strokeWidth={1.5} />
                </View>

                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.sub}>
                    We sent a 6-digit code to{'\n'}
                    <Text style={{ color: Colors.brand.primary }}>{email}</Text>
                </Text>

                {/* OTP boxes */}
                <View style={styles.boxRow}>
                    {code.map((digit, i) => (
                        <TextInput
                            key={i}
                            ref={r => { inputRefs.current[i] = r }}
                            style={[styles.box, digit ? styles.boxFilled : {}]}
                            value={digit}
                            onChangeText={v => onDigit(v, i)}
                            onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {/* Timer */}
                <Text style={styles.timer}>
                    {timer > 0 ? `Code expires in ${formatTimer(timer)}` : 'Code expired'}
                </Text>

                {/* Verify button */}
                <TouchableOpacity
                    style={[styles.btn, loading && { opacity: 0.6 }]}
                    onPress={verify}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    <Text style={styles.btnText}>{loading ? 'Verifying…' : 'Verify Code'}</Text>
                </TouchableOpacity>

                {/* Resend */}
                <TouchableOpacity
                    onPress={resend}
                    disabled={resending || timer > 0}
                    style={{ marginTop: Spacing.md, alignItems: 'center' }}
                >
                    <Text style={[styles.resend, (resending || timer > 0) && { opacity: 0.4 }]}>
                        {resending ? 'Resending…' : "Didn't get it? Resend code"}
                    </Text>
                </TouchableOpacity>

            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    inner: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 90, alignItems: 'center' },
    iconWrap: {
        width: 72, height: 72, borderRadius: 24,
        backgroundColor: Colors.brand.dim,
        borderWidth: 1, borderColor: Colors.brand.primary,
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    icon: { fontSize: 32 },
    title: { fontFamily: Fonts.black, fontSize: 26, color: Colors.dark.text, marginBottom: 10 },
    sub: { fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 36 },
    boxRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    box: {
        width: 48, height: 58, borderRadius: 14,
        backgroundColor: Colors.dark.input,
        borderWidth: 1.5, borderColor: Colors.dark.border,
        textAlign: 'center',
        fontSize: 22, fontFamily: Fonts.bold,
        color: Colors.dark.text,
    },
    boxFilled: { borderColor: Colors.brand.primary, backgroundColor: Colors.brand.dim },
    timer: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted, marginBottom: 28 },
    btn: {
        width: '100%',
        backgroundColor: Colors.brand.primary,
        borderRadius: Radius.full,
        paddingVertical: 16,
        alignItems: 'center',
    },
    btnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' },
    resend: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.brand.primary },
})
