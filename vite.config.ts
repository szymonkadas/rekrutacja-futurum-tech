import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' && process.env.GITHUB_PAGES ? '/rekrutacja-futurum-tech/' : '/',
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
}))
