# Deploy cost policy — Epic Tech / Epic OS

**Default until a project explicitly needs scale: zero avoidable platform fees.**

Apply this checklist on every Railway (or cloud) deploy — current and future projects.

## Database

- [ ] App service uses **private** DB URL only: `DATABASE_URL=${{Postgres.DATABASE_URL}}` → `*.railway.internal`
- [ ] **Never** set `DATABASE_PUBLIC_URL` on the app service
- [ ] `scripts/assert-private-db.mjs` runs at startup (fail deploy if public proxy detected)
- [ ] Postgres TCP Proxy: **disabled** until local/off-platform DB access is required
- [ ] Local dev uses `DATABASE_PUBLIC_URL` in **gitignored `.env` only** — never in production vars

## Networking & egress

- [ ] Services in the same Railway project talk over **private networking** (`RAILWAY_PRIVATE_DOMAIN`, `*.railway.internal`)
- [ ] No app env var pointing at `*.proxy.rlwy.net`, `RAILWAY_TCP_PROXY_DOMAIN`, or external DB proxies for in-project traffic
- [ ] Third-party webhooks/callbacks use the public app URL only where required (OAuth, Stripe) — not for DB

## Compute & storage

- [ ] Right-size services for current traffic (no oversized plans before revenue/load)
- [ ] No redundant services or duplicate databases for the same app
- [ ] Volumes/backups: enable only when the project needs durability beyond the template default

## Secrets & ops junk

- [ ] No unused env vars on production (Supabase, Vercel, Cloudflare tokens, etc. after migration)
- [ ] No paid add-ons enabled “just in case”

## When to upscale (explicit decision)

Only after the project needs it:

| Trigger | Action |
|---------|--------|
| Local dev needs direct DB | Re-enable Postgres TCP Proxy **or** use `railway connect` |
| Traffic exceeds single instance | Scale replicas / upgrade plan |
| Multi-region or HA | Add read replicas, backups, monitoring templates |
| External integrations need public DB | Dedicated connection with egress budget approved |

Document the decision in the project README or a design note before enabling paid paths.

## Pre-push / pre-deploy verification

```bash
npm run build
npm run check:secrets
# Railway: confirm DATABASE_URL reference, no DATABASE_PUBLIC_URL on app
npx @railway/cli variable list --service <app>
```

## Project scripts

| Script | Purpose |
|--------|---------|
| `scripts/fix-railway-postgres.ps1` | Rewire app → private Postgres + redeploy |
| `scripts/railway-postgres.md` | Postgres private vs public URLs |
| `scripts/assert-private-db.mjs` | Startup guard against egress DB URLs |

---

**Rule for agents and humans:** If a deploy choice trades cost for convenience, choose **free private paths** until the user or product explicitly calls for upscale.