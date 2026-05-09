import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { getSession } from '../lib/auth'
import type { Bindings, Variables } from '../lib/types'

export const sessionMiddleware: MiddlewareHandler<{
  Bindings: Bindings
  Variables: Variables
}> = async (c, next) => {
  const token = getCookie(c, 'oasis_session')
  if (token) {
    const user = await getSession(c.env.OASIS_KV, token)
    if (user) c.set('user', user)
  }
  await next()
}

export const requireAuth: MiddlewareHandler<{
  Bindings: Bindings
  Variables: Variables
}> = async (c, next) => {
  const user = c.get('user')
  if (!user) {
    if (c.req.header('accept')?.includes('application/json') || c.req.path.startsWith('/api/')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }
    return c.redirect('/login')
  }
  await next()
}
