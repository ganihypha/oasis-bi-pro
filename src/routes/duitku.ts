import { Hono } from 'hono'
import {
  getDuitkuConfig,
  createDuitkuPayment,
  checkDuitkuPaymentStatus,
  verifyDuitkuCallback,
  generateMerchantOrderId,
  SUBSCRIPTION_PLANS,
  DUITKU_STATUS,
  type PlanId
} from '../lib/duitku'
import { uuid } from '../lib/auth'
import type { Bindings, Variables } from '../lib/types'

const duitku = new Hono<{ Bindings: Bindings; Variables: Variables }>()

/* ---------- Plans ---------- */
duitku.get('/plans', (c) =>
  c.json({ success: true, plans: SUBSCRIPTION_PLANS })
)

/* ---------- Checkout ---------- */
duitku.post('/checkout', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { planId, email, phoneNumber, customerName } = body as Record<string, any>

  if (!planId || !email || !phoneNumber || !customerName) {
    return c.json(
      { success: false, error: 'Missing required fields: planId, email, phoneNumber, customerName' },
      400
    )
  }

  const plan = SUBSCRIPTION_PLANS[planId as PlanId]
  if (!plan) {
    return c.json({ success: false, error: `Invalid planId: ${planId}` }, 400)
  }

  const cfg = getDuitkuConfig(c.env)
  const merchantOrderId = generateMerchantOrderId(planId)
  const user = c.get('user')

  // Pre-record payment as pending
  await c.env.DB.prepare(
    `INSERT INTO payments
       (id, merchant_order_id, user_id, team_id, plan_id, amount, currency, status,
        customer_email, customer_phone, customer_name)
     VALUES (?, ?, ?, ?, ?, ?, 'IDR', 'pending', ?, ?, ?)`
  )
    .bind(
      uuid(),
      merchantOrderId,
      user?.id || null,
      user?.team_id || null,
      planId,
      plan.price,
      email,
      phoneNumber,
      customerName
    )
    .run()

  const result = await createDuitkuPayment(cfg, {
    merchantOrderId,
    paymentAmount: plan.price,
    productDetails: `${plan.name} Plan — OASIS BI Pro Subscription`,
    email,
    phoneNumber,
    customerName,
    planId: planId as PlanId,
    userId: user?.id
  })

  if (!result.success) {
    await c.env.DB.prepare(
      `UPDATE payments SET status = 'cancelled', updated_at = datetime('now')
        WHERE merchant_order_id = ?`
    ).bind(merchantOrderId).run()

    return c.json({ success: false, error: result.error, raw: result.raw }, 502)
  }

  await c.env.DB.prepare(
    `UPDATE payments
        SET duitku_reference = ?, payment_url = ?, updated_at = datetime('now')
      WHERE merchant_order_id = ?`
  )
    .bind(result.reference, result.paymentUrl, merchantOrderId)
    .run()

  return c.json({
    success: true,
    data: {
      reference: result.reference,
      paymentUrl: result.paymentUrl,
      merchantOrderId,
      planId,
      amount: plan.price
    }
  })
})

/* ---------- Callback (Duitku → us) ---------- */
duitku.post('/callback', async (c) => {
  const cfg = getDuitkuConfig(c.env)

  let body: Record<string, any> = {}
  const ct = c.req.header('content-type') || ''
  if (ct.includes('application/json')) {
    body = await c.req.json().catch(() => ({}))
  } else {
    const fd = await c.req.formData().catch(() => null)
    if (fd) for (const [k, v] of fd.entries()) body[k] = String(v)
  }

  const { merchantOrderId, amount, signature, resultCode, reference } = body

  if (!merchantOrderId || !amount || !signature) {
    return c.text('Missing fields', 400)
  }

  const valid = await verifyDuitkuCallback(cfg, merchantOrderId, amount, signature)
  if (!valid) {
    return c.text('Invalid signature', 401)
  }

  const status =
    resultCode === DUITKU_STATUS.SUCCESS ? 'success'
      : resultCode === DUITKU_STATUS.PENDING ? 'pending'
      : resultCode === DUITKU_STATUS.EXPIRED ? 'expired'
      : 'cancelled'

  // Update payment row
  await c.env.DB.prepare(
    `UPDATE payments
        SET status = ?, duitku_reference = COALESCE(?, duitku_reference),
            callback_payload = ?, updated_at = datetime('now')
      WHERE merchant_order_id = ?`
  )
    .bind(status, reference || null, JSON.stringify(body), merchantOrderId)
    .run()

  // If success — extend subscription
  if (status === 'success') {
    const payment = await c.env.DB.prepare(
      `SELECT user_id, team_id, plan_id FROM payments WHERE merchant_order_id = ?`
    ).bind(merchantOrderId).first<any>()

    if (payment?.team_id) {
      await c.env.DB.batch([
        c.env.DB.prepare(
          `UPDATE teams SET plan = ?, billing_status = 'active', updated_at = datetime('now')
            WHERE id = ?`
        ).bind(payment.plan_id, payment.team_id),
        c.env.DB.prepare(
          `UPDATE subscriptions
              SET plan = ?, status = 'active',
                  current_period_start = datetime('now'),
                  current_period_end = datetime('now', '+30 days'),
                  payment_gateway = 'duitku',
                  gateway_subscription_id = ?,
                  updated_at = datetime('now')
            WHERE team_id = ?`
        ).bind(payment.plan_id, reference || null, payment.team_id)
      ])
    }
  }

  return c.text('OK', 200)
})

/* ---------- Status check ---------- */
duitku.get('/check-status', async (c) => {
  const merchantOrderId = c.req.query('merchantOrderId')
  if (!merchantOrderId) return c.json({ success: false, error: 'merchantOrderId required' }, 400)

  // Local view
  const local = await c.env.DB.prepare(
    `SELECT merchant_order_id, plan_id, amount, status, duitku_reference, updated_at
       FROM payments WHERE merchant_order_id = ?`
  ).bind(merchantOrderId).first<any>()

  // Live Duitku view
  const cfg = getDuitkuConfig(c.env)
  const live = await checkDuitkuPaymentStatus(cfg, merchantOrderId)

  return c.json({ success: true, local, live })
})

export default duitku
