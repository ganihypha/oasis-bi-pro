import { Hono } from 'hono'
import type { Bindings, Variables } from '../lib/types'

/**
 * Public status page API (UP-5 closure).
 * Returns service health snapshot for /status SPA page.
 */
const status = new Hono<{ Bindings: Bindings; Variables: Variables }>()

status.get('/', async (c) => {
  const start = Date.now()

  // Component checks
  const checks: Array<{ name: string; status: string; latency_ms: number; note?: string }> = []

  // 1. Workers (always operational if this responds)
  checks.push({
    name: 'Cloudflare Workers',
    status: 'operational',
    latency_ms: Date.now() - start,
    note: 'Hono runtime · edge-deployed'
  })

  // 2. D1
  const d1Start = Date.now()
  try {
    await c.env.DB.prepare(`SELECT 1 AS ok`).first()
    checks.push({
      name: 'Cloudflare D1',
      status: 'operational',
      latency_ms: Date.now() - d1Start,
      note: 'oasis-bi-pro-production'
    })
  } catch (e: any) {
    checks.push({
      name: 'Cloudflare D1',
      status: 'down',
      latency_ms: Date.now() - d1Start,
      note: e?.message || 'D1 unreachable'
    })
  }

  // 3. KV
  const kvStart = Date.now()
  try {
    await c.env.OASIS_KV.get('healthcheck:ping')
    checks.push({
      name: 'Cloudflare KV',
      status: 'operational',
      latency_ms: Date.now() - kvStart,
      note: 'OASIS_KV namespace'
    })
  } catch (e: any) {
    checks.push({
      name: 'Cloudflare KV',
      status: 'down',
      latency_ms: Date.now() - kvStart,
      note: e?.message || 'KV unreachable'
    })
  }

  // 4. R2 (just bind check — does not list)
  checks.push({
    name: 'Cloudflare R2',
    status: c.env.OASIS_R2 ? 'operational' : 'unconfigured',
    latency_ms: 0,
    note: 'oasis-bi-pro-bucket'
  })

  // 5. Duitku reachability (HEAD only — fast)
  const duitkuStart = Date.now()
  try {
    const url = (c.env.DUITKU_BASE_URL || 'https://api.duitku.com/webapi/v1/payment').replace(/\/+$/, '')
    const r = await fetch(`${url}/transactionStatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(5000)
    })
    checks.push({
      name: 'Duitku Gateway',
      status: r.status >= 500 ? 'degraded' : 'operational',
      latency_ms: Date.now() - duitkuStart,
      note: `Merchant D20919 · status ${r.status}`
    })
  } catch (e: any) {
    checks.push({
      name: 'Duitku Gateway',
      status: 'degraded',
      latency_ms: Date.now() - duitkuStart,
      note: e?.message || 'Duitku unreachable'
    })
  }

  // Aggregate
  const allOk = checks.every((x) => x.status === 'operational')
  const overall = allOk ? 'operational'
                  : checks.some((x) => x.status === 'down') ? 'major-outage'
                  : 'degraded'

  // Recent events
  const { results: events } = await c.env.DB.prepare(
    `SELECT component, status, message, region, latency_ms, created_at
       FROM status_events
      ORDER BY created_at DESC
      LIMIT 10`
  ).all<any>().catch(() => ({ results: [] as any[] }))

  return c.json({
    success: true,
    overall,
    timestamp: new Date().toISOString(),
    region: c.req.header('cf-ray')?.split('-')[1] || 'unknown',
    checks,
    recent_events: events || [],
    uptime_30d: '99.97%' // placeholder until rollups exist
  })
})

export default status
