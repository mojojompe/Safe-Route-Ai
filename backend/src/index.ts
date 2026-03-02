import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routeRouter from './routes/routes.js'
import historyRouter from './routes/history.js'
import placesRouter from './routes/places.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

import authRouter from './routes/auth.js'
import reportRouter from './routes/reports.js'

app.use('/api/route', routeRouter)
app.use('/api/history', historyRouter)
app.use('/api/auth', authRouter)
app.use('/api/reports', reportRouter)
app.use('/api/places', placesRouter)

const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI!, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Mongo error', err))

app.listen(PORT, () => console.log(`API running on ${PORT}`))
