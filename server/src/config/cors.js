import { config } from './env.js'

/** @param {string | undefined} url */
export function normalizeOrigin(url) {
  if (!url || typeof url !== 'string') return ''
  return url.trim().replace(/\/$/, '')
}

function parseExtraOrigins() {
  const raw = process.env.CLIENT_URLS || ''
  return raw
    .split(',')
    .map((o) => normalizeOrigin(o))
    .filter(Boolean)
}

/** Origins allowed in production (Netlify deploys). */
function isNetlifyAppOrigin(origin) {
  return /^https:\/\/[\w-]+(\.[\w-]+)*\.netlify\.app$/i.test(origin)
}

export function getAllowedOrigins() {
  const origins = new Set([
    normalizeOrigin(config.CLIENT_URL),
    ...parseExtraOrigins(),
  ])
  if (config.NODE_ENV === 'development') {
    origins.add('http://localhost:5173')
    origins.add('http://127.0.0.1:5173')
  }
  return origins
}

/** @param {string | undefined} origin */
export function isOriginAllowed(origin) {
  if (!origin) return true
  const normalized = normalizeOrigin(origin)
  if (getAllowedOrigins().has(normalized)) return true
  if (config.NODE_ENV === 'production' && isNetlifyAppOrigin(normalized)) return true
  return false
}
