# Railway maintenance (Epic OS Platform)

> **Cost policy:** See `scripts/deploy-cost-policy.md` — no egress or avoidable fees until upscale is explicitly needed.

**Project:** divine-wonder · **Service:** epicos
**Public URL:** https://epic-os.up.railway.app  
**Repo:** Sm0k367/epic-os-platform (branch `main`, **public**)

## CLI (from repo root)

```bash
npx @railway/cli status
npx @railway/cli logs
npx @railway/cli redeploy
npx @railway/cli variable list
```

Link the project locally with `npx @railway/cli link` (`.railway/` is gitignored).

## GitHub deploys

Service source is connected to `Sm0k367/epic-os-platform` on `main`.  
Pushes to `main` trigger an automatic Railway deploy.

Reconnect if a push does not trigger a deploy:

```bash
npx @railway/cli service source connect --repo Sm0k367/epic-os-platform --branch main
```

Or run `scripts/fix-railway-github.ps1`.

## Database — avoid egress fees

See **`scripts/railway-postgres.md`** for full Postgres + epicos wiring.

| Variable | Set on epicos? | Notes |
|----------|----------------|-------|
| `DATABASE_URL` | **Yes** — `${{Postgres.DATABASE_URL}}` | Private `postgres.railway.internal` (no egress) |
| `DATABASE_PUBLIC_URL` | **No** | Postgres-only; uses `RAILWAY_TCP_PROXY_DOMAIN` |

The Postgres service advisory about `DATABASE_PUBLIC_URL` is expected. To remove it entirely: Postgres → Settings → Networking → **disable TCP Proxy** (optional until you need local DB access).

Quick fix script: `pwsh scripts/fix-railway-postgres.ps1`

## Required env vars (set in Railway dashboard only)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (private — do not substitute `DATABASE_PUBLIC_URL`) |
| `AUTH_SECRET` | Auth.js secret |
| `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` | `https://epic-os.up.railway.app` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | **Required** — see `scripts/setup-google-oauth.md` |
| `PLATFORM_ADMIN_EMAILS` | Admin emails |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Billing |
| `STRIPE_PRICE_WEEKLY` / `MONTHLY` / `YEARLY` | Plan price IDs |

Provision Stripe prices:

```bash
npx @railway/cli run -- npx tsx scripts/setup-stripe.ts
```

Copy price IDs from `bootstrap/secrets/stripe.env` into Railway (never commit).

## Google OAuth redirect

`https://epic-os.up.railway.app/api/auth/callback/google`

## Health check

`GET https://epic-os.up.railway.app/api/os/health` — must return `{"ok":true,"database":"connected"}`