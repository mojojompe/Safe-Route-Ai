import { Router } from 'express'
import { Waitlist } from '../models/Waitlist.js'
import { sendWaitlistConfirmation } from '../utils/mailer.js'

const router = Router()

// POST /api/waitlist — join the waitlist
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body
        if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' })

        const existing = await Waitlist.findOne({ email: email.toLowerCase().trim() })
        if (existing) return res.status(409).json({ error: 'This email is already on our waitlist!' })

        await Waitlist.create({ name: name.trim(), email: email.toLowerCase().trim() })

        // Send confirmation email (non-blocking)
        sendWaitlistConfirmation(email.toLowerCase().trim(), name.trim()).catch(err =>
            console.error('Waitlist confirmation mail failed:', err.message)
        )

        res.json({ message: "You're on the list! Check your email for a confirmation." })
    } catch (err: any) {
        console.error('Waitlist error:', err.message)
        res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
})

// GET /api/waitlist — admin: see all entries
router.get('/', async (_req, res) => {
    try {
        const entries = await Waitlist.find().sort({ createdAt: -1 })
        res.json(entries)
    } catch {
        res.status(500).json({ error: 'Failed to fetch waitlist.' })
    }
})

export default router
