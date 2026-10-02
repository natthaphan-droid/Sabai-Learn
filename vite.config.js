import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { proxy: { '/api': `http://127.0.0.1:${process.env.SABAI_API_PORT || 8787}` } },
})
