import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'
import { sessionMiddleware } from './middleware/auth'
import authRoutes from './routes/auth'
import duitkuRoutes from './routes/duitku'
import analyticsRoutes from './routes/analytics'
import teamRoutes from './routes/team'
import leadsRoutes from './routes/leads'
import statusRoutes from './routes/status'
import { renderShell } from './pages/shell'
import type { Bindings, Variables } from './lib/types'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('*', logger())
app.use('/api/*', cors())
app.use('*', sessionMiddleware)

/* ---------- API ---------- */
app.get('/api/health', (c) =>
  c.json({
    success: true,
    service: c.env.APP_NAME || 'OASIS BI Pro',
    version: c.env.APP_VERSION || '3.0.0-cloudflare',
    stack: 'Cloudflare Pages + Workers + D1 + KV + R2 + Hono',
    timestamp: new Date().toISOString()
  })
)

app.route('/api/auth', authRoutes)
app.route('/api/duitku', duitkuRoutes)
app.route('/api/analytics', analyticsRoutes)
app.route('/api/team', teamRoutes)
app.route('/api/leads', leadsRoutes)
app.route('/api/status', statusRoutes)

/* ---------- SEO endpoints ---------- */
app.get('/robots.txt', (c) =>
  c.text(`User-agent: *
Allow: /
Sitemap: https://oasis-bi-pro.web.id/sitemap.xml
Sitemap: https://oasis-bi-pro.pages.dev/sitemap.xml
`)
)

app.get('/sitemap.xml', (c) => {
  const base = 'https://oasis-bi-pro.pages.dev'
  const urls = ['', '/pricing', '/about', '/login', '/register',
    '/terms', '/privacy', '/refund', '/contact', '/status']
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => `  <url>
    <loc>${base}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '' ? '1.0' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`
  return c.body(xml, 200, { 'Content-Type': 'application/xml' })
})

/* ---------- Static assets ---------- */
app.get('/static/*', serveStatic({ root: './' }))
app.get('/favicon.ico', serveStatic({ path: './static/favicon.ico' }))

/* ---------- Pages (SPA shell) ---------- */
const pageRoutes = [
  '/', '/login', '/register', '/pricing', '/dashboard',
  '/checkout', '/payment/success', '/payment/failed',
  '/about', '/legal', '/contact',
  '/terms', '/privacy', '/refund',
  '/status', '/smoketest'
]
for (const r of pageRoutes) {
  app.get(r, (c) => c.html(renderShell(c.env, c.get('user'))))
}

/* ---------- 404 fallback ---------- */
app.notFound((c) =>
  c.req.path.startsWith('/api/')
    ? c.json({ success: false, error: 'Not found' }, 404)
    : c.html(renderShell(c.env, c.get('user')))
)

export default app
