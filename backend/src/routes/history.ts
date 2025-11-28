import { Router } from 'express'
import { Route } from '../models/Route.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await Route.find().sort({ date: -1 }).limit(50)
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

router.post('/save', async (req, res) => {
  try {
    const data = req.body
    const item = new Route(data)
    await item.save()
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save route' })
  }
})

export default router
