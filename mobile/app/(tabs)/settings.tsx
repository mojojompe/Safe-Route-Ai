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
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import GlassView from '../../components/ui/GlassView';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
    const { user, logout, updateProfilePhoto } = useAuth(); 
    // ⬆️ updateProfilePhoto should update photoURL in auth/backend
    const router = useRouter();

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [uploading, setUploading] = useState(false);

    const pickProfileImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permission required', 'Allow access to photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            try {
                setUploading(true);
                const imageUri = result.assets[0].uri;
                await updateProfilePhoto(imageUri);
            } catch (err) {
                Alert.alert('Error', 'Failed to update profile photo.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        setLogoutModalVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#071B11]">
            <ScrollView className="flex-1 px-4">
                {/* HEADER */}
                <View className="flex-row items-center justify-between mt-4 mb-6">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ChevronLeft size={26} color="#10b981" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">
                        Settings
                    </Text>
                    <View className="w-6" />
                </View>

                {/* PROFILE */}
                <Animated.View entering={FadeInDown.duration(400)}>
                    <View className="items-center mb-10">
                        <TouchableOpacity
                            onPress={pickProfileImage}
                            activeOpacity={0.8}
                        >
                            <View className="relative">
                                <View className="w-28 h-28 rounded-full border-4 border-emerald-500 items-center justify-center bg-[#0E2219] overflow-hidden">
                                    {user?.photoURL ? (
                                        <Image
                                            source={{ uri: user.photoURL }}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <Text className="text-white text-4xl font-bold">
                                            {user?.displayName?.[0] || 'U'}
                                        </Text>
                                    )}
                                </View>

                                {/* Edit badge */}
                                <View className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-2">
                                    <Pencil size={14} color="#000" />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <Text className="text-white text-2xl font-bold mt-4">
                            {user?.displayName || 'User'}
                        </Text>
                        <Text className="text-gray-400 mt-1">
                            {user?.email}
                        </Text>

                        {uploading && (
                            <Text className="text-emerald-400 text-sm mt-2">
                                Updating photo...
                            </Text>
                        )}
                    </View>
                </Animated.View>

                {/* ACCOUNT */}
                <Text className="text-gray-500 font-bold uppercase mb-3">
                    Account
                </Text>

                <GlassView className="rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <SettingRow
                        icon={<Key size={18} color="#10b981" />}
                        label="Change Password"
                        onPress={() => {}}
                    />
                    <Divider />
                    <SettingRow
                        icon={<Shield size={18} color="#10b981" />}
                        label="Privacy Settings"
                        onPress={() => {}}
                    />
                </GlassView>

                {/* PREFERENCES */}
                <Text className="text-gray-500 font-bold uppercase mb-3">
                    Preferences
                </Text>

                <GlassView className="rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <SettingRow
                        icon={<Bell size={18} color="#10b981" />}
                        label="Notifications"
                        onPress={() => {}}
                    />
                    <Divider />
                    <SettingRow
                        icon={<Map size={18} color="#10b981" />}
                        label="Map Settings"
                        onPress={() => {}}
                    />
                    <Divider />
                    <View className="flex-row items-center px-4 py-4">
                        <View className="mr-4">
                            <Moon size={18} color="#10b981" />
                        </View>
                        <Text className="text-white flex-1 text-base">
                            Dark Mode
                        </Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            thumbColor="#fff"
                            trackColor={{
                                false: '#1f2933',
                                true: '#22c55e',
                            }}
                        />
                    </View>
                </GlassView>

                {/* ROUTE HISTORY */}
                <GlassView className="rounded-2xl mb-8 border border-white/10">
                    <SettingRow
                        icon={<Clock size={18} color="#10b981" />}
                        label="Route History"
                        onPress={() => router.push('/(tabs)/history')}
                    />
                </GlassView>

                {/* LOG OUT */}
                <TouchableOpacity
                    onPress={() => setLogoutModalVisible(true)}
                    className="bg-red-900/40 border border-red-500/30 rounded-2xl py-4 items-center mb-10"
                >
                    <Text className="text-red-400 font-bold text-lg">
                        Log Out
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* LOGOUT MODAL */}
            <Modal visible={logoutModalVisible} transparent animationType="fade">
                <View className="flex-1 bg-black/80 items-center justify-center px-6">
                    <GlassView className="w-full rounded-3xl p-6 border border-white/10">
                        <Text className="text-white text-xl font-bold text-center mb-2">
                            Log Out
                        </Text>
                        <Text className="text-gray-400 text-center mb-6">
                            Are you sure you want to log out?
                        </Text>

                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                onPress={() => setLogoutModalVisible(false)}
                                className="flex-1 bg-white/10 py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-bold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleLogout}
                                className="flex-1 bg-red-500 py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-bold">
                                    Log Out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </GlassView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/* ---------- Helpers ---------- */

function SettingRow({
    icon,
    label,
    onPress,
}: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center px-4 py-4"
        >
            <View className="mr-4">{icon}</View>
            <Text className="text-white flex-1 text-base">
                {label}
            </Text>
            <ChevronRight size={18} color="#6b7280" />
        </TouchableOpacity>
    );
}

function Divider() {
    return <View className="h-px bg-white/10 ml-12" />;
}
