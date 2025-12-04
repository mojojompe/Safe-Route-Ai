import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdChevronRight, MdRefresh } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface RouteItem {
  _id: string
  startLocation: string
  endLocation: string
  distance: string
  duration: string
  safetyScore: number
  riskLevel: 'Low' | 'Moderate' | 'High'
  date: string
}

export default function History() {
  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [replayingId, setReplayingId] = useState<string | null>(null)

  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/history`, {
          params: { userId: user.uid }
        })
        setRoutes(res.data)
      } catch (error) {
        console.error('Failed to fetch history', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user])

  const handleReplay = async (route: RouteItem) => {
    if (replayingId) return
    setReplayingId(route._id)
    try {
      // 1. Geocode Start
      const startRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(route.startLocation)}.json`, {
        params: { access_token: MAPBOX_TOKEN, limit: 1 }
      })
      const startCoords = startRes.data.features[0]?.center

      // 2. Geocode End
      const endRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(route.endLocation)}.json`, {
        params: { access_token: MAPBOX_TOKEN, limit: 1 }
      })
      const destCoords = endRes.data.features[0]?.center

      if (!startCoords || !destCoords) {
        alert('Could not find locations for this route.')
        return
      }

      // 3. Fetch Route Options
      const routeRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/route/options`, {
        start: startCoords,
        destination: destCoords,
        mode: 'driving' // Default to driving or infer?
      })

      // 4. Navigate to Breakdown (using the first/best route)
      const bestRoute = routeRes.data[0]
      nav('/route-breakdown', {
        state: {
          routeData: bestRoute,
          startQuery: route.startLocation,
          destQuery: route.endLocation
        }
      })

    } catch (error) {
      console.error("Replay failed", error)
      alert('Failed to replay route. Please try again.')
    } finally {
      setReplayingId(null)
    }
  }

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.endLocation.toLowerCase().includes(search.toLowerCase()) ||
      route.startLocation.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || route.riskLevel === filter
    return matchesSearch && matchesFilter
  })

  return (

    <div className="relative flex h-auto min-h-screen w-full flex-col bg-sr-dark font-display text-gray-200">
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Route History
              </h1>
              <p className="text-gray-400 text-base font-normal leading-normal">
                Review your past journeys and safety reports.
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full sm:w-auto sm:max-w-xs">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-4xl h-full bg-white/5">
                  <div className="text-gray-400 flex items-center justify-center pl-4">
                    <MdSearch className="text-2xl" />
                  </div>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-400 pl-2 text-base font-normal leading-normal"
                    placeholder="Search routes..."
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-2">
              {["All", "Low", "Moderate", "High"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-4xl text-sm font-bold transition-colors ${filter === f
                    ? "bg-green-900 text-green-500"
                    : "bg-primary text-sr-dark hover:bg-white/10"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <p className="text-center text-gray-500 animate-pulse">
                Loading history...
              </p>
            ) : filteredRoutes.length === 0 ? (
              <p className="text-center text-gray-500">No routes found.</p>
            ) : (
              filteredRoutes.map((route) => (
                <div
                  key={route._id}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-4xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {route.startLocation} to {route.endLocation}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${route.riskLevel === "Low"
                          ? "bg-green-500/20 text-green-500"
                          : route.riskLevel === "Moderate"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                          }`}
                      >
                        {route.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(route.date).toLocaleDateString()} •{" "}
                      {route.distance} • {route.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Safety Score
                      </p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">
                        {route.safetyScore}/10
                      </p>
                    </div>
                    <button
                      onClick={() => handleReplay(route)}
                      disabled={replayingId === route._id}
                      className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                    >
                      <span className={`text-2xl ${replayingId === route._id ? 'animate-spin' : ''}`}>
                        {replayingId === route._id ? <MdRefresh /> : <MdChevronRight />}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
