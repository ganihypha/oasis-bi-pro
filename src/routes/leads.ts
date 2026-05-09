import { Hono } from 'hono'
import { uuid } from '../lib/auth'
import type { Bindings, Variables } from '../lib/types'

/**
 * Lead-capture (UP-2 closure).
 * Form on homepage / pricing magnet → POST /api/leads
 * Stores in D1 leads table for later 7-day email drip.
 */
const leads = new Hono<{ Bindings: Bindings; Variables: Variables }>()

leads.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const {
    email, full_name, source, magnet,
    utm_source, utm_medium, utm_campaign, consent
  } = body as Record<string, any>

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ success: false, error: 'Email tidak valid' }, 400)
  }

  // Idempotency — same email + same magnet = update only.
  const existing = await c.env.DB.prepare(
    `SELECT id FROM leads WHERE email = ? AND magnet = ? LIMIT 1`
  ).bind(email, magnet || 'sovereign-bi-playbook').first<any>()

  if (existing) {
    await c.env.DB.prepare(
      `UPDATE leads SET full_name = COALESCE(?, full_name),
                        utm_source = COALESCE(?, utm_source),
                        utm_medium = COALESCE(?, utm_medium),
                        utm_campaign = COALESCE(?, utm_campaign)
        WHERE id = ?`
    ).bind(full_name || null, utm_source || null, utm_medium || null,
           utm_campaign || null, existing.id).run()
    return c.json({ success: true, deduped: true })
  }

  await c.env.DB.prepare(
    `INSERT INTO leads (id, email, full_name, source, magnet,
                        utm_source, utm_medium, utm_campaign,
                        ip, user_agent, consent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
  ).bind(
    uuid(), email, full_name || null,
    source || 'hero-magnet',
    magnet || 'sovereign-bi-playbook',
    utm_source || null, utm_medium || null, utm_campaign || null,
    c.req.header('cf-connecting-ip') || null,
    c.req.header('user-agent') || null,
    consent === false ? 0 : 1
  ).run()

  return c.json({
    success: true,
    message: 'Terima kasih! Sovereign BI Playbook akan dikirim ke email Anda.',
    download_url: '/static/sovereign-bi-playbook.pdf'  // placeholder
  })
})

/* ---------- Lead count (public proof / counter) ---------- */
leads.get('/count', async (c) => {
  const r = await c.env.DB.prepare(
    `SELECT COUNT(*) AS total FROM leads`
  ).first<any>()
  return c.json({ success: true, total: Number(r?.total || 0) })
})

export default leads
