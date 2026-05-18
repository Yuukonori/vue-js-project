import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/local-api': {
        target: 'http://127.0.0.1:5050',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local-api/, '/api'),
      },
      '/api': {
        target: 'https://api-management-front-7jes35hloq-as.a.run.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
