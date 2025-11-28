import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const tips = [
  { title: 'Stay Aware', text: 'Pay attention to your surroundings and avoid distractions like your phone.', image: '/tip-1.png' },
  { title: 'Share Your Route', text: 'Let a friend or family member know your intended route and ETA.', image: '/tip-2.png' },
  { title: 'Wear Bright Clothing', text: 'Make yourself more visible to drivers, especially at night or in low light.', image: '/tip-3.png' },
  { title: 'Stick to Well-Lit Paths', text: 'When walking at night, choose routes that are well-illuminated and populated.', image: '/tip-4.png', tag: 'Contextual Tip' },
  { title: 'Use Crosswalks', text: 'Always cross streets at designated crosswalks or intersections for safety.', image: '/tip-5.png' },
  { title: 'Avoid Shortcuts', text: 'Unknown shortcuts can be poorly lit or isolated. Stick to familiar paths.', image: '/tip-6.png' },
]

export default function SafetyTips() {
  const [mode, setMode] = useState<'walking' | 'driving'>('walking')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Safety Tips</h1>
        <p className="text-slate-400">Your guide to safer journeys on foot and by car.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            placeholder="Search for a specific tip"
            className="w-full bg-sr-darker border border-sr-muted rounded-full py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-sr-green focus:ring-1 focus:ring-sr-green transition-all"
          />
        </div>

        <div className="flex p-1 bg-sr-darker border border-sr-muted rounded-full">
          <button
            onClick={() => setMode('walking')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'walking' ? 'bg-sr-green text-sr-darker' : 'text-slate-400 hover:text-white'}`}
          >
            Walking
          </button>
          <button
            onClick={() => setMode('driving')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'driving' ? 'bg-sr-green text-sr-darker' : 'text-slate-400 hover:text-white'}`}
          >
            Driving
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map(t => (
          <div key={t.title} className="bg-sr-darker border border-sr-muted rounded-2xl overflow-hidden hover:border-sr-green/50 transition-colors group">
            <div className="h-48 bg-sr-muted relative">
              {/* Placeholder for tip image */}
              <div className="absolute inset-0 bg-sr-green/5 flex items-center justify-center text-slate-600">Image Placeholder</div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-white mb-2">{t.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{t.text}</p>
              {t.tag && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-sr-green/10 text-sr-green text-xs font-medium border border-sr-green/20">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  {t.tag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
