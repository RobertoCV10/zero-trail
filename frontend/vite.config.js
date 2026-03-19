import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // Permite conexiones externas a Docker
    port: 3000,      // Cambiamos el puerto interno a 3000
    strictPort: true, 
    watch: {
      usePolling: true,
    },
  },
})