/**
 * DUITKU Payment Gateway — Cloudflare Workers edition
 * Uses Web Crypto API (no Node.js crypto module).
 *
 * Subscription billing only — NOT a payment facilitator/aggregator.
 * Reference: https://docs.duitku.com/pop/en/
 */

export interface DuitkuConfig {
  merchantCode: string
  apiKey: string
  baseUrl: string
  returnUrl: string
  callbackUrl: string
  environment: string
}

export function getDuitkuConfig(env: any): DuitkuConfig {
  // SECRETS — must come from Cloudflare secrets / wrangler secret. NEVER hard-code.
  // Set via: `npx wrangler pages secret put DUITKU_MERCHANT_CODE --project-name oasis-bi-pro`
  //         `npx wrangler pages secret put DUITKU_API_KEY --project-name oasis-bi-pro`
  // For local dev, place them in `.dev.vars` (gitignored).
  const merchantCode = env.DUITKU_MERCHANT_CODE
  const apiKey = env.DUITKU_API_KEY
  if (!merchantCode || !apiKey) {
    throw new Error(
      'Missing DUITKU_MERCHANT_CODE or DUITKU_API_KEY. ' +
      'Set them via `wrangler pages secret put …` (production) or `.dev.vars` (local).'
    )
  }
  return {
    merchantCode,
    apiKey,
    baseUrl: env.DUITKU_BASE_URL || 'https://api-prod.duitku.com/api/merchant',
    returnUrl: env.RETURN_URL || 'https://oasis-bi-pro.pages.dev/payment/success',
    callbackUrl: env.CALLBACK_URL || 'https://oasis-bi-pro.pages.dev/api/duitku/callback',
    environment: env.DUITKU_ENV || 'production'
  }
}

/* ---------- Subscription plans (locked from MBA doc + Bridge Monetization Layer 3) ---------- */
export const SUBSCRIPTION_PLANS = {
  starter: {
    id: 'starter',
    name: 'Operator',
    tagline: 'Solo founder & freelancer',
    price: 99000,
    currency: 'IDR',
    duration: 'monthly',
    sku: 'OBP-OPR-MO',
    features: [
      '5 dashboard interaktif',
      '10 data source connections',
      'Basic analytics & reporting',
      'Email support (24 jam)',
      '1 user account',
      'Trial 14 hari gratis'
    ]
  },
  professional: {
    id: 'professional',
    name: 'Sovereign',
    tagline: 'UMKM 5–20 orang',
    price: 299000,
    currency: 'IDR',
    duration: 'monthly',
    sku: 'OBP-SVR-MO',
    popular: true,
    features: [
      '50 dashboard interaktif',
      'Unlimited data sources',
      'Advanced AI analytics',
      'Priority support (12 jam)',
      'Custom branding',
      '5 user accounts',
      'API access',
      'Trial 14 hari gratis'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Direktur',
    tagline: 'Tim 20+ · White-label',
    price: 999000,
    currency: 'IDR',
    duration: 'monthly',
    sku: 'OBP-DIR-MO',
    features: [
      'Unlimited dashboards',
      'Unlimited data sources',
      'AI-powered insights',
      'Dedicated support 24/7',
      'White-label solution',
      'Unlimited users',
      'Full API access',
      'SLA guarantee 99.9%'
    ]
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime Deal',
    tagline: 'Early adopter · Limited 50 seats',
    price: 1499000,
    currency: 'IDR',
    duration: 'lifetime',
    sku: 'OBP-LTD-ONE',
    limited: true,
    features: [
      'Akses Sovereign tier seumur hidup',
      'Unlimited data sources',
      'Advanced AI analytics',
      'Priority support seumur hidup',
      'Custom branding',
      '5 user accounts',
      'API access',
      'Grandfathered untuk semua future features',
      'No recurring billing — bayar sekali'
    ]
  }
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS

export const DUITKU_STATUS = {
  SUCCESS: '00',
  PENDING: '01',
  EXPIRED: '02',
  CANCELLED: '03'
} as const

/* ---------- Web Crypto helpers (Cloudflare Workers compatible) ---------- */

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function md5Hex(input: string): Promise<string> {
  // Workers do not ship MD5 in subtle.digest; use a tiny pure-JS implementation.
  return md5(input)
}

/**
 * Header signature for Duitku Pop API (createInvoice).
 * Formula: SHA256(merchantCode + timestamp_ms + apiKey)
 */
export async function generatePopSignature(
  cfg: DuitkuConfig,
  timestampMs: number
): Promise<string> {
  return sha256Hex(`${cfg.merchantCode}${timestampMs}${cfg.apiKey}`)
}

/**
 * Callback verification.
 * Formula: MD5(merchantCode + amount + merchantOrderId + apiKey)
 */
export async function verifyDuitkuCallback(
  cfg: DuitkuConfig,
  merchantOrderId: string,
  amount: string,
  signature: string
): Promise<boolean> {
  const expected = await md5Hex(
    `${cfg.merchantCode}${amount}${merchantOrderId}${cfg.apiKey}`
  )
  return expected.toLowerCase() === signature.toLowerCase()
}

/**
 * Status-check signature.
 * Formula: MD5(merchantCode + merchantOrderId + apiKey)
 */
export async function generateStatusSignature(
  cfg: DuitkuConfig,
  merchantOrderId: string
): Promise<string> {
  return md5Hex(`${cfg.merchantCode}${merchantOrderId}${cfg.apiKey}`)
}

/* ---------- Domain calls ---------- */

export interface DuitkuPaymentRequest {
  merchantOrderId: string
  paymentAmount: number
  productDetails: string
  email: string
  phoneNumber: string
  customerName: string
  planId: PlanId
  userId?: string
}

export interface DuitkuCreateResult {
  success: boolean
  paymentUrl?: string
  reference?: string
  raw?: any
  error?: string
}

export async function createDuitkuPayment(
  cfg: DuitkuConfig,
  data: DuitkuPaymentRequest
): Promise<DuitkuCreateResult> {
  const timestamp = Date.now()
  const signature = await generatePopSignature(cfg, timestamp)

  // Split full name into first + last for Duitku customerDetail.
  const nameParts = (data.customerName || 'Customer').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Customer'
  const lastName = nameParts.slice(1).join(' ') || firstName

  const body = {
    paymentAmount: data.paymentAmount,
    merchantOrderId: data.merchantOrderId,
    productDetails: data.productDetails,
    email: data.email,
    phoneNumber: data.phoneNumber,
    customerVaName: data.customerName,
    customerDetail: {
      firstName,
      lastName,
      email: data.email,
      phoneNumber: data.phoneNumber
    },
    itemDetails: [
      {
        name: data.productDetails,
        price: data.paymentAmount,
        quantity: 1
      }
    ],
    callbackUrl: cfg.callbackUrl,
    returnUrl: cfg.returnUrl,
    expiryPeriod: 60
  }

  try {
    const res = await fetch(`${cfg.baseUrl}/createInvoice`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Duitku-Signature': signature,
        'X-Duitku-Timestamp': timestamp.toString(),
        'X-Duitku-Merchantcode': cfg.merchantCode,
        'X-Duitku-Client': 'sdk-cloudflare-worker'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000)
    })

    const result: any = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        error: `Duitku API ${res.status}: ${result?.message || result?.statusMessage || res.statusText}`,
        raw: result
      }
    }

    if (!result?.paymentUrl || !result?.reference) {
      return {
        success: false,
        error: 'Invalid Duitku response — missing paymentUrl/reference',
        raw: result
      }
    }

    return {
      success: true,
      paymentUrl: result.paymentUrl,
      reference: result.reference,
      raw: result
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error contacting Duitku'
    }
  }
}

export async function checkDuitkuPaymentStatus(
  cfg: DuitkuConfig,
  merchantOrderId: string
) {
  const signature = await generateStatusSignature(cfg, merchantOrderId)
  try {
    const res = await fetch(`${cfg.baseUrl}/transactionStatus`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantCode: cfg.merchantCode,
        merchantOrderId,
        signature
      })
    })
    const result: any = await res.json().catch(() => ({}))
    return { success: res.ok, data: result }
  } catch (err: any) {
    return { success: false, error: err?.message || 'status check error' }
  }
}

export function generateMerchantOrderId(planId: string): string {
  const ts = Date.now()
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `OASIS-${planId.toUpperCase()}-${ts}-${rand}`
}

/* ---------- Tiny pure-JS MD5 (RFC 1321) — required because Workers
 *           do not ship MD5 in crypto.subtle. Adapted from Joseph Myers
 *           public-domain JS MD5; ~3KB. ----------------------- */

function md5(str: string): string {
  function rh(n: number) {
    let s = '', j
    for (j = 0; j <= 3; j++)
      s += ((n >> (j * 8 + 4)) & 0x0f).toString(16) + ((n >> (j * 8)) & 0x0f).toString(16)
    return s
  }
  function ad(x: number, y: number) {
    const l = (x & 0xffff) + (y & 0xffff)
    const m = (x >> 16) + (y >> 16) + (l >> 16)
    return (m << 16) | (l & 0xffff)
  }
  function rl(n: number, c: number) { return (n << c) | (n >>> (32 - c)) }
  function cm(q: number, a: number, b: number, x: number, s: number, t: number) {
    return ad(rl(ad(ad(a, q), ad(x, t)), s), b)
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm((b & c) | (~b & d), a, b, x, s, t)
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm((b & d) | (c & ~d), a, b, x, s, t)
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm(b ^ c ^ d, a, b, x, s, t)
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm(c ^ (b | ~d), a, b, x, s, t)
  }
  function sb(s: string) {
    let i
    const nblk = ((s.length + 8) >> 6) + 1
    const blks = new Array(nblk * 16)
    for (i = 0; i < nblk * 16; i++) blks[i] = 0
    for (i = 0; i < s.length; i++) blks[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8)
    blks[i >> 2] |= 0x80 << ((i % 4) * 8)
    blks[nblk * 16 - 2] = s.length * 8
    return blks
  }

  // UTF-8 encode
  const utf8 = unescape(encodeURIComponent(str))
  const x = sb(utf8)
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878

  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d
    a = ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i + 10], 17, -42063)
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = hh(d, a, b, c, x[i + 0], 11, -358537222)
    c = hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = ii(a, b, c, d, x[i + 0], 6, -198630844)
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = ad(a, olda); b = ad(b, oldb); c = ad(c, oldc); d = ad(d, oldd)
  }
  return rh(a) + rh(b) + rh(c) + rh(d)
}
