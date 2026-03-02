import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import axios from 'axios'
import {
    MdArrowBack, MdShare, MdDelete, MdRoute,
    MdSecurity, MdTimer, MdStraighten, MdCalendarToday,
    MdAdd, MdClose
} from 'react-icons/md'

const API = import.meta.env.VITE_API_URL
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const RISK_COLORS: Record<string, string> = { Low: '#00d35a', Moderate: '#eab308', High: '#ef4444' }
const RISK_BG: Record<string, string> = { Low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', Moderate: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', High: 'bg-red-100 dark:bg-red-900/20 text-red-600' }

const SUGGESTED_TAGS = ['#commute', '#morning', '#evening', '#work', '#errand', '#safe', '#traffic', '#weekend']

export default function JourneyDetail() {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [route, setRoute] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState('')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [mapImgUrl, setMapImgUrl] = useState('')

    useEffect(() => {
        if (!id) return
        axios.get(`${API}/api/journeys/${id}`)
            .then(r => {
                setRoute(r.data)
                setNotes(r.data.notes || '')
                setTags(r.data.tags || [])
            })
            .catch(() => navigate('/history'))
            .finally(() => setLoading(false))
    }, [id])

    // Build static map URL from start+end once we have locations
    useEffect(() => {
        if (!route || !MAPBOX_TOKEN) return
        const geocode = async (q: string) => {
            const r = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=ng`
            )
            const d = await r.json()
            const f = d.features?.[0]
            return f ? `${f.center[0]},${f.center[1]}` : null
        }
        Promise.all([geocode(route.startLocation), geocode(route.endLocation)]).then(([s, e]) => {
            if (!s || !e) return
            setMapImgUrl(
                `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
                `pin-s-a+00d35a(${s}),pin-s-b+ef4444(${e})/auto/600x300?access_token=${MAPBOX_TOKEN}&padding=40`
            )
        })
    }, [route])

    const saveAnnotations = async () => {
        if (!id) return
        setSaving(true)
        try {
            await axios.patch(`${API}/api/journeys/${id}`, { notes, tags })
            setSaved(true); setTimeout(() => setSaved(false), 2500)
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const addTag = (tag: string) => {
        const t = tag.startsWith('#') ? tag : `#${tag}`
        if (!tags.includes(t) && t.length > 1) setTags(prev => [...prev, t])
        setNewTag('')
    }

    const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t))

    const handleDelete = async () => {
        if (!id || !user) return
        setDeleting(true)
        try {
            await axios.delete(`${API}/api/history/${id}`)
            navigate('/history')
        } catch (e) { setDeleting(false) }
    }

    const handleShare = async () => {
        if (!route) return
        const text = [
            `🛡️ Safe Route AI — Journey`,
            `📍 From: ${route.startLocation}`,
            `📍 To: ${route.endLocation}`,
            `📊 Safety Score: ${route.safetyScore}/10`,
            `⚠️ Risk: ${route.riskLevel}`,
            `🛣️ Distance: ${route.distance} · ⏱️ ${route.duration}`,
        ].join('\n')

        if (mapImgUrl && navigator.share) {
            try {
                const blob = await (await fetch(mapImgUrl)).blob()
                const file = new File([blob], 'journey.jpg', { type: 'image/jpeg' })
                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({ title: 'Safe Route AI Journey', text, files: [file] })
                    return
                }
            } catch { /* fallback */ }
        }
        if (navigator.share) {
            await navigator.share({ title: 'Safe Route AI Journey', text }).catch(() => { })
        } else {
            navigator.clipboard.writeText(text)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
    )

    if (!route) return null

    const dateStr = new Date(route.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    return (
        <PageTransition className="min-h-screen bg-gray-50 dark:bg-sr-dark font-sans">
            {/* Map image hero */}
            <div className="relative h-52 md:h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {mapImgUrl ? (
                    <img src={mapImgUrl} alt="Route map" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                    </div>
                )}
                {/* Top bar */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <button onClick={() => navigate('/history')}
                        className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                        <MdArrowBack size={20} />
                    </button>
                    <div className="flex gap-2">
                        <button onClick={handleShare}
                            className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                            <MdShare size={18} />
                        </button>
                        <button onClick={handleDelete} disabled={deleting}
                            className="w-10 h-10 rounded-2xl bg-red-500/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                            {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdDelete size={18} />}
                        </button>
                    </div>
                </div>
                {/* Gradient */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-gray-50 dark:from-sr-dark to-transparent" />
            </div>

            <div className="px-4 md:px-8 pb-8 max-w-lg mx-auto space-y-4 -mt-4">

                {/* Title card */}
                <GlassCard className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                                {route.startLocation.split(',')[0]} → {route.endLocation.split(',')[0]}
                            </p>
                            <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight truncate">
                                {route.endLocation.split(',')[0]}
                            </h1>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <MdCalendarToday size={11} /> {dateStr}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-xs font-black flex-shrink-0 ${RISK_BG[route.riskLevel]}`}>
                            {route.riskLevel}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                            { icon: MdSecurity, label: 'Safety', value: `${route.safetyScore}/10`, color: RISK_COLORS[route.riskLevel] },
                            { icon: MdStraighten, label: 'Distance', value: route.distance, color: '#3b82f6' },
                            { icon: MdTimer, label: 'Duration', value: route.duration, color: '#8b5cf6' },
                        ].map(s => (
                            <div key={s.label} className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
                                <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Notes */}
                <GlassCard className="p-5 space-y-3">
                    <h2 className="text-sm font-black text-gray-900 dark:text-white">📝 Notes</h2>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                        placeholder="Add notes about this journey..."
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />

                    {/* Tags */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">🏷️ Tags</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map(t => (
                                <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                                    {t}
                                    <button onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors"><MdClose size={12} /></button>
                                </span>
                            ))}
                        </div>
                        {/* Suggested */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map(t => (
                                <button key={t} onClick={() => addTag(t)}
                                    className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors">
                                    {t}
                                </button>
                            ))}
                        </div>
                        {/* Custom tag */}
                        <div className="flex gap-2">
                            <input value={newTag} onChange={e => setNewTag(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTag(newTag)}
                                placeholder="#custom tag"
                                className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-xs text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
                            <button onClick={() => addTag(newTag)} disabled={!newTag.trim()}
                                className="w-9 h-9 rounded-xl bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-40">
                                <MdAdd size={16} />
                            </button>
                        </div>
                    </div>

                    <button onClick={saveAnnotations} disabled={saving}
                        className={`w-full py-3 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 ${saved ? 'bg-green-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'}`}>
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? '✓ Saved!' : 'Save Notes & Tags'}
                    </button>
                </GlassCard>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate('/map')}
                        className="flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-2xl transition-colors">
                        <MdRoute size={18} /> Replay Route
                    </button>
                    <button onClick={handleShare}
                        className="flex items-center justify-center gap-2 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl transition-colors">
                        <MdShare size={18} /> Share Journey
                    </button>
                </div>

            </div>
        </PageTransition>
    )
}
