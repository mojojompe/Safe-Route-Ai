import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

// ── Badge definitions ────────────────────────────────────────────────────────
const BADGES = [
    {
        id: 'first_route',
        emoji: '🛣️',
        name: 'First Steps',
        desc: 'Plan your first route',
        color: 'from-green-400 to-emerald-500',
        check: (s: any) => s.totalRoutes >= 1,
        progress: (s: any) => Math.min(s.totalRoutes, 1),
        max: 1,
    },
    {
        id: 'ten_routes',
        emoji: '🏅',
        name: 'Regular Traveller',
        desc: 'Plan 10 routes',
        color: 'from-blue-400 to-sky-500',
        check: (s: any) => s.totalRoutes >= 10,
        progress: (s: any) => Math.min(s.totalRoutes, 10),
        max: 10,
    },
    {
        id: 'fifty_routes',
        emoji: '🏆',
        name: 'Road Warrior',
        desc: 'Plan 50 routes',
        color: 'from-amber-400 to-orange-500',
        check: (s: any) => s.totalRoutes >= 50,
        progress: (s: any) => Math.min(s.totalRoutes, 50),
        max: 50,
    },
    {
        id: 'safe_streak',
        emoji: '🛡️',
        name: 'Safety First',
        desc: 'Average safety score ≥ 8.0',
        color: 'from-green-500 to-teal-500',
        check: (s: any) => s.avgScore >= 8.0,
        progress: (s: any) => Math.min(s.avgScore * 10, 100),
        max: 100,
    },
    {
        id: 'low_risk',
        emoji: '🌿',
        name: 'Safe Pathfinder',
        desc: '80% of routes rated Low Risk',
        color: 'from-lime-400 to-green-400',
        check: (s: any) => {
            const total = s.totalRoutes
            if (!total) return false
            return (s.riskBreakdown?.Low / total) >= 0.8
        },
        progress: (s: any) => {
            const total = s.totalRoutes
            if (!total) return 0
            return Math.round((s.riskBreakdown?.Low / total) * 100)
        },
        max: 100,
    },
    {
        id: 'community',
        emoji: '🤝',
        name: 'Community Guardian',
        desc: 'Submit 5 hazard reports',
        color: 'from-purple-400 to-violet-500',
        check: (s: any) => (s.reportCount || 0) >= 5,
        progress: (s: any) => Math.min(s.reportCount || 0, 5),
        max: 5,
    },
    {
        id: 'explorer',
        emoji: '🗺️',
        name: 'Explorer',
        desc: 'Plan routes to 10 unique destinations',
        color: 'from-cyan-400 to-blue-400',
        check: (s: any) => (s.uniqueDestinations || 0) >= 10,
        progress: (s: any) => Math.min(s.uniqueDestinations || 0, 10),
        max: 10,
    },
    {
        id: 'night_owl',
        emoji: '🌙',
        name: 'Night Owl',
        desc: 'Plan 5 late-night routes (after 10 PM)',
        color: 'from-indigo-500 to-purple-600',
        check: (s: any) => (s.nightRoutes || 0) >= 5,
        progress: (s: any) => Math.min(s.nightRoutes || 0, 5),
        max: 5,
    },
]

// Tier definitions based on total routes
const TIERS = [
    { name: 'Commuter', minRoutes: 0, color: '#94a3b8', emoji: '🚶' },
    { name: 'Traveller', minRoutes: 10, color: '#22c55e', emoji: '🧭' },
    { name: 'Navigator', minRoutes: 25, color: '#3b82f6', emoji: '🗺️' },
    { name: 'Pathfinder', minRoutes: 50, color: '#f59e0b', emoji: '⭐' },
    { name: 'SafeGuard', minRoutes: 100, color: '#a855f7', emoji: '🛡️' },
]

function getTier(routes: number) {
    return [...TIERS].reverse().find(t => routes >= t.minRoutes) || TIERS[0]
}
function getNextTier(routes: number) {
    return TIERS.find(t => routes < t.minRoutes) || null
}

export default function Achievements() {
    const { user } = useAuth()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<typeof BADGES[0] | null>(null)

    useEffect(() => {
        if (!user) return
        axios.get(`${API}/api/stats/${user.uid}`)
            .then(r => setStats(r.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [user])

    const earned = useMemo(() => stats ? BADGES.filter(b => b.check(stats)) : [], [stats])
    const unearned = useMemo(() => stats ? BADGES.filter(b => !b.check(stats)) : BADGES, [stats])
    const tier = stats ? getTier(stats.totalRoutes) : TIERS[0]
    const nextTier = stats ? getNextTier(stats.totalRoutes) : TIERS[1]
    const progressToNext = nextTier && stats
        ? Math.round((stats.totalRoutes / nextTier.minRoutes) * 100)
        : 100

    if (loading) return (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
    )

    return (
        <PageTransition className="min-h-screen bg-gray-50 dark:bg-sr-dark p-4 md:p-8 font-sans">
            <div className="max-w-lg mx-auto space-y-6">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">🏆 Achievements</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {earned.length}/{BADGES.length} badges earned
                    </p>
                </motion.div>

                {/* Tier Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
                    <GlassCard className="p-5 relative overflow-hidden">
                        {/* Tier glow */}
                        <div
                            className="absolute inset-0 opacity-10 rounded-3xl"
                            style={{ background: `radial-gradient(circle at 30% 50%, ${tier.color}, transparent 70%)` }}
                        />
                        <div className="relative flex items-center gap-4">
                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br flex items-center justify-center text-4xl shadow-xl flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${tier.color}33, ${tier.color}88)` }}>
                                {tier.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Tier</p>
                                <p className="text-xl font-black" style={{ color: tier.color }}>{tier.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {stats?.totalRoutes || 0} route{(stats?.totalRoutes || 0) !== 1 ? 's' : ''} planned
                                </p>
                            </div>
                            <div className="flex flex-col items-center flex-shrink-0">
                                <p className="text-2xl font-black text-gray-900 dark:text-white">{stats?.avgScore ?? '—'}</p>
                                <p className="text-[10px] text-gray-400 font-bold">AVG SCORE</p>
                            </div>
                        </div>

                        {nextTier && (
                            <div className="mt-4 relative">
                                <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                                    <span>Progress to {nextTier.emoji} {nextTier.name}</span>
                                    <span>{stats?.totalRoutes}/{nextTier.minRoutes}</span>
                                </div>
                                <div className="h-2.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressToNext}%` }}
                                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})` }}
                                    />
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </motion.div>

                {/* Earned Badges */}
                {earned.length > 0 && (
                    <div>
                        <h2 className="text-sm font-black text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span>✨</span> Earned Badges ({earned.length})
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {earned.map((badge, i) => (
                                <motion.div key={badge.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 + i * 0.06 }}
                                >
                                    <GlassCard
                                        className="p-4 cursor-pointer hover:scale-[1.02] transition-all active:scale-95"
                                        onClick={() => setSelected(badge)}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl mb-3 shadow-lg`}>
                                            {badge.emoji}
                                        </div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{badge.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{badge.desc}</p>
                                        <div className="mt-2 flex items-center gap-1">
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                ✓ EARNED
                                            </span>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Locked Badges */}
                {unearned.length > 0 && (
                    <div>
                        <h2 className="text-sm font-black text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span>🔒</span> Locked ({unearned.length})
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {unearned.map((badge, i) => {
                                const prog = stats ? badge.progress(stats) : 0
                                const pct = Math.round((prog / badge.max) * 100)
                                return (
                                    <motion.div key={badge.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + i * 0.05 }}
                                    >
                                        <GlassCard className="p-4 opacity-75 hover:opacity-100 cursor-pointer transition-all" onClick={() => setSelected(badge)}>
                                            <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/10 flex items-center justify-center text-2xl mb-3 grayscale">
                                                {badge.emoji}
                                            </div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{badge.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{badge.desc}</p>
                                            <div className="mt-3">
                                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                                    <span>Progress</span><span>{prog}/{badge.max}</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.8, delay: 0.3 }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${badge.color}`}
                                                    />
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>

            {/* Badge Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-xs w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl ${!earned.find(b => b.id === selected.id) ? 'grayscale opacity-60' : ''}`}>
                                {selected.emoji}
                            </div>
                            <h2 className="text-xl font-black text-center text-gray-900 dark:text-white">{selected.name}</h2>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">{selected.desc}</p>
                            {earned.find(b => b.id === selected.id) ? (
                                <div className="mt-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-2xl text-center text-green-600 dark:text-green-400 font-black text-sm">
                                    ✓ Badge Earned!
                                </div>
                            ) : stats && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1.5">
                                        <span>Progress</span><span>{selected.progress(stats)}/{selected.max}</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${selected.color}`}
                                            style={{ width: `${Math.round((selected.progress(stats) / selected.max) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            <button onClick={() => setSelected(null)}
                                className="mt-4 w-full py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-2xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </PageTransition>
    )
}
