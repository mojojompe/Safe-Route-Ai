import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TIPS = [
  "Routing your safest path...",
  "Checking live hazard reports near you...",
  "Did you know? Well-lit streets reduce crime risk by 21%...",
  "Analysing traffic and road conditions...",
  "Arlo AI is scanning your route segments...",
  "Mapping community safety reports...",
  "Calculating your safety score...",
  "Almost ready — stay safe out there!",
]

interface Props {
  fullScreen?: boolean
}

export function SafetyTipsLoader({ fullScreen = false }: Props) {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const containerClass = fullScreen
    ? "fixed inset-0 z-[999] flex items-center justify-center bg-background-light dark:bg-background-dark"
    : "flex items-center justify-center h-full w-full min-h-[60vh]"

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-6 px-8 max-w-sm text-center">

        {/* Animated shield pulse */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute w-full h-full rounded-full bg-green-500/20 animate-ping" />
          <div className="absolute w-10 h-10 rounded-full bg-green-500/30 animate-pulse" />
          <div className="relative w-6 h-6 rounded-full bg-green-500" />
        </div>

        {/* Rotating tip */}
        <div className="h-10 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
