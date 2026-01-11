import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouteContext } from '../../src/context/RouteContext';
import { AlertTriangle, Flag } from 'lucide-react-native';
import GlassView from '../../components/ui/GlassView';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { RouteCompletedModal } from '../../components/RouteCompletedModal';
import { useRouter } from 'expo-router';

export default function BreakdownScreen() {
    const { selectedRoute, destinationQuery } = useRouteContext();
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    if (!selectedRoute) {
        return (
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop' }}
                className="flex-1"
            >
                <SafeAreaView className="flex-1 justify-center items-center px-6">
                    <Text className="text-white text-2xl font-bold mb-2">No Active Route</Text>
                    <Text className="text-gray-400 text-center">
                        Go back to the map and select a route to view analysis.
                    </Text>
                </SafeAreaView>
            </ImageBackground>
        );
    }

    const handleFinishRoute = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        router.replace('/(tabs)/map');
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop' }}
            className="flex-1 bg-[#071B11]"
            resizeMode="cover"
        >
            <SafeAreaView className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1 px-4"
                >
                    {/* HEADER */}
                    <Animated.View entering={FadeInDown}>
                        <Text className="text-white text-3xl font-bold mt-4">
                            Route Analysis
                        </Text>
                        <Text className="text-gray-400 mt-1 text-base">
                            {destinationQuery || 'Destination'}
                        </Text>
                    </Animated.View>

                    {/* STATS */}
                    <Animated.View entering={FadeInDown.delay(100)} className="mt-6">
                        <View className="flex-row justify-between">
                            <View className="w-[48%] bg-[#0E2219] p-4 rounded-xl border border-[#1a3a2a]">
                                <Text className="text-gray-400 text-sm">Overall Risk</Text>
                                <Text className="text-white text-2xl font-bold mt-1">
                                    {(selectedRoute.score / 10).toFixed(1)} / 10
                                </Text>
                            </View>

                            <View className="w-[48%] bg-[#0E2219] p-4 rounded-xl border border-[#1a3a2a]">
                                <Text className="text-gray-400 text-sm">Distance</Text>
                                <Text className="text-white text-2xl font-bold mt-1">
                                    {selectedRoute.distance}
                                </Text>
                            </View>
                        </View>

                        <View className="mt-4 bg-[#0E2219] p-4 rounded-xl border border-[#1a3a2a]">
                            <Text className="text-gray-400 text-sm">Est. Time</Text>
                            <Text className="text-white text-2xl font-bold mt-1">
                                {selectedRoute.eta}
                            </Text>
                        </View>
                    </Animated.View>

                    {/* TABS */}
                    <View className="flex-row bg-[#0E2219] mt-6 p-1 rounded-xl border border-[#1a3a2a]">
                        <View className="flex-1 bg-[#00D35A] py-3 rounded-lg items-center">
                            <Text className="text-black font-bold">Route Segments</Text>
                        </View>
                        <View className="flex-1 py-3 rounded-lg items-center">
                            <Text className="text-gray-400 font-semibold">Turn-by-turn</Text>
                        </View>
                    </View>

                    {/* SEGMENTS */}
                    <View className="mt-6">
                        {selectedRoute.segments?.map((segment: any, i: number) => {
                            const borderColor =
                                segment.score >= 7
                                    ? '#ef4444'
                                    : segment.score >= 4
                                    ? '#f59e0b'
                                    : '#22c55e';

                            return (
                                <Animated.View
                                    key={i}
                                    entering={FadeInUp.delay(100 + i * 80)}
                                    className="mb-4"
                                >
                                    <View
                                        className="rounded-xl p-4"
                                        style={{ borderWidth: 1, borderColor }}
                                    >
                                        <View className="flex-row justify-between mb-2">
                                            <View>
                                                <Text className="text-gray-400 text-xs">
                                                    Segment {i + 1} of {selectedRoute.segments.length}
                                                </Text>
                                                <Text className="text-white text-lg font-bold mt-1">
                                                    {segment.title}
                                                </Text>
                                            </View>

                                            <View
                                                className="px-3 py-1 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        segment.score >= 7
                                                            ? '#ef444420'
                                                            : segment.score >= 4
                                                            ? '#f59e0b20'
                                                            : '#22c55e20',
                                                }}
                                            >
                                                <Text
                                                    className="text-xs font-bold"
                                                    style={{
                                                        color:
                                                            segment.score >= 7
                                                                ? '#ef4444'
                                                                : segment.score >= 4
                                                                ? '#f59e0b'
                                                                : '#22c55e',
                                                    }}
                                                >
                                                    {segment.score}/10
                                                </Text>
                                            </View>
                                        </View>

                                        {segment.reason && (
                                            <Text className="text-gray-300 text-sm mb-3">
                                                {segment.reason}
                                            </Text>
                                        )}

                                        <View className="flex-row flex-wrap gap-2 mb-3">
                                            {segment.risks?.map((risk: string, idx: number) => (
                                                <View
                                                    key={idx}
                                                    className="bg-[#1A2233] px-3 py-1 rounded-full"
                                                >
                                                    <Text className="text-gray-300 text-xs">
                                                        {risk}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        <TouchableOpacity className="flex-row items-center">
                                            <AlertTriangle size={14} color="#00D35A" />
                                            <Text className="text-[#00D35A] ml-2 font-semibold">
                                                View Safer Detour
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            );
                        })}
                    </View>

                    {/* MAP PREVIEW */}
                    <View className="mt-6 mb-6 rounded-xl overflow-hidden border border-[#1a3a2a]">
                        <ImageBackground
                            source={{ uri: selectedRoute.previewImage }}
                            className="h-72 w-full"
                        />
                    </View>

                    {/* FINISH BUTTON */}
                    <TouchableOpacity
                        onPress={handleFinishRoute}
                        className="mb-10 bg-[#00D35A] py-4 rounded-xl flex-row justify-center items-center"
                    >
                        <Flag size={18} color="black" />
                        <Text className="text-black font-bold text-lg ml-2">
                            Finish Route
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                <RouteCompletedModal
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    startLocation="Current Location"
                    endLocation={destinationQuery}
                    duration={selectedRoute.eta}
                    distance={selectedRoute.distance}
                    score={selectedRoute.score}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}
