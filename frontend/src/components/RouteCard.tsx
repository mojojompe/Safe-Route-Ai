import { Link } from 'react-router-dom'
import { ChevronRightIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function RouteCard({ route }: any) {
  const isSafe = route.score >= 7
  const isRisky = route.score <= 4

  return (
    <Link to={`/route/${route.id}`} state={{ route }} className="block bg-sr-darker p-4 rounded-xl border border-sr-muted hover:border-sr-green/50 transition-colors group">
      <div className="flex items-center gap-4">
        {/* Placeholder for map thumbnail or icon */}
        <div className="w-20 h-20 bg-sr-muted rounded-lg flex-shrink-0 overflow-hidden relative">
          <div className={`absolute inset-0 opacity-20 ${isSafe ? 'bg-sr-green' : 'bg-red-500'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-slate-400">Map</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white truncate">Route {route.id}</h3>
          <div className="text-sm text-slate-400 mb-2">{route.eta} • {route.distance}</div>

          {isSafe ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sr-green/10 text-sr-green text-xs font-medium border border-sr-green/20">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              Safest Route Chosen
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">
              <ExclamationTriangleIcon className="w-3.5 h-3.5" />
              {isRisky ? 'High Incident Zone' : 'Moderate Risk'}
            </div>
          )}
        </div>

        <ChevronRightIcon className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
      </div>
    </Link>
  )
}
