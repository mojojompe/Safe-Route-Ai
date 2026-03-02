import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import {
    MdTrendingUp, MdSecurity, MdRoute,
    MdCalendarToday, MdLocationOn
} from 'react-icons/md'
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend
} from 'recharts'

const API = import.meta.env.VITE_API_URL
const RISK_COLORS = { Low: '#00d35a', Moderate: '#eab308', High: '#ef4444' }
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Range = '7d' | '30d' | 'all'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
            <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
            ))}
        </div>
    )
}

export default function Analytics() {
    const { user } = useAuth()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState<Range>('30d')
    const [activeTab, setActiveTab] = useState<'trend' | 'risk' | 'weekly' | 'places'>('trend')

    useEffect(() => {
        if (!user) return
        axios.get(`${API}/api/stats/${user.uid}`)
            .then(r => setStats(r.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false))
    }, [user])

    // ── Derived chart data ──────────────────────────────────────────────────────
    const trendData = useMemo(() => {
        if (!stats?.chartData) return []
        const cutoff = range === '7d' ? 7 : range === '30d' ? 30 : 9999
        return stats.chartData
            .slice(0, cutoff)
            .reverse()
            .map((r: any, i: number) => ({
                idx: i + 1,
                date: new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                score: r.score,
            }))
    }, [stats, range])

    const riskPieData = useMemo(() => {
        if (!stats?.riskBreakdown) return []
        return Object.entries(stats.riskBreakdown)
            .filter(([, v]) => (v as number) > 0)
            .map(([name, value]) => ({ name, value }))
    }, [stats])

    const weeklyData = useMemo(() => {
        if (!stats?.chartData) return DAYS.map(d => ({ day: d, routes: 0, avgScore: 0 }))
        const buckets = DAYS.map(d => ({ day: d, routes: 0, total: 0 }))
        stats.chartData.forEach((r: any) => {
            const dow = new Date(r.date).getDay()
            buckets[dow].routes++
            buckets[dow].total += r.score || 0
        })
        return buckets.map(b => ({
            day: b.day,
            routes: b.routes,
            avgScore: b.routes > 0 ? Math.round((b.total / b.routes) * 10) / 10 : 0
        }))
    }, [stats])

    const topPlaces = useMemo(() => {
        if (!stats?.chartData) return []
        const counts: Record<string, number> = {}
        stats.chartData.forEach((r: any) => {
            if (r.endLocation) counts[r.endLocation] = (counts[r.endLocation] || 0) + 1
        })
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name: name.split(',')[0], count }))
    }, [stats])

    const tabs = [
        { id: 'trend', label: 'Score Trend', icon: MdTrendingUp },
        { id: 'risk', label: 'Risk Split', icon: MdSecurity },
        { id: 'weekly', label: 'Weekly', icon: MdCalendarToday },
        { id: 'places', label: 'Top Places', icon: MdLocationOn },
    ] as const

    if (loading) return (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
    )

    return (
        <PageTransition className="min-h-screen bg-gray-50 dark:bg-sr-dark p-4 md:p-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-5">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                        Safety Analytics
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your route safety at a glance</p>
                </motion.div>

                {/* Summary strip */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total Routes', value: stats?.totalRoutes ?? 0, color: '#00d35a' },
                        { label: 'Avg Safety Score', value: stats?.avgScore ?? '—', color: '#3b82f6' },
                        { label: 'Safe Routes', value: stats?.riskBreakdown?.Low ?? 0, color: '#8b5cf6' },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <GlassCard className="p-3 text-center">
                                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-0.5 leading-tight">{s.label}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Tabs */}
                <GlassCard className="p-5">
                    {/* Tab bar */}
                    <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1 mb-5">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id
                                        ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <t.icon size={13} />
                                <span className="hidden sm:inline">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ── Score Trend ── */}
                        {activeTab === 'trend' && (
                            <motion.div key="trend" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Safety Score Over Time</p>
                                    <div className="flex gap-1">
                                        {(['7d', '30d', 'all'] as Range[]).map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setRange(r)}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${range === r
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {r === 'all' ? 'All' : r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {trendData.length === 0 ? (
                                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No routes yet</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                                            <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={20} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone" dataKey="score" name="Score"
                                                stroke="#00d35a" strokeWidth={2.5} dot={false}
                                                activeDot={{ r: 5, fill: '#00d35a' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </motion.div>
                        )}

                        {/* ── Risk Pie ── */}
                        {activeTab === 'risk' && (
                            <motion.div key="risk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Risk Level Distribution</p>
                                {riskPieData.length === 0 ? (
                                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No routes yet</div>
                                ) : (
                                    <div className="flex items-center gap-6">
                                        <ResponsiveContainer width="60%" height={180}>
                                            <PieChart>
                                                <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                                                    {riskPieData.map((entry: any) => (
                                                        <Cell key={entry.name} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || '#ccc'} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="space-y-2">
                                            {riskPieData.map((d: any) => (
                                                <div key={d.name} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS[d.name as keyof typeof RISK_COLORS] }} />
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{d.name}</span>
                                                    <span className="text-xs text-gray-400 ml-auto">{d.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ── Weekly Pattern ── */}
                        {activeTab === 'weekly' && (
                            <motion.div key="weekly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Routes by Day of Week</p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={weeklyData} barSize={22}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={20} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: 10 }} />
                                        <Bar dataKey="routes" name="Routes" fill="#00d35a" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="avgScore" name="Avg Score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>
                        )}

                        {/* ── Top Places ── */}
                        {activeTab === 'places' && (
                            <motion.div key="places" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Most Visited Destinations</p>
                                {topPlaces.length === 0 ? (
                                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No routes yet</div>
                                ) : (
                                    <div className="space-y-3">
                                        {topPlaces.map((p: any, i: number) => (
                                            <div key={p.name} className="flex items-center gap-3">
                                                <span className="text-sm font-black text-gray-400 w-5 text-right">{i + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-bold text-gray-800 dark:text-gray-200 truncate">{p.name}</span>
                                                        <span className="text-gray-400 flex-shrink-0 ml-2">{p.count}×</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(p.count / topPlaces[0].count) * 100}%` }}
                                                            transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                                                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                                                        />
                                                    </div>
                                                </div>
                                                <MdRoute className="text-gray-300 flex-shrink-0" size={14} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassCard>

            </div>
        </PageTransition>
    )
}
