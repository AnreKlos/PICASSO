import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react'
            if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
            if (id.includes('node_modules/lenis') || id.includes('node_modules/embla-carousel')) return 'vendor-utils'
          },
        },
      },
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      hmr: { overlay: false },
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
