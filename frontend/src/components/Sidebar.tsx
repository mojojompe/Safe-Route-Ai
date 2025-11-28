import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="flex w-64 flex-col bg-background-light dark:bg-[#102216] p-4 border-r border-black/10 dark:border-white/10 h-screen sticky top-0">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbpePpAYs3whPbw9byr0pPQSdecansQBiswcwF1tbYt3QT-9fLJUdD_dGvJAsGOpugLc231FTJyko5EFZDLRvFo5y8t6vlwsrGmnTksC7qwtGfVaiycqWeO7fJJrsNZ5aVUu05qbumVC9BIim9YnjP8KIc84mAmmqYG49blACV1m0oVsl0dl8NfCFnjxVkq9fDaLJ1fJLIlO3_4M35k54jTXsnnSZv8UGd-ndJ-Nf8TjYpWfA_rutxHPgk7KdCySLjAKYbCn-ahCwo")' }}></div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Alex Chen</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Safe Route AI Member</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 mt-4">
          <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/') ? 'bg-primary/20 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined ${isActive('/') ? 'fill' : ''}`}>home</span>
            <p className="text-sm font-medium leading-normal">Home</p>
          </Link>
          <Link to="/map" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/map') ? 'bg-primary/20 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined ${isActive('/map') ? 'fill' : ''}`}>map</span>
            <p className="text-sm font-medium leading-normal">Plan Route</p>
          </Link>
          <Link to="/safety-tips" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/safety-tips') ? 'bg-primary/20 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined ${isActive('/safety-tips') ? 'fill' : ''}`}>shield</span>
            <p className="text-sm font-medium leading-normal">Safety Tips</p>
          </Link>
          <Link to="/history" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/history') ? 'bg-primary/20 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined ${isActive('/history') ? 'fill' : ''}`}>history</span>
            <p className="text-sm font-medium leading-normal">History</p>
          </Link>
          <Link to="/emergency" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/emergency') ? 'bg-primary/20 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined ${isActive('/emergency') ? 'fill' : ''}`}>emergency_home</span>
            <p className="text-sm font-medium leading-normal">Emergency</p>
          </Link>
          <Link to="/about" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/about') ? 'bg-primary/20 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined ${isActive('/about') ? 'fill' : ''}`}>info</span>
            <p className="text-sm font-medium leading-normal">About</p>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
