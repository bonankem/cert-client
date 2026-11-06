/**
 * Production web server for Heroku (Vercel uses vercel.json instead).
 *
 *  - Serves the built app from dist/, with SPA fallback so /admin/... works on refresh.
 *  - Forwards /api/* to the API app (API_URL), so the browser only ever talks to
 *    this origin and the admin session cookie stays first-party.
 *
 * Env: PORT (set by Heroku), API_URL (e.g. https://cert-server.herokuapp.com).
 */
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_URL = process.env.API_URL?.replace(/\/+$/, '')
if (!API_URL) {
  console.error('API_URL is not set. Point it at the API app, e.g. https://cert-server.herokuapp.com')
  process.exit(1)
}

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

// Same security headers as vercel.json.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'DENY')
  next()
})

// API: forwarded untouched (path, body, cookies). xfwd passes the real client IP on.
app.use(
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    xfwd: true,
    pathFilter: '/api',
    proxyTimeout: 25_000,
    on: {
      error: (_err, _req, res) => {
        if ('writeHead' in res && !res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ statusCode: 502, message: 'The server is starting up. Please try again in a moment.' }))
        }
      },
    },
  }),
)

// Hashed build assets never change: cache for a year.
app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }))
app.use(express.static(dist, { index: false, maxAge: '1h' }))

// Everything else is a client-side route: always the latest index.html.
app.get('/{*path}', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.sendFile(path.join(dist, 'index.html'))
})

const port = Number(process.env.PORT) || 8080
app.listen(port, () => console.log(`Client listening on :${port}, forwarding /api to ${API_URL}`))
