import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple config without aliases
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
    open: false
  }
})
