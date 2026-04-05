import { Router } from 'express'
import nodemailer from 'nodemailer'
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

        // Send confirmation email — await it so errors are visible in logs
        try {
            await sendWaitlistConfirmation(email.toLowerCase().trim(), name.trim())
            console.log(`Waitlist confirmation sent to ${email}`)
        } catch (mailErr: any) {
            console.error('Waitlist confirmation mail failed:', mailErr.message, mailErr.code)
        }

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

// GET /api/waitlist/test-mail — diagnose SMTP connection & send a test email
router.get('/test-mail', async (req, res) => {
    const to = (req.query.to as string) || process.env.MAIL_USER || ''

    const config = {
        MAIL_HOST: process.env.MAIL_HOST || '(missing)',
        MAIL_PORT: process.env.MAIL_PORT || '(missing)',
        MAIL_USER: process.env.MAIL_USER || '(missing)',
        MAIL_PASS: process.env.MAIL_PASS ? '***set***' : '(missing)',
        MAIL_FROM: process.env.MAIL_FROM || '(missing)',
    }

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.MAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    })

    try {
        await transporter.verify()
        await transporter.sendMail({
            from: process.env.MAIL_FROM || '"Safe Route AI" <saferouteai@gmail.com>',
            to,
            subject: 'Safe Route AI — SMTP Test',
            html: '<p>SMTP connection is working correctly from Render!</p>',
        })
        res.json({ status: 'ok', message: `Test email sent to ${to}`, config })
    } catch (err: any) {
        res.status(500).json({
            status: 'error',
            message: err.message,
            code: err.code,
            config,
        })
    }
})

export default router
