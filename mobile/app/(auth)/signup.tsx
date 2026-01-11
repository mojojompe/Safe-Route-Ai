import React, { useState } from "react";
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
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock, User as UserIcon } from "lucide-react-native";

export default function SignupScreen() {
    const router = useRouter();
    const { signupWithEmail } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signupWithEmail(email, password, name);
        } catch (error: any) {
            Alert.alert("Signup Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#071B11]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-6 left-4 z-20"
            >
                <Text className="text-white text-4xl">{`‹`}</Text>
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 26,
                        paddingTop: 100,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Floating Logo Circle */}
                    <View className="items-center mb-6">
                        <View
                            className="w-20 h-20 rounded-full bg-[#0d3b27] border border-[#0f5a3c] items-center justify-center"
                        >
                            <Image
                                source={require("../../assets/images/icon.png")}
                                style={{ width: 38, height: 38, tintColor: "#00d35a" }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-white text-center text-4xl font-extrabold">
                        Create Your Account
                    </Text>

                    <Text className="text-gray-300 text-center mt-2 text-lg px-5 leading-6">
                        Join Safe Route AI to find the safest paths.
                    </Text>

                    {/* FULL NAME INPUT */}
                    <View className="mt-10">
                        <Text className="text-gray-200 mb-2 ml-1 font-medium">
                            Full Name
                        </Text>
                        <View className="flex-row items-center bg-[#0c1f17] border border-[#132d24] rounded-2xl px-4 h-14">
                            <UserIcon size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 text-white ml-3 text-base"
                                placeholder="Enter your full name"
                                placeholderTextColor="#9ca3af"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* EMAIL */}
                    <View className="mt-6">
                        <Text className="text-gray-200 mb-2 ml-1 font-medium">
                            Email Address
                        </Text>
                        <View className="flex-row items-center bg-[#0c1f17] border border-[#132d24] rounded-2xl px-4 h-14">
                            <Mail size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 text-white ml-3 text-base"
                                placeholder="you@example.com"
                                placeholderTextColor="#9ca3af"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    {/* PASSWORD */}
                    <View className="mt-6">
                        <Text className="text-gray-200 mb-2 ml-1 font-medium">
                            Password
                        </Text>
                        <View className="flex-row items-center bg-[#0c1f17] border border-[#132d24] rounded-2xl px-4 h-14">
                            <Lock size={20} color="#9ca3af" />
                            <TextInput
                                className="flex-1 text-white ml-3 text-base"
                                placeholder="Create a strong password"
                                placeholderTextColor="#9ca3af"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    {/* SIGN UP BUTTON */}
                    <TouchableOpacity
                        onPress={handleSignup}
                        disabled={loading}
                        className="bg-[#00d35a] h-14 rounded-3xl items-center justify-center mt-8"
                        style={{
                            shadowColor: "#00d35a",
                            shadowOpacity: 0.35,
                            shadowOffset: { width: 0, height: 10 },
                            shadowRadius: 20,
                            elevation: 10,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-[#071B11] font-bold text-lg">Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* FOOTER LINK */}
                    <View className="mt-10 items-center">
                        <Text className="text-gray-300 text-base">
                            Already have an account?{" "}
                            <Text
                                onPress={() => router.push("/(auth)/login")}
                                className="text-[#00d35a] font-bold"
                            >
                                Log In
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
