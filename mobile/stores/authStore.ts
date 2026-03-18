import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface User {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    safetyTier?: string
}

interface AuthStore {
    user: User | null
    token: string | null
    isLoading: boolean
    setUser: (user: User, token: string) => Promise<void>
    logout: () => Promise<void>
    loadFromStorage: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isLoading: true,

    setUser: async (user, token) => {
        await SecureStore.setItemAsync('sr_token', token)
        await SecureStore.setItemAsync('sr_user', JSON.stringify(user))
        set({ user, token })
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('sr_token')
        await SecureStore.deleteItemAsync('sr_user')
        set({ user: null, token: null })
    },

    loadFromStorage: async () => {
        try {
            const token = await SecureStore.getItemAsync('sr_token')
            const userStr = await SecureStore.getItemAsync('sr_user')
            if (token && userStr) {
                set({ user: JSON.parse(userStr), token, isLoading: false })
            } else {
                set({ isLoading: false })
            }
        } catch {
            set({ isLoading: false })
        }
    },
}))
