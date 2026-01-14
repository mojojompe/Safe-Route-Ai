import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
    Switch,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../src/context/AuthContext';
import {
    ChevronLeft,
    ChevronRight,
    Key,
    Shield,
    Bell,
    Map,
    Moon,
    Clock,
    LogOut,
    Pencil,
    X,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const { user, logout, updateProfilePhoto } = useAuth();
    const router = useRouter();

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [uploading, setUploading] = useState(false);

    const pickProfileImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Allow access to photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setUploading(true);
            await updateProfilePhoto(result.assets[0].uri);
            setUploading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0A100C]">
            <ScrollView className="px-5" showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View className="relative mt-2 mb-10 items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-0 top-1"
                    >
                        <ChevronLeft size={28} color="#22c55e" />
                    </TouchableOpacity>

                    <Text className="text-white text-xl font-semibold">
                        Settings
                    </Text>
                </View>

                {/* PROFILE */}
                <View className="items-center mb-8">
                    <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.9}>
                        <View className="relative">
                            <View
                                style={{ width: 96, height: 96 }}
                                className="rounded-full border-2 border-[#22c55e] overflow-hidden items-center justify-center"
                            >
                                {user?.photoURL ? (
                                    <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                                ) : (
                                    <View className="w-full h-full bg-[#d4b08a] items-center justify-center">
                                        <View className="w-10 h-14 bg-white rounded-sm" />
                                    </View>
                                )}
                            </View>

                            {/* EDIT BADGE */}
                            <View className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#22c55e] items-center justify-center">
                                <Pencil size={14} color="#fff" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text className="text-white text-2xl font-bold mt-4">
                        {user?.displayName || 'Alex Johnson'}
                    </Text>

                    <Text className="text-gray-400">
                        {user?.email || 'alex.johnson@email.com'}
                    </Text>

                    {uploading && (
                        <Text className="text-emerald-400 text-sm mt-2">
                            Updating photo…
                        </Text>
                    )}
                </View>

                {/* ACCOUNT */}
                <Text className="px-1 text-sm font-medium text-gray-500 mb-2">
                    Account
                </Text>

                <View className="rounded-lg overflow-hidden mb-8" style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}>
                    <Row icon={<Key size={18} color="#22c55e" />} label="Change Password" />
                    <Divider />
                    <Row icon={<Shield size={18} color="#22c55e" />} label="Privacy Settings" />
                </View>

                {/* PREFERENCES */}
                <Text className="px-1 text-sm font-medium text-gray-500 mb-2">
                    Preferences
                </Text>

                <View className="rounded-lg overflow-hidden mb-8" style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}>
                    <Row icon={<Bell size={18} color="#22c55e" />} label="Notifications" />
                    <Divider />
                    <Row icon={<Map size={18} color="#22c55e" />} label="Map Settings" />
                    <Divider />

                    {/* DARK MODE */}
                    <View className="flex-row items-center px-5 py-4">
                        <Moon size={18} color="#22c55e" />
                        <Text className="text-white flex-1 ml-4 text-base font-medium">
                            Dark Mode
                        </Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            thumbColor="#ffffff"
                            trackColor={{ false: '#374151', true: '#22c55e' }}
                        />
                    </View>
                </View>

                {/* ROUTE HISTORY */}
                {/* ROUTE HISTORY */}
                <View className="rounded-lg overflow-hidden mb-8" style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}>
                    <Row
                        icon={<Clock size={18} color="#22c55e" />}
                        label="Route History"
                        onPress={() => router.push('/(tabs)/history')}
                    />
                </View>

                {/* LOG OUT */}
                <TouchableOpacity
                    onPress={() => setLogoutModalVisible(true)}
                    className="w-full p-4 rounded-lg items-center justify-center mb-20"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                    <Text className="text-red-400 font-semibold">
                        Log Out
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* LOGOUT MODAL */}
            <Modal visible={logoutModalVisible} transparent animationType="fade">
                <View className="flex-1 bg-black/80 items-center justify-center px-6">
                    <View className="bg-[#0B1E16] rounded-3xl p-6 w-full">
                        <Text className="text-white text-xl font-semibold text-center mb-2">
                            Log Out
                        </Text>
                        <Text className="text-gray-400 text-center mb-6">
                            Are you sure you want to log out?
                        </Text>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setLogoutModalVisible(false)}
                                className="flex-1 bg-white/10 py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={logout}
                                className="flex-1 bg-red-500 py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-semibold">Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/* ---------- Helpers ---------- */

function Row({
    icon,
    label,
    onPress = () => { },
}: {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center p-4"
        >
            {icon}
            <Text className="text-gray-200 flex-1 ml-4 text-base">
                {label}
            </Text>
            <ChevronRight size={20} color="#6b7280" />
        </TouchableOpacity>
    );
}

function Divider() {
    return <View className="h-px bg-gray-800" />;
}
