# OASIS BI Pro — Sovereign BI SaaS on Cloudflare Full Stack

[![Status](https://img.shields.io/badge/Status-Live-success)](https://oasis-bi-pro.pages.dev)
[![Stack](https://img.shields.io/badge/Stack-Cloudflare%20Pages%20%2B%20Workers%20%2B%20D1%20%2B%20KV%20%2B%20R2-orange)](https://developers.cloudflare.com)
[![Framework](https://img.shields.io/badge/Framework-Hono-blue)](https://hono.dev)
[![Payments](https://img.shields.io/badge/Duitku-Integrated-purple)](https://docs.duitku.com)

> **Sovereign Business Intelligence SaaS** — migrated from Next.js + Supabase + Vercel
> to a **full Cloudflare ecosystem** with Hono framework + D1 + KV + R2 + Duitku payment gateway.
> A SparkMind sovereign product.

---

## Project Overview

- **Name**: OASIS BI Pro (`oasis-bi-pro`)
- **Goal**: BI SaaS for solopreneur & micro-agency Indonesia, fully self-sovereign on Cloudflare edge
- **Niche** (locked from Doc-MBA v1.0): Solopreneur · Micro-Agency · Muslim Creator-CEO
- **Brand parent**: SparkMind Sovereign Holding
- **Migration source**: `v0-v0oasisbiproduitkuv21mainmain-02-main-3-1-main-1-5-new` (Next.js 15 + Supabase) → fully re-platformed to Hono on Cloudflare

---

## Live URLs

| Surface | URL |
|---------|-----|
| **Production** | https://oasis-bi-pro.pages.dev |
| **Latest deploy** | https://0dc5dd2c.oasis-bi-pro.pages.dev |
| **Health** | https://oasis-bi-pro.pages.dev/api/health |
| **Plans API** | https://oasis-bi-pro.pages.dev/api/duitku/plans |
| **Analytics** | https://oasis-bi-pro.pages.dev/api/analytics/overview |
| **GitHub** | (set after `setup_github_environment`) |

**Demo login** · `demo@oasis-bi-pro.web.id` / `Demo1234`

---

## Currently Completed Features

### Frontend (SPA, vanilla JS)
- Hero landing page (purple/gold sovereign visual system, matches Doc-I/Doc-J/Doc-MBA)
- Pricing page — 3 plans (Operator / Sovereign / Direktur) loaded from API
- Auth flows — Login, Register (with 14-day trial subscription auto-provisioned)
- Checkout flow — pre-fill from session, Duitku redirect
- Dashboard — 4 KPI cards + Revenue line chart (30d) + Traffic bar chart (7d) + team table
- Payment success / failed pages
- About, Legal (UU PDP 27/2022), Contact pages
- Tailwind CSS via CDN, Chart.js, Axios, dayjs, Font Awesome

### Backend (Hono on Cloudflare Workers)
- `GET  /api/health` — service health + version + stack info
- `POST /api/auth/register` — create user + team + trial subscription (D1 batch)
- `POST /api/auth/login` — SHA-256 password verify + KV session token
- `POST /api/auth/logout` — destroy session in KV + D1
- `GET  /api/auth/me` — current session user
- `GET  /api/duitku/plans` — return locked subscription plans (Operator/Sovereign/Direktur)
- `POST /api/duitku/checkout` — record pending payment + call Duitku Pop API + return paymentUrl
- `POST /api/duitku/callback` — verify MD5 signature + update payment + activate subscription
- `GET  /api/duitku/check-status` — local D1 + live Duitku transactionStatus
- `GET  /api/analytics/overview` — 30d revenue, visitors, signups
- `GET  /api/analytics/revenue?days=N` — daily revenue series
- `GET  /api/analytics/traffic` — 7d visitors + signups
- `GET  /api/team/members` — team roster
- `GET  /api/team/subscription` — current subscription record

### Cloudflare resources (provisioned)
- **D1 database** — `oasis-bi-pro-production` (id `1d8a6860-7eff-4959-bcf2-89cccd34e26c`) with 8 tables, applied migration `0001_initial_schema.sql` to both local + remote, seeded
- **KV namespace** — `OASIS_KV` (id `367ff07f353545fd98d6d564f88d84ff`) for sessions / cache / idempotency
- **R2 bucket** — `oasis-bi-pro-bucket` for exports / dashboard snapshots / uploads
- **Pages project** — `oasis-bi-pro`, production branch `main`
- **Secrets** — `DUITKU_API_KEY`, `DUITKU_MERCHANT_CODE` set via `wrangler pages secret put` (never in source)

### Duitku integration (Pop API, edge-native)
- Pure Web Crypto signatures (no Node `crypto` module)
- Header signature: `SHA256(merchantCode + timestamp_ms + apiKey)` for `createInvoice`
- Callback signature: `MD5(merchantCode + amount + merchantOrderId + apiKey)` (pure-JS MD5 for Workers)
- Status check signature: `MD5(merchantCode + merchantOrderId + apiKey)`
- Order ID format: `OASIS-{PLAN}-{timestamp}-{random}`
- 30-second `AbortSignal.timeout`
- Subscription auto-extended on `resultCode = '00'` (SUCCESS)

### Compliance flags (locked from Doc-MBA v1.0)
- **Pure-BI** (no payment-aggregator activity)
- **Non-PayFac** Duitku usage (subscription billing only)
- **UU PDP 27/2022** — privacy hard-rule cross-brand
- **KBLI 63122** — data hosting & processing
- Trademark schedule: SparkMind · OASIS BI Pro · Spiritual OS · Sovereign Forge · slogan

---

## Data Architecture

### Storage services
- **Cloudflare D1** (SQLite) — replaces Supabase Postgres
- **Cloudflare KV** — replaces Supabase Auth session store + Redis cache
- **Cloudflare R2** — replaces AWS S3 / Supabase Storage (zero egress fee)

### Data models (D1 — see `migrations/0001_initial_schema.sql`)
| Table | Purpose |
|-------|---------|
| `users` | Auth + profile (replaces Supabase auth.users + user_profiles) |
| `teams` | Organizations |
| `team_members` | M:N user ↔ team |
| `subscriptions` | Plan, status, period, gateway ref |
| `payments` | Duitku transactions (pending → success/expired/cancelled) |
| `daily_metrics` | BI sample data (revenue, visitors, signups) |
| `sessions` | Mirror of KV sessions for audit |
| `audit_log` | Governance + UU PDP 27/2022 compliance |

### Data flow — payment
```
User → /checkout (SPA)
     → POST /api/duitku/checkout
        → DB: insert payments(status=pending)
        → Duitku createInvoice (SHA256 signed)
        → DB: update payments(reference, payment_url)
     → 302 to Duitku payment page
Duitku → POST /api/duitku/callback (MD5 signature verified)
        → DB: update payments + subscriptions + teams.plan
     → 302 to /payment/success
```

---

## User Guide

### Try the demo
1. Visit https://oasis-bi-pro.pages.dev
2. Click **Login** → email `demo@oasis-bi-pro.web.id`, password `Demo1234`
3. Open **Dashboard** to see 30-day BI metrics
4. Click **Pricing** → pick a plan → walk through Duitku checkout (production credentials)

### Register your own account
1. Go to `/register` — fill name, email, password (≥8 chars)
2. A team + 14-day trial subscription are auto-provisioned
3. Upgrade any time via `/pricing`

---

## Development

```bash
# Install once
cd /home/user/webapp
npm install

# Local dev (build + PM2 + wrangler pages dev)
npm run build
pm2 start ecosystem.config.cjs
curl http://localhost:3000/api/health

# DB lifecycle
npm run db:migrate:local        # apply migrations to local SQLite
npm run db:seed:local           # load seed data
npm run db:reset                # nuke local + re-migrate + re-seed
npm run db:console:local        # open SQL console

# Production DB
npm run db:migrate:prod
```

### Logs (non-blocking)
```bash
pm2 logs oasis-bi-pro --nostream
```

---

## Deployment

### Status
- **Platform**: Cloudflare Pages (`oasis-bi-pro`)
- **Status**: ✅ LIVE
- **Production branch**: `main`
- **Compatibility date**: `2024-12-01`
- **Bundle size**: ~51 KB (`dist/_worker.js`)

### Tech stack
| Layer | Choice |
|-------|--------|
| Hosting | Cloudflare Pages (300+ edge cities) |
| Runtime | Cloudflare Workers |
| Framework | Hono 4.x (TypeScript + JSX) |
| Database | Cloudflare D1 (SQLite, replicated) |
| Sessions | Cloudflare KV |
| Object storage | Cloudflare R2 |
| Payments | Duitku Pop API (production) |
| Build | Vite + `@hono/vite-build/cloudflare-pages` |
| Process manager | PM2 (sandbox dev only) |

### Deploy commands
```bash
npm run build
npx wrangler pages deploy dist --project-name oasis-bi-pro --branch main

# Set production secrets
echo "$KEY" | npx wrangler pages secret put DUITKU_API_KEY --project-name oasis-bi-pro
echo "D20919" | npx wrangler pages secret put DUITKU_MERCHANT_CODE --project-name oasis-bi-pro
```

---

## Migration Summary (vs. original Next.js stack)

| Concern | Before (Next.js + Supabase + Vercel) | After (Cloudflare sovereign stack) |
|---------|--------------------------------------|------------------------------------|
| Hosting | Vercel | Cloudflare Pages |
| Runtime | Node.js (server-side rendering) | Workers (edge, V8 isolate) |
| Framework | Next.js 15 App Router | Hono 4 |
| Database | Supabase Postgres | Cloudflare D1 (SQLite) |
| Auth | Supabase Auth (JWT) | Self-hosted (Web Crypto + KV sessions) |
| Storage | Supabase Storage | Cloudflare R2 |
| Cache | (none) | Cloudflare KV |
| Payment lib | Node `crypto` (MD5/SHA256) | Web Crypto + pure-JS MD5 |
| Edge cold start | ~300 ms | <10 ms |
| Estimated cost cut | — | ~85% (matches Doc-I projection) |

---

## Features Not Yet Implemented

- Email verification (currently `email_verified=0` for new signups)
- Google OAuth (button slot reserved in UI but not yet wired)
- Password reset flow
- Real data-source integrations (currently demo metrics in D1)
- Multi-currency / annual billing plans
- AI-powered anomaly detection (planned for v3.1)
- White-label / custom-domain feature for Direktur tier
- Rate limiting per user/IP (Cloudflare WAF rules)
- Cron-triggered metric rollups (Cloudflare Cron Triggers)
- Admin console for impersonation & subscription overrides
- E2E tests (Playwright)

---

## Recommended Next Steps

1. Bind custom domain `oasis-bi-pro.web.id` (DNS → Cloudflare Pages)
2. Update `RETURN_URL` / `CALLBACK_URL` in `wrangler.jsonc` once domain is live, then redeploy
3. Update Duitku merchant dashboard callback URL → `https://oasis-bi-pro.web.id/api/duitku/callback`
4. Wire email verification (Resend / SendGrid via REST)
5. Implement Google OAuth (Cloudflare Workers OAuth flow)
6. Add Cloudflare Cron Triggers for daily metric ingestion
7. Build admin console under `/admin` (role check via D1 `team_members.role`)
8. Apply Doc-MBA hero copy v2.0 to landing page
9. Schedule IG carousel publishing (8-slide script in Doc-MBA section 16)
10. Kick off 90-day GTM sprint (Doc-MBA section 17)

---

## Project Structure

```
webapp/
├── src/
│   ├── index.tsx              # Hono app entry, route mounting
│   ├── pages/shell.ts         # SPA HTML shell renderer
│   ├── routes/
│   │   ├── auth.ts            # /api/auth/*
│   │   ├── duitku.ts          # /api/duitku/*
│   │   ├── analytics.ts       # /api/analytics/*
│   │   └── team.ts            # /api/team/*
│   ├── lib/
│   │   ├── duitku.ts          # Web-Crypto Duitku client (+ pure-JS MD5)
│   │   ├── auth.ts            # Password hash + KV sessions
│   │   └── types.ts           # Bindings + Variables
│   └── middleware/
│       └── auth.ts            # sessionMiddleware + requireAuth
├── public/static/
│   ├── styles.css             # Sovereign visual system (purple/gold)
│   └── app.js                 # Vanilla SPA router + pages
├── migrations/
│   └── 0001_initial_schema.sql
├── seed/seed.sql              # Demo user + 30d metrics
├── wrangler.jsonc             # Cloudflare bindings
├── vite.config.ts             # @hono/vite-build/cloudflare-pages
├── ecosystem.config.cjs       # PM2 (sandbox dev)
├── package.json
└── README.md
```

---

## Documentation Cross-References

- **Doc-MBA — Master Brand Architecture v1.0** (52 KB) — brand hierarchy, niche lock, pricing, compliance
- **Doc-I — SparkMind Technical Migration to Cloudflare Stack v1.0** (37 KB) — 4-phase migration, ~85% cost cut
- **Doc-J — Sovereign AI Intelligence · Strategic Rebrand & GTM Reset v1.0** (42 KB) — narrative + GTM
- Source repo: `v0-v0oasisbiproduitkuv21mainmain-02-main-3-1-main-1-5-new` (Next.js + Supabase, archived)

---

**Version**: 3.0.0-cloudflare
**Last Updated**: 2026-05-09
**Status**: PRODUCTION (LIVE on Cloudflare Pages)
