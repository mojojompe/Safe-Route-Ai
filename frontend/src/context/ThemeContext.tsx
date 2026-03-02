import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'
type MapStyle = 'streets-v12' | 'satellite-streets-v12' | 'dark-v11'

interface ThemeContextType {
    theme: Theme
    mapStyle: MapStyle
    resolvedTheme: 'light' | 'dark'
    setTheme: (t: Theme) => void
    setMapStyle: (s: MapStyle) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY_THEME = 'sr_theme'
const STORAGE_KEY_MAP = 'sr_map_style'

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    return resolved as 'light' | 'dark'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem(STORAGE_KEY_THEME) as Theme) || 'system'
    )
    const [mapStyle, setMapStyleState] = useState<MapStyle>(
        () => (localStorage.getItem(STORAGE_KEY_MAP) as MapStyle) || 'streets-v12'
    )
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

    // Apply theme on mount and changes
    useEffect(() => {
        const resolved = applyTheme(theme)
        setResolvedTheme(resolved)
    }, [theme])

    // Watch system preference if set to 'system'
    useEffect(() => {
        if (theme !== 'system') return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => { const r = applyTheme('system'); setResolvedTheme(r) }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [theme])

    const setTheme = (t: Theme) => {
        localStorage.setItem(STORAGE_KEY_THEME, t)
        setThemeState(t)
    }

    const setMapStyle = (s: MapStyle) => {
        localStorage.setItem(STORAGE_KEY_MAP, s)
        setMapStyleState(s)
    }

    return (
        <ThemeContext.Provider value={{ theme, mapStyle, resolvedTheme, setTheme, setMapStyle }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
