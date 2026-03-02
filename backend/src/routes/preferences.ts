import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

const PrefsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    alertTypes: { type: [String], default: ['accident', 'hazard', 'closure'] },
    alertRadius: { type: Number, default: 1000 },
    theme: { type: String, default: 'system' },
    mapStyle: { type: String, default: 'streets-v12' },
    emergencyContacts: [{
        name: String,
        phone: String,
        relationship: String
    }]
}, { timestamps: true })

const Prefs = mongoose.models.UserPreferences || mongoose.model('UserPreferences', PrefsSchema)

// GET /api/preferences/:userId
router.get('/:userId', async (req, res) => {
    try {
        let prefs = await Prefs.findOne({ userId: req.params.userId }).lean()
        if (!prefs) {
            prefs = await Prefs.create({ userId: req.params.userId })
        }
        res.json(prefs)
    } catch (error) {
        console.error('Prefs GET error:', error)
        res.status(500).json({ error: 'Failed to fetch preferences' })
    }
})

// PUT /api/preferences/:userId — full upsert
router.put('/:userId', async (req, res) => {
    try {
        const { alertTypes, alertRadius, theme, mapStyle, emergencyContacts } = req.body
        const updated = await Prefs.findOneAndUpdate(
            { userId: req.params.userId },
            { alertTypes, alertRadius, theme, mapStyle, emergencyContacts },
            { new: true, upsert: true, runValidators: true }
        ).lean()
        res.json(updated)
    } catch (error) {
        console.error('Prefs PUT error:', error)
        res.status(500).json({ error: 'Failed to save preferences' })
    }
})

export default router
