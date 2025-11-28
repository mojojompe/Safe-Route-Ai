import { useState } from 'react'
import { MagnifyingGlassIcon, ChevronRightIcon, ShieldCheckIcon, ExclamationTriangleIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function History() {
  const [filter, setFilter] = useState('All')

  // Mock History Data
  const history = [
    { id: 1, to: 'Central Station', date: 'Today, 8:30 AM', duration: '12 min', score: 9.2, mode: 'Walking', tags: ['Safest'] },
    { id: 2, to: 'City Library', date: 'Yesterday, 6:15 PM', duration: '24 min', score: 6.5, mode: 'Walking', tags: ['Moderate Risk'] },
    { id: 3, to: 'Gym', date: 'Nov 24, 5:00 PM', duration: '8 min', score: 9.8, mode: 'Driving', tags: ['Fastest'] },
    { id: 4, to: 'Coffee Shop', date: 'Nov 22, 10:00 AM', duration: '15 min', score: 8.0, mode: 'Walking', tags: [] },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Journeys</h1>
          <p className="text-sr-text-muted">Review your past routes and safety reports.</p>
        </div>

        <div className="relative w-full md:w-80">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sr-text-muted" />
          <input
            placeholder="Search history..."
            className="w-full bg-sr-darker border border-sr-muted rounded-full py-3 pl-12 pr-4 text-white placeholder-sr-text-muted focus:outline-none focus:border-sr-green focus:ring-1 focus:ring-sr-green transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
        {['All', 'Walking', 'Driving', 'Safest', 'Riskiest'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filter === f
                ? 'bg-sr-green text-sr-darker border-sr-green shadow-[0_0_15px_rgba(0,211,90,0.3)]'
                : 'bg-sr-darker border-sr-muted text-sr-text-muted hover:text-white hover:border-sr-green/50'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {history.map(item => (
          <div key={item.id} className="group relative overflow-hidden bg-sr-darker border border-sr-muted/50 rounded-2xl p-6 hover:border-sr-green/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-sr-green/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.score >= 8 ? 'bg-sr-green/10 text-sr-green' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {item.score >= 8 ? <ShieldCheckIcon className="w-6 h-6" /> : <ExclamationTriangleIcon className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.to}</h3>
                  <div className="flex items-center gap-3 text-sm text-sr-text-muted">
                    <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {item.date}</span>
                    <span className="w-1 h-1 rounded-full bg-sr-muted"></span>
                    <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {item.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  {item.tags.map(t => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-sr-muted/30 border border-sr-muted/50 text-xs font-medium text-sr-text-muted">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="text-right hidden md:block">
                  <div className={`text-2xl font-bold ${item.score >= 8 ? 'text-sr-green' : 'text-yellow-500'}`}>{item.score}</div>
                  <div className="text-[10px] uppercase font-bold text-sr-text-muted">Safety Score</div>
                </div>

                <button className="p-2 rounded-full bg-sr-muted/20 text-sr-text-muted group-hover:bg-sr-green group-hover:text-sr-darker transition-all">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
