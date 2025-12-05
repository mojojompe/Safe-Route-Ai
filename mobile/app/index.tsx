import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Shield, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Smart Routing',
        description: 'Choose between the fastest route or the safest path based on real-time data.',
        icon: <Zap size={80} color="#10b981" />, // Green
    },
    {
        id: '2',
        title: 'Real-time Insights',
        description: 'Avoid high-risk zones with our live safety maps and community alerts.',
        icon: <MapPin size={80} color="#10b981" />,
    },
    {
        id: '3',
        title: 'Stay Safe',
        description: 'Emergency tools and safety scores at your fingertips.',
        icon: <Shield size={80} color="#10b981" />,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push('/(auth)/login');
        }
    };

    const handleSkip = () => {
        router.push('/(auth)/login');
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    return (
        <SafeAreaView className="flex-1 bg-neutral-950">
            <View className="flex-row justify-between p-4">
                <TouchableOpacity onPress={handleSkip}>
                    <Text className="text-gray-400 text-lg">Skip</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ width, height: height * 0.6 }} className="items-center justify-center p-8">
                        <View className="bg-neutral-900 p-10 rounded-full mb-8 shadow-lg shadow-emerald-500/20">
                            {item.icon}
                        </View>
                        <Text className="text-white text-3xl font-bold text-center mb-4">{item.title}</Text>
                        <Text className="text-gray-400 text-center text-lg leading-6">{item.description}</Text>
                    </View>
                )}
            />

            <View className="h-1/4 items-center justify-between pb-10">
                {/* Pagination Dots */}
                <View className="flex-row space-x-2 mb-4">
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2.5 rounded-full transition-all ${currentIndex === index ? 'w-8 bg-emerald-500' : 'w-2.5 bg-gray-600'
                                }`}
                        />
                    ))}
                </View>

                {/* Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-emerald-600 px-10 py-4 rounded-xl shadow-lg shadow-emerald-500/30 w-3/4 items-center"
                >
                    <Text className="text-white font-bold text-xl">
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
