import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { User, LogOut, Info, ChevronRight, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            // Router will auto-redirect in _layout
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-950">
            <ScrollView className="p-4">
                <Text className="text-3xl font-bold text-white mb-8">Settings</Text>

                {/* User Profile */}
                <View className="flex-row items-center mb-8 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
                    <View className="h-16 w-16 rounded-full bg-emerald-600 items-center justify-center mr-4">
                        <Text className="text-white text-2xl font-bold">{user?.displayName?.[0] || 'U'}</Text>
                    </View>
                    <View>
                        <Text className="text-white text-xl font-bold">{user?.displayName || 'User'}</Text>
                        <Text className="text-gray-400">{user?.email}</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="bg-neutral-900 rounded-2xl overflow-hidden mb-6 border border-neutral-800">
                    <TouchableOpacity onPress={() => router.push('/(tabs)/history')} className="flex-row items-center p-4 border-b border-neutral-800">
                        <View className="bg-blue-500/10 p-2 rounded-lg mr-4">
                            <Clock size={20} color="#3b82f6" />
                        </View>
                        <Text className="text-white text-lg flex-1">History</Text>
                        <ChevronRight size={20} color="#6b7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Alert.alert('About Safe-Route-Ai', 'Version 1.0.0\n\nHelping you find the safest path since 2024.')}
                        className="flex-row items-center p-4"
                    >
                        <View className="bg-purple-500/10 p-2 rounded-lg mr-4">
                            <Info size={20} color="#a855f7" />
                        </View>
                        <Text className="text-white text-lg flex-1">About App</Text>
                        <ChevronRight size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleLogout} className="flex-row items-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                    <LogOut size={20} color="#ef4444" />
                    <Text className="text-red-500 text-lg font-bold ml-3">Log Out</Text>
                </TouchableOpacity>

                <View className="mt-10 items-center">
                    <Text className="text-gray-600">Safe-Route-Ai v1.0.0</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
