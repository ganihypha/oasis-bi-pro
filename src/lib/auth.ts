/**
 * Sovereign auth — Web Crypto only.
 * Replaces Supabase Auth with a self-hosted, edge-native implementation.
 * Sessions are stored in KV (fast) and mirrored in D1 (audit).
 */

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const h = await hashPassword(password)
  // constant-time compare
  if (h.length !== hash.length) return false
  let diff = 0
  for (let i = 0; i < h.length; i++) diff |= h.charCodeAt(i) ^ hash.charCodeAt(i)
  return diff === 0
}

export function uuid(): string {
  // crypto.randomUUID is available in Workers
  return crypto.randomUUID()
}

export function generateToken(): string {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export interface SessionUser {
  id: string
  email: string
  full_name: string
  team_id?: string
  plan?: string
}

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

export async function createSession(
  kv: KVNamespace,
  db: D1Database,
  user: SessionUser,
  meta: { ua?: string; ip?: string } = {}
): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString()

  await kv.put(`session:${token}`, JSON.stringify(user), {
    expirationTtl: SESSION_TTL_SECONDS
  })

  await db
    .prepare(
      `INSERT INTO sessions (id, user_id, token, expires_at, user_agent, ip)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(uuid(), user.id, token, expiresAt, meta.ua || null, meta.ip || null)
    .run()

  return token
}

export async function getSession(
  kv: KVNamespace,
  token: string
): Promise<SessionUser | null> {
  if (!token) return null
  const raw = await kv.get(`session:${token}`)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function destroySession(
  kv: KVNamespace,
  db: D1Database,
  token: string
): Promise<void> {
  await kv.delete(`session:${token}`)
  await db.prepare(`DELETE FROM sessions WHERE token = ?`).bind(token).run()
}
