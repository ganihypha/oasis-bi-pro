import { Hono } from 'hono'
import type { Bindings, Variables } from '../lib/types'

const team = new Hono<{ Bindings: Bindings; Variables: Variables }>()

team.get('/members', async (c) => {
  const user = c.get('user')
  const teamId = user?.team_id || 'team_demo_001'
  const { results } = await c.env.DB.prepare(
    `SELECT u.id, u.email, u.full_name, u.company, tm.role, tm.created_at
       FROM team_members tm
       JOIN users u ON u.id = tm.user_id
      WHERE tm.team_id = ?
      ORDER BY tm.created_at ASC`
  ).bind(teamId).all<any>()
  return c.json({ success: true, members: results || [] })
})

team.get('/subscription', async (c) => {
  const user = c.get('user')
  const teamId = user?.team_id || 'team_demo_001'
  const sub = await c.env.DB.prepare(
    `SELECT * FROM subscriptions WHERE team_id = ? ORDER BY updated_at DESC LIMIT 1`
  ).bind(teamId).first<any>()
  return c.json({ success: true, subscription: sub })
})

export default team
