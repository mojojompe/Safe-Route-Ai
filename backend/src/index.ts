import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { createServer } from 'http'
import { Server } from 'socket.io'

dotenv.config()

import routeRouter from './routes/routes.js'
import historyRouter from './routes/history.js'
import placesRouter from './routes/places.js'
import statsRouter from './routes/stats.js'
import preferencesRouter from './routes/preferences.js'
import favoritesRouter from './routes/favorites.js'
import journeysRouter from './routes/journeys.js'
import authRouter from './routes/auth.js'
import reportRouter from './routes/reports.js'
import chatRouter from './routes/chat.js'
import waitlistRouter from './routes/waitlist.js'
import { startScheduler } from './services/scheduler.js'

const app = express()

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions)) // Handle preflight — Express 5 requires regex not '*'
app.use(express.json())

// ── REST routes ──────────────────────────────────────────────────────────────
app.use('/api/route', routeRouter)
app.use('/api/history', historyRouter)
app.use('/api/auth', authRouter)
app.use('/api/reports', reportRouter)
app.use('/api/places', placesRouter)
app.use('/api/stats', statsRouter)
app.use('/api/preferences', preferencesRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/journeys', journeysRouter)
app.use('/api/chat', chatRouter)
app.use('/api/waitlist', waitlistRouter)

// ── Socket.io — Live Route Sharing ───────────────────────────────────────────
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

// Active sessions: sessionCode → Set of socket IDs
const sessions = new Map<string, Set<string>>()
// Latest location per socket
const locations = new Map<string, { lat: number; lng: number; userId: string; name: string; timestamp: number }>()

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  // Join or create a sharing session
  socket.on('join-session', ({ sessionCode, userId, name }: { sessionCode: string; userId: string; name: string }) => {
    socket.join(sessionCode)
    if (!sessions.has(sessionCode)) sessions.set(sessionCode, new Set())
    sessions.get(sessionCode)!.add(socket.id)
    locations.set(socket.id, { lat: 0, lng: 0, userId, name, timestamp: Date.now() })

    // Send all current participants' locations to the newcomer
    const currentLocations: any[] = []
    sessions.get(sessionCode)!.forEach(sid => {
      if (sid !== socket.id && locations.has(sid)) {
        currentLocations.push({ socketId: sid, ...locations.get(sid) })
      }
    })
    socket.emit('session-state', currentLocations)

    // Tell everyone else a new person joined
    socket.to(sessionCode).emit('user-joined', { socketId: socket.id, userId, name })
    console.log(`${name} joined session ${sessionCode}`)
  })

  // Receive a location update and broadcast to session
  socket.on('location-update', ({ sessionCode, lat, lng }: { sessionCode: string; lat: number; lng: number }) => {
    const loc = locations.get(socket.id)
    if (!loc) return
    loc.lat = lat; loc.lng = lng; loc.timestamp = Date.now()
    socket.to(sessionCode).emit('location-update', { socketId: socket.id, ...loc })
  })

  // Leave session
  socket.on('leave-session', ({ sessionCode }: { sessionCode: string }) => {
    sessions.get(sessionCode)?.delete(socket.id)
    locations.delete(socket.id)
    socket.to(sessionCode).emit('user-left', { socketId: socket.id })
    socket.leave(sessionCode)
  })

  socket.on('disconnect', () => {
    // Clean up from all sessions
    sessions.forEach((members, code) => {
      if (members.has(socket.id)) {
        members.delete(socket.id)
        locations.delete(socket.id)
        io.to(code).emit('user-left', { socketId: socket.id })
      }
    })
    console.log('Socket disconnected:', socket.id)
  })
})

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI!, {})
  .then(() => {
    console.log('Connected to MongoDB')
    // node-cron requires a persistent process — skip on Vercel serverless
    if (!process.env.VERCEL) {
      startScheduler()
    } else {
      console.log('Vercel environment detected — scheduler disabled')
    }
  })
  .catch(err => console.error('Mongo error', err))

httpServer.listen(PORT, () => console.log(`API + Socket.io running on ${PORT}`))
