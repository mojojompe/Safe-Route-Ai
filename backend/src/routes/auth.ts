import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { createOtp, verifyOtp as verifyOtpCode } from '../utils/otp.js'
import { sendOtpEmail } from '../utils/mailer.js'

const router = Router()

// ── User model ────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    phone: { type: String },
    verified: { type: Boolean, default: false },
    avatar: { type: String },
    safetyTier: { type: String, default: 'Commuter' },
    deviceTokens: [{ type: String }],
    // Firebase compat fields
    uid: { type: String },
    displayName: { type: String },
    photoURL: { type: String },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

function signToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: (process.env.JWT_EXPIRES as any) || '7d',
    })
}

function safeUser(u: any) {
    return { id: u._id, name: u.name || u.displayName, email: u.email, phone: u.phone, avatar: u.avatar || u.photoURL, safetyTier: u.safetyTier }
}

// ── Firebase Google sync (existing web route) ─────────────────────────────────
router.post('/login', async (req, res) => {
    // Support both: { uid, email, displayName } (Firebase/Google) and { email, password } (mobile)
    const { uid, email, displayName, photoURL, password } = req.body

    // Mobile email/password login
    if (password) {
        try {
            if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' })
            const user = await User.findOne({ email: email.toLowerCase() })
            if (!user || !user.password) return res.status(401).json({ error: 'Invalid email or password.' })
            if (!user.verified) return res.status(403).json({ error: 'Please verify your email first.' })
            const match = await bcrypt.compare(password, user.password)
            if (!match) return res.status(401).json({ error: 'Invalid email or password.' })
            const token = signToken(user._id.toString())
            return res.json({ user: safeUser(user), token })
        } catch (e: any) {
            return res.status(500).json({ error: 'Login failed.' })
        }
    }

    // Firebase Google login (web compat)
    try {
        let user = await User.findOne({ uid })
        if (!user) {
            user = new User({ uid, email, displayName, photoURL, verified: true })
        } else {
            user.lastLogin = new Date()
            user.displayName = displayName
            user.photoURL = photoURL
        }
        await user.save()
        res.json(user)
    } catch (error) {
        console.error('Auth sync error', error)
        res.status(500).json({ error: 'Failed to sync user' })
    }
})

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body
        if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' })
        const exists = await User.findOne({ email: email.toLowerCase() })
        if (exists) return res.status(409).json({ error: 'An account with this email already exists.' })
        const hashed = await bcrypt.hash(password, 12)
        await User.create({ name, email, password: hashed, phone, verified: false })
        const code = await createOtp(email, 'signup')
        await sendOtpEmail(email, name, code, 'signup')
        res.json({ message: 'Account created. Check your email for the verification code.' })
    } catch (err: any) {
        console.error('Register error:', err.message)
        res.status(500).json({ error: 'Registration failed. Please try again.' })
    }
})

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, code, type } = req.body
        const valid = await verifyOtpCode(email, code, type)
        if (!valid) return res.status(400).json({ error: 'Invalid or expired verification code.' })
        if (type === 'signup') {
            const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { verified: true }, { new: true })
            if (!user) return res.status(404).json({ error: 'User not found.' })
            const token = signToken(user._id.toString())
            return res.json({ message: 'Email verified!', user: safeUser(user), token })
        }
        res.json({ message: 'Code verified.' })
    } catch (err: any) {
        res.status(500).json({ error: 'Verification failed.' })
    }
})

// ── POST /api/auth/resend-otp ─────────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
    try {
        const { email, type } = req.body
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.status(404).json({ error: 'No account found with this email.' })
        const code = await createOtp(email, type)
        await sendOtpEmail(email, user.name || user.displayName, code, type)
        res.json({ message: 'A new code has been sent.' })
    } catch {
        res.status(500).json({ error: 'Could not resend code.' })
    }
})

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: email.toLowerCase() })
        if (user) {
            const code = await createOtp(email, 'reset')
            await sendOtpEmail(email, user.name || user.displayName, code, 'reset')
        }
        res.json({ message: 'If an account exists, a reset code has been sent.' })
    } catch {
        res.status(500).json({ error: 'Could not send reset email.' })
    }
})

// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, password } = req.body
        const valid = await verifyOtpCode(email, code, 'reset')
        if (!valid) return res.status(400).json({ error: 'Invalid or expired reset code.' })
        const hashed = await bcrypt.hash(password, 12)
        await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashed })
        res.json({ message: 'Password updated successfully.' })
    } catch {
        res.status(500).json({ error: 'Password reset failed.' })
    }
})

export default router
