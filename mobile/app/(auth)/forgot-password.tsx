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
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email);
            Alert.alert(
                'Success',
                'Password reset email sent! Check your inbox.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
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
                        paddingTop: 24,
                        paddingBottom: 40,
                    }}
                >
                    {/* BACK BUTTON */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: '#0f291e',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <ArrowLeft size={24} color="#ffffff" />
                    </TouchableOpacity>

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
                        Reset Password
                    </Text>

                    <Text
                        style={{
                            color: '#9ca3af',
                            textAlign: 'center',
                            marginTop: 6,
                            fontSize: 14,
                            marginBottom: 36,
                        }}
                    >
                        Enter your email address to receive a password reset link
                    </Text>

                    {/* EMAIL */}
                    <View>
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
                                placeholder="Email Address"
                                placeholderTextColor="#6b7280"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    {/* SEND BUTTON */}
                    <TouchableOpacity
                        onPress={handleResetPassword}
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
                                Send Reset Link
                            </Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
