import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
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
