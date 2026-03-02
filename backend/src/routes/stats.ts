import { Router } from 'express'
import { Route } from '../models/Route.js'

const router = Router()

/**
 * GET /api/stats/:userId
 * Returns aggregated stats for the Profile + Analytics pages
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const routes = await Route.find({ userId }).sort({ date: -1 }).lean()

    const total = routes.length
    const avgScore = total > 0
      ? Math.round((routes.reduce((a, r: any) => a + (r.safetyScore || 0), 0) / total) * 10) / 10
      : 0

    const riskBreakdown = { Low: 0, Moderate: 0, High: 0 }
    routes.forEach((r: any) => {
      const level = r.riskLevel as 'Low' | 'Moderate' | 'High'
      if (riskBreakdown[level] !== undefined) riskBreakdown[level]++
    })

    // Last 60 routes for chart data (reversed = oldest first for trend line)
    const chartData = routes.slice(0, 60).reverse().map((r: any) => ({
      date: r.date,
      score: r.safetyScore,
      riskLevel: r.riskLevel,
      startLocation: r.startLocation,
      endLocation: r.endLocation,
    }))

    res.json({ totalRoutes: total, avgScore, riskBreakdown, chartData })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
