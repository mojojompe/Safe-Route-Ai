import { Router } from 'express'
import { NigeriaPlace } from '../models/NigeriaPlace.js'

const router = Router()

/**
 * GET /api/places?q=Lekki&types=school,road&limit=8
 *
 * Searches the Nigeria places database and returns results
 * in the same shape as Mapbox Geocoding API features so the
 * frontend can merge both sources without extra mapping logic.
 */
router.get('/', async (req, res) => {
    try {
        const { q, types, limit = '8' } = req.query

        if (!q || String(q).trim().length < 2) {
            return res.json([])
        }

        const searchQuery = String(q).trim()
        const typeFilter = types
            ? String(types).split(',').map(t => t.trim())
            : ['school', 'road', 'poi', 'junction']
        const maxResults = Math.min(Number(limit), 15)

        const results = await NigeriaPlace.find(
            {
                $text: { $search: searchQuery },
                type: { $in: typeFilter }
            },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(maxResults)
            .lean()

        // Format to match Mapbox Geocoding feature shape
        const formatted = results.map((r: any) => {
            const parts = [r.name]
            if (r.lga) parts.push(r.lga)
            if (r.state) parts.push(r.state)
            parts.push('Nigeria')

            return {
                id: `nga_${r._id}`,
                place_name: parts.join(', '),
                text: r.name,
                center: r.location?.coordinates ?? [3.3792, 6.5244],
                place_type: [r.type],
                subtype: r.subtype || '',
                properties: {
                    category: r.type,
                    source: 'nigeria_db'
                }
            }
        })

        res.json(formatted)
    } catch (error) {
        console.error('Places search error:', error)
        // Return empty rather than 500 — autocomplete should degrade gracefully
        res.json([])
    }
})

export default router
