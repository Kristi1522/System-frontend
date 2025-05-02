import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Restorant Manager',
        short_name: 'Restorant',
        description: 'Paneli i brendshëm i menaxhimit për stafin e restorantit.',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/222.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/222.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ]
});
