import { Router } from 'express'
import { Report } from '../models/Report.js'

const router = Router()

// Get all reports — last 7 days (client does its own time filtering)
router.get('/', async (req, res) => {
    try {
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const reports = await Report.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(200)
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

// Upvote a report
router.post('/:id/upvote', async (req, res) => {
    try {
        const { userId } = req.body
        const report = await Report.findById(req.params.id)
        if (!report) return res.status(404).json({ error: 'Not found' })
        const upvotedBy: string[] = (report as any).upvotedBy || []
        const idx = upvotedBy.indexOf(userId)
        if (idx === -1) {
            upvotedBy.push(userId)
        } else {
            upvotedBy.splice(idx, 1)
        }
        ; (report as any).upvotedBy = upvotedBy
            ; (report as any).upvotes = upvotedBy.length
        await report.save()
        res.json(report)
    } catch (error) {
        res.status(500).json({ error: 'Failed to upvote' })
    }
})

export default router
