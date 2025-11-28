import { Router } from 'express'
import scoringService from '../services/scoring'
const router = Router()

// POST /api/route/options -> returns multiple route options (geojson segments, score etc)
router.post('/options', async (req, res) => {
  const { destination, mode } = req.body
  // Here you should call your mapping provider to get route geometries (Mapbox Directions API / Google)
  // For demo we create mocked routes. Then call scoringService to score each route.
  const mockRoutes = [
    { id: 'r1', geojson: {/*...*/}, distance: '2.5 mi', eta: '15 min', mode },
    { id: 'r2', geojson: {/*...*/}, distance: '3.1 mi', eta: '18 min', mode },
  ]
  const scored = await Promise.all(mockRoutes.map(async r => {
    const scoreObj = await scoringService.scoreRoute(r.geojson, { mode })
    return { ...r, ...scoreObj }
  }))
  res.json({ routes: scored })
})

// POST /api/route/score -> score a single route on demand
router.post('/score', async (req, res) => {
  const { geojson, mode } = req.body
  const scoreObj = await scoringService.scoreRoute(geojson, { mode })
  res.json(scoreObj)
})

export default router
