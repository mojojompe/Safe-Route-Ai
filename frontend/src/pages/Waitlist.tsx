import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { PageTransition } from '../components/ui/PageTransition'
import {
  MdShield,
  MdMap,
  MdSmartToy,
  MdSos,
  MdShareLocation,
  MdEmojiEvents,
  MdRocketLaunch,
  MdGpsFixed,
  MdCheckCircle,
  MdArrowBack,
} from 'react-icons/md'
import type { IconType } from 'react-icons'

interface Feature {
  Icon: IconType
  iconColor: string
  title: string
  desc: string
  color: string
  border: string
}

const APP_FEATURES: Feature[] = [
  {
    Icon: MdShield,
    iconColor: 'text-green-500',
    title: 'AI Safety Scoring',
    desc: 'Every route is scored in real-time using crime data, lighting, traffic, and community reports.',
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/20',
  },
  {
    Icon: MdMap,
    iconColor: 'text-yellow-500',
    title: 'Live Hazard Map',
    desc: 'See real-time accidents, potholes, floods, and community-reported danger zones on the map.',
    color: 'from-yellow-500/20 to-orange-500/10',
    border: 'border-yellow-500/20',
  },
  {
    Icon: MdSmartToy,
    iconColor: 'text-blue-500',
    title: 'Arlo AI Navigator',
    desc: 'Our built-in AI assistant answers your safety questions, plans routes, and gives live guidance.',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/20',
  },
  {
    Icon: MdSos,
    iconColor: 'text-red-500',
    title: 'Emergency SOS',
    desc: 'One tap sends your live location to your emergency contacts and local authorities instantly.',
    color: 'from-red-500/20 to-rose-500/10',
    border: 'border-red-500/20',
  },
  {
    Icon: MdShareLocation,
    iconColor: 'text-purple-500',
    title: 'Live Location Share',
    desc: 'Share your live journey with family in real-time so they always know where you are.',
    color: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/20',
  },
  {
    Icon: MdEmojiEvents,
    iconColor: 'text-teal-500',
    title: 'Safety Achievements',
    desc: 'Earn badges and rewards for safe navigation habits, community reports, and consistent safe travel.',
    color: 'from-teal-500/20 to-green-500/10',
    border: 'border-teal-500/20',
  },
]

export default function Waitlist() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError('Please fill in both fields.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return }
    setError('')
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/waitlist`, { name: name.trim(), email: email.trim().toLowerCase() })
      setShowSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="bg-white dark:bg-black min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Coming Soon to Play Store &amp; App Store
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Be the First to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400">
              Navigate Safely
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Safe Route AI is launching on mobile. Join our waitlist and get early access, exclusive updates, and a free premium month when we go live.
          </p>
        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Everything You Need, In One App
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {APP_FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className={`mb-4 ${f.iconColor}`}>
                <f.Icon size={36} />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WAITLIST FORM */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-green-500/5 text-center"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mx-auto mb-5">
              <MdRocketLaunch size={32} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-black mb-2">Join the Waitlist</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Drop your details below. We'll notify you the moment it drops — plus early-bird perks.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aisha Abike"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
              >
                <MdGpsFixed size={20} />
                {loading ? 'Joining...' : 'Secure My Spot'}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4">No spam, ever. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* BACK BUTTON */}
      <div className="text-center pb-12">
        <button
          onClick={() => nav('/')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors underline underline-offset-4"
        >
          <MdArrowBack size={16} /> Back to Home
        </button>
      </div>

      <Footer />

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            onClick={() => { setShowSuccess(false); nav('/') }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl border border-green-500/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <MdCheckCircle size={40} className="text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-black mb-2">You're on the list!</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Thanks, <strong className="text-gray-900 dark:text-white">{name}</strong>! We've sent a confirmation to <strong className="text-green-500">{email}</strong>. We'll reach out the moment the app launches. Stay safe!
              </p>
              <button
                onClick={() => { setShowSuccess(false); nav('/') }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <MdArrowBack size={18} /> Back to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
