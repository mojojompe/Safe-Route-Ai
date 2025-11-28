
import { useNavigate } from 'react-router-dom'
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const nav = useNavigate()
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-sr-muted/50 bg-sr-dark/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4 md:hidden">
        <button className="p-2 text-sr-text hover:text-white" onClick={() => nav('/')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="text-xl font-bold text-white">Safe Route AI</div>
      </div>

      {/* Global Search (Desktop) */}
      <div className="hidden md:flex items-center relative w-96">
        <MagnifyingGlassIcon className="absolute left-4 w-5 h-5 text-sr-text-muted" />
        <input
          type="text"
          placeholder="Search routes, locations, or tips..."
          className="w-full bg-sr-muted/30 border border-sr-muted/50 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder-sr-text-muted focus:outline-none focus:border-sr-green/50 focus:ring-1 focus:ring-sr-green/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-full bg-sr-muted/30 text-sr-text-muted hover:bg-sr-green hover:text-sr-darker transition-all duration-300 group">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-sr-darker group-hover:border-sr-green"></span>
        </button>
        <button className="hidden md:block px-5 py-2.5 rounded-full bg-sr-green text-sr-darker font-bold text-sm hover:shadow-[0_0_15px_rgba(0,211,90,0.4)] transition-all transform hover:-translate-y-0.5">
          Go Premium
        </button>
      </div>
    </header>
  )
}
