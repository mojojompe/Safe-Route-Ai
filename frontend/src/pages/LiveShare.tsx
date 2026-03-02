import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import MapGL, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { io, Socket } from 'socket.io-client'
import {
    MdShare, MdPersonPin, MdClose, MdContentCopy, MdCheck,
    MdRadar, MdSignalWifiOff, MdGroup
} from 'react-icons/md'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

interface Participant {
    socketId: string
    userId: string
    name: string
    lat: number
    lng: number
    timestamp: number
}

// Generate a random 6-char uppercase session code
function makeCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Color palette for different participants
const COLORS = ['#00d35a', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']

export default function LiveShare() {
    const { user } = useAuth()
    const [mode, setMode] = useState<'idle' | 'hosting' | 'joining' | 'active'>('idle')
    const [sessionCode, setSessionCode] = useState('')
    const [joinInput, setJoinInput] = useState('')
    const [participants, setParticipants] = useState<Map<string, Participant>>(new Map())
    const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [copied, setCopied] = useState(false)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState('')
    const [viewState, setViewState] = useState({ latitude: 6.5244, longitude: 3.3792, zoom: 13 })

    const socketRef = useRef<Socket | null>(null)
    const watchIdRef = useRef<number | null>(null)
    const activeCode = useRef('')

    // Color assignment per socketId
    const colorMap = useRef<Map<string, string>>(new Map())
    let colorIdx = 0
    const getColor = (sid: string) => {
        if (!colorMap.current.has(sid)) {
            colorMap.current.set(sid, COLORS[colorIdx % COLORS.length])
            colorIdx++
        }
        return colorMap.current.get(sid)!
    }

    const stopSharing = useCallback(() => {
        if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
        if (socketRef.current) {
            socketRef.current.emit('leave-session', { sessionCode: activeCode.current })
            socketRef.current.disconnect()
        }
        setParticipants(new Map())
        setMyLocation(null)
        setConnected(false)
        setMode('idle')
        setSessionCode('')
        activeCode.current = ''
        colorMap.current.clear()
    }, [])

    const startSession = useCallback((code: string) => {
        activeCode.current = code
        const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })
        socketRef.current = socket

        socket.on('connect', () => {
            setConnected(true)
            setError('')
            socket.emit('join-session', {
                sessionCode: code,
                userId: user?.uid,
                name: user?.displayName || 'Anonymous',
            })
        })

        socket.on('disconnect', () => setConnected(false))
        socket.on('connect_error', () => setError('Could not connect to server. Check your connection.'))

        // Receive initial state of session on join
        socket.on('session-state', (pts: Participant[]) => {
            setParticipants(prev => {
                const next = new Map(prev)
                pts.forEach(p => next.set(p.socketId, p))
                return next
            })
        })

        // Someone else joined
        socket.on('user-joined', (p: Participant) => {
            setParticipants(prev => new Map(prev).set(p.socketId, { ...p, lat: 0, lng: 0, timestamp: Date.now() }))
        })

        // Location update from another participant
        socket.on('location-update', (p: Participant) => {
            setParticipants(prev => new Map(prev).set(p.socketId, p))
        })

        // Someone left
        socket.on('user-left', ({ socketId }: { socketId: string }) => {
            setParticipants(prev => {
                const next = new Map(prev)
                next.delete(socketId)
                return next
            })
        })

        // Start broadcasting my location
        if (navigator.geolocation) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                pos => {
                    const { latitude: lat, longitude: lng } = pos.coords
                    setMyLocation({ lat, lng })
                    setViewState(v => ({ ...v, latitude: lat, longitude: lng, zoom: Math.max(v.zoom, 14) }))
                    socket.emit('location-update', { sessionCode: code, lat, lng })
                },
                _err => setError('Location access denied. Please enable GPS.'),
                { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
            )
        } else {
            setError('Geolocation not supported on this device.')
        }

        setMode('active')
        setSessionCode(code)
    }, [user])

    const hostSession = () => {
        const code = makeCode()
        startSession(code)
    }

    const joinSession = () => {
        if (!joinInput.trim() || joinInput.trim().length < 4) {
            setError('Enter a valid session code')
            return
        }
        startSession(joinInput.trim().toUpperCase())
    }

    const copyCode = () => {
        navigator.clipboard.writeText(sessionCode).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const shareCode = () => {
        const text = `🛡️ Join my Safe Route AI live session!\nCode: ${sessionCode}\nOpen the app → Live Share → Enter code`
        if (navigator.share) {
            navigator.share({ title: 'Safe Route AI Live Share', text }).catch(() => { })
        } else {
            navigator.clipboard.writeText(text)
        }
    }

    useEffect(() => () => stopSharing(), [stopSharing])

    const participantArr = Array.from(participants.values()).filter(p => p.lat !== 0 || p.lng !== 0)

    return (
        <PageTransition className="relative h-screen w-full bg-gray-50 dark:bg-sr-dark font-sans overflow-hidden flex flex-col">

            {/* ── Map (always rendered as background in active state) ── */}
            {mode === 'active' && (
                <div className="absolute inset-0 z-0">
                    <MapGL
                        {...viewState}
                        onMove={(e: { viewState: typeof viewState }) => setViewState(e.viewState)}
                        style={{ width: '100%', height: '100%' }}
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        mapboxAccessToken={MAPBOX_TOKEN}
                        attributionControl={false}
                    >
                        {/* My location */}
                        {myLocation && (
                            <Marker longitude={myLocation.lng} latitude={myLocation.lat} anchor="center">
                                <div className="relative">
                                    <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
                                    <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping scale-150" />
                                </div>
                            </Marker>
                        )}

                        {/* Other participants */}
                        {participantArr.map(p => (
                            <Marker key={p.socketId} longitude={p.lng} latitude={p.lat} anchor="bottom">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="px-2 py-1 rounded-xl text-[10px] font-black text-white shadow-lg mb-1 whitespace-nowrap"
                                        style={{ background: getColor(p.socketId) }}
                                    >
                                        {p.name.split(' ')[0]}
                                    </div>
                                    <div className="w-3 h-3 rounded-full border-2 border-white shadow-md" style={{ background: getColor(p.socketId) }} />
                                </div>
                            </Marker>
                        ))}
                    </MapGL>
                </div>
            )}

            {/* ── Idle: Choose mode ── */}
            {mode === 'idle' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-5">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-4">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-4 shadow-xl shadow-green-500/30">
                            <MdRadar size={40} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Live Route Sharing</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
                            Share your real-time location with friends and family so they can follow your journey
                        </p>
                    </motion.div>

                    <div className="w-full max-w-sm space-y-3">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={hostSession}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-3xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 hover:from-green-600 hover:to-emerald-700 transition-all"
                        >
                            <MdShare size={22} /> Start Sharing My Location
                        </motion.button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-white/10" /></div>
                            <div className="relative text-center"><span className="bg-gray-50 dark:bg-sr-dark px-3 text-xs text-gray-400 font-bold">OR</span></div>
                        </div>

                        <GlassCard className="p-4 space-y-3">
                            <p className="text-sm font-black text-gray-900 dark:text-white text-center">Join Someone's Session</p>
                            <div className="flex gap-2">
                                <input
                                    value={joinInput}
                                    onChange={e => { setJoinInput(e.target.value.toUpperCase()); setError('') }}
                                    maxLength={8}
                                    placeholder="Enter session code"
                                    className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 text-sm font-bold tracking-widest text-center text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <motion.button whileTap={{ scale: 0.95 }} onClick={joinSession}
                                    className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-2xl transition-colors">
                                    Join
                                </motion.button>
                            </div>
                            {error && <p className="text-xs text-red-500 text-center font-semibold">{error}</p>}
                        </GlassCard>
                    </div>
                </div>
            )}

            {/* ── Active: floating overlay ── */}
            {mode === 'active' && (
                <div className="absolute top-4 inset-x-4 z-10 space-y-3">
                    {/* Session info bar */}
                    <GlassCard className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Session Code</p>
                            <p className="font-black text-gray-900 dark:text-white tracking-widest text-lg">{sessionCode}</p>
                        </div>
                        <button onClick={copyCode}
                            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                            {copied ? <MdCheck size={18} className="text-green-500" /> : <MdContentCopy size={16} />}
                        </button>
                        <button onClick={shareCode}
                            className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors">
                            <MdShare size={18} />
                        </button>
                        <button onClick={stopSharing}
                            className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                            <MdClose size={18} />
                        </button>
                    </GlassCard>

                    {/* Participants list */}
                    {(participants.size > 0) && (
                        <GlassCard className="px-4 py-3">
                            <div className="flex items-center gap-2 mb-2">
                                <MdGroup className="text-green-500" size={16} />
                                <p className="text-xs font-black text-gray-700 dark:text-gray-300">
                                    {participants.size} participant{participants.size !== 1 ? 's' : ''} in session
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(participants.values()).map(p => (
                                    <div key={p.socketId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                                        style={{ background: getColor(p.socketId) }}>
                                        <MdPersonPin size={12} />
                                        {p.name.split(' ')[0]}
                                        {p.lat === 0 ? ' (locating…)' : ''}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* Connection error */}
                    {!connected && (
                        <GlassCard className="px-4 py-2 flex items-center gap-2">
                            <MdSignalWifiOff className="text-red-500 flex-shrink-0" size={18} />
                            <p className="text-xs text-red-500 font-semibold">{error || 'Reconnecting…'}</p>
                        </GlassCard>
                    )}
                </div>
            )}

            {/* ── Active: bottom stop button ── */}
            {mode === 'active' && (
                <div className="absolute bottom-6 inset-x-4 z-10">
                    <GlassCard className="px-4 py-3 flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">📡 Broadcasting your location</p>
                            <p className="text-xs text-gray-400 mt-0.5">{participantArr.length} tracking • Updated live</p>
                        </div>
                        <button onClick={stopSharing}
                            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-2xl transition-colors">
                            Stop Sharing
                        </button>
                    </GlassCard>
                </div>
            )}

        </PageTransition>
    )
}
