import cron from 'node-cron'
import mongoose from 'mongoose'
import { sendBroadcastEmail } from '../utils/mailer.js'

// ── User model reference (same schema as in auth.ts) ──────────────────────────
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String, displayName: String, email: String, verified: Boolean
}))

// ── Holiday definitions (month is 0-indexed) ──────────────────────────────────
// For Easter & Eid (floating dates), update these each year
const NIGERIAN_HOLIDAYS: { name: string; month: number; day: number; message: (name: string) => { subject: string; body: string } }[] = [
    {
        name: 'New Year',
        month: 0, day: 1,
        message: name => ({
            subject: `🎆 Happy New Year, ${name}! Navigate 2026 Safely`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy New Year! 🎆</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  A brand new year means brand new journeys. As you step out to embrace everything 2026 has to offer, remember that your safety comes first — always.<br/><br/>
  <strong style="color:#00d35a;">Safe Route AI is with you every step of the way.</strong> Use Arlo to plan your routes, report hazards for your community, and share your live location with loved ones.<br/><br/>
  Here's to a safe, thriving, and adventure-filled year ahead! 🛡️
</p>`
        })
    },
    {
        name: 'Easter Sunday',
        month: 3, day: 20, // 2025 Easter — update annually
        message: name => ({
            subject: `🐣 Happy Easter, ${name}! Stay Safe on Your Journey`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy Easter! 🐣</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  As you make your way to visit loved ones, attend celebrations, or simply enjoy the holiday, we want you to travel with complete peace of mind.<br/><br/>
  The roads are busier during Easter — but with <strong style="color:#00d35a;">Safe Route AI</strong>, you'll always have the safest path mapped out for you. Check live hazard reports, avoid traffic hotspots, and share your location with family so they know you're safe. 🛣️<br/><br/>
  Wishing you a blessed, joyful, and safe Easter from all of us. 🙏
</p>`
        })
    },
    {
        name: 'Eid el-Fitr',
        month: 3, day: 30, // approximate — update annually
        message: name => ({
            subject: `🌙 Eid Mubarak, ${name}! Travel Safely This Celebration`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Eid Mubarak! 🌙</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  As you celebrate Eid el-Fitr with family and friends, may your journeys be as joyful and peaceful as the occasion itself.<br/><br/>
  The streets are lively today — use <strong style="color:#00d35a;">Safe Route AI</strong> to find the safest roads to your celebrations. Our live hazard map will help you avoid congested or risky areas. 🛡️<br/><br/>
  Eid Mubarak from the Safe Route AI family! May Allah keep you and your loved ones safe. 🤲
</p>`
        })
    },
    {
        name: 'Eid el-Kabir',
        month: 6, day: 7, // approximate — update annually
        message: name => ({
            subject: `🐑 Eid el-Kabir Mubarak, ${name}! Safe Travels Today`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Eid el-Kabir Mubarak! 🐑</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  On this special occasion of Eid el-Kabir, we pray that your travels are smooth and your celebrations are beautiful.<br/><br/>
  Wherever your journey takes you today — to family, to prayers, or to celebrations — let <strong style="color:#00d35a;">Safe Route AI</strong> be your safety companion. 🛣️<br/><br/>
  Eid Mubarak from all of us at Safe Route AI! Stay safe. 🤲
</p>`
        })
    },
    {
        name: 'Independence Day',
        month: 9, day: 1,
        message: name => ({
            subject: `🇳🇬 Happy Independence Day, ${name}! Navigate Nigeria Safely`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Happy Independence Day, Nigeria! 🇳🇬</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  On this special day, we celebrate the great nation we call home and the beautiful people in it — including you.<br/><br/>
  As you head out for celebrations, processions, or family time, trust <strong style="color:#00d35a;">Safe Route AI</strong> to keep you navigating safely through the festivities. The city is buzzing — stay smart, stay safe! 🛡️<br/><br/>
  Happy Independence Day from Safe Route AI. 🙏🇳🇬
</p>`
        })
    },
    {
        name: 'Christmas',
        month: 11, day: 25,
        message: name => ({
            subject: `🎄 Merry Christmas, ${name}! Safe Travels This Season`,
            body: `<h2 style="color:#fff;margin:0 0 16px;">Merry Christmas! 🎄</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  As you make your way to family gatherings, church services, and festive celebrations, we hope every journey fills you with joy and warmth.<br/><br/>
  The roads can be extra busy during the Christmas season. Use <strong style="color:#00d35a;">Safe Route AI</strong> to find your safest route, avoid accidents, and share your location with people who care about you. 🛡️🎁<br/><br/>
  Merry Christmas and safe journeys from the entire Safe Route AI family! 🎅
</p>`
        })
    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAllVerifiedUsers(): Promise<{ name: string; email: string }[]> {
    const users = await User.find({ verified: true }, { name: 1, displayName: 1, email: 1 })
    return users.map((u: any) => ({ name: u.name || u.displayName || 'Navigator', email: u.email }))
}

async function broadcastToAll(subject: string, bodyFn: (name: string) => string) {
    const users = await getAllVerifiedUsers()
    console.log(`📧 Broadcasting to ${users.length} users: "${subject}"`)
    for (const user of users) {
        try {
            await sendBroadcastEmail(user.email, user.name, subject, bodyFn(user.name))
            await new Promise(res => setTimeout(res, 300)) // rate-limit: 300ms between sends
        } catch (err: any) {
            console.error(`⚠️  Failed to send to ${user.email}:`, err.message)
        }
    }
    console.log(`✅ Broadcast complete.`)
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

export function startScheduler() {
    console.log('🕐 Scheduler started.')

    // Every Monday at 8:00 AM — weekly safety tip
    cron.schedule('0 8 * * 1', async () => {
        const tips = [
            'roads are busiest on Monday mornings. Leave 15 minutes earlier and use Safe Route AI to avoid accident-prone areas.',
            'night travel carries extra risk. Plan your routes in advance using Safe Route AI and always share your location with someone you trust.',
            'rainy season floods change everything. Always check our live hazard map before setting out — roads that were fine yesterday may be submerged today.',
            'motorcycles (okadas) and tricycles (keke) often take shortcuts through unsafe areas. When booking rides, use Safe Route AI to confirm the route before you go.',
            'high-risk zones shift with the time of day. A road that\'s safe at noon could be dangerous at night. Always check scores before you travel.',
        ]
        const tip = tips[new Date().getDate() % tips.length]
        await broadcastToAll(
            `🛡️ Stay Safe This Week — A Quick Safety Reminder`,
            name => `<h2 style="color:#fff;margin:0 0 16px;">Good morning, ${name}! 👋</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  A new week means new journeys. Here's a quick safety reminder as you head out:<br/><br/>
  <div style="background:rgba(0,211,90,0.08);border-left:3px solid #00d35a;padding:16px;border-radius:0 12px 12px 0;margin:16px 0;">
    <strong style="color:#00d35a;">This week's tip:</strong><br/>
    <span style="color:rgba(255,255,255,0.7);">Nigerian ${tip}</span>
  </div>
  Stay safe on your way to work, school, or anywhere life takes you. We're always routing you safely. 🛡️
</p>`
        )
    })

    // 1st of every month at 9:00 AM — monthly message
    cron.schedule('0 9 1 * *', async () => {
        const month = new Date().toLocaleString('en-NG', { month: 'long' })
        await broadcastToAll(
            `🗓️ A New Month, A New Commitment to Safety`,
            name => `<h2 style="color:#fff;margin:0 0 16px;">Happy new month, ${name}! 🗓️</h2>
<p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;">
  Welcome to <strong style="color:#00d35a;">${month}</strong>! A fresh month is the perfect time to renew your commitment to travelling safely.<br/><br/>
  Here's how Safe Route AI can make this month better for you:<br/><br/>
  <strong style="color:#fff;">🗺️ Plan safer routes</strong> — let our AI find the lowest-risk path for every journey.<br/>
  <strong style="color:#fff;">📡 Share your location</strong> — keep your loved ones informed whenever you travel.<br/>
  <strong style="color:#fff;">🚨 Report hazards</strong> — your reports protect your neighbours and earn you safety badges.<br/>
  <strong style="color:#fff;">🤖 Ask Arlo</strong> — our AI assistant is available 24/7 for guidance and route advice.<br/><br/>
  Here's to a safe, productive, and blessed ${month}. 🛡️
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
                console.log(`🎉 Holiday detected: ${holiday.name}`)
                await broadcastToAll(
                    holiday.message('').subject,
                    name => holiday.message(name).body
                )
                break
            }
        }
    })

    console.log('✅ Scheduled: Weekly (Mon 8am), Monthly (1st 9am), Holidays (daily check 9am)')
}
