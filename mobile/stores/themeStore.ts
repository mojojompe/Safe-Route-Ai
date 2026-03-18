import { create } from 'zustand'
import { Appearance } from 'react-native'

type Theme = 'dark' | 'light' | 'system'

interface ThemeStore {
    theme: Theme
    resolved: 'dark' | 'light'
    setTheme: (t: Theme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: 'system',
    resolved: (Appearance.getColorScheme() ?? 'dark') as 'dark' | 'light',
    setTheme: (t) => {
        const resolved = t === 'system'
            ? (Appearance.getColorScheme() ?? 'dark') as 'dark' | 'light'
            : t
        set({ theme: t, resolved })
    },
}))
