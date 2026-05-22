# 🔒 Security Policy — Oasis BI Pro

## Reporting a vulnerability

Please email security disclosures to the project owner directly. Do **not** open
public GitHub issues for security problems.

---

## Secret management — required reading for contributors

This project handles real Duitku merchant payments. The following values are
**SECRETS** and must never be committed to git:

| Name | Where to set (production) | Where to set (local dev) |
|------|---------------------------|--------------------------|
| `DUITKU_MERCHANT_CODE` | `wrangler pages secret put DUITKU_MERCHANT_CODE --project-name oasis-bi-pro` | `.dev.vars` (gitignored) |
| `DUITKU_API_KEY`       | `wrangler pages secret put DUITKU_API_KEY --project-name oasis-bi-pro`       | `.dev.vars` (gitignored) |
| `JWT_SECRET`           | `wrangler pages secret put JWT_SECRET --project-name oasis-bi-pro`           | `.dev.vars` (gitignored) |
| Any other API key      | `wrangler pages secret put NAME --project-name oasis-bi-pro`                 | `.dev.vars` (gitignored) |

### Code rule
`src/lib/duitku.ts::getDuitkuConfig()` reads these from `env` and **throws** if
they are missing. **Do not add fallback string literals** for any secret value.

### Verifying secrets are set in production
```bash
npx wrangler pages secret list --project-name oasis-bi-pro
```

---

## Past incident (resolved 2026-05-22)

Earlier commits (≤ `eae13a1`) shipped a fallback hardcoded merchant API key in
`src/lib/duitku.ts`. This was removed in commit (the one bearing this file).

**Action required by the merchant owner:**
1. **Rotate** the Duitku API key in the Duitku merchant dashboard.
2. Re-`wrangler pages secret put DUITKU_API_KEY …` with the new key.
3. Confirm production functions still work via `/api/duitku/healthcheck`.

The old key remains in git history. After rotation, the historical leak loses
all operational value (it can no longer authenticate against Duitku).

If desired, a follow-up `git filter-repo` rewrite can scrub it from history,
but rotation is the actual mitigation that matters.

---

## .gitignore checklist

Confirm these are ignored (they already are; do not change):

- `.env`, `.env.local`, `.env.*.local`
- `.dev.vars`, `.dev.vars.local`
- `.wrangler/`
- `dist/`
- `*.zip`, `*.tar.gz`
- `node_modules/`
