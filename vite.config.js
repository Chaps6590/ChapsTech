import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Seguridad (CSP) y analítica (Umami) se inyectan solo en el build:
// en dev la CSP rompería el HMR de Vite y no queremos contar visitas de desarrollo.
const securityAndAnalytics = (env) => {
  // Umami: VITE_UMAMI_URL (ej. https://stats.chapstech.cloud) y VITE_UMAMI_ID
  const umamiUrl = (env.VITE_UMAMI_URL || '').replace(/\/+$/, '')
  const umamiId = env.VITE_UMAMI_ID || ''
  const umami = umamiUrl && umamiId ? umamiUrl : ''

  const csp = [
    "default-src 'self'",
    `script-src 'self'${umami ? ' ' + umami : ''}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "media-src 'self'",
    `connect-src 'self'${umami ? ' ' + umami : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'security-and-analytics',
    apply: 'build',
    transformIndexHtml: () => {
      const tags = [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: csp }, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
      ]
      if (umami) {
        tags.push({
          tag: 'script',
          attrs: { defer: true, src: `${umami}/script.js`, 'data-website-id': umamiId },
          injectTo: 'head',
        })
      }
      return tags
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  return {
    plugins: [react(), securityAndAnalytics(env)],
  }
})
