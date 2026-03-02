import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'

// Eagerly load the landing page for instant first render
import Welcome from './pages/Welcome'

// Lazy load all app pages — their JS only downloads when the user navigates there.
// This prevents pulling the heavy Mapbox GL bundle on the landing page.
const MapPage = lazy(() => import('./pages/MapPage'))
const RouteBreakdown = lazy(() => import('./pages/RouteBreakdown'))
const SafetyTips = lazy(() => import('./pages/SafetyTips'))
const History = lazy(() => import('./pages/History'))
const Emergency = lazy(() => import('./pages/Emergency'))
const About = lazy(() => import('./pages/About'))

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

// Minimal skeleton shown while a lazy page chunk is loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
    </div>
  )
}

// Wrapper to redirect if logged in
function WelcomeWrapper() {
  const { user, loading } = useAuth()
  if (loading) return null
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
          <Route path="/map" element={<Layout><Suspense fallback={<PageLoader />}><PageTransition><MapPage /></PageTransition></Suspense></Layout>} />
          <Route path="/route-breakdown" element={<Layout><Suspense fallback={<PageLoader />}><PageTransition><RouteBreakdown /></PageTransition></Suspense></Layout>} />
          <Route path="/history" element={<Layout><Suspense fallback={<PageLoader />}><PageTransition><History /></PageTransition></Suspense></Layout>} />
          <Route path="/about" element={<Layout><Suspense fallback={<PageLoader />}><PageTransition><About /></PageTransition></Suspense></Layout>} />
          <Route path="/safety-tips" element={<Layout><Suspense fallback={<PageLoader />}><PageTransition><SafetyTips /></PageTransition></Suspense></Layout>} />
          <Route path="/emergency" element={<Layout><Suspense fallback={<PageLoader />}><PageTransition><Emergency /></PageTransition></Suspense></Layout>} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  )
}
