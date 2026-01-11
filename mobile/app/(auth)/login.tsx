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
import { Mail, Lock, Chrome } from 'lucide-react-native';

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
        <SafeAreaView className="flex-1 bg-[#071B11]">
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 60,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo Circle */}
                    <View className="items-center mb-8">
                        <View
                            className="w-20 h-20 rounded-full border border-[#0f3a2a] items-center justify-center"
                        >
                            <Image
                                source={require('../../assets/images/icon.png')}
                                style={{ width: 36, height: 36, tintColor: '#00d35a' }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Headings */}
                    <Text className="text-4xl font-extrabold text-white text-center">
                        Welcome Back
                    </Text>

                    <Text className="text-gray-300 text-center mt-2 text-base">
                        Log in to continue to Safe Route AI
                    </Text>

                    {/* Email Input */}
                    <View className="mt-10">
                        <View className="flex-row items-center bg-[#0c261a] border border-[#113425] rounded-2xl px-4 h-14">
                            <Mail size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 text-white ml-3 text-base"
                                placeholder="Email or Username"
                                placeholderTextColor="#9ca3af"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View className="mt-6">
                        <View className="flex-row items-center bg-[#0c261a] border border-[#113425] rounded-2xl px-4 h-14">
                            <Lock size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 text-white ml-3 text-base"
                                placeholder="Password"
                                placeholderTextColor="#9ca3af"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    {/* Forgot password */}
                    <TouchableOpacity
                        onPress={() => Alert.alert("Reset Password", "Coming soon!")}
                        className="mt-3 items-end"
                    >
                        <Text className="text-[#00d35a] font-medium">
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-[#00d35a] h-14 rounded-3xl mt-8 items-center justify-center shadow-lg"
                        style={{
                            shadowColor: '#00d35a',
                            shadowOpacity: 0.4,
                            shadowOffset: { width: 0, height: 8 },
                            shadowRadius: 16,
                            elevation: 10,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-[#071B11] font-bold text-lg">
                                Log In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center justify-center my-8">
                        <View className="flex-1 h-[1px] bg-white/10" />
                        <Text className="text-gray-300 mx-3">Or continue with</Text>
                        <View className="flex-1 h-[1px] bg-white/10" />
                    </View>

                    {/* Google Login */}
                    <TouchableOpacity
                        onPress={handleGoogleLogin}
                        className="flex-row items-center justify-center bg-[#0c261a] border border-[#113425] h-14 rounded-2xl space-x-3"
                    >
                        <Chrome size={20} color="white" />
                        <Text className="text-white font-semibold text-base">
                            Sign in with Google
                        </Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center mt-10">
                        <Text className="text-gray-300">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text className="text-[#00d35a] font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
