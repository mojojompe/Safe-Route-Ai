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
  }
})
