import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ShieldCheck,
    Eye,
    Lightbulb,
    Lock,
    Users,
    Gauge,
    Search,
    User,
    ChevronDown,
    ChevronUp,
} from 'lucide-react-native';

/* Enable layout animation on Android */
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Tip = {
    id: string;
    title: string;
    short: string;
    details: string;
    icon: any;
    category: 'Walking' | 'Driving' | 'General';
};

function generateAiTips(mode: 'All' | 'Walking' | 'Driving'): Tip[] {
    const baseTips: Tip[] = [
        {
            id: 'aware',
            title: 'Be Aware of Your Surroundings',
            short: 'Avoid distractions and stay alert.',
            details:
                'AI analysis shows that situational awareness reduces incident likelihood by up to 45%. Avoid phone distractions and monitor nearby movement.',
            icon: Eye,
            category: 'General',
        },
        {
            id: 'lighting',
            title: 'Stick to Well-Lit Areas',
            short: 'Choose illuminated and populated routes.',
            details:
                'Low-light environments correlate strongly with safety incidents. AI recommends prioritizing streets with active lighting and pedestrian traffic.',
            icon: Lightbulb,
            category: 'Walking',
        },
        {
            id: 'vehicle',
            title: 'Secure Your Vehicle',
            short: 'Lock doors and hide valuables.',
            details:
                'AI-flagged risk zones show increased break-ins when valuables are visible. Lock doors and avoid isolated parking spots.',
            icon: Lock,
            category: 'Driving',
        },
        {
            id: 'instinct',
            title: 'Trust Your Instincts',
            short: 'Leave if something feels off.',
            details:
                'Behavioral risk models indicate early exit decisions significantly reduce danger exposure. Do not second-guess discomfort.',
            icon: Users,
            category: 'General',
        },
        {
            id: 'distance',
            title: 'Maintain Safe Following Distance',
            short: 'Follow the 3-second rule.',
            details:
                'AI traffic modeling confirms safer braking response times when maintaining proper following distance, especially in urban traffic.',
            icon: Gauge,
            category: 'Driving',
        },
    ];

    if (mode === 'All') return baseTips;
    return baseTips.filter(t => t.category === mode || t.category === 'General');
}

/* ---------------- SCREEN ---------------- */

export default function SafetyScreen() {
    const [activeTab, setActiveTab] = useState<'All' | 'Walking' | 'Driving'>('All');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const tips = useMemo(() => {
        const aiTips = generateAiTips(activeTab);
        return aiTips.filter(t =>
            t.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [activeTab, search]);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <SafeAreaView className="flex-1 bg-[#071B11]">
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View className="flex-row items-center justify-between mt-2 mb-6">
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center mr-2">
                            <ShieldCheck size={18} color="#10b981" />
                        </View>
                        <Text className="text-white font-bold text-lg">
                            Safe Route AI
                        </Text>
                    </View>

                    <View className="w-9 h-9 rounded-full bg-white/5 items-center justify-center border border-white/10">
                        <User size={18} color="#e5e7eb" />
                    </View>
                </View>

                {/* TITLE */}
                <Text className="text-3xl font-bold text-white mb-2">
                    Safety Tips
                </Text>
                <Text className="text-gray-400 mb-6 leading-6">
                    AI-generated guidance to help you stay safe while walking or driving.
                </Text>

                {/* SEARCH */}
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-full px-4 py-3 mb-5">
                    <Search size={18} color="#9ca3af" />
                    <TextInput
                        className="flex-1 ml-3 text-white"
                        placeholder="Search for tips..."
                        placeholderTextColor="#6b7280"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* FILTER TABS */}
                <View className="flex-row mb-6">
                    {(['All', 'Walking', 'Driving'] as const).map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 mr-3 rounded-full ${
                                activeTab === tab
                                    ? 'bg-emerald-500'
                                    : 'bg-white/5 border border-white/10'
                            }`}
                        >
                            <Text
                                className={`font-bold ${
                                    activeTab === tab
                                        ? 'text-black'
                                        : 'text-gray-300'
                                }`}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* TIP CARDS */}
                {tips.map(tip => {
                    const Icon = tip.icon;
                    const expanded = expandedId === tip.id;

                    return (
                        <TouchableOpacity
                            key={tip.id}
                            activeOpacity={0.9}
                            onPress={() => toggleExpand(tip.id)}
                            className="bg-[#0E2219] border border-[#1a3a2a] rounded-2xl p-5 mb-4"
                        >
                            <View className="flex-row items-start justify-between">
                                <View className="flex-row flex-1">
                                    <View className="w-12 h-12 rounded-xl bg-emerald-500/20 items-center justify-center mr-4">
                                        <Icon size={22} color="#10b981" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg mb-1">
                                            {tip.title}
                                        </Text>
                                        <Text className="text-gray-400">
                                            {tip.short}
                                        </Text>
                                    </View>
                                </View>

                                {expanded ? (
                                    <ChevronUp size={20} color="#9ca3af" />
                                ) : (
                                    <ChevronDown size={20} color="#9ca3af" />
                                )}
                            </View>

                            {expanded && (
                                <View className="mt-4 pt-4 border-t border-white/10">
                                    <Text className="text-gray-300 leading-6 mb-2">
                                        {tip.details}
                                    </Text>
                                    <Text className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                        AI-Generated Insight
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
