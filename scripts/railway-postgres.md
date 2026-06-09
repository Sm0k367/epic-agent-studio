# Railway Postgres — private networking (no egress)

## Why Railway shows the warning

The **Postgres** plugin auto-creates two connection strings:

| Variable (on Postgres service) | Host | Use |
|----------------------------------|------|-----|
| `DATABASE_URL` | `postgres.railway.internal` | **Production** — app ↔ DB inside Railway (no egress) |
| `DATABASE_PUBLIC_URL` | `*.proxy.rlwy.net` | **Local dev only** — your laptop → cloud (egress if used) |

The advisory `DATABASE_PUBLIC_URL -> RAILWAY_TCP_PROXY_DOMAIN` is expected. It does **not** mean you are being charged unless something actually connects through the public proxy.

## epicos (app) — required config

On the **epicos** service only:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Never copy `DATABASE_PUBLIC_URL` onto epicos.

Startup runs `scripts/assert-private-db.mjs` — deploy fails if production uses a public proxy URL.

## Postgres service — keep updated

1. **Redeploy Postgres** after template updates (Railway dashboard → Postgres → Deployments → Redeploy, or CLI):

```bash
npx @railway/cli redeploy --service Postgres --yes
```

2. **epicos auto-syncs** when `DATABASE_URL=${{Postgres.DATABASE_URL}}` — credential or host changes on Postgres propagate on next epicos deploy.

3. **Optional — remove egress risk entirely** (until you need local DB access):
   - Postgres service → **Settings** → **Networking** → disable **TCP Proxy**
   - This removes the public endpoint and the advisory; local dev must use `railway connect` or a tunnel instead.

## Local development from your machine

Only then use the public URL (egress applies to your dev machine, not production):

```bash
# From Postgres service variables tab — copy DATABASE_PUBLIC_URL into local .env only
DATABASE_URL=postgresql://...@....proxy.rlwy.net:PORT/railway
```

## Verify production

```bash
curl https://epic-os.up.railway.app/api/os/health
# → {"ok":true,"database":"connected"}
```

```bash
npx @railway/cli logs --service epicos
# → [epic-os] DB: private Railway network (no egress fees)
```