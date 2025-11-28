import { NavLink } from 'react-router-dom'
import { HomeIcon, MapIcon, ShieldCheckIcon, BellAlertIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

const links = [
  { to: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
  { to: '/map', label: 'Plan Route', icon: <MapIcon className="w-5 h-5" /> },
  { to: '/tips', label: 'Safety Tips', icon: <ShieldCheckIcon className="w-5 h-5" /> },
  { to: '/history', label: 'History', icon: <UserIcon className="w-5 h-5" /> }, // Swapped Profile for History based on user feedback
  { to: '/emergency', label: 'Emergency', icon: <BellAlertIcon className="w-5 h-5" /> },
]

export default function Sidebar() {
  return (
    <aside className="w-72 bg-sr-darker border-r border-sr-muted/50 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-sr-green/20 blur-lg rounded-full"></div>
          <img src="/logo.svg" alt="Safe Route AI" className="w-10 h-10 relative z-10" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-white tracking-tight">Safe Route <span className="text-sr-green">AI</span></h1>
          <p className="text-xs text-sr-text-muted font-medium">Navigate with Confidence</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 py-4">
        <div className="text-xs font-semibold text-sr-text-muted uppercase tracking-wider px-4 mb-4">Menu</div>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-sr-green text-sr-darker font-bold shadow-[0_0_15px_rgba(0,211,90,0.3)]'
                : 'text-sr-text-muted hover:bg-sr-muted/50 hover:text-white'
              }
            `}
          >
            {l.icon}
            <span className="tracking-wide">{l.label}</span>
            {/* Active Indicator Dot */}
            <span className={`ml-auto w-1.5 h-1.5 rounded-full bg-sr-darker ${l.to === window.location.pathname ? 'opacity-100' : 'opacity-0'}`}></span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sr-muted/50">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sr-text-muted hover:bg-sr-muted/50 hover:text-white transition-colors">
          <Cog6ToothIcon className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <div className="mt-4 p-4 bg-sr-muted/30 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sr-green to-emerald-600 flex items-center justify-center text-sr-darker font-bold shadow-lg">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">John Doe</div>
            <div className="text-xs text-sr-text-muted truncate">Premium Member</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
