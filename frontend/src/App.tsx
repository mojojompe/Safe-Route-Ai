import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import { SafetyTipsLoader } from './components/ui/SafetyTipsLoader'

// Eagerly load the landing page for instant first render
import Welcome from './pages/Welcome'

// Lazy load all app pages
const MapPage = lazy(() => import('./pages/MapPage'))
const RouteBreakdown = lazy(() => import('./pages/RouteBreakdown'))
const SafetyTips = lazy(() => import('./pages/SafetyTips'))
const History = lazy(() => import('./pages/History'))
const Emergency = lazy(() => import('./pages/Emergency'))
const About = lazy(() => import('./pages/About'))
const Profile = lazy(() => import('./pages/Profile'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const Favorites = lazy(() => import('./pages/Favorites'))
const JourneyDetail = lazy(() => import('./pages/JourneyDetail'))
const HazardMap = lazy(() => import('./pages/HazardMap'))
const Achievements = lazy(() => import('./pages/Achievements'))
const ArloChat = lazy(() => import('./pages/ArloChat'))
const LiveShare = lazy(() => import('./pages/LiveShare'))
const Waitlist = lazy(() => import('./pages/Waitlist'))

// ── Layout shell ─────────────────────────────────────────────────────────────
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark text-gray-800 dark:text-white font-display">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

// ── Page transition wrapper ───────────────────────────────────────────────────
const PT = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.25 }}
    className="h-full"
  >
    {children}
  </motion.div>
)

// ── Suspense spinner ──────────────────────────────────────────────────────────
function PageLoader() {
  return <SafetyTipsLoader />
}

// ── Protected route: redirects to / if not authenticated ─────────────────────
// Shows a spinner while Firebase is still resolving auth state.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <SafetyTipsLoader fullScreen />
  }

  if (!user) return <Navigate to="/" replace />

  return <>{children}</>
}

// ── Welcome wrapper: shows landing page, redirects logged-in users ───────────
function WelcomeWrapper() {
  const { user, loading } = useAuth()
  // Show Welcome immediately; redirect once Firebase resolves
  if (!loading && user) return <Navigate to="/map" replace />
  return <PT><Welcome /></PT>
}

// ── Helper: wrap a lazy page in Layout + ProtectedRoute + Suspense ───────────
function P({ page }: { page: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <PT>{page}</PT>
        </Suspense>
      </Layout>
    </ProtectedRoute>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<WelcomeWrapper />} />
          <Route path="/waitlist" element={<Suspense fallback={<PageLoader />}><PT><Waitlist /></PT></Suspense>} />

          {/* Protected — every route below requires a signed-in user */}
          <Route path="/map" element={<P page={<MapPage />} />} />
          <Route path="/route-breakdown" element={<P page={<RouteBreakdown />} />} />
          <Route path="/history" element={<P page={<History />} />} />
          <Route path="/history/:id" element={<P page={<JourneyDetail />} />} />
          <Route path="/analytics" element={<P page={<Analytics />} />} />
          <Route path="/arlo" element={<P page={<ArloChat />} />} />
          <Route path="/live-share" element={<P page={<LiveShare />} />} />
          <Route path="/favorites" element={<P page={<Favorites />} />} />
          <Route path="/hazard-map" element={<P page={<HazardMap />} />} />
          <Route path="/achievements" element={<P page={<Achievements />} />} />
          <Route path="/safety-tips" element={<P page={<SafetyTips />} />} />
          <Route path="/emergency" element={<P page={<Emergency />} />} />
          <Route path="/profile" element={<P page={<Profile />} />} />
          <Route path="/settings" element={<P page={<Settings />} />} />
          <Route path="/about" element={<P page={<About />} />} />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  )
}
