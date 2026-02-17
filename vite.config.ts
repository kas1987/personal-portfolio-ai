import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: process.env.VITE_DEV_API_PROXY_TARGET
      ? {
          '/api': {
            target: process.env.VITE_DEV_API_PROXY_TARGET,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        }
      : undefined,
  },
})
