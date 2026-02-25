import { useState, useEffect, useRef } from 'react'
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
  MdPrint
} from 'react-icons/md'
import { GlassCard } from '../components/ui/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

import { PageTransition } from '../components/ui/PageTransition'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function RouteBreakdown() {
  const [view, setView] = useState<'segments' | 'turns'>('segments')
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Modal State
  const [selectedSegment, setSelectedSegment] = useState<any>(null)

  const location = useLocation()
  const nav = useNavigate()
  const { routeData, startQuery, destQuery } = location.state || {}
  const mapRef = useRef<any>(null)

  const [showCopyFeedback, setShowCopyFeedback] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: 'Safe Route AI Journey',
      text: `Check out this safe route from ${startQuery} to ${destQuery}! Risk Level: ${routeData?.riskLevel}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
        setShowCopyFeedback(true)
        setTimeout(() => setShowCopyFeedback(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  useEffect(() => {
    if (routeData && routeData.geojson) {
      setUserLocation(routeData.geojson.geometry.coordinates[0])
    }
  }, [routeData])

  // Simulated Navigation Effect
  useEffect(() => {
    if (!isNavigating || !routeData || !routeData.steps) return

    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        const next = prev + 1
        if (next >= routeData.steps.length) {
          setIsNavigating(false)
          return prev
        }
        // Move marker to next step location (simplified)
        const step = routeData.steps[next]
        setUserLocation(step.maneuver.location)

        // Fly map to new location
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: step.maneuver.location,
            zoom: 17,
            pitch: 60,
            bearing: step.maneuver.bearing_after || 0
          })
        }
        return next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [isNavigating, routeData])

  if (!routeData) {
    return <Navigate to="/map" />
  }

  const routeLayer = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': '#00d35a',
      'line-width': 6,
      'line-opacity': 0.8
    }
  }

  const currentStep = routeData.steps ? routeData.steps[currentStepIndex] : null

  return (
    <PageTransition className="relative flex h-screen w-full flex-col lg:flex-row bg-white dark:bg-sr-dark overflow-hidden font-display">

      {/* Left Column: Map (60%) */}
      <div className="w-full lg:w-[60%] h-[50vh] lg:h-full relative border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: routeData.geojson.geometry.coordinates[0][0],
            latitude: routeData.geojson.geometry.coordinates[0][1],
            zoom: 13
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <NavigationControl position="top-left" showCompass={false} />

          <Source id="route" type="geojson" data={routeData.geojson}>
            <Layer {...routeLayer} />
          </Source>

          {/* Start/End Markers */}
          <Marker longitude={routeData.geojson.geometry.coordinates[0][0]} latitude={routeData.geojson.geometry.coordinates[0][1]} color="#00d35a" />
          <Marker longitude={routeData.geojson.geometry.coordinates[routeData.geojson.geometry.coordinates.length - 1][0]} latitude={routeData.geojson.geometry.coordinates[routeData.geojson.geometry.coordinates.length - 1][1]} color="#ef4444" />

          {/* User Location Marker (Navigation) */}
          {userLocation && isNavigating && (
            <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
              <div className="relative">
                <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10 relative"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/30 rounded-full animate-ping"></div>
              </div>
            </Marker>
          )}
        </Map>

        {/* Floating Back Button */}
        <button
          onClick={() => nav('/map')}
          className="absolute top-4 left-14 bg-white/90 dark:bg-black/90 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-10"
        >
          <MdClose size={20} />
        </button>
      </div>

      {/* Right Column: Details (40%) */}
      <div className="w-full lg:w-[40%] h-[50vh] lg:h-full flex flex-col bg-gray-50 dark:bg-sr-dark relative z-20">

        {/* Header */}
        <div className="p-6 pb-4 bg-white dark:bg-black/20 border-b border-gray-200 dark:border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {isNavigating ? "Ongoing Journey" : "Route Breakdown"}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="truncate max-w-[150px] font-medium">{startQuery}</span>
                <MdArrowForward className="text-gray-300" />
                <span className="truncate max-w-[150px] font-medium text-gray-900 dark:text-white">{destQuery}</span>
              </div>
            </div>
            <div className="flex gap-2 relative">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                title="Share Route"
              >
                <MdShare size={20} />
              </button>
              <AnimatePresence>
                {showCopyFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
                  >
                    Copied to clipboard!
                  </motion.div>
                )}
              </AnimatePresence>
              <button className="p-2 text-gray-400 hover:text-green-500 transition-colors"><MdPrint size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/20 text-center">
              <MdSecurity className="mx-auto text-green-500 mb-1" />
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Risk</div>
              <div className="font-black text-green-600 dark:text-green-400">{routeData.riskLevel}</div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
              <MdStraighten className="mx-auto text-gray-400 mb-1" />
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Dist</div>
              <div className="font-bold text-gray-900 dark:text-white">{routeData.distance}</div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
              <MdTimer className="mx-auto text-gray-400 mb-1" />
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Time</div>
              <div className="font-bold text-gray-900 dark:text-white">{routeData.duration}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-4">
          <button
            onClick={() => setIsNavigating(!isNavigating)}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2",
              isNavigating
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
                : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/30"
            )}
          >
            {isNavigating ? <><MdStop /> End Navigation</> : <><MdNavigation /> Start Navigation</>}
          </button>
        </div>

        {/* View Toggle */}
        <div className="px-6 pb-2">
          <div className="bg-gray-200 dark:bg-white/10 p-1 rounded-xl flex">
            {['segments', 'turns'].map(v => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                  view === v
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                )}
              >
                {v === 'segments' ? 'Safety Segments' : 'Turn-by-Turn'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2 space-y-4">
          {isNavigating && currentStep && (
            <GlassCard className="bg-green-600 text-white border-0 shadow-xl mb-4 animate-pulse">
              <div className="p-4 flex items-center gap-4">
                <div className="text-4xl bg-white/20 p-3 rounded-full">
                  {currentStep.maneuver.type === 'turn' ?
                    (currentStep.maneuver.modifier?.includes('left') ? <MdTurnLeft /> : <MdTurnRight />) :
                    <MdArrowUpward />}
                </div>
                <div>
                  <div className="text-3xl font-black">{Math.round(currentStep.distance)}m</div>
                  <div className="font-medium opacity-90">{currentStep.maneuver.instruction}</div>
                </div>
              </div>
            </GlassCard>
          )}

          {view === 'segments' ? (
            <div className="space-y-3">
              {routeData.segments?.map((segment: any, i: number) => (
                <GlassCard
                  key={i}
                  onClick={() => setSelectedSegment(segment)}
                  className="cursor-pointer hover:border-green-500/50 hover:shadow-lg group transition-all"
                >
                  <div className="p-4 flex gap-4">
                    <div className="w-1.5 self-stretch rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
                          {segment.title}
                        </h3>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-black/5 dark:bg-white/10" style={{ color: segment.color }}>
                          {segment.score}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {segment.reason}
                      </p>
                    </div>
                    <MdArrowForward className="text-gray-300 self-center group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {routeData.steps?.map((step: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-xl">
                  <div className="text-gray-400 mt-1">
                    {step.maneuver.type === 'turn' ?
                      (step.maneuver.modifier?.includes('left') ? <MdTurnLeft size={24} /> : <MdTurnRight size={24} />) :
                      <MdArrowUpward size={24} />}
                  </div>
                  <div>
                    <p className={cn("text-gray-900 dark:text-white font-medium", i === currentStepIndex && isNavigating && "text-green-500")}>
                      {step.maneuver.instruction}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{Math.round(step.distance)} meters</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Segment Detail Modal */}
      <AnimatePresence>
        {selectedSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedSegment(null)}
          >
            <GlassCard className="max-w-md w-full bg-white dark:bg-zinc-900 overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <div className="h-32 bg-gray-100 dark:bg-white/5 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                {/* Placeholder for segment map or image could go here */}
                <div className="absolute bottom-4 left-4 z-20">
                  <h2 className="text-2xl font-black text-white">{selectedSegment.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-xs font-bold text-white border border-white/20">
                      Score: {selectedSegment.score}/10
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSegment(null)}
                  className="absolute top-4 right-4 z-20 bg-black/40 text-white p-1 rounded-full hover:bg-black/60 transition-colors"
                >
                  <MdClose size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Analysis</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedSegment.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Risks</h4>
                    <ul className="text-sm space-y-1">
                      {selectedSegment.risks?.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-red-600 dark:text-red-400">
                          <span className="mt-1.5 w-1 h-1 bg-current rounded-full" /> {r}
                        </li>
                      )) || <span className="text-gray-400 text-xs text-center block italic">None reported</span>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tips</h4>
                    <ul className="text-sm space-y-1">
                      {selectedSegment.tips?.map((t: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-green-600 dark:text-green-400">
                          <span className="mt-1.5 w-1 h-1 bg-current rounded-full" /> {t}
                        </li>
                      )) || <span className="text-gray-400 text-xs text-center block italic">No specific tips</span>}
                    </ul>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
