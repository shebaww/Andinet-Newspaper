import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.DEV': true,
    'import.meta.env.MODE': JSON.stringify('development')
  }
})