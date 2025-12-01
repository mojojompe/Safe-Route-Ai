import { Router } from 'express'
import axios from 'axios'
import scoringService from '../services/scoring.js'

const router = Router()

router.post('/options', async (req, res) => {
    const { start, destination, mode } = req.body

    try {
        // Mapbox Directions API
        const profile = mode === 'walking' ? 'walking' : 'driving'
        // Request alternatives=true
        const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${destination[0]},${destination[1]}?geometries=geojson&steps=true&alternatives=true&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`

        const response = await axios.get(url)
        const routes = response.data.routes

        if (!routes || routes.length === 0) {
            return res.status(404).json({ error: 'No route found' })
        }

        // Score all routes
        const scoredRoutes = await Promise.all(routes.map(async (route: any, index: number) => {
            const scoreObj = await scoringService.scoreRoute(route.geometry, {
                distance: route.distance / 1609.34, // meters to miles
                mode,
                steps: route.legs[0].steps
            })

            return {
                id: index,
                geojson: {
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry
                },
                distance: `${(route.distance / 1609.34).toFixed(1)} mi`,
                duration: `${Math.round(route.duration / 60)} min`,
                steps: route.legs[0].steps,
                ...scoreObj
            }
        }))

        // Sort by safety score (descending)
        scoredRoutes.sort((a, b) => b.score - a.score)

        res.json(scoredRoutes)

    } catch (error) {
        console.error("Routing error", error)
        res.status(500).json({ error: 'Failed to generate route' })
    }
})

export default router
