import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: String,
    photoURL: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
})

export const User = mongoose.model('User', userSchema)
