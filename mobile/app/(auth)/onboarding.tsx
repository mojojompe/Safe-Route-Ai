import { useState, useRef } from 'react'
import {
    View, Text, StyleSheet, Dimensions, FlatList,
    TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, Image,
} from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated'
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors'
import { StatusBar } from 'expo-status-bar'
import { Icon } from '@/components/ui/Icon'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

const slides = [
    {
        id: '1',
        image: require('@/assets/Illustrations/Slide 1.png'),
        title: 'Navigate.\nSafely.',
        body: 'AI-powered route safety scoring for every road in Nigeria. Know the risk before you drive.',
        accent: Colors.brand.primary,
    },
    {
        id: '2',
        image: require('@/assets/Illustrations/Slide 2.png'),
        title: 'Know Before\nYou Go.',
        body: 'See real-time safety scores, community hazard reports, and risk breakdowns — street by street.',
        accent: '#3b82f6',
    },
    {
        id: '3',
        image: require('@/assets/Illustrations/Slide 3.png'),
        title: 'Travel\nTogether.',
        body: 'Share your live journey with family. One-tap SOS sends your GPS to all trusted contacts instantly.',
        accent: '#a855f7',
    },
]

export default function Onboarding() {
    const [active, setActive] = useState(0)
    const listRef = useRef<FlatList>(null)
    const insets = useSafeAreaInsets()

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / width)
        setActive(idx)
    }

    const next = () => {
        if (active < slides.length - 1) {
            listRef.current?.scrollToIndex({ index: active + 1, animated: true })
        } else {
            router.replace('/(auth)/login')
        }
    }

    const currentAccent = slides[active].accent

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <FlatList
                ref={listRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onMomentumScrollEnd={onScroll}
                keyExtractor={(s) => s.id}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        {/* Full-screen Background Image */}
                        <Image
                            source={item.image}
                            style={StyleSheet.absoluteFillObject}
                            resizeMode="cover"
                        />

                        {/* Gradient Overlay for Text Readability */}
                        <LinearGradient
                            colors={['transparent', 'rgba(10, 15, 20, 0.6)', Colors.dark.bg, Colors.dark.bg]}
                            locations={[0.2, 0.5, 0.75, 1]}
                            style={StyleSheet.absoluteFillObject}
                        />

                        {/* Content Container (Pushed to bottom) */}
                        <View style={[styles.contentBlock, { paddingBottom: Math.max(insets.bottom, 40) + 140 }]}>
                            <Animated.Text entering={FadeInDown.delay(100).springify()} style={styles.title}>
                                {item.title}
                            </Animated.Text>
                            <Animated.Text entering={FadeInDown.delay(180).springify()} style={styles.body}>
                                {item.body}
                            </Animated.Text>
                        </View>
                    </View>
                )}
            />

            {/* Floating UI Elements (Over Top of Slides) */}

            {/* Skip Button */}
            <TouchableOpacity
                style={[styles.skip, { top: Math.max(insets.top, 50) }]}
                onPress={() => router.replace('/(auth)/login')}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Bottom Controls Panel */}
            <Animated.View entering={FadeIn.delay(300)} style={[styles.bottomControls, { paddingBottom: Math.max(insets.bottom, 20) }]}>

                {/* Dots */}
                <View style={styles.dotsRow}>
                    {slides.map((s, i) => (
                        <View
                            key={s.id}
                            style={[
                                styles.dot,
                                {
                                    width: i === active ? 28 : 8,
                                    backgroundColor: i === active ? currentAccent : 'rgba(255,255,255,0.2)',
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* CTA */}
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: currentAccent }]}
                    onPress={next}
                    activeOpacity={0.85}
                >
                    <Text style={styles.btnText}>
                        {active === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    <Icon name="arrow-right" size={18} color="#000" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
                    <Text style={styles.loginLinkText}>
                        Already have an account?{' '}
                        <Text style={{ color: Colors.brand.primary, fontFamily: Fonts.bold }}>Sign in</Text>
                    </Text>
                </TouchableOpacity>

            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.bg },
    skip: { position: 'absolute', right: 24, zIndex: 10, padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: Radius.full },
    skipText: { fontFamily: Fonts.semibold, color: '#fff', fontSize: 13 },
    slide: {
        width,
        height,
        flex: 1,
    },
    contentBlock: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 36,
    },
    title: {
        fontFamily: Fonts.black,
        fontSize: 42,
        color: '#fff',
        lineHeight: 48,
        marginBottom: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    body: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: '#rgba(255,255,255,0.85)',
        lineHeight: 26,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.lg,
        paddingTop: 20,
        backgroundColor: 'transparent',
    },
    dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 28, paddingHorizontal: 16 },
    dot: { height: 8, borderRadius: 4 },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: Radius.full,
        paddingVertical: 18,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    btnText: { fontFamily: Fonts.black, fontSize: 16, color: '#000' },
    loginLink: { alignItems: 'center', paddingBottom: 10 },
    loginLinkText: { fontFamily: Fonts.regular, color: Colors.dark.textMuted, fontSize: 14 },
})
