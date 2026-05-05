// Vite configuration for React SPA - Optimized for mobile performance
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  envPrefix: 'REACT_APP_', // Agar Vite mau baca variabel REACT_APP_ di .env
  define: {
    'process.env': process.env // Agar kode lama yang pake process.env tidak error
  },
  build: {
    outDir: 'build',
    assetsDir: 'static',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015', // Better mobile support
    rollupOptions: {
      output: {
        // Disable manual chunks in development to prevent preload warnings
        ...(process.env.NODE_ENV === 'production' ? {
          manualChunks: {
            // Core React libraries
            'react-vendor': ['react', 'react-dom'],
            // Router
            'router': ['react-router-dom'],
            // UI components
            'ui-icons': ['lucide-react'],
            // Helmet for SEO
            'helmet': ['react-helmet-async'],
            // Leaflet maps (lazy loaded)
            'maps': ['leaflet']
          }
        } : {}),
        // Optimize chunk names for better caching
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    },
    // Optimize bundle size
    chunkSizeWarningLimit: 1000,
    // Enable compression
    reportCompressedSize: true
  },
  server: {
    port: 3001,
    host: true
  },
  preview: {
    port: 3001,
    host: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
