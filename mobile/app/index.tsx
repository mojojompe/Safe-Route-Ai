import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Shield, Zap } from 'lucide-react-native';
import GlassView from '../components/ui/GlassView';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Smart Navigation',
    description:
      'Get optimized routes for both walking and driving, balancing speed with unparalleled safety.',
    icon: <Zap size={56} color="#00d35a" />,
  },
  {
    id: '2',
    title: 'Enhanced Safety',
    description:
      'Our AI analyzes real-time data to guide you through the safest paths, avoiding high-risk areas.',
    icon: <Shield size={56} color="#00d35a" />,
  },
  {
    id: '3',
    title: 'Real-time Insights',
    description:
      'Receive instant alerts about potential hazards on your route, keeping you aware and prepared.',
    icon: <MapPin size={56} color="#00d35a" />,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animated values for transitions (per slide)
  const iconScale = useRef(new Animated.Value(0.85)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const descOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const animateIn = () => {
    iconScale.setValue(0.9);
    iconOpacity.setValue(0);
    titleOpacity.setValue(0);
    descOpacity.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(descOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      // final action
      router.push('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const idx = viewableItems[0].index ?? 0;
      setCurrentIndex(idx);
    }
  }).current;

  const renderSlide = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isActive = index === currentIndex;
      return (
        <View style={{ width, paddingHorizontal: 28, alignItems: 'center' }}>
          <View style={{ height: height * 0.42, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View
              style={[
                {
                  width: 160,
                  height: 160,
                  borderRadius: 160 / 2,
                  backgroundColor: '#072613', // dark green circle
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#00d35a',
                },
                {
                  transform: [{ scale: iconScale }],
                  opacity: iconOpacity,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.18,
                  shadowRadius: 30,
                  elevation: 12,
                },
              ]}
            >
              {/* slightly inner circle for glow */}
              <View
                style={{
                  width: 108,
                  height: 108,
                  borderRadius: 108 / 2,
                  backgroundColor: '#0d3b27',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </View>
            </Animated.View>
          </View>

          <Animated.View style={{ opacity: titleOpacity }}>
            <Text className="text-white text-4xl font-extrabold text-center">{item.title}</Text>
          </Animated.View>

          <Animated.View style={{ marginTop: 16, opacity: descOpacity }}>
            <Text className="text-gray-300 text-base text-center leading-7 px-2">
              {item.description}
            </Text>
          </Animated.View>
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex]
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#071B11]">
      <StatusBar barStyle="light-content" backgroundColor="#071B11" />
      {/* Header: only Skip on right (Option 2) */}
      <View className="flex-row items-center justify-end px-6 py-4">
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.8}>
          <GlassView intensity={14} className="px-4 py-2 rounded-full">
            <Text className="text-gray-300 text-sm font-medium">Skip</Text>
          </GlassView>
        </TouchableOpacity>
      </View>

      {/* Slide area */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(i) => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderSlide}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Pagination + Button area */}
      <View className="px-6 pb-10 pt-4">
        {/* pagination dots (small) */}
        <View className="flex-row justify-center mb-6">
          {SLIDES.map((_, idx) => {
            const active = idx === currentIndex;
            return (
              <View
                key={idx}
                style={{
                  width: active ? 36 : 8,
                  height: 8,
                  borderRadius: 20,
                  marginHorizontal: 6,
                  backgroundColor: active ? '#00d35a' : '#31403c',
                  shadowColor: active ? '#00d35a' : 'transparent',
                  shadowOpacity: active ? 0.25 : 0,
                  shadowRadius: active ? 12 : 0,
                  elevation: active ? 6 : 0,
                }}
              />
            );
          })}
        </View>

        {/* big rounded button */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleNext}>
          <View
            style={{
              backgroundColor: '#00d35a',
              borderRadius: 38,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#00d35a',
              shadowOffset: { width: 0, height: 18 },
              shadowOpacity: 0.22,
              shadowRadius: 30,
              elevation: 12,
            }}
          >
            <Text style={{ color: '#071B11', fontWeight: '800', fontSize: 18 }}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
