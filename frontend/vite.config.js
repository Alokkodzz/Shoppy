import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/products': {
        target: 'http://product-service:5001',
        changeOrigin: true
      },
      '/api/orders': {
        target: 'http://order-service:5002',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit (in kB)
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ['@mui/material', '@mui/icons-material'],
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})