import mongoose from 'mongoose'
import crypto from 'crypto'

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true },
    codeHash: { type: String, required: true },
    type: { type: String, enum: ['signup', 'reset'], required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
}, { timestamps: true })

OTPSchema.index({ email: 1, type: 1 })
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL auto-delete

const OTPModel = mongoose.model('OTP', OTPSchema)

export function generateOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000))
}

export function hashOtp(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex')
}

export async function createOtp(email: string, type: 'signup' | 'reset'): Promise<string> {
    // Delete any existing OTP for this email+type
    await OTPModel.deleteMany({ email: email.toLowerCase(), type })
    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000) // 3 minutes
    await OTPModel.create({ email: email.toLowerCase(), codeHash: hashOtp(code), type, expiresAt })
    return code
}

export async function verifyOtp(email: string, code: string, type: 'signup' | 'reset'): Promise<boolean> {
    const record = await OTPModel.findOne({ email: email.toLowerCase(), type })
    if (!record) return false
    if (record.expiresAt < new Date()) {
        await OTPModel.deleteOne({ _id: record._id })
        return false
    }
    if (record.attempts >= 3) return false

    const valid = record.codeHash === hashOtp(code)
    if (!valid) {
        record.attempts += 1
        await record.save()
        return false
    }

    await OTPModel.deleteOne({ _id: record._id })
    return true
}

export default OTPModel
