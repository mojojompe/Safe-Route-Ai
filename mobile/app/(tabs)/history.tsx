import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

export default function HistoryScreen() {
    const { user } = useAuth();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            // Note: Adjust endpoint if needed based on real backend API
            const res = await api.get('/history', {
                params: { userId: user.uid }
            });
            setHistory(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-xl mb-3 flex-row items-center border border-neutral-800">
            <View className={`p-3 rounded-full mr-4 ${item.riskLevel === 'Low' ? 'bg-emerald-500/10' :
                    item.riskLevel === 'High' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                }`}>
                <Clock size={24} color={
                    item.riskLevel === 'Low' ? '#10b981' :
                        item.riskLevel === 'High' ? '#ef4444' : '#eab308'
                } />
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                    <Text className="text-white font-bold text-base flex-1 mr-2" numberOfLines={1}>
                        To: {item.endLocation}
                    </Text>
                    <Text className={`text-xs font-bold px-2 py-0.5 rounded ${item.riskLevel === 'Low' ? 'text-emerald-500 bg-emerald-500/10' : 'text-yellow-500 bg-yellow-500/10'
                        }`}>
                        {item.riskLevel}
                    </Text>
                </View>
                <Text className="text-gray-400 text-sm">
                    {new Date(item.date).toLocaleDateString()} • {item.distance}
                </Text>
            </View>
            <ChevronRight size={20} color="#4b5563" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-neutral-950 p-4">
            <Text className="text-2xl font-bold text-white mb-6">History</Text>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#10b981" />
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item._id || Math.random().toString()}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
                    }
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Clock size={50} color="#374151" />
                            <Text className="text-gray-500 mt-4 text-lg">No history found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
