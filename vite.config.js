import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

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
      hmr: { overlay: false },
      historyApiFallback: true,
      proxy: {
        '/api/chat': {
          target: 'https://openrouter.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chat/, '/api/v1/chat/completions'),
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          },
        },
      },
    },
  }
})
