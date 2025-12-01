import { useState, useEffect } from 'react'
import Map, { Marker, Source, Layer, NavigationControl, GeolocateControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapPage() {
  const [mode, setMode] = useState('walking')
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 13
  })
  const [startQuery, setStartQuery] = useState('')
  const [destQuery, setDestQuery] = useState('')
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null)
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null)

  // Changed to array of routes
  const [routes, setRoutes] = useState<any[]>([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)

  const [suggestions, setSuggestions] = useState<any[]>([])
  const [activeInput, setActiveInput] = useState<'start' | 'dest' | null>(null)
  const [loading, setLoading] = useState(false)

  const nav = useNavigate()
  const { user } = useAuth()

  // Persistence: Load state from localStorage on mount
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

  // Persistence: Save state when key data changes
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
            types: 'address,poi,place,locality,neighborhood',
            proximity: 'ip', // Bias to user's IP
            limit: 5
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
    // Extract country code from context (usually last item in context array)
    const countryContext = feature.context?.find((c: any) => c.id.startsWith('country'))
    const countryCode = countryContext ? countryContext.short_code : null

    if (activeInput === 'start') {
      setStartCoords(coords)
      setStartQuery(feature.place_name)
      setStartCountry(countryCode)
      setViewState(prev => ({ ...prev, longitude: coords[0], latitude: coords[1] }))
    } else {
      setDestCoords(coords)
      setDestQuery(feature.place_name)
      setDestCountry(countryCode)
    }
    setSuggestions([])
    setActiveInput(null)
  }

  const [showCountryModal, setShowCountryModal] = useState(false)

  const handlePlanRoute = async () => {
    if (!startCoords || !destCoords) return

    // Check for inter-country travel
    if (startCountry && destCountry && startCountry !== destCountry) {
      setShowCountryModal(true)
      return
    }

    setLoading(true)
    setRoutes([]) // Clear previous routes
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/route/options`, {
        start: startCoords,
        destination: destCoords,
        mode
      })
      // Backend now returns an array of routes
      setRoutes(res.data)
      setSelectedRouteIndex(0) // Default to first (safest)
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
      // Save to history
      await axios.post(`${import.meta.env.VITE_API_URL}/api/history/save`, {
        userId: user.uid,
        startLocation: startQuery,
        endLocation: destQuery,
        distance: selectedRoute.distance,
        duration: selectedRoute.duration,
        safetyScore: selectedRoute.score, // Ensure backend returns 'score'
        riskLevel: selectedRoute.riskLevel,
        date: new Date()
      })
      // Navigate to breakdown with specific route data
      nav('/route-breakdown', { state: { routeData: selectedRoute, startQuery, destQuery } })
    } catch (error) {
      console.error("Failed to start navigation", error)
      // Fallback navigation even if save fails
      nav('/route-breakdown', { state: { routeData: selectedRoute, startQuery, destQuery } })
    }
  }

  const [reports, setReports] = useState<any[]>([])
  const [showReportMenu, setShowReportMenu] = useState(false)

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports`)
        setReports(res.data)
      } catch (error) {
        console.error("Failed to fetch reports", error)
      }
    }
    fetchReports()
  }, [])

  const handleReport = async (type: string) => {
    if (!user) return
    try {
      // Use center of map for report location
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

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <Map
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <GeolocateControl position="top-right" />
          <NavigationControl position="top-right" />

          {startCoords && <Marker longitude={startCoords[0]} latitude={startCoords[1]} color="#00d35a" />}
          {destCoords && <Marker longitude={destCoords[0]} latitude={destCoords[1]} color="#ef4444" />}

          {/* Report Markers */}
          {reports.map(report => (
            <Marker
              key={report._id}
              longitude={report.location.coordinates[0]}
              latitude={report.location.coordinates[1]}
            >
              <div className="text-2xl" title={report.type}>
                {report.type === 'accident' ? '💥' :
                  report.type === 'police' ? '👮' :
                    report.type === 'hazard' ? '⚠️' : '📍'}
              </div>
            </Marker>
          ))}

          {/* Render Routes */}
          {routes.map((route, index) => {
            const isSelected = index === selectedRouteIndex
            // Color logic: Green for safest (index 0), Yellow for others, Red if score < 4
            let color = '#eab308' // Yellow default
            if (index === 0) color = '#00d35a' // Green for best
            if (route.score < 4) color = '#ef4444' // Red for dangerous

            return (
              <Source key={index} id={`route-${index}`} type="geojson" data={route.geojson}>
                <Layer
                  id={`route-layer-${index}`}
                  type="line"
                  paint={{
                    'line-color': color,
                    'line-width': isSelected ? 6 : 4,
                    'line-opacity': isSelected ? 1 : 0.4
                  }}
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round'
                  }}
                />
                {/* Invisible wide line for easier clicking */}
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

        {/* Crosshair for Reporting */}
        {showReportMenu && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="material-symbols-outlined text-4xl text-red-500 drop-shadow-lg">add_circle</span>
          </div>
        )}
      </div>

      {/* UI Overlay */}
      <div className="relative z-30 flex h-full grow flex-col pointer-events-none">
        {/* Top Nav Bar */}
        <header className="flex w-full items-start justify-between gap-4 p-4 md:p-6 pointer-events-auto">
          {/* Left Section: Search */}
          <div className="flex flex-1 flex-col items-start gap-3 max-w-md">
            <div className="w-full shadow-lg flex flex-col gap-2">
              {/* Start Input */}
              <div className="relative">
                <div className="flex w-full items-center rounded-2xl bg-green-900 backdrop-blur-sm ring-1 ring-white/10">
                  <div className="text-green-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">my_location</span>
                  </div>
                  <input
                    value={startQuery}
                    onChange={e => setStartQuery(e.target.value)}
                    onFocus={() => setActiveInput('start')}
                    className="flex w-full bg-transparent p-3 text-white placeholder:text-green-500/70 focus:outline-none"
                    placeholder="Enter start point..."
                  />
                </div>
                {activeInput === 'start' && suggestions.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-green-950 rounded-xl shadow-xl overflow-hidden z-50">
                    {suggestions.map(s => (
                      <button key={s.id} onClick={() => handleSelect(s)} className="w-full text-left p-3 hover:bg-green-900 text-white text-sm border-b border-white/5 last:border-0">
                        {s.place_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative">
                <div className="flex w-full items-center rounded-2xl bg-green-900 backdrop-blur-sm ring-1 ring-white/10">
                  <div className="text-green-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <input
                    value={destQuery}
                    onChange={e => setDestQuery(e.target.value)}
                    onFocus={() => setActiveInput('dest')}
                    className="flex w-full bg-transparent p-3 text-white placeholder:text-green-500/70 focus:outline-none"
                    placeholder="Enter destination..."
                  />
                </div>
                {activeInput === 'dest' && suggestions.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-green-950 rounded-xl shadow-xl overflow-hidden z-50">
                    {suggestions.map(s => (
                      <button key={s.id} onClick={() => handleSelect(s)} className="w-full text-left p-3 hover:bg-green-900 text-white text-sm border-b border-white/5 last:border-0">
                        {s.place_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handlePlanRoute}
                disabled={!startCoords || !destCoords || loading}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Planning...' : 'Plan Route'}
              </button>
            </div>
          </div>

          {/* Right Section: Mode Toggle */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex h-10 items-center justify-center rounded-3xl bg-green-900 p-1 backdrop-blur-sm shadow-lg ring-1 ring-white/10">
              {['walking', 'driving'].map(m => (
                <label key={m} className={`flex cursor-pointer h-full items-center justify-center gap-2 rounded-2xl px-3 text-white text-sm font-medium transition-colors ${mode === m ? "bg-green-700 text-green-500" : ""}`}>
                  <span className="material-symbols-outlined text-base">
                    {m === 'walking' ? 'directions_walk' : 'directions_car'}
                  </span>
                  <span className="capitalize hidden sm:inline">{m}</span>
                  <input type="radio" checked={mode === m} onChange={() => setMode(m)} className="hidden" />
                </label>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1"></div>

        {/* Report FAB */}
        <div className="absolute bottom-24 right-6 pointer-events-auto flex flex-col items-end gap-2">
          {showReportMenu && (
            <div className="flex flex-col gap-2 bg-green-900 p-2 rounded-2xl shadow-lg mb-2">
              <button onClick={() => handleReport('accident')} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl text-white">
                <span>💥</span> Accident
              </button>
              <button onClick={() => handleReport('police')} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl text-white">
                <span>👮</span> Police
              </button>
              <button onClick={() => handleReport('hazard')} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl text-white">
                <span>⚠️</span> Hazard
              </button>
            </div>
          )}
          <button
            onClick={() => setShowReportMenu(!showReportMenu)}
            className="h-14 w-14 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">report</span>
          </button>
        </div>

        {/* Floating Summary Card */}
        {routes.length > 0 && (
          <footer className="p-4 md:p-6 flex justify-center pointer-events-auto">
            <div className="w-full max-w-xl">
              <div className="flex flex-col items-stretch justify-start rounded-3xl bg-green-900 backdrop-blur-sm shadow-lg ring-1 ring-white/10 overflow-hidden md:flex-row md:items-start">
                <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-whitesmoke text-lg font-bold leading-tight tracking-[-0.015em]">
                      Route Options ({routes.length})
                    </p>
                    <div className="flex gap-1">
                      {routes.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedRouteIndex(i)}
                          className={`h-2 w-2 rounded-full ${i === selectedRouteIndex ? 'bg-white' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-white/70 text-sm font-normal leading-normal">
                        {routes[selectedRouteIndex].distance} • {routes[selectedRouteIndex].duration}
                      </p>
                      <p className="text-white/70 text-sm font-normal leading-normal">
                        Safety Score: <span className={`font-bold ${routes[selectedRouteIndex].score >= 7 ? 'text-green-400' : 'text-yellow-400'}`}>{routes[selectedRouteIndex].score}/10</span>
                      </p>
                    </div>
                    <button
                      onClick={handleStartNavigation}
                      className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-10 px-3 bg-green-700 text-green-500 text-sm font-bold transition-transform hover:scale-105"
                    >
                      <span className="truncate">Start Navigation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Country Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-green-950 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-500">public_off</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Travel Restricted</h3>
            <p className="text-green-500 mb-6">
              You cannot plan a route to a different country. Please select a destination within the same country.
            </p>
            <button
              onClick={() => setShowCountryModal(false)}
              className="w-full py-3 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
