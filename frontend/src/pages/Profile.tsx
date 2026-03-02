import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import {
    MdLogout, MdRoute, MdSecurity, MdTrendingUp,
    MdEdit, MdCheck, MdWarning, MdShield
} from 'react-icons/md'
import LogoutModal from '../components/layout/LogoutModal'

const API = import.meta.env.VITE_API_URL

function StatCard({ label, value, sub, color }: {
    label: string; value: string | number; sub?: string; color: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0"
        >
            <GlassCard className="p-4 text-center">
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
            </GlassCard>
        </motion.div>
    )
}

export default function Profile() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [logoutModal, setLogoutModal] = useState(false)
    const [editingName, setEditingName] = useState(false)
    const [displayName, setDisplayName] = useState(user?.displayName || '')

    useEffect(() => {
        if (!user) return
        setDisplayName(user.displayName || '')
        axios.get(`${API}/api/stats/${user.uid}`)
            .then(r => setStats(r.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false))
    }, [user])

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const initials = (user?.displayName || user?.email || 'U')
        .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

    const riskColors: Record<string, string> = {
        Low: '#00d35a', Moderate: '#eab308', High: '#ef4444'
    }

    const totalRisk = stats
        ? (stats.riskBreakdown.Low + stats.riskBreakdown.Moderate + stats.riskBreakdown.High) || 1
        : 1

    return (
        <PageTransition className="min-h-screen bg-gray-50 dark:bg-sr-dark p-4 md:p-8 font-sans">
            <div className="max-w-lg mx-auto space-y-5">

                {/* ── Hero Card ── */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-20 h-20 rounded-3xl overflow-hidden ring-4 ring-green-500/30 shadow-xl">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-black">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                            </div>

                            {/* Name + Email */}
                            <div className="flex-1 min-w-0">
                                {editingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={displayName}
                                            onChange={e => setDisplayName(e.target.value)}
                                            className="flex-1 bg-gray-100 dark:bg-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => setEditingName(false)}
                                            className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                        >
                                            <MdCheck size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-black text-gray-900 dark:text-white truncate">
                                            {user?.displayName || 'User'}
                                        </h1>
                                        <button onClick={() => setEditingName(true)} className="text-gray-400 hover:text-green-500 transition-colors flex-shrink-0">
                                            <MdEdit size={16} />
                                        </button>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                                <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                    <MdShield size={10} /> Safe Traveler
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* ── Stats Row ── */}
                {loading ? (
                    <div className="flex gap-3">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="flex-1 h-20 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <StatCard label="Total Routes" value={stats?.totalRoutes ?? 0} color="#00d35a" />
                        <StatCard label="Avg. Safety" value={stats?.avgScore ?? '—'} sub="out of 10" color="#3b82f6" />
                        <StatCard
                            label="Risk Level"
                            value={stats?.totalRoutes > 0
                                ? (stats.riskBreakdown.Low >= stats.riskBreakdown.High ? 'Low' : 'High')
                                : '—'
                            }
                            color={stats?.riskBreakdown?.High > stats?.riskBreakdown?.Low ? '#ef4444' : '#00d35a'}
                        />
                    </div>
                )}

                {/* ── Risk Breakdown Bar ── */}
                {stats && stats.totalRoutes > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        <GlassCard className="p-5">
                            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MdSecurity className="text-green-500" /> Risk Breakdown
                            </h2>
                            <div className="space-y-3">
                                {(['Low', 'Moderate', 'High'] as const).map(level => {
                                    const count = stats.riskBreakdown[level] || 0
                                    const pct = Math.round((count / totalRisk) * 100)
                                    return (
                                        <div key={level}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold" style={{ color: riskColors[level] }}>{level}</span>
                                                <span className="text-gray-400">{count} routes · {pct}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: riskColors[level] }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {/* ── Quick Actions ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                    <GlassCard className="p-5 space-y-2">
                        <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <MdTrendingUp className="text-green-500" /> Quick Links
                        </h2>
                        {[
                            { label: 'View Analytics', path: '/analytics', icon: MdTrendingUp, color: '#3b82f6' },
                            { label: 'Route History', path: '/history', icon: MdRoute, color: '#8b5cf6' },
                            { label: 'Settings & Alerts', path: '/settings', icon: MdSecurity, color: '#f59e0b' },
                            { label: 'Emergency SOS', path: '/emergency', icon: MdWarning, color: '#ef4444' },
                        ].map(item => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                            >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                                    <item.icon style={{ color: item.color }} size={18} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                                <span className="ml-auto text-gray-300 dark:text-gray-600 text-lg">›</span>
                            </button>
                        ))}
                    </GlassCard>
                </motion.div>

                {/* ── Danger Zone ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <GlassCard className="p-5">
                        <button
                            onClick={() => setLogoutModal(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                        >
                            <MdLogout size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold">Sign Out</span>
                        </button>
                    </GlassCard>
                </motion.div>

            </div>

            <LogoutModal
                isOpen={logoutModal}
                onClose={() => setLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </PageTransition>
    )
}
