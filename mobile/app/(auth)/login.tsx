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
import { Mail, Lock } from 'lucide-react-native';
import { AntDesign } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const { loginWithEmail, loginWithGoogle } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }
        setLoading(true);
        try {
            await loginWithEmail(email, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 64,
                        paddingBottom: 40,
                    }}
                >
                    {/* LOGO */}
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
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
                                style={{
                                    width: 32,
                                    height: 32,
                                    tintColor: '#00d35a',
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* TITLE */}
                    <Text
                        style={{
                            color: '#ffffff',
                            fontSize: 28,
                            fontWeight: '700',
                            textAlign: 'center',
                        }}
                    >
                        Welcome Back
                    </Text>

                    <Text
                        style={{
                            color: '#9ca3af',
                            textAlign: 'center',
                            marginTop: 6,
                            fontSize: 14,
                        }}
                    >
                        Log in to continue to Safe Route AI
                    </Text>

                    {/* EMAIL */}
                    <View style={{ marginTop: 36 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 52,
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                backgroundColor: '#0f291e',
                            }}
                        >
                            <Mail size={18} color="#6b7280" />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: 12,
                                    color: '#ffffff',
                                    fontSize: 15,
                                    fontWeight: '500',
                                }}
                                placeholder="Email or Username"
                                placeholderTextColor="#6b7280"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* PASSWORD */}
                    <View style={{ marginTop: 16 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 52,
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                backgroundColor: '#0f291e',
                            }}
                        >
                            <Lock size={18} color="#6b7280" />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: 12,
                                    color: '#ffffff',
                                    fontSize: 15,
                                    fontWeight: '500',
                                }}
                                placeholder="Password"
                                placeholderTextColor="#6b7280"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    {/* FORGOT PASSWORD */}
                    <TouchableOpacity
                        style={{ marginTop: 10, alignItems: 'flex-end' }}
                        onPress={() => router.push('/(auth)/forgot-password')}
                    >
                        <Text
                            style={{
                                color: '#00d35a',
                                fontSize: 13,
                                fontWeight: '600',
                            }}
                        >
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* LOGIN BUTTON */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        style={{
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
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#071B11" />
                        ) : (
                            <Text
                                style={{
                                    color: '#071B11',
                                    fontWeight: '700',
                                    fontSize: 16,
                                }}
                            >
                                Log In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 28,
                        }}
                    >
                        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        <Text style={{ color: '#9ca3af', marginHorizontal: 12, fontSize: 13 }}>
                            Or continue with
                        </Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    </View>

                    {/* GOOGLE SIGN IN */}
                    <TouchableOpacity
                        onPress={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            height: 52,
                            borderRadius: 16,
                            backgroundColor: '#1C2E26',
                            borderWidth: 1,
                            borderColor: '#2e4c3b',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AntDesign name="google" size={18} color="#ffffff" />
                        <Text
                            style={{
                                color: '#ffffff',
                                fontWeight: '600',
                                fontSize: 15,
                                marginLeft: 10,
                            }}
                        >
                            Google
                        </Text>
                    </TouchableOpacity>

                    {/* SIGN UP */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 32,
                        }}
                    >
                        <Text style={{ color: '#9ca3af', fontSize: 13 }}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/signup')}
                        >
                            <Text
                                style={{
                                    color: '#00d35a',
                                    fontWeight: '700',
                                    fontSize: 13,
                                    marginLeft: 4,
                                }}
                            >
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
