import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User as UserIcon } from 'lucide-react-native';
import { AntDesign } from '@expo/vector-icons';

export default function SignupScreen() {
    const router = useRouter();
    const { signupWithEmail, loginWithGoogle } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // 🔐 Password strength
    const getPasswordStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 2) return { label: 'Weak', color: '#ef4444', width: '25%' };
        if (score === 3) return { label: 'Fair', color: '#eab308', width: '50%' };
        if (score === 4) return { label: 'Good', color: '#84cc16', width: '75%' };
        return { label: 'Strong', color: '#22c55e', width: '100%' };
    };

    const strength = getPasswordStrength(password);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await signupWithEmail(email, password, name);
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (error: any) {
            Alert.alert('Google Sign-In Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#072613' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}
            >
                <Text style={{ color: '#ffffff', fontSize: 34 }}>{'‹'}</Text>
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 90,
                        paddingBottom: 40,
                    }}
                >
                    {/* LOGO */}
                    <View style={{ alignItems: 'center', marginBottom: 28 }}>
                        <View
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 36,
                                backgroundColor: '#0d3b27',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#00d35a',
                                shadowOpacity: 0.25,
                                shadowRadius: 12,
                                shadowOffset: { width: 0, height: 6 },
                                elevation: 6,
                            }}
                        >
                            <Image
                                source={require('../../assets/images/icon.png')}
                                style={{ width: 32, height: 32, tintColor: '#00d35a' }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* TITLE */}
                    <Text style={{ color: '#fff', fontSize: 30, fontWeight: '700', textAlign: 'center' }}>
                        Create Your Account
                    </Text>

                    <Text style={{ color: '#9ca3af', textAlign: 'center', marginTop: 6, fontSize: 14 }}>
                        Join Safe Route AI to find the safest paths.
                    </Text>

                    {/* FULL NAME */}
                    <View style={{ marginTop: 36 }}>
                        <View style={inputStyle}>
                            <UserIcon size={18} color="#6b7280" />
                            <TextInput
                                style={textInputStyle}
                                placeholder="Enter your full name"
                                placeholderTextColor="#6b7280"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* EMAIL */}
                    <View style={{ marginTop: 16 }}>
                        <View style={inputStyle}>
                            <Mail size={18} color="#6b7280" />
                            <TextInput
                                style={textInputStyle}
                                placeholder="you@example.com"
                                placeholderTextColor="#6b7280"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    {/* PASSWORD */}
                    <View style={{ marginTop: 16 }}>
                        <View style={inputStyle}>
                            <Lock size={18} color="#6b7280" />
                            <TextInput
                                style={textInputStyle}
                                placeholder="Create a strong password"
                                placeholderTextColor="#6b7280"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        {/* 🔐 Password Strength Meter */}
                        {password.length > 0 && (
                            <View style={{ marginTop: 8 }}>
                                <View
                                    style={{
                                        height: 6,
                                        borderRadius: 4,
                                        backgroundColor: '#1c2e26',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <View
                                        style={{
                                            height: '100%',
                                            width: strength.width,
                                            backgroundColor: strength.color,
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        marginTop: 6,
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: strength.color,
                                    }}
                                >
                                    Password strength: {strength.label}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* SIGN UP BUTTON */}
                    <TouchableOpacity onPress={handleSignup} disabled={loading} style={primaryButton}>
                        {loading ? (
                            <ActivityIndicator color="#071B11" />
                        ) : (
                            <Text style={primaryButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 28 }}>
                        <View style={divider} />
                        <Text style={dividerText}>Or continue with</Text>
                        <View style={divider} />
                    </View>

                    {/* GOOGLE SIGN UP */}
                    <TouchableOpacity onPress={handleGoogleSignup} disabled={loading} style={googleButton}>
                        <AntDesign name="google" size={18} color="#ffffff" />
                        <Text style={googleButtonText}>Google</Text>
                    </TouchableOpacity>

                    {/* FOOTER */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
                        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={{ color: '#00d35a', fontWeight: '700', fontSize: 13, marginLeft: 4 }}>
                                Log In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* ---------- shared styles ---------- */

const inputStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0f291e',
};

const textInputStyle = {
    flex: 1,
    marginLeft: 12,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
};

const primaryButton = {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#00d35a',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    shadowColor: '#00d35a',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
};

const primaryButtonText = {
    color: '#071B11',
    fontWeight: '700',
    fontSize: 16,
};

const divider = {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
};

const dividerText = {
    color: '#9ca3af',
    marginHorizontal: 12,
    fontSize: 13,
};

const googleButton = {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1C2E26',
    borderWidth: 1,
    borderColor: '#2e4c3b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
};

const googleButtonText = {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 10,
};
