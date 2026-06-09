# Railway deploy reference

## Services

| Service | ID purpose |
|---------|------------|
| `epicos` | Next.js app — public URL `epic-os.up.railway.app` |
| `Postgres` | Database plugin — private `postgres.railway.internal` |

## DATABASE_URL — egress policy

**epicos (app):**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```
Resolves to `postgresql://...@postgres.railway.internal:5432/railway` — **free internal traffic**.

**Never on epicos:**
- `DATABASE_PUBLIC_URL` (uses `*.proxy.rlwy.net` → egress fees)

**Postgres plugin advisory** about `DATABASE_PUBLIC_URL → RAILWAY_TCP_PROXY_DOMAIN` is informational. To dismiss: Postgres → Settings → Networking → disable TCP Proxy.

## Startup sequence (`scripts/start-prod.mjs`)

1. `assert-private-db.mjs` — exit if public proxy URL
2. Spawn `next start -p $PORT` immediately
3. Background: `prisma db push` + `seed.ts` (skip if ≥80 apps)

## railway.toml

```toml
healthcheckPath = "/api/os/health"
healthcheckTimeout = 120
```

## Stripe webhook URL

```
https://epic-os.up.railway.app/api/stripe/webhook
```

## Google OAuth redirect

```
https://epic-os.up.railway.app/api/auth/callback/google
```