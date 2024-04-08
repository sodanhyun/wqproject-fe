import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@headlessui/tailwindcss'


// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  server: {
    proxy: {
      '/api': {
        //DEPLOY
        //target: 'https://3.35.239.151',
        //TEST
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      }
    }
  }
})
