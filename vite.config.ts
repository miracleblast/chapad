import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // This ensures proper Vue 3 support
      reactivityTransform: true
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ChapaDocs',
        short_name: 'ChapaDocs',
        description: 'Official business documents made in Africa',
        theme_color: '#7c3aed',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}']
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost.crt'))
    }
  },
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Add this for better development experience
  optimizeDeps: {
    include: ['@iconify/vue']
  }
})