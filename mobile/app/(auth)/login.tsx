import { useState } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { StatusBar } from 'expo-status-bar'
import { Icon } from '@/components/ui/Icon'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setUser } = useAuthStore()

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing fields', 'Please enter your email and password.')
            return
        }
        setLoading(true)
        try {
            const res = await authApi.login(email.trim().toLowerCase(), password)
            await setUser(res.data.user, res.data.token)
            router.replace('/(tabs)/plan')
        } catch (err: any) {
            const msg = err?.response?.data?.error || 'Login failed. Please try again.'
            Alert.alert('Login Failed', msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Header */}
                <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.header}>
                    <View style={styles.logoMini}>
                        <Text style={styles.logoIcon}>📍</Text>
                    </View>
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.sub}>Sign in to continue navigating safely</Text>
                </Animated.View>

                {/* Form Card */}
                <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.card}>

                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputWrap}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="yourname@email.com"
                            placeholderTextColor={Colors.dark.textMuted}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={[styles.label, { marginTop: Spacing.md }]}>Password</Text>
                    <View style={styles.inputWrap}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor={Colors.dark.textMuted}
                            secureTextEntry={!showPw}
                        />
                        <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                            <Text style={styles.eyeIcon}>{showPw ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/forgot-password')}
                        style={{ alignSelf: 'flex-end', marginTop: 8 }}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, loading && { opacity: 0.6 }]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.divLine} />
                        <Text style={styles.divText}>or</Text>
                        <View style={styles.divLine} />
                    </View>

                    <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
                        <Text style={styles.googleIcon}>G</Text>
                        <Text style={styles.googleText}>Continue with Google</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Sign up link */}
                <Animated.View entering={FadeInDown.delay(250).springify()} style={{ alignItems: 'center', marginTop: 24 }}>
                    <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                        <Text style={styles.signupText}>
                            Don't have an account?{' '}
                            <Text style={{ color: Colors.brand.primary }}>Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 80, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 32 },
    logoMini: {
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: Colors.brand.dim,
        borderWidth: 1, borderColor: Colors.brand.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
    },
    logoIcon: { fontSize: 28 },
    title: { fontFamily: Fonts.black, fontSize: 28, color: Colors.dark.text, textAlign: 'center' },
    sub: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted, marginTop: 6, textAlign: 'center' },
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
    input: {
        flex: 1,
        paddingVertical: 14,
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: Colors.dark.text,
    },
    eyeBtn: { padding: 6 },
    eyeIcon: { fontSize: 16 },
    forgotText: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.brand.primary },
    btn: {
        marginTop: Spacing.lg,
        backgroundColor: Colors.brand.primary,
        borderRadius: Radius.full,
        paddingVertical: 16,
        alignItems: 'center',
    },
    btnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md, gap: 8 },
    divLine: { flex: 1, height: 1, backgroundColor: Colors.dark.border },
    divText: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.dark.textMuted },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        paddingVertical: 14,
        backgroundColor: Colors.dark.input,
    },
    googleIcon: { fontFamily: Fonts.black, fontSize: 16, color: '#4285F4' },
    googleText: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.dark.text },
    signupText: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted },
})
