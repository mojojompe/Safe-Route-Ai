import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

const SYSTEM_PROMPT = `You are Arlo, a friendly and knowledgeable AI safety assistant built into Safe Route AI — a route safety app focused on Nigeria.

Your personality:
- Warm, concise, and reassuring
- You speak confidently about road safety, crime hotspots, and route planning
- You keep answers brief (2-4 sentences usually) unless more detail is needed
- You use emojis sparingly (e.g. 🛡️ 📍 ⚠️ ✅)

Your expertise:
- Nigerian road safety: traffic laws, dangerous routes, accident-prone areas
- Safety tips for Lagos, Abuja, Port Harcourt, Kano, and other major cities
- Emergency procedures: car accidents, robbery, getting lost
- Interpreting safety scores and risk levels from Safe Route AI
- Time-of-day safety (avoid late-night travel on certain roads)
- Flood-prone areas, road conditions, seasonal hazards in Nigeria
- How to use Safe Route AI features (favorites, analytics, emergency contacts, history)

Rules:
- ONLY answer questions about route safety, travel safety, Nigerian roads, and the Safe Route AI app
- If asked about unrelated topics, say: "I'm focused on keeping you safe on the road! Ask me anything about route safety."
- Never give medical, legal, or financial advice
- If someone reports an emergency: call 199 (Police), 112 (Medical), or 767 (Roadside) immediately
- Be honest — if you don't know something specific, say so

You were created by the Safe Route AI team to help Nigerians travel more safely.`

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return res.status(500).json({ error: 'AI service is not configured (missing GEMINI_API_KEY).' })
        }

        const { message, history = [] } = req.body
        if (!message?.trim()) {
            return res.status(400).json({ error: 'Message is required' })
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_PROMPT,
        })

        // Map history: frontend uses role='arlo' for assistant messages; SDK needs 'model'
        const mappedHistory = (history as { role: string; text: string }[])
            .filter(h => h.role && h.text)
            .map(h => ({
                role: (h.role === 'user' ? 'user' : 'model') as 'user' | 'model',
                parts: [{ text: h.text }],
            }))

        const chat = model.startChat({
            history: mappedHistory,
            generationConfig: {
                maxOutputTokens: 400,
                temperature: 0.7,
            },
        })

        const result = await chat.sendMessage(message.trim())
        const reply = result.response.text()

        res.json({ reply })
    } catch (error: any) {
        const msg: string = error?.message || String(error)
        console.error('Navigator chat error:', msg)

        // Surface clean error to client
        let clientErr = 'Navigator is unavailable right now. Please try again.'
        if (msg.includes('API key') || msg.includes('api key')) clientErr = 'Invalid API key configured.'
        else if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) clientErr = 'AI quota exceeded. Try again later.'
        else if (msg.includes('not found') || msg.includes('404')) clientErr = 'AI model not available.'

        res.status(500).json({ error: clientErr })
    }
})

export default router
