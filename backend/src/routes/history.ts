import { Router } from 'express'
import { Route } from '../models/Route.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }
    const items = await Route.find({ userId }).sort({ date: -1 }).limit(50)
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

router.post('/save', async (req, res) => {
  try {
    const data = req.body
    if (!data.userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }
    const item = new Route(data)
    await item.save()
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save route' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Route.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Route not found' })
    }
    res.json({ message: 'Route deleted successfully', id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete route' })
  }
})

export default router
