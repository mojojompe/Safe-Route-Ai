import { Router } from 'express'
import { Route } from '../models/Route.js'

const router = Router()

// GET /api/history/:id  — single journey detail
router.get('/:id', async (req, res) => {
    try {
        const item = await Route.findById(req.params.id).lean()
        if (!item) return res.status(404).json({ error: 'Not found' })
        res.json(item)
    } catch (e) { res.status(500).json({ error: 'Failed to fetch journey' }) }
})

// PATCH /api/history/:id  — save notes + tags
router.patch('/:id', async (req, res) => {
    try {
        const { notes, tags } = req.body
        const updated = await Route.findByIdAndUpdate(
            req.params.id,
            { notes, tags },
            { new: true }
        ).lean()
        if (!updated) return res.status(404).json({ error: 'Not found' })
        res.json(updated)
    } catch (e) { res.status(500).json({ error: 'Failed to update journey' }) }
})

export default router
