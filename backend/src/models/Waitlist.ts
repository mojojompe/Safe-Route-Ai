import mongoose from 'mongoose'

const WaitlistSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    createdAt: { type: Date, default: Date.now },
})

// Use models cache guard for Vercel serverless warm restarts
export const Waitlist = (mongoose.models['Waitlist'] as mongoose.Model<any>) ||
    mongoose.model('Waitlist', WaitlistSchema)
