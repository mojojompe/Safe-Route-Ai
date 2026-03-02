import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { GlassCard } from '../components/ui/GlassCard'
import { MdNotifications, MdPerson, MdPalette, MdSave, MdAdd, MdDelete, MdRadar, MdCheck } from 'react-icons/md'

const API = import.meta.env.VITE_API_URL

interface Contact { name: string; phone: string; relationship: string }
interface Prefs {
    alertTypes: string[]; alertRadius: number; theme: string;
    mapStyle: string; emergencyContacts: Contact[]
}
const DEFAULT_PREFS: Prefs = {
    alertTypes: ['accident', 'hazard', 'closure'], alertRadius: 1000,
    theme: 'system', mapStyle: 'streets-v12', emergencyContacts: []
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? 'bg-green-500' : 'bg-gray-200 dark:bg-white/10'}`}>
            <motion.div animate={{ x: checked ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md" />
        </button>
    )
}

export default function Settings() {
    const { user } = useAuth()
    const { setTheme: applyTheme, setMapStyle: applyMapStyle } = useTheme()
    const [tab, setTab] = useState<'alerts' | 'contacts' | 'appearance'>('alerts')
    const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [newContact, setNewContact] = useState<Contact>({ name: '', phone: '', relationship: '' })
    const [showAdd, setShowAdd] = useState(false)

    useEffect(() => {
        if (!user) return
        axios.get(`${API}/api/preferences/${user.uid}`)
            .then(r => setPrefs({ ...DEFAULT_PREFS, ...r.data }))
            .catch(() => setPrefs(DEFAULT_PREFS))
            .finally(() => setLoading(false))
    }, [user])

    const save = async () => {
        if (!user) return
        setSaving(true)
        try {
            await axios.put(`${API}/api/preferences/${user.uid}`, prefs)
            // Apply theme + map style immediately via context
            applyTheme(prefs.theme as any)
            applyMapStyle(prefs.mapStyle as any)
            setSaved(true); setTimeout(() => setSaved(false), 2500)
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }

    const toggleAlert = (type: string) => setPrefs(p => ({
        ...p, alertTypes: p.alertTypes.includes(type)
            ? p.alertTypes.filter(t => t !== type) : [...p.alertTypes, type]
    }))

    const addContact = () => {
        if (!newContact.name.trim() || !newContact.phone.trim()) return
        setPrefs(p => ({ ...p, emergencyContacts: [...p.emergencyContacts, newContact] }))
        setNewContact({ name: '', phone: '', relationship: '' })
        setShowAdd(false)
    }

    const removeContact = (i: number) =>
        setPrefs(p => ({ ...p, emergencyContacts: p.emergencyContacts.filter((_, idx) => idx !== i) }))

    if (loading) return (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
    )

    return (
        <PageTransition className="min-h-screen bg-gray-50 dark:bg-sr-dark p-4 md:p-8 font-sans">
            <div className="max-w-lg mx-auto space-y-5">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Settings</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage alerts & preferences</p>
                    </div>
                    <motion.button onClick={save} disabled={saving} whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}>
                        {saved ? <MdCheck size={18} /> : saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdSave size={18} />}
                        {saved ? 'Saved!' : 'Save'}
                    </motion.button>
                </motion.div>

                {/* Tab Bar */}
                <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-2xl p-1">
                    {([['alerts', 'Alerts', MdNotifications], ['contacts', 'Emergency', MdPerson], ['appearance', 'Appearance', MdPalette]] as const).map(([id, label, Icon]) => (
                        <button key={id} onClick={() => setTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === id ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                            <Icon size={16} /><span>{label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'alerts' && (
                        <motion.div key="alerts" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                            <GlassCard className="p-5 space-y-4">
                                <h2 className="text-sm font-black text-gray-900 dark:text-white">Alert Types</h2>
                                {[
                                    { id: 'accident', label: 'Accident Alerts', sub: 'Nearby collision reports', emoji: '💥' },
                                    { id: 'hazard', label: 'Hazard Alerts', sub: 'Road hazards & obstacles', emoji: '⚠️' },
                                    { id: 'police', label: 'Police Presence', sub: 'Police activity nearby', emoji: '👮' },
                                    { id: 'closure', label: 'Road Closures', sub: 'Blocked or closed routes', emoji: '🚧' },
                                ].map(item => (
                                    <div key={item.id} className="flex items-center justify-between py-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{item.emoji}</span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
                                            </div>
                                        </div>
                                        <Toggle checked={prefs.alertTypes.includes(item.id)} onChange={() => toggleAlert(item.id)} />
                                    </div>
                                ))}
                            </GlassCard>

                            <GlassCard className="p-5">
                                <h2 className="text-sm font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MdRadar className="text-green-500" /> Alert Radius
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-500">
                                        <span>100m</span>
                                        <span className="text-green-600 dark:text-green-400 text-sm">{prefs.alertRadius >= 1000 ? `${prefs.alertRadius / 1000}km` : `${prefs.alertRadius}m`}</span>
                                        <span>5km</span>
                                    </div>
                                    <input type="range" min={100} max={5000} step={100} value={prefs.alertRadius}
                                        onChange={e => setPrefs(p => ({ ...p, alertRadius: Number(e.target.value) }))}
                                        className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-green-500" />
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {tab === 'contacts' && (
                        <motion.div key="contacts" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            <GlassCard className="p-5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-sm font-black text-gray-900 dark:text-white">Emergency Contacts</h2>
                                    <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                                        <MdAdd size={16} /> Add
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {showAdd && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/5">
                                                {[['name', 'Full Name'], ['phone', 'Phone Number (+234...)'], ['relationship', 'Relationship']].map(([key, placeholder]) => (
                                                    <input key={key} placeholder={placeholder}
                                                        value={newContact[key as keyof Contact]}
                                                        onChange={e => setNewContact(prev => ({ ...prev, [key]: e.target.value }))}
                                                        className="w-full px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                                ))}
                                                <button onClick={addContact} className="w-full py-2.5 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-600 transition-colors">Add Contact</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {prefs.emergencyContacts.length === 0 && !showAdd && (
                                    <p className="text-sm text-gray-400 text-center py-4">No emergency contacts yet</p>
                                )}
                                {prefs.emergencyContacts.map((c, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black flex-shrink-0">
                                            {c.name[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{c.phone} · {c.relationship}</p>
                                        </div>
                                        <button onClick={() => removeContact(i)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                            <MdDelete size={16} />
                                        </button>
                                    </div>
                                ))}
                            </GlassCard>
                        </motion.div>
                    )}

                    {tab === 'appearance' && (
                        <motion.div key="appearance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            <GlassCard className="p-5 space-y-6">
                                {[
                                    { title: 'App Theme', key: 'theme', options: [{ id: 'system', label: 'System', emoji: '💻' }, { id: 'light', label: 'Light', emoji: '☀️' }, { id: 'dark', label: 'Dark', emoji: '🌙' }] },
                                    { title: 'Map Style', key: 'mapStyle', options: [{ id: 'streets-v12', label: 'Street', emoji: '🗺️' }, { id: 'satellite-streets-v12', label: 'Satellite', emoji: '🛰️' }, { id: 'dark-v11', label: 'Dark', emoji: '🌑' }] },
                                ].map(section => (
                                    <div key={section.key}>
                                        <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">{section.title}</h2>
                                        <div className="grid grid-cols-3 gap-2">
                                            {section.options.map(opt => (
                                                <button key={opt.id}
                                                    onClick={() => setPrefs(p => ({ ...p, [section.key]: opt.id }))}
                                                    className={`p-3 rounded-2xl text-center transition-all border-2 ${(prefs as any)[section.key] === opt.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-transparent bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                                                    <span className="text-2xl block mb-1">{opt.emoji}</span>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    )
}
