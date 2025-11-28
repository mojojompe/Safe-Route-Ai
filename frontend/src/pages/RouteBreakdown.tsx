import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheckIcon, ExclamationTriangleIcon, ClockIcon, ArrowLeftIcon, ShareIcon, MapIcon } from '@heroicons/react/24/outline'

export default function RouteBreakdown() {
  const { state } = useLocation()
  const nav = useNavigate()
  // Mock data if no state passed
  const route = state?.route || {
    id: 'mock-1',
    score: 8.5,
    color: 'green',
    duration: '15 min',
    distance: '1.2 km',
    segments: [
      { title: 'Main St', score: 9, reason: 'Well Lit, High Foot Traffic', color: '#00d35a' },
      { title: 'Park Ave', score: 7, reason: 'Moderate Lighting', color: '#eab308' },
      { title: 'Alley Shortcut', score: 4, reason: 'Isolated Area', color: '#ef4444' },
    ]
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <button onClick={() => nav(-1)} className="flex items-center gap-2 text-sr-text-muted hover:text-white mb-8 transition-colors group">
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Map
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Score Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative overflow-hidden rounded-3xl bg-sr-darker border border-sr-muted/50 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sr-green/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Route Safety Analysis</h1>
                <p className="text-sr-text-muted">AI-generated risk assessment for your journey.</p>
              </div>
              <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 ${route.color === 'green' ? 'border-sr-green text-sr-green' : route.color === 'yellow' ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'} bg-sr-darker shadow-lg`}>
                <span className="text-3xl font-bold">{route.score}</span>
                <span className="text-xs font-medium uppercase">Score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-sr-muted/30 border border-sr-muted/30 flex items-center gap-4">
                <ClockIcon className="w-8 h-8 text-sr-green" />
                <div>
                  <div className="text-xs text-sr-text-muted uppercase font-bold">Est. Time</div>
                  <div className="text-xl font-bold text-white">{route.duration}</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-sr-muted/30 border border-sr-muted/30 flex items-center gap-4">
                <MapIcon className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-xs text-sr-text-muted uppercase font-bold">Distance</div>
                  <div className="text-xl font-bold text-white">{route.distance}</div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-sr-green" />
              Segment Breakdown
            </h3>
            <div className="space-y-4">
              {route.segments.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-sr-muted/20 border border-sr-muted/30 hover:bg-sr-muted/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-12 rounded-full" style={{ backgroundColor: s.color }}></div>
                    <div>
                      <div className="font-bold text-white">{s.title}</div>
                      <div className="text-sm text-sr-text-muted">{s.reason}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-sr-darker border border-sr-muted/50">
            <h3 className="font-bold text-white mb-4">Actions</h3>
            <button className="w-full py-4 bg-sr-green hover:bg-sr-green-dim text-sr-darker font-bold rounded-xl mb-3 shadow-lg hover:shadow-sr-green/20 transition-all flex items-center justify-center gap-2">
              Start Navigation
            </button>
            <button className="w-full py-4 bg-sr-muted/30 hover:bg-sr-muted/50 text-white font-bold rounded-xl border border-sr-muted transition-all flex items-center justify-center gap-2">
              <ShareIcon className="w-5 h-5" />
              Share Route
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-3 mb-2 text-red-400">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <h3 className="font-bold">High Risk Alert</h3>
            </div>
            <p className="text-sm text-red-200/80 leading-relaxed mb-4">
              This route passes through an area with reported low lighting. Proceed with caution or choose an alternative.
            </p>
            <button className="text-sm font-bold text-red-400 hover:text-red-300 underline">
              View Safer Detour
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
