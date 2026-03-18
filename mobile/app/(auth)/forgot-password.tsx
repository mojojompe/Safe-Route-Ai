import { useState } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Alert
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { authApi } from '@/services/api'
import { StatusBar } from 'expo-status-bar'

export default function ForgotPassword() {
    const { email: prefillEmail, step, code: verifiedCode } = useLocalSearchParams<{
        email?: string; step?: string; code?: string
    }>()

    const [email, setEmail] = useState(prefillEmail || '')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const isResetStep = step === 'new-password'

    const sendReset = async () => {
        if (!email.trim()) { Alert.alert('Enter Email', 'Please enter your email address.'); return }
        setLoading(true)
        try {
            await authApi.forgotPassword(email.trim().toLowerCase())
            router.push({ pathname: '/(auth)/otp-verify', params: { email: email.trim(), mode: 'reset' } })
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.error || 'Could not send reset email.')
        } finally {
            setLoading(false)
        }
    }

    const doReset = async () => {
        if (!newPassword || newPassword !== confirm) {
            Alert.alert('Password Mismatch', 'Passwords do not match.')
            return
        }
        if (newPassword.length < 8) {
            Alert.alert('Too Short', 'Password must be at least 8 characters.')
            return
        }
        setLoading(true)
        try {
            await authApi.resetPassword(prefillEmail!, verifiedCode!, newPassword)
            Alert.alert('Password Updated', 'Your password has been reset successfully.', [
                { text: 'Sign In', onPress: () => router.replace('/(auth)/login') }
            ])
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.error || 'Reset failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="light" />
            <Animated.View entering={FadeInDown.springify()} style={styles.inner}>

                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.iconWrap}>
                    <Text style={styles.icon}>{isResetStep ? '🔐' : '🔑'}</Text>
                </View>

                <Text style={styles.title}>{isResetStep ? 'New Password' : 'Forgot Password?'}</Text>
                <Text style={styles.sub}>
                    {isResetStep
                        ? 'Create a strong new password for your account'
                        : "Enter your email and we'll send a reset code"}
                </Text>

                {!isResetStep ? (
                    <>
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
                        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={sendReset} disabled={loading}>
                            <Text style={styles.btnText}>{loading ? 'Sending…' : 'Send Reset Code'}</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={[styles.inputWrap, { marginBottom: Spacing.md }]}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="New password"
                                placeholderTextColor={Colors.dark.textMuted}
                                secureTextEntry={!showPw}
                            />
                            <TouchableOpacity onPress={() => setShowPw(!showPw)} style={{ padding: 6 }}>
                                <Text>{showPw ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputWrap}>
                            <TextInput
                                style={styles.input}
                                value={confirm}
                                onChangeText={setConfirm}
                                placeholder="Confirm new password"
                                placeholderTextColor={Colors.dark.textMuted}
                                secureTextEntry={!showPw}
                            />
                        </View>
                        <TouchableOpacity style={[styles.btn, { marginTop: Spacing.lg }, loading && { opacity: 0.6 }]} onPress={doReset} disabled={loading}>
                            <Text style={styles.btnText}>{loading ? 'Updating…' : 'Update Password'}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Animated.View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    inner: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 70 },
    backBtn: { marginBottom: 32 },
    backText: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.brand.primary },
    iconWrap: {
        width: 72, height: 72, borderRadius: 24,
        backgroundColor: Colors.brand.dim,
        borderWidth: 1, borderColor: Colors.brand.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, alignSelf: 'center',
    },
    icon: { fontSize: 32 },
    title: { fontFamily: Fonts.black, fontSize: 26, color: Colors.dark.text, textAlign: 'center', marginBottom: 8 },
    sub: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.dark.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    inputWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.dark.input,
        borderRadius: Radius.md,
        borderWidth: 1, borderColor: Colors.dark.border,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
    },
    input: { flex: 1, paddingVertical: 14, fontFamily: Fonts.regular, fontSize: 15, color: Colors.dark.text },
    btn: {
        backgroundColor: Colors.brand.primary,
        borderRadius: Radius.full,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    btnText: { fontFamily: Fonts.bold, fontSize: 16, color: '#000' },
})
