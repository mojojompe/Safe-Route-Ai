import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    type: { type: String, required: true }, // e.g., 'accident', 'police', 'hazard', 'traffic'
    description: String,
    userId: String,
    createdAt: { type: Date, default: Date.now }
})

reportSchema.index({ location: '2dsphere' })

export const Report = mongoose.model('Report', reportSchema)
