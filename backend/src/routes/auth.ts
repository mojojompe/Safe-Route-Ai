import { Router } from 'express'
import { User } from '../models/User.js'

const router = Router()

router.post('/login', async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body

    try {
        let user = await User.findOne({ uid })

        if (!user) {
            user = new User({ uid, email, displayName, photoURL })
        } else {
            user.lastLogin = new Date()
            // Update other fields if they changed
            user.displayName = displayName
            user.photoURL = photoURL
        }

        await user.save()
        res.json(user)
    } catch (error) {
        console.error("Auth sync error", error)
        res.status(500).json({ error: 'Failed to sync user' })
    }
})

export default router
