import { Hono } from 'hono'
import type { Bindings, Variables } from '../lib/types'

const analytics = new Hono<{ Bindings: Bindings; Variables: Variables }>()

/* ---------- Demo team fallback for unauthenticated dashboard preview ---------- */
const DEMO_TEAM = 'team_demo_001'

function getTeamId(c: any): string {
  const user = c.get('user')
  return user?.team_id || DEMO_TEAM
}

/* ---------- Overview ---------- */
analytics.get('/overview', async (c) => {
  const teamId = getTeamId(c)

  const totals = await c.env.DB.prepare(
    `SELECT
       COALESCE(SUM(CASE WHEN metric_name = 'revenue'  THEN metric_value END), 0) AS total_revenue,
       COALESCE(SUM(CASE WHEN metric_name = 'visitors' THEN metric_value END), 0) AS total_visitors,
       COALESCE(SUM(CASE WHEN metric_name = 'signups'  THEN metric_value END), 0) AS total_signups
       FROM daily_metrics
      WHERE team_id = ? AND metric_date >= date('now', '-30 days')`
  ).bind(teamId).first<any>()

  const last7 = await c.env.DB.prepare(
    `SELECT
       COALESCE(SUM(CASE WHEN metric_name = 'revenue'  THEN metric_value END), 0) AS revenue_7d,
       COALESCE(SUM(CASE WHEN metric_name = 'visitors' THEN metric_value END), 0) AS visitors_7d
       FROM daily_metrics
      WHERE team_id = ? AND metric_date >= date('now', '-7 days')`
  ).bind(teamId).first<any>()

  return c.json({
    success: true,
    overview: {
      total_revenue:  Number(totals?.total_revenue  || 0),
      total_visitors: Number(totals?.total_visitors || 0),
      total_signups:  Number(totals?.total_signups  || 0),
      revenue_7d:     Number(last7?.revenue_7d      || 0),
      visitors_7d:    Number(last7?.visitors_7d     || 0)
    }
  })
})

/* ---------- Revenue series ---------- */
analytics.get('/revenue', async (c) => {
  const teamId = getTeamId(c)
  const days = Math.min(Number(c.req.query('days') || 30), 90)

  const { results } = await c.env.DB.prepare(
    `SELECT metric_date, metric_value
       FROM daily_metrics
      WHERE team_id = ? AND metric_name = 'revenue'
        AND metric_date >= date('now', '-' || ? || ' days')
      ORDER BY metric_date ASC`
  ).bind(teamId, days).all<any>()

  return c.json({
    success: true,
    series: (results || []).map((r) => ({
      date: r.metric_date,
      value: Number(r.metric_value)
    }))
  })
})

/* ---------- Traffic ---------- */
analytics.get('/traffic', async (c) => {
  const teamId = getTeamId(c)
  const { results } = await c.env.DB.prepare(
    `SELECT metric_date, metric_name, metric_value
       FROM daily_metrics
      WHERE team_id = ? AND metric_name IN ('visitors', 'signups')
        AND metric_date >= date('now', '-7 days')
      ORDER BY metric_date ASC`
  ).bind(teamId).all<any>()

  return c.json({ success: true, rows: results || [] })
})

export default analytics
