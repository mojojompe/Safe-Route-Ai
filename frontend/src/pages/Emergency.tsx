import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import axios from 'axios'
import {
  MdLocalPolice, MdLocalHospital, MdLocalFireDepartment,
  MdDirectionsCar, MdLocationOn, MdTimer, MdPhone,
  MdSettings, MdContentCopy, MdCheck, MdImage
} from 'react-icons/md'

const API = import.meta.env.VITE_API_URL
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// Country-specific emergency numbers
const COUNTRY_NUMBERS: Record<string, {
  police: string; medical: string; fire: string; roadside: string
}> = {
  NG: { police: '199', medical: '112', fire: '112', roadside: '767' },
  US: { police: '911', medical: '911', fire: '911', roadside: '911' },
  GB: { police: '999', medical: '999', fire: '999', roadside: '999' },
  GH: { police: '191', medical: '193', fire: '192', roadside: '191' },
  ZA: { police: '10111', medical: '10177', fire: '10177', roadside: '112' },
  KE: { police: '999', medical: '999', fire: '999', roadside: '999' },
  DEFAULT: { police: '112', medical: '112', fire: '112', roadside: '112' },
}

const SERVICE_META = {
  police: { label: 'Police', icon: MdLocalPolice, color: '#3b82f6', bg: '#eff6ff' },
  medical: { label: 'Medical', icon: MdLocalHospital, color: '#ef4444', bg: '#fef2f2' },
  fire: { label: 'Fire', icon: MdLocalFireDepartment, color: '#f97316', bg: '#fff7ed' },
  roadside: { label: 'Roadside', icon: MdDirectionsCar, color: '#8b5cf6', bg: '#f5f3ff' },
}

/** Detect country code from the IP via a free service */
async function detectCountry(): Promise<string> {
  try {
    // Try timezone first (no network needed)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz.startsWith('Africa/Lagos') || tz.startsWith('Africa/Abuja')) return 'NG'
    if (tz.startsWith('America/')) return 'US'
    if (tz.startsWith('Europe/London')) return 'GB'
    if (tz.startsWith('Africa/Accra')) return 'GH'
    if (tz.startsWith('Africa/Johannesburg')) return 'ZA'
    if (tz.startsWith('Africa/Nairobi')) return 'KE'
    // Fallback: IP lookup
    const r = await fetch('https://ipapi.co/country/', { signal: AbortSignal.timeout(3000) })
    const code = await r.text()
    return code.trim().toUpperCase()
  } catch {
    return 'NG' // Default to Nigeria for this app
  }
}

function useCountdown(started: boolean, minutes: number) {
  const [remaining, setRemaining] = useState(minutes * 60)
  useEffect(() => {
    if (!started) { setRemaining(minutes * 60); return }
    const id = setInterval(() => setRemaining(s => s <= 0 ? 0 : s - 1), 1000)
    return () => clearInterval(id)
  }, [started, minutes])
  return remaining
}

export default function Emergency() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [countryCode, setCountryCode] = useState<string>('NG')
  const [sosPulsing, setSosPulsing] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [shareMapUrl, setShareMapUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(15)
  const [timerRunning, setTimerRunning] = useState(false)
  const remaining = useCountdown(timerRunning, timerMinutes)

  useEffect(() => {
    detectCountry().then(setCountryCode)
    navigator.geolocation?.getCurrentPosition(pos => setLocation(pos.coords))
    if (user) {
      axios.get(`${API}/api/preferences/${user.uid}`)
        .then(r => setContacts(r.data.emergencyContacts || []))
        .catch(() => { })
    }
  }, [user])

  const numbers = COUNTRY_NUMBERS[countryCode] ?? COUNTRY_NUMBERS.DEFAULT

  const handleSOS = () => {
    setSosPulsing(true)
    const msg = location
      ? `🚨 SOS from ${user?.displayName || 'Safe Route AI User'}!\n📍 Location: https://maps.google.com/?q=${location.latitude},${location.longitude}\n🗺️ Map: ${buildMapUrl(location)}`
      : `🚨 SOS from ${user?.displayName || 'Safe Route AI User'}! Please call emergency services immediately.`
    if (navigator.share) {
      navigator.share({ title: '🚨 SOS Alert', text: msg }).catch(() => { })
    } else {
      navigator.clipboard.writeText(msg)
    }
    setTimeout(() => setSosPulsing(false), 3000)
  }

  const buildMapUrl = (coords: GeolocationCoordinates) => {
    if (!MAPBOX_TOKEN) return `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
    const lng = coords.longitude.toFixed(5)
    const lat = coords.latitude.toFixed(5)
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+e74c3c(${lng},${lat})/${lng},${lat},15,0/600x400?access_token=${MAPBOX_TOKEN}`
  }

  const generateShareLink = () => {
    if (!location) {
      navigator.geolocation?.getCurrentPosition(pos => {
        setLocation(pos.coords)
        const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        const mapUrl = buildMapUrl(pos.coords)
        setShareLink(link)
        setShareMapUrl(mapUrl)
      })
      return
    }
    const link = `https://maps.google.com/?q=${location.latitude},${location.longitude}`
    setShareLink(link)
    setShareMapUrl(buildMapUrl(location))
  }

  const shareWithImage = async () => {
    if (!shareLink) return
    setSharing(true)
    try {
      const msg = `📍 My current location:\n${shareLink}\n\nSent via Safe Route AI`
      if (navigator.share) {
        // Try sharing with the map image file
        if (shareMapUrl && MAPBOX_TOKEN) {
          try {
            const resp = await fetch(shareMapUrl)
            const blob = await resp.blob()
            const file = new File([blob], 'my-location.jpg', { type: 'image/jpeg' })
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({ title: '📍 My Location', text: msg, files: [file] })
              return
            }
          } catch { /* fallback below */ }
        }
        await navigator.share({ title: '📍 My Location', text: msg })
      } else {
        await navigator.clipboard.writeText(msg)
        setCopied(true); setTimeout(() => setCopied(false), 2000)
      }
    } finally {
      setSharing(false)
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const mmss = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`

  return (
    <PageTransition className="min-h-screen bg-gray-50 dark:bg-sr-dark p-4 md:p-8 font-sans">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">🆘 Emergency</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stay calm — help is nearby</p>
            </div>
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-xs font-black text-gray-500 dark:text-gray-400 rounded-xl">
              📍 {countryCode}
            </span>
          </div>
        </motion.div>

        {/* SOS Button */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative flex justify-center py-4">
          {sosPulsing && (
            <>
              <motion.div animate={{ scale: [1, 2.5], opacity: [0.4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute w-36 h-36 rounded-full bg-red-500" />
              <motion.div animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }}
                className="absolute w-36 h-36 rounded-full bg-red-400" />
            </>
          )}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleSOS}
            className="relative w-36 h-36 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-2xl shadow-red-500/40 flex flex-col items-center justify-center text-white z-10 select-none active:shadow-red-500/20"
          >
            <span className="text-4xl font-black leading-none">SOS</span>
            <span className="text-[10px] font-bold mt-1 opacity-80">TAP TO ALERT</span>
          </motion.button>
        </motion.div>

        {/* Emergency Numbers */}
        <GlassCard className="p-5">
          <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">
            Emergency Numbers · <span className="text-green-600 dark:text-green-400">{countryCode}</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(numbers) as [keyof typeof SERVICE_META, string][]).map(([key, num]) => {
              const meta = SERVICE_META[key]
              if (!meta) return null
              return (
                <motion.a
                  key={key} href={`tel:${num}`} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
                  style={{ backgroundColor: meta.bg + '44' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.bg }}>
                    <meta.icon style={{ color: meta.color }} size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{meta.label}</p>
                    <p className="text-lg font-black" style={{ color: meta.color }}>{num}</p>
                  </div>
                </motion.a>
              )
            })}
          </div>
        </GlassCard>

        {/* Share Location with Image */}
        <GlassCard className="p-5 space-y-3">
          <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
            <MdLocationOn className="text-green-500" /> Share My Location
          </h2>
          {location ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              📍 {location.latitude.toFixed(5)}°N, {location.longitude.toFixed(5)}°E
            </p>
          ) : (
            <p className="text-xs text-gray-400">Tap below to get your location</p>
          )}

          <button onClick={generateShareLink}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors">
            <MdLocationOn size={18} /> Get Location Link + Map
          </button>

          <AnimatePresence>
            {shareLink && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                {/* Map preview */}
                {shareMapUrl && (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                    <img src={shareMapUrl} alt="Your location map" className="w-full h-36 object-cover" />
                  </div>
                )}

                {/* Link row */}
                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-white/10 rounded-xl">
                  <p className="flex-1 text-xs text-gray-600 dark:text-gray-300 truncate font-mono">{shareLink}</p>
                  <button onClick={copyLink} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors flex-shrink-0">
                    {copied ? <MdCheck size={16} className="text-green-500" /> : <MdContentCopy size={16} />}
                  </button>
                </div>

                {/* Share button with image */}
                <button onClick={shareWithImage} disabled={sharing}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-colors disabled:opacity-60">
                  {sharing
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <MdImage size={18} />}
                  Share Location + Map Picture
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Emergency Contacts */}
        {contacts.length > 0 && (
          <GlassCard className="p-5 space-y-3">
            <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <MdPhone className="text-blue-500" /> Emergency Contacts
            </h2>
            {contacts.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black flex-shrink-0">
                  {c.name[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.relationship}</p>
                </div>
                <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors flex-shrink-0">
                  <MdPhone size={16} /> Call
                </a>
              </div>
            ))}
          </GlassCard>
        )}

        {contacts.length === 0 && (
          <button onClick={() => navigate('/settings')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 text-sm text-gray-500 hover:border-green-400 hover:text-green-600 dark:hover:border-green-500 dark:hover:text-green-400 transition-colors">
            <MdSettings size={18} /> Add Emergency Contacts in Settings
          </button>
        )}

        {/* Check-In Timer */}
        <GlassCard className="p-5 space-y-4">
          <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
            <MdTimer className="text-amber-500" /> Safety Check-In Timer
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Start a countdown — if the timer runs out without a check-in, share your location immediately.
          </p>
          {!timerRunning ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 flex-shrink-0">Alert after</span>
                <select value={timerMinutes} onChange={e => setTimerMinutes(Number(e.target.value))}
                  className="flex-1 bg-gray-100 dark:bg-white/10 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {[5, 10, 15, 20, 30, 45, 60].map(m => <option key={m} value={m}>{m} minutes</option>)}
                </select>
              </div>
              <button onClick={() => setTimerRunning(true)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl transition-colors">
                Start Timer
              </button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <motion.p
                animate={{ scale: remaining <= 60 ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: remaining <= 60 ? Infinity : 0, duration: 1 }}
                className={`text-5xl font-black tabular-nums ${remaining <= 60 ? 'text-red-500' : 'text-amber-500'}`}
              >
                {mmss}
              </motion.p>
              {remaining === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p className="text-sm font-bold text-red-500">⚠️ Timer expired — share your location now!</p>
                  <button onClick={generateShareLink}
                    className="w-full py-2.5 bg-red-500 text-white font-bold text-sm rounded-2xl">
                    📍 Share Location
                  </button>
                </motion.div>
              )}
              <button onClick={() => setTimerRunning(false)}
                className="px-6 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-2xl hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                Cancel Timer
              </button>
            </div>
          )}
        </GlassCard>

      </div>
    </PageTransition>
  )
}
