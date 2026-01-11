import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Clock,
    MapPin,
    ChevronRight,
    Search,
    ArrowRight,
    ShieldCheck,
    AlertTriangle,
} from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';
import GlassView from '../../components/ui/GlassView';
import Animated, { FadeInDown } from 'react-native-reanimated';

const FILTERS = ['All', 'Walking', 'Driving', 'Safest', 'Riskiest'];

export default function HistoryScreen() {
    const { user } = useAuth();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');

    const fetchHistory = async () => {
        if (!user) return;
        try {
            const res = await api.get('/history', {
                params: { userId: user.uid },
            });
            setHistory(res.data || []);
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

    const filteredHistory = history.filter(item => {
        const matchesSearch =
            item.endLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.startLocation?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filter === 'All' ||
            item.mode === filter.toLowerCase() ||
            (filter === 'Safest' && item.riskLevel === 'Low') ||
            (filter === 'Riskiest' && item.riskLevel === 'High');

        return matchesSearch && matchesFilter;
    });

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 80)}>
            <GlassView
                intensity={25}
                className="mb-4 rounded-2xl p-4 border border-white/5 bg-white/5"
            >
                <View className="flex-row items-center">
                    {/* Map Thumbnail */}
                    <View className="w-20 h-20 rounded-xl bg-black/40 border border-white/5 items-center justify-center mr-4">
                        <MapPin size={22} color="#34d399" />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                        <Text className="text-white font-bold text-base mb-1">
                            {item.startLocation?.split(',')[0] || 'Origin'}
                            <Text className="text-gray-400"> → </Text>
                            {item.endLocation?.split(',')[0] || 'Destination'}
                        </Text>

                        <Text className="text-gray-400 text-xs mb-3">
                            {new Date(item.date).toLocaleDateString()} •{' '}
                            {item.duration || '0 min'} • {item.distance}
                        </Text>

                        {/* Status Tags */}
                        {item.riskLevel === 'Low' ? (
                            <View className="flex-row items-center bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 self-start">
                                <ShieldCheck size={12} color="#10b981" />
                                <Text className="text-emerald-400 text-xs font-bold ml-1">
                                    Safest Route Chosen
                                </Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center bg-yellow-500/15 px-3 py-1 rounded-full border border-yellow-500/30 self-start">
                                <AlertTriangle size={12} color="#eab308" />
                                <Text className="text-yellow-400 text-xs font-bold ml-1">
                                    Risks Detected
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Chevron */}
                    <ChevronRight size={20} color="#4b5563" />
                </View>
            </GlassView>
        </Animated.View>
    );

    return (
        <View className="flex-1 bg-[#071B11]">
            <SafeAreaView className="flex-1 px-4">
                {/* Header */}
                <Text className="text-3xl font-bold text-white mt-2">
                    Route History
                </Text>
                <Text className="text-gray-400 mt-1 mb-6">
                    Review your past trips and AI-generated safety insights.
                </Text>

                {/* Search */}
                <GlassView
                    intensity={20}
                    className="flex-row items-center px-4 py-3 rounded-xl mb-4 bg-white/5 border border-white/5"
                >
                    <Search size={18} color="#9ca3af" />
                    <TextInput
                        className="flex-1 ml-3 text-white"
                        placeholder="Search by location, date, or tag..."
                        placeholderTextColor="#6b7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </GlassView>

                {/* Filters */}
                <FlatList
                    data={FILTERS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item}
                    className="mb-6"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setFilter(item)}
                            className={`px-4 py-2 mr-2 rounded-full ${
                                filter === item
                                    ? 'bg-emerald-500'
                                    : 'bg-white/5 border border-white/5'
                            }`}
                        >
                            <Text
                                className={`font-bold text-sm ${
                                    filter === item
                                        ? 'text-black'
                                        : 'text-gray-300'
                                }`}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* List */}
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#32CD32" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredHistory}
                        keyExtractor={item => item._id || Math.random().toString()}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#32CD32"
                            />
                        }
                        ListEmptyComponent={
                            <View className="items-center mt-24">
                                <View className="w-16 h-16 rounded-full bg-white/5 items-center justify-center mb-4">
                                    <Clock size={28} color="#4b5563" />
                                </View>
                                <Text className="text-gray-400 font-bold text-lg">
                                    No history found
                                </Text>
                                <Text className="text-gray-500 text-center mt-2">
                                    Your past routes will appear here.
                                </Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
