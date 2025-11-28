import { useState } from 'react'
import MapView from '../components/Map'
import RouteCard from '../components/RouteCard'
import { getRouteOptions } from '../services/routeService'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

export default function MapPage() {
  const [q, setQ] = useState('')
  const [mode, setMode] = useState<'walking' | 'driving'>('walking')
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!q) return
    setLoading(true)
    try {
      const data = await getRouteOptions(q, mode)
      setRoutes(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-full flex flex-col md:flex-row overflow-hidden bg-sr-dark">
      {/* Sidebar / Overlay for Search & Routes */}
      <div className="w-full md:w-[450px] bg-sr-darker/95 backdrop-blur-xl border-r border-sr-muted/50 flex flex-col z-10 shadow-2xl">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Plan Your Route</h2>
            <button className="p-2 text-sr-text-muted hover:text-white bg-sr-muted/30 rounded-lg transition-colors">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sr-text-muted group-focus-within:text-sr-green transition-colors" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Where do you want to go?"
              className="w-full bg-sr-muted/30 border border-sr-muted/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-sr-text-muted focus:outline-none focus:border-sr-green focus:ring-1 focus:ring-sr-green transition-all shadow-inner"
            />
          </div>

          <div className="flex p-1.5 bg-sr-muted/30 rounded-2xl border border-sr-muted/30">
            <button
              onClick={() => setMode('walking')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'walking' ? 'bg-sr-green text-sr-darker shadow-lg' : 'text-sr-text-muted hover:text-white'}`}
            >
              Walking
            </button>
            <button
              onClick={() => setMode('driving')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'driving' ? 'bg-sr-green text-sr-darker shadow-lg' : 'text-sr-text-muted hover:text-white'}`}
            >
              Driving
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-4">
              <div className="w-8 h-8 border-4 border-sr-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sr-text-muted animate-pulse">Analyzing safety data...</p>
            </div>
          ) : routes.length > 0 ? (
            <>
              <div className="flex items-center justify-between text-xs font-medium text-sr-text-muted uppercase tracking-wider mb-2">
                <span>Suggested Routes</span>
                <span>{routes.length} Found</span>
              </div>
              {routes.map(r => <RouteCard key={r.id} route={r} />)}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-sr-muted/30 rounded-3xl">
              <div className="w-16 h-16 bg-sr-muted/20 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-sr-muted" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Routes Yet</h3>
              <p className="text-sr-text-muted text-sm">Enter a destination to see AI-analyzed safe routes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-sr-muted">
        <MapView routes={routes} />

        {/* Map Overlay Controls */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <button className="w-10 h-10 bg-sr-darker/90 backdrop-blur text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-sr-green hover:text-sr-darker transition-all">
            <span className="font-bold text-lg">+</span>
          </button>
          <button className="w-10 h-10 bg-sr-darker/90 backdrop-blur text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-sr-green hover:text-sr-darker transition-all">
            <span className="font-bold text-lg">-</span>
          </button>
        </div>
      </div>
    </div>
  )
}
