import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { GlassView } from './ui/GlassView';
import { CheckCircle, MapPin, Clock, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

type RouteCompletedModalProps = {
    visible: boolean;
    onClose: () => void;
    startLocation: string;
    endLocation: string;
    duration: string;
    distance: string;
    score: number;
};

const { width, height } = Dimensions.get('window');

export const RouteCompletedModal = ({ visible, onClose, startLocation, endLocation, duration, distance, score }: RouteCompletedModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/80 p-4">
                <Animated.View entering={FadeInUp.springify()} className="w-full max-w-sm">
                    <GlassView intensity={50} className="rounded-3xl p-6 border border-white/10 items-center overflow-hidden">
                        {/* Success Icon */}
                        <View className="w-20 h-20 bg-emerald-500/20 rounded-full items-center justify-center mb-6 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                            <CheckCircle size={40} color="#34d399" />
                        </View>

                        <Text className="text-white text-2xl font-bold mb-2 text-center">Route Completed!</Text>
                        <Text className="text-gray-400 text-center mb-6">
                            You have arrived at your destination safely.
                        </Text>

                        {/* Route Path */}
                        <View className="flex-row items-center justify-center mb-6 w-full space-x-2">
                            <Text className="text-gray-300 font-medium text-sm flex-1 text-right" numberOfLines={1}>
                                {startLocation || 'Start'}
                            </Text>
                            <ArrowRight size={16} color="#4b5563" />
                            <Text className="text-white font-bold text-sm flex-1 text-left" numberOfLines={1}>
                                {endLocation || 'End'}
                            </Text>
                        </View>

                        {/* Stats Grid */}
                        <View className="flex-row justify-between w-full mb-8">
                            <View className="items-center flex-1">
                                <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Time</Text>
                                <Text className="text-white font-bold text-lg">{duration}</Text>
                            </View>
                            <View className="w-px bg-white/10 h-10" />
                            <View className="items-center flex-1">
                                <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Distance</Text>
                                <Text className="text-white font-bold text-lg">{distance}</Text>
                            </View>
                            <View className="w-px bg-white/10 h-10" />
                            <View className="items-center flex-1">
                                <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Safety</Text>
                                <Text className="text-emerald-400 font-bold text-lg">{score}%</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            className="w-full bg-primary py-4 rounded-xl items-center shadow-lg shadow-emerald-900/40 active:scale-95 transition-all"
                        >
                            <Text className="text-black font-bold text-lg">Back to Home</Text>
                        </TouchableOpacity>

                    </GlassView>
                </Animated.View>
            </View>
        </Modal>
    );
};
