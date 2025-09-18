import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
            runtimeCaching: [
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  }
                }
              }
            ]
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.png', 'exercsies/*.png'],
          manifest: {
            name: 'مستشفى الملك عبدالله - بيشه | نظام مواعيد العلاج الطبيعي',
            short_name: 'PT Scheduler',
            description: 'نظام حجز مواعيد العلاج الطبيعي - مستشفى الملك عبدالله ببيشة',
            theme_color: '#1e40af',
            background_color: '#f1f5f9',
            display: 'standalone',
            orientation: 'portrait-primary',
            scope: '/',
            start_url: '/',
            lang: 'ar',
            dir: 'rtl',
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
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ],
            categories: ['medical', 'health', 'productivity'],
            screenshots: [
              {
                src: 'screenshot-wide.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide'
              },
              {
                src: 'screenshot-narrow.png',
                sizes: '540x720',
                type: 'image/png',
                form_factor: 'narrow'
              }
            ]
          },
          devOptions: {
            enabled: true
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      publicDir: 'Public'
    };
});
