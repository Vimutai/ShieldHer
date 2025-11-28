import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API requests to Flask backend if enabled
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        // Set to false to allow frontend-only mode
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Backend not running, using frontend-only mode');
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
