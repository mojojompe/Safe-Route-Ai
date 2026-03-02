import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-map-gl': resolve(__dirname, 'node_modules/react-map-gl/dist/mapbox.js')
    }
  },
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Mapbox GL is ~1MB — keep it completely separate from the main bundle
          'mapbox': ['mapbox-gl', 'react-map-gl'],
          // Firebase auth module (large) separate from the app bundle
          'firebase': ['firebase/app', 'firebase/auth'],
          // Animation library in its own chunk
          'framer': ['framer-motion'],
        }
      }
    }
  }
})
