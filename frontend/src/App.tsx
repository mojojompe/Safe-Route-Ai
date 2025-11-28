
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Welcome from './pages/Welcome'
import MapPage from './pages/MapPage'
import RouteBreakdown from './pages/RouteBreakdown'
import SafetyTips from './pages/SafetyTips'
import History from './pages/History'
import Resources from './pages/Resources'
import Emergency from './pages/Emergency'
import About from './pages/About'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen flex bg-sr-dark text-sr-text">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/route/:id" element={<RouteBreakdown />} />
            <Route path="/tips" element={<SafetyTips />} />
            <Route path="/history" element={<History />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
