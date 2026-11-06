import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:4000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Same-origin /api in development, so the session cookie just works.
      proxy: { '/api': { target: apiTarget, changeOrigin: true } },
    },
    preview: {
      proxy: { '/api': { target: apiTarget, changeOrigin: true } },
    },
    build: {
      // antd is shipped as its own vendor chunk (~300 kB gzipped); app code stays small.
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Vite 8 (Rolldown) only accepts the function form.
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined
            if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react'
            if (/node_modules[\\/](antd|@ant-design|@rc-component|rc-[^\\/]+)[\\/]/.test(id)) return 'antd'
            return undefined
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
