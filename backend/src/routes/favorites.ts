import { Router } from 'express'
import mongoose, { Schema, Document } from 'mongoose'

const router = Router()

interface IFavorite extends Document {
    userId: string
    name: string
    emoji: string
    address: string
    coordinates: number[]
}

const FavoriteSchema = new Schema<IFavorite>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    emoji: { type: String, default: '📍' },
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true }
}, { timestamps: true })

FavoriteSchema.index({ userId: 1 })
const Favorite = (mongoose.models.Favorite as mongoose.Model<IFavorite>)
    || mongoose.model<IFavorite>('Favorite', FavoriteSchema)

// GET /api/favorites?userId=X
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) return res.status(400).json({ error: 'userId required' })
        const favs = await Favorite.find({ userId }).sort({ createdAt: -1 }).lean()
        res.json(favs)
    } catch (e) { res.status(500).json({ error: 'Failed to fetch favorites' }) }
})

// POST /api/favorites
router.post('/', async (req, res) => {
    try {
        const { userId, name, emoji, address, coordinates } = req.body
        if (!userId || !name || !address || !coordinates) {
            return res.status(400).json({ error: 'Missing required fields' })
        }
        const fav = await Favorite.create({ userId, name, emoji, address, coordinates })
        res.status(201).json(fav)
    } catch (e) { res.status(500).json({ error: 'Failed to save favorite' }) }
})

// DELETE /api/favorites/:id
router.delete('/:id', async (req, res) => {
    try {
        await Favorite.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (e) { res.status(500).json({ error: 'Failed to delete favorite' }) }
})

export default router
