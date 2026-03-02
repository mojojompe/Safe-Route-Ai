import { useState, useEffect, useRef, useCallback } from 'react'
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useLocation, Navigate, useNavigate } from 'react-router-dom'
import {
  MdTurnLeft,
  MdTurnRight,
  MdArrowUpward,
  MdClose,
  MdArrowForward,
  MdTimer,
  MdStraighten,
  MdSecurity,
  MdNavigation,
  MdStop,
  MdShare,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdWarning,
  MdShield,
  MdLightbulb,
  MdLocationOn,
  MdRoute,
  MdSpeed,
  MdVisibility,
  MdCheckCircle,
  MdInfo
} from 'react-icons/md'
import { GlassCard } from '../components/ui/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { PageTransition } from '../components/ui/PageTransition'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// Risk level color and label helpers
const riskColor = (level: string) => {
  if (level === 'Low') return { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800/30' }
  if (level === 'Moderate') return { bg: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800/30' }
  return { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800/30' }
}

const scoreToLevel = (score: number) => score >= 7 ? 'Low' : score >= 4 ? 'Moderate' : 'High'

export default function RouteBreakdown() {
  const [view, setView] = useState<'segments' | 'turns'>('segments')
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Sheet: 'peek' = just handle visible, 'half' = ~50% open, 'full' = fully open
  const [sheetState, setSheetState] = useState<'peek' | 'half' | 'full'>('half')
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [showShareToast, setShowShareToast] = useState<string | null>(null)

  const location = useLocation()
  const nav = useNavigate()
  const { routeData, startQuery, destQuery } = location.state || {}
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (routeData?.geojson) {
      setUserLocation(routeData.geojson.geometry.coordinates[0])
    }
  }, [routeData])

  // Simulated Navigation
  useEffect(() => {
    if (!isNavigating || !routeData?.steps) return
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        const next = prev + 1
        if (next >= routeData.steps.length) { setIsNavigating(false); return prev }
        const step = routeData.steps[next]
        setUserLocation(step.maneuver.location)
        if (mapRef.current) {
          mapRef.current.flyTo({ center: step.maneuver.location, zoom: 17, pitch: 60, bearing: step.maneuver.bearing_after || 0 })
        }
        return next
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [isNavigating, routeData])

  // Share with static map image
  const handleShare = useCallback(async () => {
    const coords = routeData?.geojson?.geometry?.coordinates
    let staticMapUrl = ''

    if (coords && MAPBOX_TOKEN) {
      const start = coords[0]
      const end = coords[coords.length - 1]
      // Build path overlay for static map
      const pathCoords = coords.filter((_: any, i: number) => i % Math.max(1, Math.floor(coords.length / 50)) === 0)
      const pathStr = pathCoords.map((c: number[]) => `${c[0]},${c[1]}`).join(',')
      staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
        `pin-s-a+00d35a(${start[0]},${start[1]}),pin-s-b+ef4444(${end[0]},${end[1]}),` +
        `path-4+00d35a-0.8(${encodeURIComponent(pathStr)})/` +
        `auto/600x400?access_token=${MAPBOX_TOKEN}`
    }

    const shareText = [
      `🛡️ Safe Route Ai — Journey Breakdown`,
      `📍 From: ${startQuery}`,
      `📍 To: ${destQuery}`,
      `📊 Safety Score: ${routeData?.score}/10`,
      `⚠️ Risk Level: ${routeData?.riskLevel}`,
      `🛣️ Distance: ${routeData?.distance}`,
      `⏱️ Duration: ${routeData?.duration}`,
      staticMapUrl ? `\n🗺️ Map Preview: ${staticMapUrl}` : '',
    ].filter(Boolean).join('\n')

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Safe Route Ai — Route Breakdown', text: shareText, url: window.location.href })
        return
      } catch { /* fall through to clipboard */ }
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`)
      setShowShareToast('Copied to clipboard!')
      setTimeout(() => setShowShareToast(null), 3000)
    } catch {
      setShowShareToast('Could not copy — please share manually.')
      setTimeout(() => setShowShareToast(null), 3000)
    }
  }, [routeData, startQuery, destQuery])

  if (!routeData) return <Navigate to="/map" />

  const coords = routeData.geojson?.geometry?.coordinates || []
  const startCoord = coords[0]
  const endCoord = coords[coords.length - 1]
  const currentStep = routeData.steps?.[currentStepIndex]
  const riskColors = riskColor(routeData.riskLevel)

  // Sheet snap points (as % of viewport height from bottom)
  const sheetSnapMap = { peek: '88vh', half: '54vh', full: '12vh' }
  const sheetHeight = sheetSnapMap[sheetState]

  return (
    <PageTransition className="relative flex flex-col h-screen w-full overflow-hidden font-sans bg-gray-900">

      {/* ══════════════════════════════════════════
          FULLSCREEN MAP (always full screen on mobile)
      ══════════════════════════════════════════ */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: startCoord[0],
            latitude: startCoord[1],
            zoom: 13
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={false}
        >
          <NavigationControl position="top-right" showCompass={false} />

          {/* Route Line */}
          <Source id="route" type="geojson" data={routeData.geojson}>
            <Layer
              id="route-bg"
              type="line"
              paint={{ 'line-color': '#00d35a', 'line-width': 10, 'line-opacity': 0.25 }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
            <Layer
              id="route-line"
              type="line"
              paint={{ 'line-color': '#00d35a', 'line-width': 5, 'line-opacity': 0.9 }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
          </Source>

          {/* Start/End Markers */}
          <Marker longitude={startCoord[0]} latitude={startCoord[1]} color="#00d35a" />
          <Marker longitude={endCoord[0]} latitude={endCoord[1]} color="#ef4444" />

          {/* Nav User Marker */}
          {userLocation && isNavigating && (
            <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
              <div className="relative">
                <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10 relative" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/30 rounded-full animate-ping" />
              </div>
            </Marker>
          )}
        </Map>
      </div>

      {/* ══════════════════════════════════════
          FLOATING HEADER BUTTONS (always on top)
      ══════════════════════════════════════ */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
        {/* Back */}
        <button
          onClick={() => nav('/map')}
          className="w-10 h-10 bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <MdClose size={20} />
        </button>

        {/* Route Label Pill */}
        <div className="bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-lg border border-white/20 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white max-w-[200px]">
          <MdRoute className="text-green-500 flex-shrink-0" size={16} />
          <span className="truncate">{destQuery}</span>
        </div>
      </div>

      {/* Share button top-right */}
      <div className="absolute top-4 right-16 z-30">
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-white/95 dark:bg-black/90 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/20 text-gray-700 dark:text-white hover:text-green-500 transition-colors"
          title="Share Route"
        >
          <MdShare size={18} />
        </button>
      </div>

      {/* Share feedback toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-2xl shadow-2xl whitespace-nowrap"
          >
            {showShareToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          LIVE NAV BANNER (floats above the sheet when navigating)
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {isNavigating && currentStep && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[72px] left-4 right-4 z-30"
          >
            <div className="bg-green-600 text-white rounded-2xl p-4 flex items-center gap-4 shadow-2xl shadow-green-500/40">
              <div className="text-4xl bg-white/20 p-3 rounded-xl flex-shrink-0">
                {currentStep.maneuver.type === 'turn'
                  ? (currentStep.maneuver.modifier?.includes('left') ? <MdTurnLeft /> : <MdTurnRight />)
                  : <MdArrowUpward />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black">{Math.round(currentStep.distance)}m</div>
                <div className="font-medium opacity-90 text-sm truncate">{currentStep.maneuver.instruction}</div>
              </div>
              <div className="text-xs opacity-60 text-right">
                <div className="font-bold">{currentStepIndex + 1}/{routeData.steps?.length}</div>
                <div>steps</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          BOTTOM SHEET (draggable panel)
      ══════════════════════════════════════════ */}
      <motion.div
        ref={sheetRef}
        className="absolute left-0 right-0 z-20 flex flex-col"
        style={{ bottom: 0, height: sheetHeight, transition: 'height 0.35s cubic-bezier(0.32,0.72,0,1)' }}
      >
        <div className="flex-1 bg-white dark:bg-zinc-950 rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border-t border-gray-100 dark:border-white/10">

          {/* Drag Handle + Quick Stats */}
          <div
            className="flex flex-col items-center pt-3 pb-2 px-5 cursor-grab active:cursor-grabbing flex-shrink-0 select-none"
            onClick={() => setSheetState(s => s === 'peek' ? 'half' : s === 'half' ? 'full' : 'peek')}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full mb-3" />

            {/* Route summary row */}
            <div className="w-full flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                  {isNavigating ? 'Navigating…' : 'Route Breakdown'}
                </h1>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <MdLocationOn size={12} className="text-green-500" />
                  <span className="truncate max-w-[100px]">{startQuery}</span>
                  <MdArrowForward size={10} />
                  <span className="truncate max-w-[100px] text-gray-900 dark:text-white font-medium">{destQuery}</span>
                </div>
              </div>

              {/* Chevron toggle */}
              <button
                onClick={e => { e.stopPropagation(); setSheetState(s => s === 'full' ? 'half' : 'full') }}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
              >
                {sheetState === 'full' ? <MdKeyboardArrowDown size={20} /> : <MdKeyboardArrowUp size={20} />}
              </button>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="px-4 pb-3 flex-shrink-0">
            <div className="grid grid-cols-3 gap-2">
              <div className={cn('p-2.5 rounded-xl border text-center', riskColors.light, riskColors.border)}>
                <MdSecurity className={cn('mx-auto mb-0.5', riskColors.text)} size={16} />
                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Risk</div>
                <div className={cn('text-sm font-black', riskColors.text)}>{routeData.riskLevel}</div>
              </div>
              <div className="p-2.5 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-center">
                <MdStraighten className="mx-auto mb-0.5 text-gray-400" size={16} />
                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Dist</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{routeData.distance}</div>
              </div>
              <div className="p-2.5 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-center">
                <MdTimer className="mx-auto mb-0.5 text-gray-400" size={16} />
                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Time</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{routeData.duration}</div>
              </div>
            </div>
          </div>

          {/* Start/Stop Nav Button */}
          <div className="px-4 pb-3 flex-shrink-0">
            <button
              onClick={() => { setIsNavigating(!isNavigating); if (!isNavigating) setSheetState('peek') }}
              className={cn(
                'w-full py-3.5 rounded-2xl font-black text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2',
                isNavigating
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
              )}
            >
              {isNavigating ? <><MdStop size={20} /> End Navigation</> : <><MdNavigation size={20} /> Start Live Navigation</>}
            </button>
          </div>

          {/* Tab Toggle */}
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex gap-1">
              {(['segments', 'turns'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5',
                    view === v
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  )}
                >
                  {v === 'segments' ? <><MdRoute size={14} /> Safety Segments</> : <><MdNavigation size={14} /> Turn-by-Turn</>}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 space-y-2.5">
            {view === 'segments' ? (
              <>
                {/* Safety score summary bar */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(routeData.score / 10) * 100}%`,
                        background: routeData.score >= 7 ? '#00d35a' : routeData.score >= 4 ? '#eab308' : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{routeData.score}/10</span>
                </div>

                {routeData.segments?.map((segment: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedSegment(segment)}
                      className="w-full text-left"
                    >
                      <GlassCard className="p-3.5 flex gap-3 hover:border-green-500/40 group transition-all" hoverEffect>
                        {/* Color bar */}
                        <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: segment.color }} />
                        <div className="flex-1 min-w-0">
                          {/* Title + Score */}
                          <div className="flex justify-between items-center mb-1.5">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-green-500 transition-colors truncate pr-2">
                              {segment.title}
                            </h3>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {segment.time && segment.time !== 'N/A' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                                  ⏱ {segment.time}
                                </span>
                              )}
                              <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ color: segment.color, background: `${segment.color}20` }}>
                                {segment.score}/10
                              </span>
                            </div>
                          </div>
                          {/* Range: From X to Y */}
                          {segment.range && segment.range !== 'Area details unavailable' && (
                            <div className="flex items-start gap-1.5 mb-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                              <MdRoute className="flex-shrink-0 mt-0.5 text-gray-400" size={12} />
                              <span className="leading-snug">{segment.range}</span>
                            </div>
                          )}
                          {/* Reason / analysis blurb */}
                          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{segment.reason}</p>
                          {/* Risk pills */}
                          {(segment.risks?.length > 0 || segment.tips?.length > 0) && (
                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              {segment.risks?.slice(0, 2).map((r: string, j: number) => (
                                <span key={j} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                  ⚠ {r}
                                </span>
                              ))}
                              {segment.tips?.slice(0, 1).map((t: string, j: number) => (
                                <span key={j} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                  💡 {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <MdArrowForward className="text-gray-300 self-center group-hover:translate-x-0.5 transition-transform flex-shrink-0" size={16} />
                      </GlassCard>
                    </button>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="space-y-0">
                {routeData.steps?.map((step: any, i: number) => {
                  const isActive = i === currentStepIndex && isNavigating
                  const isPast = i < currentStepIndex && isNavigating
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={cn(
                        'flex gap-3 p-3 border-b border-gray-100 dark:border-white/5 last:border-0 rounded-xl transition-colors',
                        isActive && 'bg-green-50 dark:bg-green-900/20',
                        isPast && 'opacity-40'
                      )}
                    >
                      {/* Step number + icon */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className={cn(
                          'w-8 h-8 rounded-xl flex items-center justify-center',
                          isActive ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                        )}>
                          {step.maneuver.type === 'turn'
                            ? (step.maneuver.modifier?.includes('left') ? <MdTurnLeft size={18} /> : <MdTurnRight size={18} />)
                            : <MdArrowUpward size={18} />}
                        </div>
                        {i < (routeData.steps?.length - 1) && (
                          <div className="w-0.5 h-4 bg-gray-200 dark:bg-white/10" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={cn('text-sm font-semibold text-gray-900 dark:text-white', isActive && 'text-green-600 dark:text-green-400')}>
                          {step.maneuver.instruction}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">{Math.round(step.distance)}m</span>
                          {step.name && <span className="text-xs text-gray-400 italic truncate">on {step.name}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Destination marker at end */}
                {routeData.steps?.length > 0 && (
                  <div className="flex gap-3 p-3 items-center">
                    <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center text-white flex-shrink-0">
                      <MdLocationOn size={18} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{destQuery} — Destination</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          SEGMENT DETAIL MODAL (full-screen bottom sheet)
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSegment(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="w-full max-h-[90vh] bg-white dark:bg-zinc-950 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header with colored accent */}
              <div
                className="relative h-40 flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${selectedSegment.color}30, ${selectedSegment.color}10)` }}
              >
                {/* Static map preview using Mapbox Static API */}
                {MAPBOX_TOKEN && routeData?.geojson && (() => {
                  const geoStr = encodeURIComponent(JSON.stringify({ type: 'Feature', geometry: routeData.geojson.geometry, properties: {} }))
                  const staticUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(${geoStr})/auto/600x200?padding=30&access_token=${MAPBOX_TOKEN}`
                  return (
                    <img
                      src={staticUrl}
                      alt="Route map"
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Title overlay */}
                <div className="absolute bottom-4 left-5 right-14 z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedSegment.color }} />
                    <span
                      className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ background: `${selectedSegment.color}30`, color: selectedSegment.color }}
                    >
                      {scoreToLevel(selectedSegment.score)} Risk
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight">{selectedSegment.title}</h2>
                </div>

                {/* Close + Score */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur text-white text-sm font-black">
                    {selectedSegment.score}/10
                  </div>
                  <button
                    onClick={() => setSelectedSegment(null)}
                    className="w-8 h-8 bg-black/50 backdrop-blur text-white rounded-xl flex items-center justify-center hover:bg-black/70 transition"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5">

                {/* Safety Score Bar */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Safety Score</span>
                    <span className="font-black text-lg" style={{ color: selectedSegment.color }}>{selectedSegment.score}/10</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedSegment.score / 10) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: selectedSegment.color }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Dangerous</span>
                    <span>Safe</span>
                  </div>
                </div>

                {/* Analysis */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MdInfo className="text-blue-500" size={18} />
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">AI Analysis</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-blue-900/10 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    {selectedSegment.reason || 'This segment has been analyzed based on real-time data, historical reports, and environmental factors to produce your safety score.'}
                  </p>
                </div>

                {/* Environmental Factors */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MdVisibility, label: 'Lighting', value: selectedSegment.lighting || 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
                    { icon: MdSpeed, label: 'Traffic', value: selectedSegment.traffic || 'Moderate', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
                    { icon: MdShield, label: 'Crime Rate', value: selectedSegment.crimeRate || 'Low', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
                    { icon: MdLocationOn, label: 'Area Type', value: selectedSegment.areaType || 'Urban', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                  ].map((factor, i) => (
                    <div key={i} className={cn('rounded-xl p-3 flex items-center gap-3', factor.bg)}>
                      <factor.icon className={cn('flex-shrink-0', factor.color)} size={20} />
                      <div>
                        <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{factor.label}</div>
                        <div className="text-sm font-black text-gray-900 dark:text-white">{factor.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Risk Factors */}
                {selectedSegment.risks?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MdWarning className="text-red-500" size={18} />
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Risk Factors</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedSegment.risks.map((r: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-[10px] font-black">{i + 1}</span>
                          </div>
                          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safety Tips */}
                {selectedSegment.tips?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MdLightbulb className="text-green-500" size={18} />
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Safety Tips</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedSegment.tips.map((t: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                          <MdCheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Landmarks (if present) */}
                {selectedSegment.landmarks?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MdLocationOn className="text-blue-500" size={18} />
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Nearby Landmarks</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSegment.landmarks.map((l: string, i: number) => (
                        <span key={i} className="text-xs font-bold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-800/30">
                          📍 {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time estimate */}
                {selectedSegment.timeRange && (
                  <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <MdTimer className="text-gray-400 flex-shrink-0" size={24} />
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Estimated Time</div>
                      <div className="font-black text-gray-900 dark:text-white">{selectedSegment.timeRange}</div>
                    </div>
                  </div>
                )}

                {/* Bottom padding */}
                <div className="h-6" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
