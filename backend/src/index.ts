import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routeRouter from './routes/routes'
import historyRouter from './routes/history'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/route', routeRouter)
app.use('/api/history', historyRouter)

const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI!, {})
  .then(() => {
    app.listen(PORT, () => console.log(`API running on ${PORT}`))
  }).catch(err => {
    console.error('Mongo error', err)
  })
