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
import * as NavigationBar from 'expo-navigation-bar';

const { width, height } = Dimensions.get('window');

const THEME_COLOR = '#00d35a';
const BG_COLOR = '#072613';

const SLIDES = [
  {
    id: '1',
    title: 'Smart Navigation',
    description:
      'Get optimized routes for both walking and driving, balancing speed with unparalleled safety.',
    icon: <Zap size={56} color={THEME_COLOR} />,
  },
  {
    id: '2',
    title: 'Enhanced Safety',
    description:
      'Our AI analyzes real-time data to guide you through the safest paths, avoiding high-risk areas.',
    icon: <Shield size={56} color={THEME_COLOR} />,
  },
  {
    id: '3',
    title: 'Real-time Insights',
    description:
      'Receive instant alerts about potential hazards on your route, keeping you aware and prepared.',
    icon: <MapPin size={56} color={THEME_COLOR} />,
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
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(BG_COLOR);
    }
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
        <View style={{ width, paddingHorizontal: 28, alignItems: 'center', backgroundColor: BG_COLOR, height: height * 0.7 }}>
          <View style={{ height: height * 0.42, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View
              style={[
                {
                  width: 160,
                  height: 160,
                  borderRadius: 160 / 2,
                  backgroundColor: BG_COLOR, // dark green circle
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: THEME_COLOR,
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
            <Text className="text-center" style={{ color: '#f1f1f1ff', fontSize: 30, marginTop: 50, fontWeight: 'bold' }}>{item.title}</Text>
          </Animated.View>

          <Animated.View style={{ marginTop: 16, opacity: descOpacity }}>
            <Text style={{ color: '#0aa342ff', fontSize: 17, textAlign: 'center', fontWeight: 'semi-bold' }}>
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
    <SafeAreaView edges={['top']} className="flex-1" style={{ backgroundColor: BG_COLOR }}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />
      {/* Header: Logo Left, Skip Right */}
      <View className="flex-row items-center justify-end px-6 py-4">
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.8}
          style={{
            borderLeftWidth: 3,
            borderTopWidth: 10,
            borderColor: 'transparent',
            paddingLeft: 20,
          }}
        >
          <Text className="text-2xl font-semibold" style={{ color: THEME_COLOR }}>Skip</Text>
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
      <View className="px-6 pb-0 pt-2">
        {/* pagination dots (small) */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
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
                  backgroundColor: active ? THEME_COLOR : '#31403c',
                  shadowColor: active ? THEME_COLOR : 'transparent',
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
              backgroundColor: THEME_COLOR,
              borderRadius: 38,
              paddingVertical: 16,
              width: '100%',
              marginBottom: 60,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: THEME_COLOR,
              shadowOffset: { width: 0, height: 18 },
              shadowOpacity: 0.22,
              shadowRadius: 30,
              elevation: 12,
            }}
          >
            <Text style={{ color: '#071B11', fontWeight: '800', fontSize: 18, }}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
