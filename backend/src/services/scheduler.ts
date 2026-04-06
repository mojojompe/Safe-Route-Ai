import cron from 'node-cron'
import mongoose from 'mongoose'
import { sendBroadcastEmail } from '../utils/mailer.js'

// Use cached models to avoid OverwriteModelError on warm restarts
const User = (mongoose.models['User'] as mongoose.Model<{ displayName?: string; email: string }>) ||
    mongoose.model('User', new mongoose.Schema({ displayName: String, email: String }))

const Waitlist = (mongoose.models['Waitlist'] as mongoose.Model<{ name: string; email: string }>) ||
    mongoose.model('Waitlist', new mongoose.Schema({ name: String, email: String }))

// ── Holiday definitions (month is 0-indexed) ──────────────────────────────────
const NIGERIAN_HOLIDAYS: { name: string; month: number; day: number; message: (name: string) => { subject: string; body: string } }[] = [
    {
        name: 'New Year',
        month: 0, day: 1,
        message: name => ({
            subject: `Happy New Year, ${name} - Navigate the New Year Safely`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy New Year!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  A brand new year means brand new journeys. As you step out to embrace everything 2026 has to offer, remember that your safety comes first, always.<br/><br/>
  <strong style="color:#00d35a;">Safe Route AI is with you every step of the way.</strong> Use Arlo to plan your routes, report hazards for your community, and share your live location with loved ones.<br/><br/>
  Here is to a safe, thriving, and adventure-filled year ahead!
</p>`
        })
    },
    {
        name: 'Easter Sunday',
        month: 3, day: 20,
        message: name => ({
            subject: `Happy Easter, ${name} - Stay Safe on Your Journey`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy Easter!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  As you make your way to visit loved ones and attend celebrations, travel with complete peace of mind.<br/><br/>
  The roads are busier during Easter — but with <strong style="color:#00d35a;">Safe Route AI</strong>, you will always have the safest path mapped out. Wishing you a blessed and safe Easter!
</p>`
        })
    },
    {
        name: 'Eid el-Fitr',
        month: 3, day: 30,
        message: name => ({
            subject: `Eid Mubarak, ${name} - Travel Safely This Celebration`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Eid Mubarak!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  As you celebrate Eid el-Fitr with family and friends, may your journeys be as joyful and peaceful as the occasion.<br/><br/>
  Use <strong style="color:#00d35a;">Safe Route AI</strong> to find the safest roads to your celebrations. Eid Mubarak from the Safe Route AI family!
</p>`
        })
    },
    {
        name: 'Eid el-Kabir',
        month: 6, day: 7,
        message: name => ({
            subject: `Eid el-Kabir Mubarak, ${name} - Safe Travels Today`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Eid el-Kabir Mubarak!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  On this special occasion, we pray your travels are smooth and your celebrations beautiful.<br/><br/>
  Wherever your journey takes you today, let <strong style="color:#00d35a;">Safe Route AI</strong> be your safety companion. Eid Mubarak from all of us!
</p>`
        })
    },
    {
        name: 'Independence Day',
        month: 9, day: 1,
        message: name => ({
            subject: `Happy Independence Day, ${name} - Navigate Nigeria Safely`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy Independence Day, Nigeria!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  On this special day, we celebrate the great nation we call home. As you head out for celebrations, trust <strong style="color:#00d35a;">Safe Route AI</strong> to keep you navigating safely. Happy Independence Day!
</p>`
        })
    },
    {
        name: 'Christmas',
        month: 11, day: 25,
        message: name => ({
            subject: `Merry Christmas, ${name} - Safe Travels This Season`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Merry Christmas!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  As you make your way to family gatherings and festive celebrations, we hope every journey fills you with joy.<br/><br/>
  The roads are busier during Christmas. Use <strong style="color:#00d35a;">Safe Route AI</strong> to find your safest route. Merry Christmas from the Safe Route AI family!
</p>`
        })
    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Gets ALL app users + ALL waitlist signups, deduped by email */
async function getAllRecipients(): Promise<{ name: string; email: string }[]> {
    const [users, waitlistEntries] = await Promise.all([
        User.find({}, { displayName: 1, email: 1 }),
        Waitlist.find({}, { name: 1, email: 1 }),
    ])

    const map = new Map<string, { name: string; email: string }>()

    for (const u of users as any[]) {
        if (u.email) map.set(u.email.toLowerCase(), { name: u.displayName || 'Navigator', email: u.email.toLowerCase() })
    }
    for (const w of waitlistEntries as any[]) {
        if (w.email && !map.has(w.email.toLowerCase())) {
            map.set(w.email.toLowerCase(), { name: w.name || 'Navigator', email: w.email.toLowerCase() })
        }
    }

    return Array.from(map.values())
}

export async function broadcastToAll(subject: string, bodyFn: (name: string) => string) {
    try {
        const recipients = await getAllRecipients()
        console.log(`Broadcast "${subject}" to ${recipients.length} recipients`)
        for (const r of recipients) {
            try {
                await sendBroadcastEmail(r.email, r.name, subject, bodyFn(r.name))
                await new Promise(res => setTimeout(res, 300)) // throttle: avoid Gmail rate limits
            } catch (err: any) {
                console.error(`Broadcast failed for ${r.email}:`, err.message)
            }
        }
        console.log('Broadcast complete.')
    } catch (err: any) {
        console.error('Broadcast error:', err.message)
    }
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

export function startScheduler() {
    try {
        const tz = 'Africa/Lagos' // WAT (UTC+1) — Nigeria

        // Every Monday at 8:00 AM WAT
        cron.schedule('0 8 * * 1', async () => {
            const tips = [
                'roads are busiest on Monday mornings. Leave 15 minutes earlier and use Safe Route AI to avoid accident-prone areas.',
                'night travel carries extra risk. Plan your routes in advance and always share your location with someone you trust.',
                'rainy season floods change everything. Check our live hazard map before setting out.',
            ]
            const tip = tips[new Date().getDate() % tips.length]
            await broadcastToAll(
                'Stay Safe This Week - A Quick Safety Reminder',
                name => `<h2 style="color:#fff;margin:0 0 16px;">Good morning, ${name}!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  A new week means new journeys. Here is a quick safety reminder:<br/><br/>
  <div style="background:rgba(0,211,90,0.08);border-left:3px solid #00d35a;padding:16px;border-radius:0 12px 12px 0;margin:16px 0;">
    <strong style="color:#00d35a;">This week's tip:</strong><br/>
    <span style="color:rgba(255,255,255,0.7);">Nigerian ${tip}</span>
  </div>
  Stay safe on your way to work, school, or anywhere life takes you.
</p>`
            )
        }, { timezone: tz })

        // Every Friday at 4:00 PM WAT
        cron.schedule('0 16 * * 5', async () => {
            await broadcastToAll(
                'The Weekend Is Here - Travel Smart, Stay Safe',
                name => `<h2 style="color:#fff;margin:0 0 16px;">TGIF, ${name}!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  The weekend is here and we know you have places to be. Whether you are heading out to see family, catch a show, or just enjoy the city — let <strong style="color:#00d35a;">Safe Route AI</strong> help you get there safely.<br/><br/>
  <div style="background:rgba(0,211,90,0.08);border-left:3px solid #00d35a;padding:16px;border-radius:0 12px 12px 0;margin:16px 0;">
    <strong style="color:#00d35a;">Weekend safety reminders:</strong><br/>
    <span style="color:rgba(255,255,255,0.7);">
      - Friday evenings are peak traffic hours — plan your route early<br/>
      - Avoid poorly lit roads after dark<br/>
      - Share your live location with someone before long trips<br/>
      - Check the community hazard map for reported incidents near you
    </span>
  </div>
  Have a great weekend and stay safe out there!
</p>`
            )
        }, { timezone: tz })

        // 1st of every month at 9:00 AM WAT
        cron.schedule('0 9 1 * *', async () => {
            const month = new Date().toLocaleString('en-NG', { month: 'long' })
            await broadcastToAll(
                `A New Month, A New Commitment to Safety`,
                name => `<h2 style="color:#fff;margin:0 0 16px;">Happy new month, ${name}!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  Welcome to <strong style="color:#00d35a;">${month}</strong>! A fresh month is the perfect time to renew your commitment to travelling safely.<br/><br/>
  <strong style="color:#fff;">Plan safer routes</strong> — let our AI find the lowest-risk path for every journey.<br/>
  <strong style="color:#fff;">Share your location</strong> — keep loved ones informed whenever you travel.<br/>
  <strong style="color:#fff;">Report hazards</strong> — your reports protect your neighbours.<br/><br/>
  Here is to a safe and productive ${month}.
</p>`
            )
        }, { timezone: tz })

        // Holiday checker — runs every morning at 9:00 AM WAT
        cron.schedule('0 9 * * *', async () => {
            const now = new Date()
            const todayMonth = now.getMonth()
            const todayDay = now.getDate()
            for (const holiday of NIGERIAN_HOLIDAYS) {
                if (holiday.month === todayMonth && holiday.day === todayDay) {
                    console.log(`Holiday detected: ${holiday.name}`)
                    await broadcastToAll(
                        holiday.message('').subject,
                        name => holiday.message(name).body
                    )
                    break
                }
            }
        }, { timezone: tz })

        console.log('Scheduler started: Mon 8am WAT, Fri 4pm WAT, Monthly 1st 9am WAT, Holidays 9am WAT')
    } catch (err: any) {
        console.error('Scheduler failed to start:', err.message)
    }
}
