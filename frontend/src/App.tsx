import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'

import Welcome from './pages/Welcome'
import MapPage from './pages/MapPage'
import RouteBreakdown from './pages/RouteBreakdown'
import SafetyTips from './pages/SafetyTips'
import History from './pages/History'
import Emergency from './pages/Emergency'
import About from './pages/About'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark text-gray-800 dark:text-white font-display">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    {children}
  </motion.div>
)

// Wrapper to redirect if logged in
function WelcomeWrapper() {
  const { user, loading } = useAuth()
  if (loading) return null // Or a loader
  if (user) return <Navigate to="/map" replace />
  return <PageTransition><Welcome /></PageTransition>
}

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<WelcomeWrapper />} />
          <Route path="/map" element={<Layout><PageTransition><MapPage /></PageTransition></Layout>} />
          <Route path="/route-breakdown" element={<Layout><PageTransition><RouteBreakdown /></PageTransition></Layout>} />
          <Route path="/history" element={<Layout><PageTransition><History /></PageTransition></Layout>} />
          <Route path="/about" element={<Layout><PageTransition><About /></PageTransition></Layout>} />
          <Route path="/safety-tips" element={<Layout><PageTransition><SafetyTips /></PageTransition></Layout>} />
          <Route path="/emergency" element={<Layout><PageTransition><Emergency /></PageTransition></Layout>} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  )
}
