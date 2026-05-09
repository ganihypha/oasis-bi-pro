import { Hono } from 'hono'
import { setCookie, deleteCookie, getCookie } from 'hono/cookie'
import {
  hashPassword,
  verifyPassword,
  uuid,
  createSession,
  destroySession,
  SESSION_TTL_SECONDS
} from '../lib/auth'
import type { Bindings, Variables } from '../lib/types'

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>()

/* ---------- Register ---------- */
auth.post('/register', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { email, password, full_name, company, phone } = body as Record<string, string>

  if (!email || !password || !full_name) {
    return c.json({ success: false, error: 'Missing email, password, or full_name' }, 400)
  }
  if (password.length < 8) {
    return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
  }

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first()
  if (existing) {
    return c.json({ success: false, error: 'Email already registered' }, 409)
  }

  const userId = uuid()
  const teamId = uuid()
  const memberId = uuid()
  const subId = uuid()
  const passwordHash = await hashPassword(password)

  // create user + team + membership + trial subscription in a single batch
  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, full_name, company, phone, email_verified)
       VALUES (?, ?, ?, ?, ?, ?, 0)`
    ).bind(userId, email, passwordHash, full_name, company || null, phone || null),

    c.env.DB.prepare(
      `INSERT INTO teams (id, name, slug, plan, billing_status)
       VALUES (?, ?, ?, 'starter', 'trialing')`
    ).bind(teamId, `${full_name}'s Team`, `team-${userId.substring(0, 8)}`),

    c.env.DB.prepare(
      `INSERT INTO team_members (id, team_id, user_id, role) VALUES (?, ?, ?, 'admin')`
    ).bind(memberId, teamId, userId),

    c.env.DB.prepare(
      `INSERT INTO subscriptions (id, team_id, plan, status, current_period_start, current_period_end)
       VALUES (?, ?, 'starter', 'trialing', datetime('now'), datetime('now', '+14 days'))`
    ).bind(subId, teamId)
  ])

  const sessionUser = {
    id: userId,
    email,
    full_name,
    team_id: teamId,
    plan: 'starter'
  }

  const token = await createSession(c.env.OASIS_KV, c.env.DB, sessionUser, {
    ua: c.req.header('user-agent') || '',
    ip: c.req.header('cf-connecting-ip') || ''
  })

  setCookie(c, 'oasis_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  })

  return c.json({ success: true, user: sessionUser })
})

/* ---------- Login ---------- */
auth.post('/login', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { email, password } = body as Record<string, string>

  if (!email || !password) {
    return c.json({ success: false, error: 'Missing email or password' }, 400)
  }

  const row = await c.env.DB.prepare(
    `SELECT u.id, u.email, u.password_hash, u.full_name,
            tm.team_id, t.plan
       FROM users u
       LEFT JOIN team_members tm ON tm.user_id = u.id
       LEFT JOIN teams t ON t.id = tm.team_id
      WHERE u.email = ?
      LIMIT 1`
  )
    .bind(email)
    .first<any>()

  if (!row) {
    return c.json({ success: false, error: 'Invalid credentials' }, 401)
  }

  const ok = await verifyPassword(password, row.password_hash)
  if (!ok) {
    return c.json({ success: false, error: 'Invalid credentials' }, 401)
  }

  const sessionUser = {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    team_id: row.team_id,
    plan: row.plan
  }

  const token = await createSession(c.env.OASIS_KV, c.env.DB, sessionUser, {
    ua: c.req.header('user-agent') || '',
    ip: c.req.header('cf-connecting-ip') || ''
  })

  setCookie(c, 'oasis_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  })

  return c.json({ success: true, user: sessionUser })
})

/* ---------- Logout ---------- */
auth.post('/logout', async (c) => {
  const token = getCookie(c, 'oasis_session')
  if (token) {
    await destroySession(c.env.OASIS_KV, c.env.DB, token)
  }
  deleteCookie(c, 'oasis_session', { path: '/' })
  return c.json({ success: true })
})

/* ---------- Current user ---------- */
auth.get('/me', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ success: false, error: 'Not authenticated' }, 401)
  return c.json({ success: true, user })
})

export default auth
