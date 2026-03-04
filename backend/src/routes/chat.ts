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

// Try these models in order until one works
const MODEL_FALLBACKS = [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-pro-preview-03-25',
    'gemini-2.5-flash-preview-04-17',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.0-pro',
]

async function tryChat(genAI: GoogleGenerativeAI, message: string, mappedHistory: any[]) {
    let lastError: any
    for (const modelName of MODEL_FALLBACKS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_PROMPT,
            })
            const chat = model.startChat({
                history: mappedHistory,
                generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
            })
            const result = await chat.sendMessage(message)
            return result.response.text()
        } catch (err: any) {
            lastError = err
            const msg: string = err?.message || ''
            // If it's a 404 / model not found, try the next model
            if (msg.includes('404') || msg.includes('not found') || msg.includes('MODEL_NOT_FOUND') || msg.includes('INVALID_ARGUMENT')) {
                console.warn(`Model ${modelName} unavailable, trying next...`)
                continue
            }
            // For other errors (auth, quota, network), throw immediately
            throw err
        }
    }
    throw lastError
}

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

        // Map history roles: frontend uses 'arlo' for assistant; SDK needs 'model'
        const mappedHistory = (history as { role: string; text: string }[])
            .filter(h => h.role && h.text)
            .map(h => ({
                role: (h.role === 'user' ? 'user' : 'model') as 'user' | 'model',
                parts: [{ text: h.text }],
            }))

        const reply = await tryChat(genAI, message.trim(), mappedHistory)
        res.json({ reply })

    } catch (error: any) {
        const msg: string = error?.message || String(error)
        console.error('Navigator chat error:', msg)

        let clientErr = 'Navigator is unavailable right now. Please try again.'
        if (msg.includes('API key') || msg.includes('api key') || msg.includes('API_KEY')) {
            clientErr = 'Invalid Gemini API key. Please check environment variables.'
        } else if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
            clientErr = 'AI quota exceeded. Please try again later.'
        }

        res.status(500).json({ error: clientErr })
    }
})

export default router
