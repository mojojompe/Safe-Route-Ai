import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import axios from 'axios'
import { MdSend, MdRefresh } from 'react-icons/md'

const API = import.meta.env.VITE_API_URL

interface Message {
    id: string
    role: 'user' | 'arlo'
    text: string
    timestamp: Date
}

const SUGGESTED_PROMPTS = [
    "Is it safe to drive at night in Lagos? 🌙",
    "What should I do if I'm in a car accident? 🚗",
    "Which roads are most dangerous in Abuja?",
    "How do I read my safety score?",
    "Tips for travelling during rainy season ☔",
    "What does a High risk route mean?",
]

const ARLO_AVATAR = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="20" fill="#00d35a"/>
  <circle cx="20" cy="16" r="7" fill="white" opacity="0.95"/>
  <path d="M6 36 Q20 26 34 36" fill="white" opacity="0.95"/>
  <circle cx="16" cy="15" r="1.5" fill="#00d35a"/>
  <circle cx="24" cy="15" r="1.5" fill="#00d35a"/>
  <path d="M17 19 Q20 21 23 19" stroke="#00d35a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</svg>
`)}`

function TypingIndicator() {
    return (
        <div className="flex gap-1.5 items-center px-4 py-3">
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    )
}

function MessageBubble({ msg }: { msg: Message }) {
    const isArlo = msg.role === 'arlo'
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`flex gap-3 ${isArlo ? 'justify-start' : 'justify-end'}`}
        >
            {isArlo && (
                <img src={ARLO_AVATAR} alt="Arlo" className="w-8 h-8 rounded-full flex-shrink-0 mt-1 ring-2 ring-green-500/30" />
            )}
            <div className={`max-w-[80%] ${isArlo ? '' : 'order-first'}`}>
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isArlo
                        ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm border border-gray-100 dark:border-white/10'
                        : 'bg-green-500 text-white rounded-tr-sm shadow-md shadow-green-500/20'
                        }`}
                >
                    {msg.text}
                </div>
                <p className={`text-[10px] text-gray-400 mt-1 ${isArlo ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </motion.div>
    )
}

export default function ArloChat() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'arlo',
            text: `Hey${user?.displayName ? ` ${user.displayName.split(' ')[0]}` : ''}! 👋 I'm **Arlo**, your Safe Route AI safety assistant.\n\nI can help you with Nigerian road safety, interpret your route scores, give you safety tips for any city, and answer questions about using the app.\n\nWhat would you like to know? 🛡️`,
            timestamp: new Date(),
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<{ role: string; text: string }[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return
        const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await axios.post(`${API}/api/chat`, {
                message: text,
                history,
            })
            const reply = res.data.reply
            const arloMsg: Message = { id: (Date.now() + 1).toString(), role: 'arlo', text: reply, timestamp: new Date() }
            setMessages(prev => [...prev, arloMsg])
            setHistory(prev => [
                ...prev,
                { role: 'user', text },
                { role: 'model', text: reply },
            ])
        } catch (err: any) {
            const backendMsg = err?.response?.data?.error
            const errMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'arlo',
                text: backendMsg
                    ? `⚠️ ${backendMsg}`
                    : "I'm having trouble connecting right now. Please try again in a moment! 🛡️",
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, errMsg])
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    const clearChat = () => {
        setMessages([{
            id: 'welcome-' + Date.now(),
            role: 'arlo',
            text: `Chat cleared! I'm still here to help with any road safety questions. 🛡️`,
            timestamp: new Date(),
        }])
        setHistory([])
    }

    return (
        <PageTransition className="flex flex-col h-screen bg-gray-50 dark:bg-sr-dark font-sans overflow-hidden">

            {/* ── Header ── */}
            <div className="flex-shrink-0 px-4 md:px-6 py-4 bg-white/80 dark:bg-black/30 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                <div className="relative">
                    <img src={ARLO_AVATAR} alt="Arlo" className="w-10 h-10 rounded-full ring-2 ring-green-500/40" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div className="flex-1">
                    <h1 className="font-black text-gray-900 dark:text-white text-base">Navigator</h1>
                    <p className="text-xs text-green-500 font-semibold">Safe Route AI Assistant · Online</p>
                </div>
                <button onClick={clearChat} title="Clear chat"
                    className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                    <MdRefresh size={18} />
                </button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4"
                style={{ scrollbarWidth: 'thin' }}>

                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

                {/* Typing indicator */}
                <AnimatePresence>
                    {loading && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex gap-3 items-start">
                            <img src={ARLO_AVATAR} alt="Arlo" className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-green-500/30" />
                            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-white/10 shadow-sm">
                                <TypingIndicator />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={bottomRef} />
            </div>

            {/* ── Suggested prompts (show only if no user messages yet) ── */}
            <AnimatePresence>
                {messages.filter(m => m.role === 'user').length === 0 && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-shrink-0 px-4 md:px-6 pb-2 overflow-x-auto">
                        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
                            {SUGGESTED_PROMPTS.map(p => (
                                <button key={p} onClick={() => sendMessage(p)}
                                    className="flex-shrink-0 px-3 py-2 bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-2xl border border-gray-200 dark:border-white/10 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-all whitespace-nowrap shadow-sm">
                                    {p}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div className="flex-shrink-0 px-4 md:px-6 py-3 bg-white/80 dark:bg-black/30 backdrop-blur-xl border-t border-gray-100 dark:border-white/10">
                <div className="flex items-end gap-3 bg-gray-100 dark:bg-white/10 rounded-3xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-500/50 transition-all">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Navigator about road safety..."
                        rows={1}
                        style={{ resize: 'none', minHeight: '24px', maxHeight: '120px' }}
                        className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none py-1 scrollbar-none"
                        onInput={e => {
                            const t = e.currentTarget
                            t.style.height = 'auto'
                            t.style.height = `${Math.min(t.scrollHeight, 120)}px`
                        }}
                    />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className="w-9 h-9 flex-shrink-0 rounded-2xl bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors mb-0.5 shadow-md shadow-green-500/30"
                    >
                        <MdSend size={16} />
                    </motion.button>
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    Navigator can make mistakes. Always verify critical safety information.
                </p>
            </div>

        </PageTransition>
    )
}
