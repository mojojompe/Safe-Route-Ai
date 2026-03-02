import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import axios from 'axios'
import { MdAdd, MdDelete, MdRoute, MdStar, MdEdit, MdCheck, MdClose } from 'react-icons/md'

const API = import.meta.env.VITE_API_URL

const EMOJI_OPTIONS = ['🏠', '🏢', '🏫', '🏥', '🛒', '⛪', '🕌', '🍽️', '⛽', '🏨', '🏦', '🌳', '📍', '⭐', '🏋️', '🎓']

interface Favorite {
    _id: string
    name: string
    emoji: string
    address: string
    coordinates: [number, number]
}

export default function Favorites() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [favs, setFavs] = useState<Favorite[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', emoji: '📍', address: '' })
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searching, setSearching] = useState(false)

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

    useEffect(() => {
        if (!user) return
        axios.get(`${API}/api/favorites`, { params: { userId: user.uid } })
            .then(r => setFavs(r.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [user])

    // Search for address
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 3) { setSearchResults([]); return }
        const t = setTimeout(async () => {
            setSearching(true)
            try {
                const r = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    new URLSearchParams({ q: searchQuery, format: 'json', limit: '5', countrycodes: 'ng', 'accept-language': 'en' })
                )
                const data = await r.json()
                setSearchResults(data)
            } catch { setSearchResults([]) }
            finally { setSearching(false) }
        }, 400)
        return () => clearTimeout(t)
    }, [searchQuery])

    const selectAddress = (item: any) => {
        setForm(f => ({ ...f, address: item.display_name }))
            // Store coords for later saving
            ; (form as any)._coords = [parseFloat(item.lon), parseFloat(item.lat)]
        setSearchQuery(item.display_name)
        setSearchResults([])
    }

    const saveFavorite = async () => {
        if (!user || !form.name.trim() || !form.address.trim()) return
        setSaving(true)
        try {
            // Geocode if no coords yet
            let coords: [number, number] = (form as any)._coords || [3.3792, 6.5244]
            const res = await axios.post(`${API}/api/favorites`, {
                userId: user.uid,
                name: form.name,
                emoji: form.emoji,
                address: form.address,
                coordinates: coords
            })
            setFavs(prev => [res.data, ...prev])
            setForm({ name: '', emoji: '📍', address: '' })
            setSearchQuery('')
            setShowAdd(false)
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const deleteFav = async (id: string) => {
        setDeleting(id)
        try {
            await axios.delete(`${API}/api/favorites/${id}`)
            setFavs(prev => prev.filter(f => f._id !== id))
        } catch (e) { console.error(e) }
        finally { setDeleting(null) }
    }

    const routeTo = (fav: Favorite) => {
        // Store destination in sessionStorage and jump to map
        sessionStorage.setItem('sr_dest', JSON.stringify({
            place_name: fav.address,
            text: fav.name,
            center: fav.coordinates
        }))
        navigate('/map')
    }

    return (
        <PageTransition className="min-h-screen bg-gray-50 dark:bg-sr-dark p-4 md:p-8 font-sans">
            <div className="max-w-lg mx-auto space-y-5">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <MdStar className="text-amber-400" /> Favorites
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quick access to your frequent places</p>
                    </div>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAdd(!showAdd)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-green-500/30 transition-all">
                        <MdAdd size={18} /> Add Place
                    </motion.button>
                </motion.div>

                {/* Add Form */}
                <AnimatePresence>
                    {showAdd && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <GlassCard className="p-5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-sm font-black text-gray-900 dark:text-white">New Favorite Place</h2>
                                    <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        <MdClose size={18} />
                                    </button>
                                </div>

                                {/* Name + Emoji */}
                                <div className="flex gap-2">
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="Name (e.g. Home, Work...)"
                                        className="flex-1 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                </div>

                                {/* Emoji Picker */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Icon</p>
                                    <div className="flex flex-wrap gap-2">
                                        {EMOJI_OPTIONS.map(e => (
                                            <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                                                className={`text-xl w-9 h-9 rounded-xl transition-all ${form.emoji === e ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500 scale-110' : 'bg-gray-100 dark:bg-white/10 hover:scale-105'}`}>
                                                {e}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Address Search */}
                                <div className="relative">
                                    <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setForm(f => ({ ...f, address: e.target.value })) }}
                                        placeholder="Search address or place..."
                                        className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    {searching && <div className="absolute right-3 top-3 w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />}
                                    <AnimatePresence>
                                        {searchResults.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                className="absolute top-full mt-1 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50">
                                                {searchResults.map((item: any) => (
                                                    <button key={item.place_id} onClick={() => selectAddress(item)}
                                                        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/5 last:border-0 text-xs text-gray-700 dark:text-gray-300">
                                                        {item.display_name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button onClick={saveFavorite} disabled={saving || !form.name || !form.address}
                                    className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2">
                                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdCheck size={18} />}
                                    Save Favorite
                                </button>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Favorites List */}
                {loading ? (
                    <div className="space-y-3">
                        {[0, 1, 2].map(i => <div key={i} className="h-20 rounded-3xl bg-gray-200 dark:bg-white/5 animate-pulse" />)}
                    </div>
                ) : favs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-4">⭐</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">No favorites yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Save your frequent places for quick one-tap routing</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {favs.map((fav, i) => (
                            <motion.div key={fav._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <GlassCard className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 flex items-center justify-center text-2xl flex-shrink-0">
                                        {fav.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-gray-900 dark:text-white">{fav.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{fav.address}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => routeTo(fav)}
                                            className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 transition-colors">
                                            <MdRoute size={18} />
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteFav(fav._id)} disabled={deleting === fav._id}
                                            className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                                            {deleting === fav._id
                                                ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                                : <MdDelete size={18} />}
                                        </motion.button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
