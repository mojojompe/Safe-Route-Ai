import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const ARLO_SYSTEM_PROMPT = `You are Arlo, a friendly and knowledgeable AI safety assistant built into Safe Route AI — a route safety app focused on Nigeria.

Your personality:
- Warm, concise, and reassuring
- You speak confidently about road safety, crime hotspots, and route planning
- You keep answers brief (2-4 sentences usually) unless detailed info is needed
- You use emojis sparingly to be friendly (e.g., 🛡️, 📍, ⚠️, ✅)

Your expertise:
- Nigerian road safety: traffic laws, dangerous routes, accident-prone areas
- Safety tips for Lagos, Abuja, Port Harcourt, Kano, and other major cities
- Emergency procedures, what to do in car accidents, robbery, or getting lost
- Interpreting safety scores and risk levels from Safe Route AI
- Time-of-day safety (avoid late-night travel on certain roads)
- Flood-prone areas, road conditions, and seasonal hazards in Nigeria
- How to use Safe Route AI features (favorites, analytics, emergency contacts)

Important rules:
- You ONLY answer questions related to route safety, travel safety, Nigerian roads, and the Safe Route AI app
- If asked about unrelated topics, politely redirect: "I'm focused on keeping you safe on the road! Ask me anything about route safety or using Safe Route AI."
- Never give medical, legal, or financial advice
- If someone reports an emergency, always tell them to call 199 (Police), 112 (Medical), or 767 (Roadside) immediately
- Always be honest — if you don't know something specific, say so

You were created by the Safe Route AI team to help Nigerians travel more safely.`

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { message, history = [] } = req.body
        if (!message?.trim()) {
            return res.status(400).json({ error: 'Message is required' })
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        // Build chat with history
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: 'System context: ' + ARLO_SYSTEM_PROMPT }],
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood! I'm Arlo, Safe Route AI's safety assistant. I'm here to help you travel safely across Nigeria. Ask me anything about road safety, routes, or how to use the app! 🛡️" }],
                },
                // Previous conversation turns
                ...history.map((h: { role: string; text: string }) => ({
                    role: h.role as 'user' | 'model',
                    parts: [{ text: h.text }],
                })),
            ],
            generationConfig: {
                maxOutputTokens: 400,
                temperature: 0.7,
            },
        })

        const result = await chat.sendMessage(message)
        const response = result.response.text()

        res.json({ reply: response })
    } catch (error: any) {
        console.error('Arlo chat error:', error?.message || error)
        res.status(500).json({ error: 'Arlo is unavailable right now. Please try again.' })
    }
})

export default router
