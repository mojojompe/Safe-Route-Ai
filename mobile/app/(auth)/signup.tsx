import { useState } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { authApi } from '@/services/api'
import { StatusBar } from 'expo-status-bar'
import { Icon } from '@/components/ui/Icon'

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const strength = (() => {
        const p = form.password
        if (!p) return 0
        let s = 0
        if (p.length >= 8) s++
        if (/[A-Z]/.test(p)) s++
        if (/[0-9]/.test(p)) s++
        if (/[^A-Za-z0-9]/.test(p)) s++
        return s
    })()
    const strengthColor = ['#555', '#ef4444', '#f59e0b', '#3b82f6', Colors.brand.primary][strength]
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]

    const handleRegister = async () => {
        if (!form.name || !form.email || !form.password) {
            Alert.alert('Missing Info', 'Please fill all required fields.')
            return
        }
        if (form.password !== form.confirm) {
            Alert.alert('Password Mismatch', 'Passwords do not match.')
            return
        }
        if (strength < 2) {
            Alert.alert('Weak Password', 'Please use a stronger password.')
            return
        }
        setLoading(true)
        try {
            await authApi.register({ name: form.name, email: form.email.trim().toLowerCase(), password: form.password, phone: form.phone })
            router.push({ pathname: '/(auth)/otp-verify', params: { email: form.email, mode: 'signup' } })
        } catch (err: any) {
            Alert.alert('Registration Failed', err?.response?.data?.error || 'Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const field = (label: string, key: keyof typeof form, opts?: any) => (
        <View style={{ marginBottom: Spacing.md }}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrap}>
                <TextInput
                    style={styles.input}
                    value={form[key]}
                    onChangeText={v => setForm(f => ({ ...f, [key]: v }))}
                    placeholderTextColor={Colors.dark.textMuted}
                    {...opts}
                />
                {(key === 'password' || key === 'confirm') && (
                    <TouchableOpacity onPress={() => setShowPw(!showPw)} style={{ padding: 6 }}>
                        <Icon name={showPw ? 'eye-off' : 'eye'} size={20} color={Colors.dark.textMuted} strokeWidth={1.8} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                <Animated.View entering={FadeInDown.springify()} style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.sub}>Join Safe Route AI and navigate safely</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.card}>
                    {field('Full Name *', 'name', { placeholder: 'Your full name', autoCapitalize: 'words' })}
                    {field('Email *', 'email', { placeholder: 'yourname@email.com', keyboardType: 'email-address', autoCapitalize: 'none' })}
                    {field('Phone (Optional)', 'phone', { placeholder: '+234 000 000 0000', keyboardType: 'phone-pad' })}
                    {field('Password *', 'password', { placeholder: '••••••••', secureTextEntry: !showPw })}

                    {form.password.length > 0 && (
                        <View style={{ marginTop: -8, marginBottom: Spacing.md }}>
                            <View style={styles.strengthBar}>
                                {[1, 2, 3, 4].map(i => (
                                    <View key={i} style={[styles.strengthSegment, { backgroundColor: i <= strength ? strengthColor : Colors.dark.border }]} />
                                ))}
                            </View>
                            <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                        </View>
                    )}

                    {field('Confirm Password *', 'confirm', { placeholder: '••••••••', secureTextEntry: !showPw })}

                    <TouchableOpacity
                        style={[styles.btn, loading && { opacity: 0.6 }]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ alignItems: 'center', marginTop: Spacing.lg }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.signInText}>Already have an account? <Text style={{ color: Colors.brand.primary }}>Sign in</Text></Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 70, paddingBottom: 40 },
    header: { marginBottom: 28 },
    title: { fontFamily: Fonts.black, fontSize: 28, color: Colors.dark.text },
    sub: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted, marginTop: 4 },
    card: {
        backgroundColor: Colors.dark.card,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        padding: Spacing.lg,
    },
    label: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.dark.textMuted, marginBottom: 6 },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.input,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        paddingHorizontal: Spacing.md,
    },
    input: { flex: 1, paddingVertical: 14, fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.text },
    strengthBar: { flexDirection: 'row', gap: 4, marginBottom: 4 },
    strengthSegment: { flex: 1, height: 3, borderRadius: 2 },
    strengthLabel: { fontFamily: Fonts.semibold, fontSize: 11 },
    btn: {
        marginTop: Spacing.sm,
        backgroundColor: Colors.brand.primary,
        borderRadius: Radius.full,
        paddingVertical: 16,
        alignItems: 'center',
    },
    btnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' },
    signInText: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted },
})
