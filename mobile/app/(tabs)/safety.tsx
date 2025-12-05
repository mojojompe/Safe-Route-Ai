import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, AlertTriangle, Phone } from 'lucide-react-native';

export default function SafetyScreen() {
    return (
        <SafeAreaView className="flex-1 bg-neutral-950">
            <ScrollView className="p-4">
                <Text className="text-2xl font-bold text-white mb-6">Safety Tips</Text>

                <View className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 mb-4">
                    <View className="bg-emerald-500/10 self-start p-3 rounded-xl mb-3">
                        <Shield size={24} color="#10b981" />
                    </View>
                    <Text className="text-white font-bold text-lg mb-2">General Awareness</Text>
                    <Text className="text-gray-400 leading-6">
                        Always stay aware of your surroundings. Avoid using headphones in high-risk areas and keep your phone accessible but secure.
                    </Text>
                </View>

                <View className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 mb-4">
                    <View className="bg-yellow-500/10 self-start p-3 rounded-xl mb-3">
                        <AlertTriangle size={24} color="#eab308" />
                    </View>
                    <Text className="text-white font-bold text-lg mb-2">Walking at Night</Text>
                    <Text className="text-gray-400 leading-6">
                        Stick to well-lit streets and populated areas. Use the "Safe Route" option on the map to avoid dark alleys and crime hotspots.
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => Linking.openURL('tel:911')}
                    className="bg-red-500/20 p-5 rounded-2xl border border-red-500/50 flex-row items-start"
                >
                    <View className="bg-red-500 p-2 rounded-full mr-4">
                        <Phone size={20} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg mb-1">Emergency Contacts</Text>
                        <Text className="text-gray-400">Tap to view local emergency numbers or call 911 instantly.</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
