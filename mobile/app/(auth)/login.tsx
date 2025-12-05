import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Chrome } from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();
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
            await signInWithEmailAndPassword(auth, email, password);
            // Auth listener in _layout will handle redirect
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        Alert.alert("Coming Soon", "Google Sign-In requires native configuration.");
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-950">
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>

                    <View className="items-center mb-10">
                        <View className="bg-emerald-500/10 p-4 rounded-full mb-4">
                            <Lock size={40} color="#10b981" />
                        </View>
                        <Text className="text-3xl font-bold text-white">Welcome Back</Text>
                        <Text className="text-gray-400 mt-2">Sign in to continue planning safe routes</Text>
                    </View>

                    <View className="space-y-4">
                        {/* Email Input */}
                        <View>
                            <Text className="text-gray-300 mb-2 ml-1">Email Address</Text>
                            <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-xl px-4 h-14 focus:border-emerald-500">
                                <Mail size={20} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 text-white ml-3 text-base"
                                    placeholder="name@example.com"
                                    placeholderTextColor="#6b7280"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text className="text-gray-300 mb-2 ml-1">Password</Text>
                            <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-xl px-4 h-14 focus:border-emerald-500">
                                <Lock size={20} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 text-white ml-3 text-base"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#6b7280"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => Alert.alert("Reset Password", "Coming soon!")} className="items-end">
                            <Text className="text-emerald-500 font-medium">Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            className="bg-emerald-600 h-14 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20 mt-4"
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Log In</Text>
                            )}
                        </TouchableOpacity>

                        <View className="flex-row items-center justify-center my-6">
                            <View className="h-[1px] bg-neutral-800 flex-1" />
                            <Text className="text-gray-500 mx-4">Or continue with</Text>
                            <View className="h-[1px] bg-neutral-800 flex-1" />
                        </View>

                        <TouchableOpacity
                            onPress={handleGoogleLogin}
                            className="flex-row items-center justify-center bg-neutral-900 border border-neutral-800 h-14 rounded-xl space-x-3"
                        >
                            <Chrome size={20} color="white" />
                            <Text className="text-white font-semibold text-base">Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-400">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text className="text-emerald-500 font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
