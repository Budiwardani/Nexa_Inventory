import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('@tanstack')) return 'vendor-react-query';
          if (id.includes('react-router') || id.includes('@remix-run')) return 'vendor-router';
          if (id.includes('framer-motion') || id.includes('/motion')) return 'vendor-motion';
          if (id.includes('@radix-ui') || id.includes('radix')) return 'vendor-radix';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (
            id.includes('react-hook-form') ||
            id.includes('@hookform') ||
            id.includes('zod') ||
            id.includes('zustand')
          ) {
            return 'vendor-forms';
          }
          if (id.includes('axios')) return 'vendor-axios';

          return 'vendor';
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
