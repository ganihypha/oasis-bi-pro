# OBP Merchant-of-Record (MoR) Routing Manifest

> **Doctrine**: MASTER-ARCHITECT-PROMPT v7.0 · OBP HYBRID LOCK
> **Effective**: 2026-05-21
> **Owner**: Reza Estes / Haidar — Sovereign AI Dev
> **Status**: 🔒 CANONICAL · EXECUTE-READY

This document declares **Oasis BI Pro** (this repo) as the legal **Merchant-of-Record (MoR)** for the SparkMind ecosystem (4 sub-brands).

## Layer 2 Lock — Merchant Layer

| Field | Value |
|-------|-------|
| Merchant-of-Record | **Oasis BI Pro** |
| Legal entity | PT. Waskita Cakrawarti Digital |
| KBLI | 63122 (Hosting & data processing) |
| Domain (apex) | `oasis-bi-pro.web.id` |
| Checkout orchestrator | `pay.oasis-bi-pro.web.id` (provisioned D7) |
| Duitku Merchant Code | `D20919` (live, verified) |
| Xendit | In process (target D7) |
| Bank | BCA atas nama OBP/Haidar |

## Brand Layer Routing Table (4 SparkMind Sub-Brands)

| # | Sub-Brand | Public Product Domain | Checkout Route via OBP |
|---|-----------|----------------------|-----------------------|
| 1 | BarberKas | `barberkas.sparkmind.web.id` | `pay.oasis-bi-pro.web.id/bk/*` |
| 2 | KuratorKas | `kuratorkas.sparkmind.web.id` (mirror at `kuratorkas.pages.dev`) | `pay.oasis-bi-pro.web.id/kk/*` |
| 3 | PaceLokal | `pacelokal.sparkmind.web.id` | `pay.oasis-bi-pro.web.id/pl/*` (Premium only) |
| 4 | Nurani.OS | `nurani.os.sparkmind.web.id` | `pay.oasis-bi-pro.web.id/nu/*` (Donation via Xendit) |

## API Contract Reference

See [`docs/doctrine/v2.0/PAYMENT-FLOW-OBP-v2.0.md`](../doctrine/v2.0/PAYMENT-FLOW-OBP-v2.0.md) for the full HTTP contract.

### Sub-Brand → OBP (Create Invoice)
```http
POST https://pay.oasis-bi-pro.web.id/v1/invoices
Authorization: Bearer <SUB_BRAND_API_KEY>
Idempotency-Key: <uuid>

{ "sub_brand_id": "kuratorkas", "external_ref": "...", "amount_idr": 49000, ... }
```

### OBP → Sub-Brand (Webhook)
```http
POST https://<sub_brand>.sparkmind.web.id/webhooks/obp
X-OBP-Signature: <hmac_sha256>

{ "event": "payment.settled", "invoice_id": "obp_inv_...", ... }
```

## Settlement Flow (T+1)

```
Customer pays
  → Duitku/Xendit settles to OBP bank account
  → OBP daily reconciliation job (02:00 WIB)
  → Match obp_invoice_id ↔ sub_brand.external_ref
  → Update obp.settlements + obp.brand_ledger
  → Internal B2B payout to sub-brand operating accounts
```

## Compliance Notes

- **UU PDP**: DPO contact `dpo@oasis-bi-pro.web.id` (Haidar self-appointed)
- **PSE Kominfo**: Umbrella registration covers all 4 SparkMind subdomains + OBP
- **BI/PJP**: OBP = merchant under PJP Duitku/Xendit (no PSP licensing needed)
- **OJK**: N/A (no P2P/wallet/insurance/securities)

## Mandatory Disclosure (placed on every checkout & receipt)

> *Pembayaran diproses oleh Oasis BI Pro (oasis-bi-pro.web.id) sebagai Merchant-of-Record untuk ekosistem SparkMind. Pemrosesan kartu/bank melalui PJP Duitku/Xendit yang terdaftar di Bank Indonesia.*

## Companion Repos

| Repo | Purpose |
|------|---------|
| https://github.com/ganihypha/Sparkmind-Sovereign | Mother monorepo (SSOT, 4-lane apps) |
| https://github.com/ganihypha/kuratorkas | Sub-brand standalone (mirror of `apps/kuratorkas/`) |
| https://github.com/ganihypha/oasis-bi-pro | **This repo** — Merchant-of-Record backend |

---
*See `docs/doctrine/v2.0/` for the full v2.0 bundle (10 canonical docs).*
