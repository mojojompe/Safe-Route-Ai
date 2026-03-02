import mongoose from 'mongoose'

const NigeriaPlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['school', 'road', 'poi', 'junction'], required: true },
    subtype: { type: String, default: '' },   // e.g. 'primary', 'motorway', 'residential'
    state: { type: String, default: '' },     // e.g. 'Lagos', 'Abuja'
    lga: { type: String, default: '' },       // Local Government Area
    location: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: { type: [Number], required: true } // [lng, lat]
    }
}, {
    collection: 'nigeria_places',
    timestamps: false
})

// Full-text index for fast fuzzy search
NigeriaPlaceSchema.index({ name: 'text', state: 'text', lga: 'text' }, {
    weights: { name: 10, lga: 3, state: 1 },
    name: 'nigeria_places_text_idx'
})

// 2dsphere index for geo-proximity queries
NigeriaPlaceSchema.index({ location: '2dsphere' })

// Regular index for type filtering
NigeriaPlaceSchema.index({ type: 1 })

// Model — use existing if already compiled (important for hot reload)
export const NigeriaPlace = mongoose.models.NigeriaPlace
    || mongoose.model('NigeriaPlace', NigeriaPlaceSchema)
