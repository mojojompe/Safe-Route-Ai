import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { InfiniteMovingCards } from '../components/ui/infinite-moving-cards'
import { Globe3D } from '../components/ui/3d-globe'
import type { GlobeMarker } from '../components/ui/3d-globe'
import WorldMap from '../components/ui/world-map'

export default function Welcome() {
    const nav = useNavigate()
    const { signInWithGoogle, user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const hero2VideoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleStart = async () => {
        if (user) {
            nav('/map')
            return
        }

        setLoading(true)
        try {
            await signInWithGoogle()
            nav('/map')
        } catch (error) {
            console.error("Login failed", error)
        } finally {
            setLoading(false)
        }
    }

    // Sample data for components
    const testimonials = [
        {
            quote: "Safe Route AI has completely changed how I navigate. I feel so much safer walking home at night.",
            name: "Aisha Abike",
            title: "Student",
        },
        {
            quote: "The real-time hazard alerts are a game-changer. It saved me from walking into a construction zone last week 😂",
            name: "Michael Alozie",
            title: "Urban Explorer",
        },
        {
            quote: "As a parent, knowing my children have this app gives me peace of mind when they're out with friends.",
            name: "Abiodun Oluremi",
            title: "Parent",
        },
        {
            quote: "The implementation of safety scores for different routes is brilliant. Highly recommended!",
            name: "Omotola Gloria",
            title: "Medical Delegate",
        },
        {
            quote: "Finally, a navigation app that prioritizes safety over just speed. A must-have for city living.",
            name: "Francis Eze",
            title: "Tech Enthusiast",
        }
    ];

    const globeMarkers: GlobeMarker[] = [
        { lat: 40.7128, lng: -74.006, label: "New York" },
        { lat: 51.5074, lng: -0.1278, label: "London" },
        { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
        { lat: -33.8688, lng: 151.2093, label: "Sydney" },
        { lat: 48.8566, lng: 2.3522, label: "Paris" },
        { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
        { lat: 55.7558, lng: 37.6173, label: "Moscow" },
        { lat: 19.4326, lng: -99.1332, label: "Mexico City" },
        { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
        { lat: 28.6139, lng: 77.209, label: "New Delhi" },
    ];

    const mapDots = [
        { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 34.0522, lng: -118.2437 } }, // Alaska -> LA
        { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -15.7975, lng: -47.8919 } }, // Alaska -> Brazil
        { start: { lat: -15.7975, lng: -47.8919 }, end: { lat: 38.7223, lng: -9.1393 } }, // Brazil -> Lisbon
        { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 28.6139, lng: 77.209 } }, // London -> Delhi
        { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 35.6762, lng: 139.6503 } }, // Delhi -> Tokyo
        { start: { lat: 28.6139, lng: 77.209 }, end: { lat: -1.2921, lng: 36.8219 } }, // Delhi -> Nairobi
    ];

    const faqs = [
        { q: "How is the safety score calculated?", a: "Our AI aggregates real-time data from various sources including official crime statistics, user reports, lighting conditions, and traffic incidents to generate a comprehensive safety score for each route segment." },
        { q: "Is the app free to use?", a: "Yes, the core navigation and safety features are completely free. We also offer a premium subscription for advanced features like offline maps and personalized safety alerts." },
        { q: "Can I report hazards?", a: "Absolutely! Community reporting is a key part of our ecosystem. You can report accidents, poor lighting, or other hazards directly from the map interface." },
        { q: "Does it work in my city?", a: "Safe Route AI is currently active in major metropolitan areas worldwide and we are continuously expanding our coverage." },
    ]

    // Hero Parallax and Scroll Blur
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const blurAmount = useTransform(scrollY, [0, 300], [0, 10]);
    const blur = useTransform(blurAmount, (value) => `blur(${value}px)`);

    return (
        <div ref={containerRef} className="bg-white dark:bg-black min-h-screen font-sans selection:bg-sr-green/30 text-gray-900 dark:text-gray-100">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Video Background */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ filter: blur }}
                >
                    <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/Hero1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>

                {/* Content */}
                <motion.div
                    style={{ y: y1 }}
                    className="relative z-20 text-center px-4 max-w-5xl mx-auto"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6"
                    >
                        Navigate the World <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sr-green to-teal-400">
                            Safely
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 font-light"
                    >
                        The advanced AI-powered navigation tool that prioritizes your safety.
                        Find the safest path, every time.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        onClick={handleStart}
                        disabled={loading}
                        className="px-8 py-4 bg-sr-green hover:bg-sr-green-dim text-white text-lg font-bold rounded-full shadow-[0_0_20px_rgba(0,211,90,0.4)] transition-all"
                    >
                        {loading ? 'Starting...' : 'Start Your Journey'}
                    </motion.button>
                </motion.div>
            </section>

            {/* --- INFO CARDS SECTION --- */}
            <section className="py-20 bg-gray-50 dark:bg-zinc-900 border-y border-gray-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What our users say</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Join thousands of users who have made their daily commute safer.</p>
                </div>
                <div className="h-[20rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
                    <InfiniteMovingCards
                        items={testimonials}
                        direction="right"
                        speed="slow"
                        className="bg-transparent"
                    />
                </div>
            </section>

            {/* --- ABOUT SECTION --- */}
            <section id="about" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
                        {/* Text Content */}
                        <div className="flex-1 space-y-8 z-10">
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Global Reach, <br />
                                <span className="text-sr-green">Local Safety.</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                Safe Route AI combines global data intelligence with local community reporting to provide the most accurate safety assessments. Whether you're in New York or Lagos, we've got you covered.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-white/5">
                                    <div className="p-3 bg-sr-green/10 rounded-xl text-sr-green">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Real-time Verified</h4>
                                        <p className="text-sm text-gray-500">Data updated every minute</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-white/5">
                                    <div className="p-3 bg-sr-green/10 rounded-xl text-sr-green">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Mobile First</h4>
                                        <p className="text-sm text-gray-500">Optimized for safety on the go</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3D Globe */}
                        <div className="flex-1 w-full relative h-[400px] md:h-[500px]">
                            <div className="absolute inset-0 bg-gradient-radial from-sr-green/20 to-transparent opacity-50 blur-3xl" />
                            <Globe3D
                                markers={globeMarkers}
                                config={{
                                    width: 1000,
                                    height: 1000,
                                    onRender: () => { },
                                    devicePixelRatio: 2,
                                    phi: 0, theta: 0, dark: 0, diffuse: 1.2, mapSamples: 16000, mapBrightness: 6, baseColor: [1, 1, 1], markerColor: [0, 0.8, 0.3], glowColor: [0.8, 1, 0.8], markers: [],
                                }}
                            />
                            {/* Floating Phone Image (Simulated Overlay) - user asked for phone image here too/instead?
                         The prompt said: "Let the about section be a split screen with this 3d map on the right side and below the text on mobile".
                         It also said: "Use these pictures for the about and Mission & vision sections @[frontend/public/Phone.png]@[frontend/public/Safety.png]"
                         I will check if I should effectively combine them. Maybe the phone shows the app, floating near the globe?
                      */}
                            <motion.img
                                src="/New Phone.png"
                                alt="App on Phone"
                                className="absolute bottom-0 -right-4 w-48 md:w-64 drop-shadow-2xl z-10"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MAP ANIMATION SECTION --- */}
            <div className="py-20 dark:bg-black bg-white w-full border-t border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto text-center px-6">
                    <h2 className="font-bold text-3xl md:text-5xl dark:text-white text-black mb-4">
                        Global{" "}
                        <span className="text-gray-400">
                            {"Connectivity".split("").map((word, idx) => (
                                <motion.span
                                    key={idx}
                                    className="inline-block"
                                    initial={{ x: -10, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: idx * 0.04 }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </span>
                    </h2>
                    <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto mb-10">
                        Connecting safe paths across continents. Data shared, safety multiplied.
                    </p>
                </div>
                <WorldMap dots={mapDots} lineColor="#00d35a" />
            </div>

            {/* --- MISSION & VISION SECTION --- */}
            <section id="mission" className="py-24 bg-gray-50 dark:bg-zinc-900 border-y border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-sr-green/20 blur-3xl transform -rotate-6 rounded-full" />
                            <img
                                src="/New Vector.png"
                                alt="Safety Vision"
                                loading="lazy"
                                className="relative z-10 rounded-3xl shadow-2xl transform transition-transform hover:scale-[1.02] duration-500 max-h-[400px] w-auto mx-auto"
                            />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    To create a world where personal safety is not a luxury, but a guarantee. We believe in leveraging advanced technology to empower individuals to move freely and fearlessly.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    A connected global community where every street is mapped not just for distance, but for well-being. By 2030, we aim to reduce pedestrian incidents by 40% in partner cities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DOWNLOAD SECTION --- */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Download Safe Route Ai Mobile App
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                    Get Safe Route AI on your device and start navigating safely today. Available on iOS and Android.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Google Play Store Button */}
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:scale-105 transition-transform shadow-lg group"
                                >
                                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs opacity-80">GET IT ON</div>
                                        <div className="text-lg font-bold">Google Play</div>
                                    </div>
                                </a>

                                {/* Apple App Store Button */}
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:scale-105 transition-transform shadow-lg group"
                                >
                                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs opacity-80">Download on the</div>
                                        <div className="text-lg font-bold">App Store</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="relative md:-ml-16 lg:-ml-24">
                            <div className="absolute inset-0 bg-sr-green/20 blur-3xl transform rotate-6 rounded-full" />
                            <img
                                src="/Download.png"
                                alt="Download App"
                                loading="lazy"
                                className="relative z-10 w-full max-h-[550px] object-contain rounded-full shadow-2xl transform transition-transform hover:scale-[1.02] hover:rotate-3 duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- APP FEATURES SECTION --- */}
            <section className="py-24 bg-gray-50 dark:bg-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="absolute inset-0 bg-sr-green/20 blur-3xl transform -rotate-6 rounded-full" />
                            <img
                                src="/Safety.jpg"
                                alt="App Features"
                                loading="lazy"
                                className="relative z-10 w-full rounded-3xl shadow-2xl transform transition-transform hover:scale-[1.02] duration-500"
                            />
                        </div>
                        <div className="space-y-8 order-1 md:order-2">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Powerful Features for Your Safety
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                    Experience cutting-edge technology designed to keep you safe on every journey.
                                </p>
                            </div>
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        ),
                                        title: "Real-time Safety Alerts",
                                        description: "Get instant notifications about hazards, incidents, and unsafe areas along your route."
                                    },
                                    {
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        ),
                                        title: "Crime Data Integration",
                                        description: "Access comprehensive crime statistics and safety data from official sources."
                                    },
                                    {
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        ),
                                        title: "Community Reports",
                                        description: "Contribute to and benefit from real-time reports shared by fellow users."
                                    },
                                    {
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        ),
                                        title: "Safe Route Planning",
                                        description: "AI-powered algorithms find the safest path, not just the fastest."
                                    },
                                    {
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        ),
                                        title: "Emergency SOS",
                                        description: "One-tap emergency assistance with automatic location sharing to contacts."
                                    },
                                    {
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        ),
                                        title: "Night Mode Navigation",
                                        description: "Enhanced safety features for nighttime travel with well-lit route preferences."
                                    }
                                ].map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-4 items-start"
                                    >
                                        <div className="p-3 bg-sr-green/10 rounded-xl text-sr-green flex-shrink-0">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION (ACCORDION) --- */}
            <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-500">Got questions? We've got answers.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isExpanded = expandedFAQ === idx;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50"
                            >
                                <button
                                    onClick={() => setExpandedFAQ(isExpanded ? null : idx)}
                                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <h3 className="text-xl font-bold pr-4">{faq.q}</h3>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <svg className="w-6 h-6 text-sr-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* --- HERO 2 VIDEO SECTION: JOURNEY TO SAFETY --- */}
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
                    <video
                        ref={hero2VideoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/Hero2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block"
                        >
                            <div className="px-6 py-2 rounded-full bg-sr-green/20 border border-sr-green/30 backdrop-blur-md">
                                <span className="text-sr-green font-semibold text-sm tracking-wide">YOUR JOURNEY TO SAFETY STARTS HERE</span>
                            </div>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-black text-white leading-tight"
                        >
                            Every Route.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sr-green via-teal-400 to-emerald-400">
                                Every Journey.
                            </span>
                            <br />
                            Protected.
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            Join thousands of users who navigate with confidence, powered by AI-driven safety insights and real-time community alerts.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                        >
                            {[
                                { number: "1K+", label: "Active Users" },
                                { number: "5K+", label: "Safe Routes Mapped" },
                                { number: "99.9%", label: "Uptime Reliability" }
                            ].map((stat, index) => (
                                <div key={index} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                    <div className="text-4xl md:text-5xl font-black text-sr-green mb-2">{stat.number}</div>
                                    <div className="text-gray-400 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="mt-12"
                        >
                            <button
                                onClick={handleStart}
                                disabled={loading}
                                className="group relative px-10 py-5 bg-gradient-to-r from-sr-green to-teal-500 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-sr-green/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 overflow-hidden"
                            >
                                <span className="relative z-10">
                                    {loading ? 'Starting...' : 'Start Your Safe Journey'}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-sr-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-sr-green rounded-full" />
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    )
}
