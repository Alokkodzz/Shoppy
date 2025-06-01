import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api/products': {
        target: 'http://3.94.57.46:5001',
        changeOrigin: true
      },
      '/api/orders': {
        target: 'http://3.94.57.46:5002',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const module = id.toString().split('node_modules/')[1].split('/')[0]
            // Ensure MUI and Emotion are bundled together
            if (module === '@mui' || module === '@emotion') {
              return 'mui'
            }
            return module
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/icons-material'
    ],
  }
})