import cron from 'node-cron'
import mongoose from 'mongoose'

// Use the cached model if already registered by auth.ts (avoids OverwriteModelError)
const User = (mongoose.models['User'] as mongoose.Model<{ displayName?: string; email: string; verified?: boolean }>) ||
    mongoose.model('User', new mongoose.Schema({ displayName: String, email: String, verified: Boolean }))
import { sendBroadcastEmail } from '../utils/mailer.js'

// ── Holiday definitions (month is 0-indexed) ──────────────────────────────────
const NIGERIAN_HOLIDAYS: { name: string; month: number; day: number; message: (name: string) => { subject: string; body: string } }[] = [
    {
        name: 'New Year',
        month: 0, day: 1,
        message: name => ({
            subject: `Happy New Year, ${name}! Navigate the New Year Safely`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy New Year!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  A brand new year means brand new journeys. As you step out to embrace everything 2026 has to offer, remember that your safety comes first, always.<br/><br/>
  <strong style="color:#00d35a;">Safe Route AI is with you every step of the way.</strong> Use Arlo to plan your routes, report hazards for your community, and share your live location with loved ones.<br/><br/>
  Here's to a safe, thriving, and adventure-filled year ahead!
</p>`
        })
    },
//     {
//         name: 'Easter Sunday',
//         month: 3, day: 20,
//         message: name => ({
//             subject: `Happy Easter, ${name}! Stay Safe on Your Journey`,
//             body: `<h2 style="color:#fff;margin:0 0 16px;">Happy Easter!</h2>
// <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
//   As you make your way to visit loved ones and attend celebrations, travel with complete peace of mind.<br/><br/>
//   The roads are busier during Easter — but with <strong style="color:#00d35a;">Safe Route AI</strong>, you'll always have the safest path mapped out. Check live hazard reports, avoid traffic hotspots, and share your location with family. Wishing you a blessed and safe Easter!
// </p>`
//         })
//     },
//     {
//         name: 'Eid el-Fitr',
//         month: 3, day: 30,
//         message: name => ({
//             subject: `Eid Mubarak, ${name}! Travel Safely This Celebration`,
//             body: `<h2 style="color:#fff;margin:0 0 16px;">Eid Mubarak!</h2>
// <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
//   As you celebrate Eid el-Fitr with family and friends, may your journeys be as joyful and peaceful as the occasion.<br/><br/>
//   Use <strong style="color:#00d35a;">Safe Route AI</strong> to find the safest roads to your celebrations. Our live hazard map will help you avoid congested or risky areas. Eid Mubarak from the Safe Route AI family!
// </p>`
//         })
//     },
//     {
//         name: 'Eid el-Kabir',
//         month: 6, day: 7,
//         message: name => ({
//             subject: `Eid el-Kabir Mubarak, ${name}! Safe Travels Today`,
//             body: `<h2 style="color:#fff;margin:0 0 16px;">Eid el-Kabir Mubarak!</h2>
// <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
//   On this special occasion, we pray your travels are smooth and your celebrations beautiful.<br/><br/>
//   Wherever your journey takes you today, let <strong style="color:#00d35a;">Safe Route AI</strong> be your safety companion. Eid Mubarak from all of us!
// </p>`
//         })
//     },
    {
        name: 'Independence Day',
        month: 9, day: 1,
        message: name => ({
            subject: `Happy Independence Day, ${name}! Navigate Nigeria Safely`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy Independence Day, Nigeria!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  On this special day, we celebrate the great nation we call home. As you head out for celebrations, trust <strong style="color:#00d35a;">Safe Route AI</strong> to keep you navigating safely through the festivities. Happy Independence Day!
</p>`
        })
    },
    {
        name: 'Christmas',
        month: 11, day: 25,
        message: name => ({
            subject: `Merry Christmas, ${name}! Safe Travels This Season`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Merry Christmas!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  As you make your way to family gatherings and festive celebrations, we hope every journey fills you with joy.<br/><br/>
  The roads are busier during Christmas. Use <strong style="color:#00d35a;">Safe Route AI</strong> to find your safest route. Merry Christmas from the Safe Route AI family!
</p>`
        })
    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAllVerifiedUsers(): Promise<{ name: string; email: string }[]> {
    const users = await User.find({ verified: true }, { displayName: 1, email: 1 })
    return users.map((u: any) => ({ name: u.displayName || 'Navigator', email: u.email }))
}

async function broadcastToAll(subject: string, bodyFn: (name: string) => string) {
    try {
        const users = await getAllVerifiedUsers()
        console.log(`Broadcast to ${users.length} users: "${subject}"`)
        for (const user of users) {
            try {
                await sendBroadcastEmail(user.email, user.name, subject, bodyFn(user.name))
                await new Promise(res => setTimeout(res, 300))
            } catch (err: any) {
                console.error(`Broadcast failed for ${user.email}:`, err.message)
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
        // Every Monday at 8:00 AM
        cron.schedule('0 8 * * 1', async () => {
            const tips = [
                'roads are busiest on Monday mornings. Leave 15 minutes earlier and use Safe Route AI to avoid accident-prone areas.',
                'night travel carries extra risk. Plan your routes in advance and always share your location with someone you trust.',
                'rainy season floods change everything. Check our live hazard map before setting out.',
            ]
            const tip = tips[new Date().getDate() % tips.length]
            await broadcastToAll(
                'Stay Safe This Week — A Quick Safety Reminder',
                name => `<h2 style="color:#fff;margin:0 0 16px;">Good morning, ${name}!</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  A new week means new journeys. Here's a quick safety reminder:<br/><br/>
  <div style="background:rgba(0,211,90,0.08);border-left:3px solid #00d35a;padding:16px;border-radius:0 12px 12px 0;margin:16px 0;">
    <strong style="color:#00d35a;">This week's tip:</strong><br/>
    <span style="color:rgba(255,255,255,0.7);">Nigerian ${tip}</span>
  </div>
  Stay safe on your way to work, school, or anywhere life takes you.
</p>`
            )
        })

        // 1st of every month at 9:00 AM
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
  Here's to a safe and productive ${month}.
</p>`
            )
        })

        // Holiday checker — runs every morning at 9:00 AM
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
        })

        console.log('Scheduler started: Weekly (Mon 8am), Monthly (1st 9am), Holidays (daily 9am)')
    } catch (err: any) {
        console.error('Scheduler failed to start:', err.message)
    }
}
