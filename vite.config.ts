import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isVercelBuild = process.env.VERCEL === '1'

// https://vite.dev/config/
export default defineConfig({
  base: isVercelBuild ? '/' : './',
  build: {
    outDir: isVercelBuild ? 'dist' : 'docs',
  },
  plugins: [react()],
})
