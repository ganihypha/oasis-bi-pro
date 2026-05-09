/**
 * Shared types for OASIS BI Pro on Cloudflare.
 */

export type Bindings = {
  DB: D1Database
  OASIS_KV: KVNamespace
  OASIS_R2: R2Bucket
  // Vars
  APP_NAME: string
  APP_VERSION: string
  DUITKU_ENV: string
  DUITKU_BASE_URL: string
  RETURN_URL: string
  CALLBACK_URL: string
  // Secrets (set via wrangler pages secret put)
  DUITKU_MERCHANT_CODE?: string
  DUITKU_API_KEY?: string
}

export type Variables = {
  user?: {
    id: string
    email: string
    full_name: string
    team_id?: string
    plan?: string
  }
}
