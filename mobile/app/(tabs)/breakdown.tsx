import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouteContext } from '../../src/context/RouteContext';
import { MapPin, AlertTriangle, ChevronDown, List, Clock, Zap } from 'lucide-react-native';

export default function BreakdownScreen() {
    const { selectedRoute, destinationQuery } = useRouteContext();
    const [activeTab, setActiveTab] = useState<'segments' | 'turnByTurn'>('segments');

    if (!selectedRoute) {
        return (
            <SafeAreaView className="flex-1 bg-neutral-950 p-4 justify-center items-center">
                <View className="bg-neutral-900 p-8 rounded-full mb-6">
                    <MapPin size={60} color="#374151" />
                </View>
                <Text className="text-2xl font-bold text-white mb-2">No Active Route</Text>
                <Text className="text-gray-500 text-lg text-center leading-6">
                    Go to the <Text className="text-emerald-500 font-bold">Map</Text> tab and search for a destination to see a breakdown.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-950">
            <View className="px-4 pb-4 border-b border-neutral-800">
                <Text className="text-sm text-gray-500 uppercase tracking-widest mb-1">Route to</Text>
                <Text className="text-2xl font-bold text-white" numberOfLines={1}>{destinationQuery || 'Destination'}</Text>

                <View className="flex-row mt-4 space-x-3">
                    <View className="flex-1 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                        <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Risk Level</Text>
                        <Text className={`text-xl font-bold ${selectedRoute.color === 'green' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                            {selectedRoute.score > 70 ? 'Low' : 'Moderate'}
                        </Text>
                    </View>
                    <View className="flex-1 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                        <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Est. Time</Text>
                        <Text className="text-xl font-bold text-white">{selectedRoute.eta}</Text>
                    </View>
                    <View className="flex-1 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                        <Text className="text-gray-400 text-xs uppercase font-bold mb-1">Distance</Text>
                        <Text className="text-xl font-bold text-white">{selectedRoute.distance}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 p-4">
                <Text className="text-white font-bold text-xl mb-4">Route Segments</Text>

                {selectedRoute.segments?.map((segment: any, i: number) => (
                    <View key={i} className="flex-row mb-4 bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
                        <View className="w-2" style={{ backgroundColor: segment.color || '#10b981' }} />
                        <View className="flex-1 p-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <View>
                                    <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Segment {i + 1}</Text>
                                    <Text className="text-white font-bold text-lg">{segment.title || `Path to waypoint ${i + 1}`}</Text>
                                </View>
                                <View className="bg-neutral-800 px-2 py-1 rounded">
                                    <Text className="text-white text-xs font-bold">{segment.score || 0}/10</Text>
                                </View>
                            </View>

                            {segment.reason && (
                                <Text className="text-gray-400 text-sm mb-3 leading-5">{segment.reason}</Text>
                            )}

                            <View className="flex-row flex-wrap gap-2">
                                {segment.risks && segment.risks.length > 0 && (
                                    <View className="flex-row items-center bg-red-500/10 px-2 py-1 rounded-md">
                                        <AlertTriangle size={12} color="#ef4444" />
                                        <Text className="text-red-500 text-xs font-bold ml-1">{segment.risks.length} Risks</Text>
                                    </View>
                                )}
                                <View className="bg-neutral-800 px-2 py-1 rounded-md">
                                    <Text className="text-gray-400 text-xs">{segment.distance || '0.5 km'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {!selectedRoute.segments && (
                    <Text className="text-gray-500 text-center mt-10">No detailed segment data available for this route.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
