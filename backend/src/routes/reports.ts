import { Router } from 'express'
import { Report } from '../models/Report.js'

const router = Router()

// Get all reports (optionally filter by bounds if needed later)
router.get('/', async (req, res) => {
    try {
        // Limit to last 24 hours to keep it relevant
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const reports = await Report.find({ createdAt: { $gte: yesterday } })
        res.json(reports)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' })
    }
})

// Create a new report
router.post('/', async (req, res) => {
    try {
        const { location, type, description, userId } = req.body
        const report = new Report({
            location: { type: 'Point', coordinates: location },
            type,
            description,
            userId
        })
        await report.save()
        res.json(report)
    } catch (error) {
        console.error("Report creation failed", error)
        res.status(500).json({ error: 'Failed to create report' })
    }
})

// Delete a report
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await Report.findByIdAndDelete(id)
        res.json({ message: 'Report deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete report' })
    }
})

export default router
