import { Router } from 'express'
import RouteHistory from '../models/RouteHistory'
const router = Router()

router.get('/', async (req, res) => {
  const items = await RouteHistory.find().sort({ date: -1 }).limit(50)
  res.json(items)
})

router.post('/save', async (req, res) => {
  const data = req.body
  const item = new RouteHistory(data)
  await item.save()
  res.json(item)
})

export default router
