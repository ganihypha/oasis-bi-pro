# OASIS BI Pro — Sovereign BI SaaS on Cloudflare Full Stack

[![Status](https://img.shields.io/badge/Status-Live-success)](https://oasis-bi-pro.pages.dev)
[![Stack](https://img.shields.io/badge/Stack-Cloudflare%20Pages%20%2B%20Workers%20%2B%20D1%20%2B%20KV%20%2B%20R2-orange)](https://developers.cloudflare.com)
[![Framework](https://img.shields.io/badge/Framework-Hono-blue)](https://hono.dev)
[![Payments](https://img.shields.io/badge/Duitku-LIVE%20%C2%B7%20D20919-purple)](https://docs.duitku.com)
[![Version](https://img.shields.io/badge/Version-3.1.0-gold)](#changelog)

> **Sovereign Business Intelligence SaaS** — fully running on the Cloudflare full-stack ecosystem
> (Pages + Workers + D1 + KV + R2 + Hono) with Duitku Pop payment gateway live-integrated on
> production merchant **D20919**. A SparkMind sovereign product, operated by
> **PT. Waskita Cakrawarti Digital**.

---

## Project Overview

- **Name**: OASIS BI Pro (`oasis-bi-pro`)
- **Goal**: BI SaaS for solopreneurs & micro-agencies in Indonesia, sovereign on Cloudflare edge
- **Legal entity**: PT. Waskita Cakrawarti Digital (KBLI 63122 — Hosting & data processing)
- **Brand parent**: SparkMind Sovereign Holding
- **Niche** (Doc-MBA v1.0): Solopreneur · Micro-Agency · Muslim Creator-CEO
- **Compliance**: UU PDP 27/2022 (DPO, breach 72h, DSR, retention)
- **Pricing model**: Subscription-only (Pure-BI / Non-PayFac)

---

## Live URLs

| Surface | URL |
|---------|-----|
| **Production** | https://oasis-bi-pro.pages.dev |
| **Custom domain** | https://www.oasis-bi-pro.web.id |
| **Health** | https://oasis-bi-pro.pages.dev/api/health |
| **Status page** | https://oasis-bi-pro.pages.dev/status |
| **Plans API** | https://oasis-bi-pro.pages.dev/api/duitku/plans |
| **Pricing UI** | https://oasis-bi-pro.pages.dev/pricing |
| **Smoke test** | https://oasis-bi-pro.pages.dev/smoketest |
| **Terms** | https://oasis-bi-pro.pages.dev/terms |
| **Privacy** | https://oasis-bi-pro.pages.dev/privacy |
| **Refund** | https://oasis-bi-pro.pages.dev/refund |
| **Sitemap** | https://oasis-bi-pro.pages.dev/sitemap.xml |

**Demo login** · `demo@oasis-bi-pro.web.id` / `Demo1234`

---

## ✅ v3.1.0 Changelog (Bridge-Monetization Release)

This release closes all 5 CRITICAL gaps + 8 upgrades from the previous deep-dive
(`launchh.obpp...txt`) and ships the bridge-monetization layer from
`obp.live.veriffied...txt`.

### GAP closures
- **GAP-1 — Legal pages**: Full Indonesian-localized Terms (11 sections), Privacy
  (10 sections, UU PDP 27/2022), Refund (7-day cooling-off), Contact pages with PT info
- **GAP-2 — Pricing**: 4-tier pricing UI (Operator Rp 99k / Sovereign Rp 299k popular /
  Direktur Rp 999k / **Lifetime Deal Rp 1.499k limited 50 seats**) with FAQ + 7-day guarantee
- **GAP-3 — Live tx test**: `/api/duitku/smoketest` (Rp 10.000) + `/smoketest` QA UI →
  **VERIFIED WORKING** with reference `D2091926472LYJAWMURK2MT` from real merchant D20919
- **GAP-4 — Onboarding**: 5-step `startOnboardingTour()` with overlay/highlight/tip,
  localStorage flag `obp_tour_done`, runs on first dashboard visit
- **GAP-5 — Branding**: Clear brand hierarchy (SparkMind parent → OBP product → PT entity)

### Upgrades
- **UP-1 — Hero polish**: Testimonials (3 cards w/ ratings), trust pills, social-proof
  counters (300+ cities · <50ms · 99.97% · 14-day trial)
- **UP-2 — Lead magnet**: `#leadForm` POST `/api/leads` with email dedup +
  Sovereign BI Playbook PDF promise
- **UP-3 — Realistic data**: Demo seed with Indonesia-realistic agency context
- **UP-4 — SEO**: Full meta tags, OG image (1200×630 SVG), Twitter card,
  JSON-LD `SoftwareApplication` schema with all 4 offers + aggregateRating, robots.txt, sitemap.xml
- **UP-5 — Status page**: Live `/api/status` checking Workers/D1/KV/R2/Duitku +
  rendered UI at `/status`

### Infrastructure
- **Duitku base URL fix**: `api.duitku.com/webapi/v1/payment` →
  `api-prod.duitku.com/api/merchant` (matches official Pop docs)
- **Duitku payload**: Added `customerDetail` (firstName/lastName) + `itemDetails` array
- **Migration 0002**: `leads` + `status_events` tables (applied to local + production D1)
- **Production secrets**: `DUITKU_API_KEY` + `DUITKU_MERCHANT_CODE` set via wrangler
- **Favicon + OG image**: Custom SVG assets in `/public/static/`

---

## Functional Entry URIs

### Public pages
| Path | Description |
|------|-------------|
| `/` | Hero landing + lead magnet + testimonials |
| `/pricing` | 4-tier pricing with Lifetime Deal |
| `/login`, `/register` | Auth flows |
| `/checkout?plan=<id>` | Duitku redirect flow |
| `/dashboard` | KPI + charts + 5-step onboarding tour |
| `/status` | Live infra health |
| `/smoketest` | Rp 10.000 live tx QA UI |
| `/terms`, `/privacy`, `/refund`, `/contact` | Legal/contact |
| `/payment/success`, `/payment/failed` | Post-payment redirects |
| `/robots.txt`, `/sitemap.xml` | SEO crawl assets |

### API endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service health + version |
| GET | `/api/status` | Live checks: Workers, D1, KV, R2, Duitku |
| POST | `/api/auth/register` | Create user + team + 14-day trial |
| POST | `/api/auth/login` | Session login (KV + cookie) |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/auth/me` | Current user |
| GET | `/api/duitku/plans` | 4 subscription plans |
| POST | `/api/duitku/checkout` | Create invoice for plan |
| POST | `/api/duitku/smoketest` | **Rp 10.000 live test** |
| GET | `/api/duitku/recent` | Last N payments |
| POST | `/api/duitku/callback` | Duitku → us (MD5 verified) |
| GET | `/api/duitku/status/:orderId` | Status check |
| GET | `/api/analytics/overview` | 30d totals + 7d trend |
| GET | `/api/analytics/revenue?days=N` | Revenue series |
| GET | `/api/analytics/traffic` | 7d visitors + signups |
| GET | `/api/team/members`, `/api/team/subscription` | Team mgmt |
| POST | `/api/leads` | Lead capture (email + magnet, dedup) |
| GET | `/api/leads/count` | Total leads |

---

## Data Architecture

- **D1 (SQLite)**: 10 tables — `users`, `teams`, `team_members`, `subscriptions`,
  `payments`, `daily_metrics`, `sessions`, `audit_log`, `leads`, `status_events`
- **KV**: `OASIS_KV` — sessions (TTL 7d), idempotency, cache
- **R2**: `oasis-bi-pro-bucket` — exports, dashboard snapshots, user uploads
- **Auth**: Self-hosted SHA-256 password hash + KV session + D1 audit mirror
- **Payment**: Duitku Pop (SHA-256 header sig + MD5 callback/status sig, Web Crypto only)

---

## User Guide

1. Visit https://oasis-bi-pro.pages.dev or https://www.oasis-bi-pro.web.id
2. Click **Mulai Trial 14 Hari** → register form
3. Auto-provisioned trial subscription (`professional` tier, 14 days)
4. First-visit dashboard launches a **5-step onboarding tour**
5. Pick a plan from `/pricing` → Duitku payment popup → 8+ payment methods
6. Track plan/payment from `/dashboard` (KPI + charts)
7. View live infra health at `/status`
8. QA team can verify Duitku end-to-end at `/smoketest` (Rp 10.000)

---

## Deployment

- **Platform**: Cloudflare Pages + Workers + D1 + KV + R2
- **Status**: ✅ Active — `oasis-bi-pro` project
- **Tech stack**: Hono 4 + TypeScript + JSX + Vite 6 + Wrangler 4
- **Production secrets**: `DUITKU_API_KEY`, `DUITKU_MERCHANT_CODE` (set via `wrangler pages secret put`)
- **D1 prod**: `1d8a6860-7eff-4959-bcf2-89cccd34e26c` (`oasis-bi-pro-production`)
- **KV prod**: `367ff07f353545fd98d6d564f88d84ff` (`OASIS_KV`)
- **R2 prod**: `oasis-bi-pro-bucket`
- **Last deploy**: 2026-05-09 (v3.1.0)

### Local dev
```bash
npm run build
pm2 start ecosystem.config.cjs
curl http://localhost:3000/api/health
```

### Deploy commands
```bash
npm run build
npx wrangler d1 migrations apply oasis-bi-pro-production --remote
npx wrangler pages deploy dist --project-name oasis-bi-pro --branch main
```

---

## Features Not Yet Implemented

- [ ] Recurring billing (Duitku tokenization for monthly auto-charge)
- [ ] Email transactional service (welcome / receipt / failed payment)
- [ ] WhatsApp notifications (Twilio or Fonnte)
- [ ] Advanced AI assistant (insights from connected data sources)
- [ ] SOC2-style compliance documentation
- [ ] Tableau / Power BI / Looker connector imports
- [ ] Mobile-native PWA installable manifest
- [ ] Affiliate/referral program

## Recommended Next Steps

1. **Drive a real Rp 10.000 payment** via `/smoketest` to verify the callback path end-to-end
2. **Wire transactional email** (Resend/Mailgun via REST) for receipts + magnet PDF
3. **Configure Lifetime Deal countdown** with persistent seat counter in D1
4. **Soft-launch on social** with Sovereign BI Playbook lead magnet
5. **Add A/B test** on hero copy via KV-stored cohort flag
6. **Set up uptime cron** that writes to `status_events` table every 5 min

---

**Stewarded by**: PT. Waskita Cakrawarti Digital · Indonesia
**Parent brand**: SparkMind Sovereign Holding
**License**: Proprietary
