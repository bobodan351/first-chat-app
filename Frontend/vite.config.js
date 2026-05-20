import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script', // Forces browser registration
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: "WeChat",
        short_name: "WeChat",
          start_url: "/",
        description: 'Instant real-time chat application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/chat.png', // Ensure this image is exactly 192x192px
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/chat-512.png', // MUST be a different file that is exactly 512x512px
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true, // Forces PWA to show install prompt on localhost
        type: 'module'
      }
    })
  ],
})
