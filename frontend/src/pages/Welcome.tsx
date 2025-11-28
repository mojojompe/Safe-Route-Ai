import { useNavigate } from 'react-router-dom'
import { ShieldCheckIcon, MapIcon, BellAlertIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Welcome() {
  const nav = useNavigate()
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center py-20 px-6 overflow-hidden bg-sr-dark">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sr-green/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sr-muted/50 border border-sr-green/20 text-sr-green text-sm font-medium mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sr-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sr-green"></span>
          </span>
          AI-Powered Safety Navigation
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-8 leading-tight">
          Navigate with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sr-green to-emerald-400">Confidence</span>
        </h1>

        <p className="text-xl text-sr-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
          Advanced AI analysis of real-time data to guide you through the safest paths. Avoid hazards, stay informed, and reach your destination securely.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => nav('/map')}
            className="px-10 py-4 bg-sr-green hover:bg-sr-green-dim text-sr-darker font-bold text-lg rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,211,90,0.4)] flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <button className="px-10 py-4 bg-sr-muted/30 hover:bg-sr-muted/50 text-white font-bold text-lg rounded-full transition-all border border-sr-muted backdrop-blur-sm">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { icon: ShieldCheckIcon, title: 'Enhanced Safety', desc: 'Real-time risk assessment avoiding high-crime zones.' },
            { icon: MapIcon, title: 'Smart Navigation', desc: 'Optimized routes balancing speed and safety.' },
            { icon: BellAlertIcon, title: 'Instant Alerts', desc: 'Live notifications about potential hazards ahead.' },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-sr-darker/80 backdrop-blur-md border border-sr-muted/50 rounded-3xl hover:border-sr-green/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-sr-muted/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sr-green/20 transition-colors">
                <item.icon className="w-7 h-7 text-sr-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sr-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
