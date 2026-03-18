import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('sr_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Auth endpoints
export const authApi = {
    register: (data: { name: string; email: string; password: string; phone?: string }) =>
        api.post('/auth/register', data),
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    verifyOtp: (email: string, code: string, type: 'signup' | 'reset') =>
        api.post('/auth/verify-otp', { email, code, type }),
    resendOtp: (email: string, type: 'signup' | 'reset') =>
        api.post('/auth/resend-otp', { email, type }),
    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),
    resetPassword: (email: string, code: string, password: string) =>
        api.post('/auth/reset-password', { email, code, password }),
}

// Route endpoints (same as web)
export const routeApi = {
    getHistory: (userId: string) => api.get('/routes', { params: { userId } }),
    getRoute: (id: string) => api.get(`/routes/${id}`),
    saveRoute: (data: any) => api.post('/routes', data),
    deleteRoute: (id: string) => api.delete(`/routes/${id}`),
    getStats: (userId: string) => api.get('/stats', { params: { userId } }),
    // Get scored route options from start -> destination coordinates
    getOptions: (start: [number, number], destination: [number, number], mode: 'driving' | 'walking' = 'driving') =>
        api.post('/routes/options', { start, destination, mode }),
}

// Places autocomplete (Nigeria DB)
export const placesApi = {
    search: (q: string, limit = 8) => api.get('/places', { params: { q, limit } }),
}

// Favorites
export const favApi = {
    getAll: (userId: string) => api.get('/favorites', { params: { userId } }),
    add: (data: any) => api.post('/favorites', data),
    remove: (id: string) => api.delete(`/favorites/${id}`),
}

// Reports / Hazards
export const reportApi = {
    getAll: (days?: number) => api.get('/reports', { params: { days: days || 7 } }),
    create: (data: any) => api.post('/reports', data),
    upvote: (id: string) => api.post(`/reports/${id}/upvote`),
}

// Chat (Navigator)
export const chatApi = {
    send: (message: string, history: any[]) =>
        api.post('/chat', { message, history }),
}
