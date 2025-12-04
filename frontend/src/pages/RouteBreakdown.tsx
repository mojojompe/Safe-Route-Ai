import { useState, useEffect, useRef } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useLocation, Navigate } from 'react-router-dom'
import { MdTurnLeft, MdTurnRight, MdArrowUpward, MdClose, MdArrowForward } from 'react-icons/md'


const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function RouteBreakdown() {
  const [view, setView] = useState('segments')
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Modal State
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const location = useLocation()
  const { routeData, startQuery, destQuery } = location.state || {}
  const mapRef = useRef<any>(null)

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
        // Move marker to next step location (simplified simulation)
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
    }, 4000) // Change step every 4 seconds for demo

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
      'line-width': 5,
      'line-opacity': 0.8
    }
  }

  const currentStep = routeData.steps ? routeData.steps[currentStepIndex] : null

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-green-950 overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
            <main className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* Left Column: Route Segments */}
              <div className="w-full lg:w-2/5 flex flex-col gap-6">
                {/* PageHeading */}
                <div className="flex flex-wrap justify-between gap-3 px-4">
                  <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                      {isNavigating ? "Live Navigation" : "Route Analysis"}
                    </p>
                    <p className="text-gray-600 dark:text-[#9db9a6] text-base font-normal leading-normal">
                      {startQuery} to {destQuery}
                    </p>
                  </div>
                </div>

                {/* Live Instruction Card */}
                {isNavigating && currentStep && (
                  <div className="mx-4 p-6 bg-green-600 rounded-2xl shadow-lg text-white animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {currentStep.maneuver.type === 'turn' ?
                          (currentStep.maneuver.modifier?.includes('left') ? <MdTurnLeft /> : <MdTurnRight />) :
                          <MdArrowUpward />}
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{currentStep.maneuver.instruction}</p>
                        <p className="text-sm opacity-80">{Math.round(currentStep.distance)} meters</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                {!isNavigating && (
                  <div className="flex flex-wrap gap-4 px-4">
                    <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-black/10 dark:border-[#3b5443] bg-white dark:bg-[#111813]">
                      <p className="text-gray-800 dark:text-white text-base font-medium leading-normal">
                        Overall Risk
                      </p>
                      <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                        {routeData.riskLevel}
                      </p>
                    </div>
                    <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-black/10 dark:border-[#3b5443] bg-white dark:bg-[#111813]">
                      <p className="text-gray-800 dark:text-white text-base font-medium leading-normal">
                        Distance
                      </p>
                      <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                        {routeData.distance}
                      </p>
                    </div>
                    <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-black/10 dark:border-[#3b5443] bg-white dark:bg-[#111813]">
                      <p className="text-gray-800 dark:text-white text-base font-medium leading-normal">
                        Est. Time
                      </p>
                      <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                        {routeData.duration}
                      </p>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="px-4">
                  {!isNavigating ? (
                    <button
                      onClick={() => setIsNavigating(true)}
                      className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-lg shadow-lg transition-transform hover:scale-105"
                    >
                      Start Live Navigation
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsNavigating(false)}
                      className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-lg shadow-lg transition-transform hover:scale-105"
                    >
                      Stop Navigation
                    </button>
                  )}
                </div>

                {/* SegmentedButtons */}
                {!isNavigating && (
                  <div className="flex px-4 py-3">
                    <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-black/5 dark:bg-[#28392e] p-1">
                      <label
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${view === "segments"
                          ? "bg-white dark:bg-[#111813] shadow-sm text-black dark:text-white"
                          : "text-gray-600 dark:text-[#9db9a6]"
                        }`}
                      >
                        <span className="truncate">Route Segments</span>
                        <input
                          checked={view === "segments"}
                          onChange={() => setView("segments")}
                          className="invisible w-0"
                          name="view-toggle"
                          type="radio"
                          value="Route Segments"
                        />
                      </label>
                      <label
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${view === "turn-by-turn"
                          ? "bg-white dark:bg-[#111813] shadow-sm text-black dark:text-white"
                          : "text-gray-600 dark:text-[#9db9a6]"
                          }`}
                      >
                        <span className="truncate">Turn-by-turn</span>
                        <input
                          checked={view === "turn-by-turn"}
                          onChange={() => setView("turn-by-turn")}
                          className="invisible w-0"
                          name="view-toggle"
                          type="radio"
                          value="Turn-by-turn"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Lists */}
                <div className="flex flex-col gap-4 px-4 overflow-y-auto max-h-[60vh]">
                  {view === 'segments' && !isNavigating ? (
                    routeData.segments?.map((segment: any, i: number) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedSegment(segment)
                          setSelectedSegmentIndex(i)
                          setIsModalOpen(true)
                        }}
                        className="flex w-full overflow rounded-xl border border-black/10 dark:border-white/20 bg-white dark:bg-[#111813] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a241d] transition-colors"
                      >
                        <div className="w-2" style={{ backgroundColor: segment.color }}></div>
                        <div className="flex flex-col gap-4 p-5 w-full">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Segment {i + 1}
                              </p>
                              <h3 className="text-lg font-bold text-black dark:text-white">
                                {segment.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold" style={{ backgroundColor: `${segment.color}20`, color: segment.color }}>
                              <span>{segment.score}/10</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                              {segment.reason}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    !isNavigating && (
                      <div className="flex flex-col gap-2">
                        {routeData.steps?.map((step: any, i: number) => (
                          <div key={i} className="p-4 bg-white dark:bg-[#111813] rounded-xl border border-white/10 flex gap-3">
                            <span className="font-bold text-green-500">{i + 1}.</span>
                            <p className="text-sm text-gray-300">{step.maneuver.instruction}</p>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Segment Modal */}
              {isModalOpen && selectedSegment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                  <div className="bg-white dark:bg-[#111813] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/10 relative">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                    >
                      <MdClose />
                    </button>

                    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-12 rounded-full" style={{ backgroundColor: selectedSegment.color }}></div>
                        <div>
                          </div>
                      </div>

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 dark:bg-[#1a241d] rounded-xl border border-black/5 dark:border-white/5">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Safety Score</p>
                          <p className="text-xl font-bold" style={{ color: selectedSegment.color }}>{selectedSegment.score}/10</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-[#1a241d] rounded-xl border border-black/5 dark:border-white/5">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Est. Time</p>
                          <p className="text-xl font-bold text-black dark:text-white">{selectedSegment.time || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Range */}
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1a241d] border border-black/5 dark:border-white/5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Range</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                          {selectedSegment.range || 'Range details unavailable'}
                        </p>
                      </div>

                      {/* Tips & Risks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2">Safety Tips</p>
                          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            {selectedSegment.tips?.map((tip: string, i: number) => (
                              <li key={i}>{tip}</li>
                            )) || <li>No specific tips available.</li>}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2">Risk Factors</p>
                          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            {selectedSegment.risks?.map((risk: string, i: number) => (
                              <li key={i}>{risk}</li>
                            )) || <li>No specific risks identified.</li>}
                          </ul>
                        </div>
                      </div>

                      {/* Landmarks & Junctions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2">Landmarks</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSegment.landmarks?.map((lm: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium">
                                {lm}
                              </span>
                            )) || <span className="text-sm text-gray-500">None nearby</span>}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2">Key Junctions</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSegment.junctions?.map((j: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-md font-medium">
                                {j}
                              </span>
                            )) || <span className="text-sm text-gray-500">None</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/10">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#28392e] hover:bg-gray-200 dark:hover:bg-[#3b5443] transition-colors"
                        >
                          Close
                        </button>
                        {routeData.segments && selectedSegmentIndex < routeData.segments.length - 1 && (
                          <button
                            onClick={() => {
                              const nextIndex = selectedSegmentIndex + 1
                              setSelectedSegment(routeData.segments[nextIndex])
                              setSelectedSegmentIndex(nextIndex)
                            }}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                          >
                            Next Segment <MdArrowForward className="text-sm" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column: Map */}
              <div className="w-full lg:w-3/5 flex flex-col min-h-[400px] lg:min-h-0">
                <div className="flex p-4 h-full">
                  <div className="w-full h-full bg-center bg-no-repeat bg-cover rounded-3xl object-cover border border-black/10 dark:border-white/20 overflow-hidden relative">
                    <Map
                      ref={mapRef}
                      initialViewState={{
                        longitude: routeData.geojson.geometry.coordinates[0][0],
                        latitude: routeData.geojson.geometry.coordinates[0][1],
                        zoom: 13
                      }}
                      style={{ width: '100%', height: '100%' }}
                      mapStyle="mapbox://styles/mapbox/dark-v11"
                      mapboxAccessToken={MAPBOX_TOKEN}
                    >
                      <Source id="route" type="geojson" data={routeData.geojson}>
                        <Layer {...routeLayer} />
                      </Source>

                      {/* Start/End Markers */}
                      <Marker longitude={routeData.geojson.geometry.coordinates[0][0]} latitude={routeData.geojson.geometry.coordinates[0][1]} color="#00d35a" />
                      <Marker longitude={routeData.geojson.geometry.coordinates[routeData.geojson.geometry.coordinates.length - 1][0]} latitude={routeData.geojson.geometry.coordinates[routeData.geojson.geometry.coordinates.length - 1][1]} color="#ef4444" />

                      {/* User Location Marker (Navigation) */}
                      {userLocation && (
                        <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
                          <div className="h-6 w-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        </Marker>
                      )}
                    </Map>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
