import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import { MdFilterList, MdRefresh, MdClose, MdThumbUp, MdWarning } from 'react-icons/md'

const API = import.meta.env.VITE_API_URL
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const REPORT_TYPES = [
    { id: 'all', label: 'All', emoji: '🗺️' },
    { id: 'accident', label: 'Accident', emoji: '💥' },
    { id: 'hazard', label: 'Hazard', emoji: '⚠️' },
    { id: 'police', label: 'Police', emoji: '👮' },
    { id: 'closure', label: 'Closure', emoji: '🚧' },
]
const TIME_FILTERS = ['24h', 'Week', 'All']

interface Report {
    _id: string
    type: string
    description: string
    location: { coordinates: [number, number] }
    createdAt: string
    upvotes?: number
    upvotedBy?: string[]
}

function getEmoji(type: string) {
    return REPORT_TYPES.find(r => r.id === type)?.emoji || '📍'
}

function timeAgo(date: string): string {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

export default function HazardMap() {
    const { user } = useAuth()
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState('all')
    const [timeFilter, setTimeFilter] = useState('Week')
    const [selected, setSelected] = useState<Report | null>(null)
    const [upvoting, setUpvoting] = useState<string | null>(null)
    const [viewState, setViewState] = useState({ latitude: 6.5244, longitude: 3.3792, zoom: 11 })
    const [showFilters, setShowFilters] = useState(false)

    const fetchReports = useCallback(async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API}/api/reports`)
            setReports(res.data)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchReports() }, [fetchReports])

    // Client-side filter
    const now = Date.now()
    const filtered = reports.filter(r => {
        if (typeFilter !== 'all' && r.type !== typeFilter) return false
        if (timeFilter === '24h' && now - new Date(r.createdAt).getTime() > 86_400_000) return false
        if (timeFilter === 'Week' && now - new Date(r.createdAt).getTime() > 7 * 86_400_000) return false
        return true
    })

    const hasUpvoted = (r: Report) => user && r.upvotedBy?.includes(user.uid)

    const handleUpvote = async (r: Report) => {
        if (!user || upvoting) return
        setUpvoting(r._id)
        try {
            const res = await axios.post(`${API}/api/reports/${r._id}/upvote`, { userId: user.uid })
            setReports(prev => prev.map(x => x._id === r._id ? { ...x, ...res.data } : x))
            if (selected?._id === r._id) setSelected(res.data)
        } catch { /* silently fail */ }
        finally { setUpvoting(null) }
    }

    return (
        <PageTransition className="relative h-screen w-full bg-sr-dark overflow-hidden font-sans">

            {/* ── Fullscreen Map ── */}
            <div className="absolute inset-0">
                <Map
                    {...viewState}
                    onMove={e => setViewState(e.viewState)}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    attributionControl={false}
                    onClick={() => setSelected(null)}
                >
                    {filtered.map(r => (
                        <Marker
                            key={r._id}
                            longitude={r.location.coordinates[0]}
                            latitude={r.location.coordinates[1]}
                            anchor="center"
                            onClick={(e: { originalEvent: { stopPropagation: () => void } }) => { e.originalEvent.stopPropagation(); setSelected(r) }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-2xl cursor-pointer drop-shadow-lg select-none"
                            >
                                {getEmoji(r.type)}
                            </motion.div>
                        </Marker>
                    ))}

                    {selected && (
                        <Popup
                            longitude={selected.location.coordinates[0]}
                            latitude={selected.location.coordinates[1]}
                            anchor="bottom"
                            offset={20}
                            closeButton={false}
                            onClose={() => setSelected(null)}
                            className="!bg-transparent !p-0 !border-0 !shadow-none"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-4 min-w-[220px] max-w-[280px]"
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{getEmoji(selected.type)}</span>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white capitalize">{selected.type}</p>
                                            <p className="text-[10px] text-gray-400">{timeAgo(selected.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0">
                                        <MdClose size={16} />
                                    </button>
                                </div>

                                {selected.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{selected.description}</p>
                                )}

                                <button
                                    onClick={() => handleUpvote(selected)}
                                    disabled={!!upvoting || !user}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all w-full justify-center ${hasUpvoted(selected)
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                                        }`}
                                >
                                    <MdThumbUp size={14} />
                                    {hasUpvoted(selected) ? 'Confirmed' : 'Confirm'} · {selected.upvotes ?? 0}
                                </button>
                            </motion.div>
                        </Popup>
                    )}
                </Map>
            </div>

            {/* ── Top Bar ── */}
            <div className="absolute top-4 inset-x-4 z-10 flex gap-2">
                <div className="flex-1">
                    <GlassCard className="px-4 py-3 flex items-center gap-3">
                        <MdWarning className="text-amber-400 flex-shrink-0" size={20} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 dark:text-white">Community Hazard Map</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {filtered.length} report{filtered.length !== 1 ? 's' : ''} · {timeFilter}
                            </p>
                        </div>
                        <button onClick={fetchReports} className="text-green-500 hover:text-green-600 flex-shrink-0">
                            <MdRefresh size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => setShowFilters(!showFilters)} className="text-gray-500 dark:text-gray-400 hover:text-green-500 flex-shrink-0">
                            <MdFilterList size={20} />
                        </button>
                    </GlassCard>
                </div>
            </div>

            {/* ── Filter Panel ── */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="absolute top-0 right-0 bottom-0 w-64 z-20 p-4 space-y-4"
                    >
                        <GlassCard className="p-4 mt-16 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-black text-gray-900 dark:text-white">Filters</h2>
                                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                                    <MdClose size={18} />
                                </button>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Report Type</p>
                                <div className="space-y-1.5">
                                    {REPORT_TYPES.map(t => (
                                        <button key={t.id} onClick={() => setTypeFilter(t.id)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${typeFilter === t.id ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                                }`}>
                                            <span>{t.emoji}</span> {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Time Range</p>
                                <div className="flex gap-1.5">
                                    {TIME_FILTERS.map(t => (
                                        <button key={t} onClick={() => setTimeFilter(t)}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${timeFilter === t ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'
                                                }`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Legend ── */}
            <div className="absolute bottom-6 left-4 z-10">
                <GlassCard className="px-4 py-3">
                    <div className="flex gap-3">
                        {REPORT_TYPES.slice(1).map(t => (
                            <div key={t.id} className="flex items-center gap-1">
                                <span className="text-base">{t.emoji}</span>
                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-5xl mb-3">🗺️</p>
                        <p className="text-white font-bold text-lg">No reports in this area</p>
                        <p className="text-gray-400 text-sm mt-1">Try changing filters or zoom out</p>
                    </div>
                </div>
            )}

        </PageTransition>
    )
}
