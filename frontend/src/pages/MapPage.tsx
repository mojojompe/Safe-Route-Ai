import { useState, useEffect, useRef } from 'react'
import { Route02Icon } from "hugeicons-react"

import Map, { Marker, Source, Layer, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdMyLocation,
  MdLocationOn,
  MdDirectionsWalk,
  MdDirectionsCar,
  MdAddCircle,
  MdReport,
  MdPublicOff,
  MdDelete,
  MdClose,
  MdSwapVert,
  MdNavigation,
  MdLayers,
  MdGpsFixed
} from 'react-icons/md'
import { GlassCard } from '../components/ui/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { PageTransition } from '../components/ui/PageTransition'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// Types for strict typing
interface Route {
  distance: string;
  duration: string;
  score: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  geojson: any;
}

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
  context?: any[];
}

export default function MapPage() {
  const [mode, setMode] = useState<'walking' | 'driving'>('walking')
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 13
  })
  const [startQuery, setStartQuery] = useState('')
  const [destQuery, setDestQuery] = useState('')
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null)
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null)

  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeInput, setActiveInput] = useState<'start' | 'dest' | null>(null)
  const [loading, setLoading] = useState(false)

  const nav = useNavigate()
  const { user } = useAuth()
  const mapRef = useRef<any>(null);

  // Welcome Message State
  const [showWelcome, setShowWelcome] = useState(false)

  // Sidebar State for Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (user) {
      const lastWelcome = localStorage.getItem(`lastWelcome_${user.uid}`)
      const today = new Date().toDateString()
      if (lastWelcome !== today) {
        setShowWelcome(true)
        localStorage.setItem(`lastWelcome_${user.uid}`, today)
        setTimeout(() => setShowWelcome(false), 2000)
      }
    }
  }, [user])

  // Persistent State
  useEffect(() => {
    const savedState = localStorage.getItem('mapState')
    if (savedState) {
      const parsed = JSON.parse(savedState)
      setStartQuery(parsed.startQuery || '')
      setDestQuery(parsed.destQuery || '')
      setStartCoords(parsed.startCoords || null)
      setDestCoords(parsed.destCoords || null)
      setRoutes(parsed.routes || [])
      if (parsed.viewState) setViewState(parsed.viewState)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mapState', JSON.stringify({
      startQuery,
      destQuery,
      startCoords,
      destCoords,
      routes,
      viewState
    }))
  }, [startQuery, destQuery, startCoords, destCoords, routes, viewState])

  const [startCountry, setStartCountry] = useState<string | null>(null)
  const [destCountry, setDestCountry] = useState<string | null>(null)

  // Debounced search
  useEffect(() => {
    const query = activeInput === 'start' ? startQuery : destQuery
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      if (!MAPBOX_TOKEN) return
      try {
        const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`, {
          params: {
            access_token: MAPBOX_TOKEN,
            types: 'poi,address,place,locality,neighborhood',
            proximity: 'ip',
            limit: 8,
            language: 'en'
          }
        })
        setSuggestions(res.data.features)
      } catch (err) {
        console.error("Error fetching suggestions:", err)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [startQuery, destQuery, activeInput])

  const handleSelect = (feature: any) => {
    const coords = feature.center
    const countryContext = feature.context?.find((c: any) => c.id.startsWith('country'))
    const countryCode = countryContext ? countryContext.short_code : null

    if (activeInput === 'start') {
      setStartCoords(coords)
      setStartQuery(feature.place_name)
      setStartCountry(countryCode)
      setViewState(prev => ({ ...prev, longitude: coords[0], latitude: coords[1], zoom: 14 }))
    } else {
      setDestCoords(coords)
      setDestQuery(feature.place_name)
      setDestCountry(countryCode)
    }
    setSuggestions([])
    setActiveInput(null)
  }

  const handleSwap = () => {
    setStartQuery(destQuery);
    setDestQuery(startQuery);
    setStartCoords(destCoords);
    setDestCoords(startCoords);
    setStartCountry(destCountry);
    setDestCountry(startCountry);
  }

  const [showCountryModal, setShowCountryModal] = useState(false)

  const handlePlanRoute = async () => {
    if (!startCoords || !destCoords) return

    if (startCountry && destCountry && startCountry !== destCountry) {
      setShowCountryModal(true)
      return
    }

    setLoading(true)
    setRoutes([])
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/route/options`, {
        start: startCoords,
        destination: destCoords,
        mode
      })
      setRoutes(res.data)
      setSelectedRouteIndex(0)
    } catch (error) {
      console.error("Route planning failed", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartNavigation = async () => {
    const selectedRoute = routes[selectedRouteIndex]
    if (!selectedRoute || !user) return
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/history/save`, {
        userId: user.uid,
        startLocation: startQuery,
        endLocation: destQuery,
        distance: selectedRoute.distance,
        duration: selectedRoute.duration,
        safetyScore: selectedRoute.score,
        riskLevel: selectedRoute.riskLevel,
        date: new Date()
      })
      nav('/route-breakdown', { state: { routeData: selectedRoute, startQuery, destQuery } })
    } catch (error) {
      console.error("Failed to start navigation", error)
      nav('/route-breakdown', { state: { routeData: selectedRoute, startQuery, destQuery } })
    }
  }

  const [reports, setReports] = useState<any[]>([])
  const [showReportMenu, setShowReportMenu] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports`)
      setReports(res.data)
    } catch (error) {
      console.error("Failed to fetch reports", error)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleReport = async (type: string) => {
    if (!user) return
    try {
      const newReport = {
        location: [viewState.longitude, viewState.latitude],
        type,
        description: `Reported ${type}`,
        userId: user.uid
      }
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/reports`, newReport)
      setReports(prev => [...prev, res.data])
      setShowReportMenu(false)
    } catch (error) {
      console.error("Failed to submit report", error)
    }
  }

  const handleDeleteReport = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/reports/${id}`)
      setReports(prev => prev.filter(r => r._id !== id))
      setSelectedReport(null)
    } catch (error) {
      console.error("Failed to delete report", error)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setViewState(prev => ({ ...prev, latitude, longitude, zoom: 14 }));
        setStartCoords([longitude, latitude]);
        setStartQuery("Current Location");
      }, (err) => {
        console.error("Geolocation error:", err);
      });
    }
  }

  return (
    <PageTransition className="relative flex h-screen w-full flex-col bg-white dark:bg-sr-dark overflow-hidden font-sans">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none"
          >
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
                Welcome, <span className="text-green-500">{user.displayName?.split(' ')[0] || 'Traveler'}</span>
              </h1>
              <p className="text-gray-300 text-lg">Stay safe on your journey.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Map Area */}
      <div className="absolute inset-0 z-0">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={false}
        >
          {startCoords && <Marker longitude={startCoords[0]} latitude={startCoords[1]} color="#00d35a" />}
          {destCoords && <Marker longitude={destCoords[0]} latitude={destCoords[1]} color="#ef4444" />}

          {/* Report Markers */}
          {reports.map(report => (
            <Marker
              key={report._id}
              longitude={report.location.coordinates[0]}
              latitude={report.location.coordinates[1]}
              onClick={(e: any) => {
                e.originalEvent.stopPropagation()
                setSelectedReport(report)
              }}
            >
              <div className="text-2xl cursor-pointer hover:scale-125 transition-transform drop-shadow-md" title={report.type}>
                {report.type === 'accident' ? '💥' :
                  report.type === 'police' ? '👮' :
                    report.type === 'hazard' ? '⚠️' : '📍'}
              </div>
            </Marker>
          ))}

          {selectedReport && (
            <Popup
              longitude={selectedReport.location.coordinates[0]}
              latitude={selectedReport.location.coordinates[1]}
              anchor="bottom"
              onClose={() => setSelectedReport(null)}
              closeButton={false}
              className="z-50"
              maxWidth="200px"
            >
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 min-w-[160px]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold capitalize text-gray-900 dark:text-white">{selectedReport.type}</h3>
                  <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600"><MdClose /></button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{selectedReport.description}</p>
                <button
                  onClick={() => handleDeleteReport(selectedReport._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-xs font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 w-full justify-center transition-colors"
                >
                  <MdDelete /> Remove Report
                </button>
              </div>
            </Popup>
          )}

          {/* Render Routes */}
          {routes.map((route, index) => {
            const isSelected = index === selectedRouteIndex
            let color = '#eab308'
            if (index === 0) color = '#00d35a'
            if (route.score < 4) color = '#ef4444'

            return (
              <Source key={index} id={`route-${index}`} type="geojson" data={route.geojson}>
                <Layer
                  id={`route-layer-${index}`}
                  type="line"
                  paint={{
                    'line-color': color,
                    'line-width': isSelected ? 6 : 4,
                    'line-opacity': isSelected ? 1 : 0.6
                  }}
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round'
                  }}
                />
                <Layer
                  id={`route-click-${index}`}
                  type="line"
                  paint={{
                    'line-width': 20,
                    'line-opacity': 0
                  }}
                  onClick={() => setSelectedRouteIndex(index)}
                />
              </Source>
            )
          })}
        </Map>

        {/* Targeter / Center Crosshair - Only visible when reporting */}
        <AnimatePresence>
          {showReportMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="relative">
                <MdGpsFixed className="text-black text-4xl drop-shadow-md" />
                <div className="absolute inset-0 bg-black/20 rounded-full animate-ping pointer-events-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Sidebar / Control Panel */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 md:right-auto md:top-4 md:bottom-4 md:w-96 z-30 pointer-events-none flex flex-col max-h-[calc(100vh-140px)] md:max-h-full"
          >
            <GlassCard className="w-full flex-1 md:h-full flex flex-col pointer-events-auto overflow-hidden shadow-2xl border-white/20 dark:border-white/10 bg-white/90 dark:bg-black/80 backdrop-blur-3xl">

              {/* Sidebar Header */}
              <div className="p-6 pb-4 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-1">Plan Journey</h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Find the safest route to your destination.</p>
              </div>

              <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">

                {/* Mode Selection */}
                <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex">
                  {['walking', 'driving'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m as any)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                        mode === m
                          ? "bg-white dark:bg-gray-800 text-green-600 dark:text-green-500 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      )}
                    >
                      {m === 'walking' ? <MdDirectionsWalk size={18} /> : <MdDirectionsCar size={18} />}
                      <span className="capitalize">{m}</span>
                    </button>
                  ))}
                </div>

                {/* Inputs */}
                <div className="relative space-y-4">
                  <div className="absolute left-3 top-3 bottom-12 w-0.5 bg-gradient-to-b from-green-500 to-gray-200 dark:to-gray-700 pointer-events-none" />

                  {/* Start Input */}
                  <div className="relative group">
                    <MdMyLocation className="absolute left-0 top-3 text-green-500 bg-white dark:bg-black p-0.5 rounded-full z-10 cursor-pointer hover:scale-110 transition-transform" size={24} onClick={getCurrentLocation} title="Use Current Location" />
                    <input
                      value={startQuery}
                      onChange={e => setStartQuery(e.target.value)}
                      onFocus={() => setActiveInput('start')}
                      className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors"
                      placeholder="Current Location"
                    />
                    {activeInput === 'start' && suggestions.length > 0 && (
                      <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {suggestions.map(s => (
                          <button key={s.id} onClick={() => handleSelect(s)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-white/5 last:border-0 truncate">
                            {s.place_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swap Button */}
                  <button
                    onClick={handleSwap}
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 hover:text-green-600 hover:scale-110 transition-all z-20"
                  >
                    <MdSwapVert size={18} />
                  </button>

                  {/* Dest Input */}
                  <div className="relative group">
                    <MdLocationOn className="absolute left-0 top-3 text-red-500 bg-white dark:bg-black p-0.5 rounded-full z-10" size={24} />
                    <input
                      value={destQuery}
                      onChange={e => setDestQuery(e.target.value)}
                      onFocus={() => setActiveInput('dest')}
                      className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors"
                      placeholder="Destination"
                    />
                    {activeInput === 'dest' && suggestions.length > 0 && (
                      <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {suggestions.map(s => (
                          <button key={s.id} onClick={() => handleSelect(s)} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-white/5 last:border-0 truncate">
                            {s.place_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handlePlanRoute}
                  disabled={!startCoords || !destCoords || loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Planning Route...
                    </>
                  ) : (
                    <>
                      <MdNavigation size={20} /> Plan Route
                    </>
                  )}
                </button>

                {/* Route Results */}
                {routes.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested Routes</h3>
                    <div className="space-y-3">
                      {routes.map((route, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedRouteIndex(i)}
                          className={cn(
                            "p-4 rounded-xl cursor-pointer transition-all border",
                            selectedRouteIndex === i
                              ? "bg-green-50 dark:bg-green-900/20 border-green-500/50 shadow-md ring-1 ring-green-500/20"
                              : "bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className={cn(
                                "text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide",
                                i === 0 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              )}>
                                {i === 0 ? "Safest" : `Route ${i + 1}`}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">{route.duration}</div>
                              <div className="text-xs text-gray-500">{route.distance}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Safety Score:</span>
                            <span className={cn(
                              "font-black",
                              route.score >= 8 ? "text-green-500" : route.score >= 5 ? "text-yellow-500" : "text-red-500"
                            )}>{route.score}/10</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleStartNavigation}
                      className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg"
                    >
                      Start Navigation
                    </button>
                  </div>
                )}

              </div>
            </GlassCard>

            {/* Close sidebar on mobile (just in case they want to see full map) */}
            <div className="md:hidden mt-2 flex justify-center pointer-events-auto">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-black/70 transition-colors"
                type="button"
              >
                <MdClose /> Hide Controls
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Toggle (Left Side) */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-12 h-12 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl flex items-center justify-center text-gray-900 dark:text-white shadow-lg border border-white/20 hover:scale-105 transition-transform"
        >
          {isSidebarOpen ? <MdClose size={24} /> : <Route02Icon size={24} />}
        </button>
      </div>

      {/* Floating Controls (Layers, Location - Right Side) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
        {/* Map Controls */}
        <div className="flex flex-col gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20">
          <button
            title="Current Location"
            onClick={getCurrentLocation}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-700 dark:text-white transition-colors"
          >
            <MdMyLocation size={24} />
          </button>
          <button title="Map Layers" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-700 dark:text-white transition-colors">
            <MdLayers size={24} />
          </button>
        </div>
      </div>

      {/* Floating Report Action Button */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3 pointer-events-auto">
        <AnimatePresence>
          {showReportMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex flex-col gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/20 mb-2"
            >
              {[
                { id: 'accident', icon: '💥', label: 'Accident' },
                { id: 'police', icon: '👮', label: 'Police' },
                { id: 'hazard', icon: '⚠️', label: 'Hazard' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleReport(item.id)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-gray-700 dark:text-white text-sm">{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setShowReportMenu(!showReportMenu)}
          className={cn(
            "h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95",
            showReportMenu ? "bg-gray-900 text-white rotate-45" : "bg-red-500 text-white"
          )}
        >
          {showReportMenu ? <MdAddCircle size={32} /> : <MdReport size={32} />}
        </button>
      </div>

      {/* Country Modal */}
      <AnimatePresence>
        {showCountryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <GlassCard className="max-w-sm w-full p-8 text-center bg-white dark:bg-zinc-900 border-red-500/20">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                <MdPublicOff className="text-4xl text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Limit Reached</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Inter-country routing is currently not supported for safety data accuracy. Please select a destination within the same country.
              </p>
              <button
                onClick={() => setShowCountryModal(false)}
                className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Understood
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
