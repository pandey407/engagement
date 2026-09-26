import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from the root of invite.ashleshpandey.com.np, so base stays '/'.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
