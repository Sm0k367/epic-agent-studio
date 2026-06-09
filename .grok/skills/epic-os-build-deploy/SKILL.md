---
name: epic-os-build-deploy
description: >
  Build, deploy, stress-test, and ship Epic OS Platform (Next.js SaaS on Railway).
  Covers full-stack implementation, Google OAuth, Stripe billing, private Postgres,
  repo cleanup, rockstar README, cost policy, and real mouse automation on Windows
  (pyautogui + Edge). Use when user asks to build/deploy Epic OS, fix Railway auth loops,
  wire Postgres without egress, stress test live site, take over mouse on their screen,
  or replicate the Sm0k367/epic-os-platform workflow. Triggers: /epic-os, deploy epic os,
  railway epicos, mouse stress test, lenovo machine test.
---

# Epic OS — build, deploy, verify (SOTA playbook)

Canonical repo: `C:\Users\Epic Tech\epic-os-platform`  
GitHub: `Sm0k367/epic-os-platform`  
Live: `https://epic-os.up.railway.app`  
Railway project: `divine-wonder` · service: `epicos` · Postgres plugin

**Operating model:** Human (Sm0k367 / Epic Tech AI) guides. Agent ships code, deploys, documents, stress-tests. Credit both in `CONTRIBUTORS.md`.

Read references as needed:
- `references/architecture.md` — stack, routes, schema
- `references/railway-deploy.md` — Railway + Postgres + cost policy
- `references/auth-billing-fixes.md` — Google loop, JWT, Stripe flow
- `references/mouse-stress-test.md` — real cursor takeover on Windows

---

## Phase 0 — Rules (never break)

1. **Execute yourself** — run commands, push, fix CI; don't tell user what to run.
2. **No egress until upscale** — app `DATABASE_URL=${{Postgres.DATABASE_URL}}` only; never `DATABASE_PUBLIC_URL` on epicos. See `scripts/deploy-cost-policy.md` in repo.
3. **Never commit secrets** — `npm run check:secrets` before push; vars in Railway only.
4. **Don't break working auth/billing** — test `/api/os/health` after deploy.
5. **Mouse takeover** — only when user explicitly asks; `pyautogui.FAILSAFE=True` (top-left abort); stop on request.

---

## Phase 1 — Repo & app structure

```
epic-os-platform/
├── src/app/          # page.tsx, /os, /login, /auth/continue, API routes
├── src/components/   # Shell, OnboardingWizard, HomeLanding, SiteFooter
├── src/lib/          # auth.ts, stripe-*, tenant.ts, require-subscription.ts
├── prisma/           # User, Workspace, AuditLog, StripeWebhookEvent
├── scripts/          # start-prod.mjs, seed.ts, assert-private-db.mjs, stress tests
├── Dockerfile + railway.toml
└── kernel/           # desktop agent (excluded from Docker via .dockerignore)
```

**Core product flow:**
```
/ → sign in → /auth/continue → /pricing (no plan) or /os (paid/admin)
Stripe checkout → /os?welcome=1 → sync subscription → Shell (88 apps)
```

---

## Phase 2 — Build locally

```bash
cd "C:\Users\Epic Tech\epic-os-platform"
cp .env.example .env   # local only; gitignored
npm install
npm run db:push
npm run db:seed
npm run build
```

---

## Phase 3 — Railway deploy

### Link & verify

```bash
npx @railway/cli link
npx @railway/cli service epicos
npx @railway/cli status
npx @railway/cli variable list
```

### Required epicos env vars

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `AUTH_SECRET` | openssl rand base64 32 |
| `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` | `https://epic-os.up.railway.app` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console |
| `STRIPE_*` | setup-stripe.ts output |
| `PLATFORM_ADMIN_EMAILS` | owner Google email |

### Postgres (private — no fees)

```bash
npx @railway/cli variables set 'DATABASE_URL=${{Postgres.DATABASE_URL}}'  # epicos only
pwsh scripts/fix-railway-postgres.ps1   # rewire + redeploy Postgres + epicos
```

Startup guard: `scripts/assert-private-db.mjs` (called from `start-prod.mjs`).

### Push → auto-deploy

```bash
git add -A && git commit -m "..." && git push origin main
```

Wait ~60–90s. Verify:

```bash
curl https://epic-os.up.railway.app/api/os/health
# {"ok":true,"database":"connected"}
```

---

## Phase 4 — Critical fixes (already in repo — preserve)

### Google sign-in loop

- **Cause:** Auth.js in Edge middleware + Prisma/JWT mismatch; stale cookies.
- **Fix:** Remove `auth()` from middleware (lightweight cookie clear on `/login?error` only). JWT sessions in `auth.ts` — **never** call Prisma in `jwt` callback unless `user` present (initial sign-in on Node).
- **Routing:** `signIn("google", { redirectTo: "/auth/continue" })` → smart route to `/os` or `/pricing`.
- **User action:** clear cookies for site if loop persists.

### F5 / Railway "down" (502)

- **Cause:** `db push` + 88-app seed blocked `next start` during container boot.
- **Fix:** `start-prod.mjs` spawns `next start` first; DB bootstrap in `setImmediate` background; seed skips if `platformApp.count >= 80`.

### Post-purchase OS access

- `success_url` → `/os?welcome=1`
- `src/lib/stripe-sync.ts` + `POST /api/stripe/sync` on welcome
- Webhook handlers write `AuditLog` for `billing.checkout_completed`

---

## Phase 5 — Repo hygiene (what to remove)

Remove from git when obsolete:
- `supabase/`, `infra/epicos-proxy/`, intro video scripts, one-off Railway/Vercel ops scripts
- Default Next.js `public/*.svg` junk
- Stale Supabase/Cloudflare env vars on Railway

Keep: `Dockerfile`, `railway.toml`, `start-prod.mjs`, `seed.ts`, `check-secrets.mjs`, `kernel/`, core `src/`.

---

## Phase 6 — Rockstar README & contributors

Follow pattern in repo `README.md`:
- Shields.io badges (live demo, stack, CI, private DB)
- Mermaid architecture diagram
- Customer journey ASCII flow
- Tables for env vars, scripts, billing
- `CONTRIBUTORS.md` — Sm0k367 guides, Grok (xAI) builds
- `package.json` `contributors` array
- Site footer: `COMPANY.engineering` → Grok link
- `.github/CONTRIBUTORS.svg` banner

---

## Phase 7 — Stress testing (SOTA)

### A) API burst (headless)

```bash
# In repo: scripts/stress-test-live.mjs (Playwright headed optional)
STRESS_URL=https://epic-os.up.railway.app node scripts/stress-test-live.mjs
```

Note: 307 on protected APIs without session is **expected**, not failure.

### B) Real mouse on user's screen (Windows SOTA)

**When user says:** "open on my screen", "take over mouse", "stress like a real user"

```bash
pip install pyautogui pygetwindow
cd "C:\Users\Epic Tech\epic-os-platform"
$env:MANUAL_LOGIN_SEC="150"   # pause for Google sign-in
python scripts/human-stress-test.py
```

**Behavior:**
- Opens **Edge** maximized on live URL
- Moves **physical cursor** with arc paths (`human_move`)
- Ctrl+L address bar navigation to every route
- Clicks CTAs, pricing, share, footer links
- Clicks Google OAuth (user completes sign-in during pause)
- Stresses `/os`: search, categories, app grid, dock, settings, billing
- **FAILSAFE:** fling mouse to top-left corner to emergency stop
- **Stop on user request:** `Stop-Process` on python PID

**Lenovo / any Windows machine:** same script — finds Edge window by title (`Epic OS`, `epic-os`, `Sign in`). No special Lenovo config required; ensure display scaling doesn't break relative clicks (use `click_in_browser(rel_x, rel_y)` fractions).

### C) Health regression

```powershell
1..10 | % { Invoke-WebRequest https://epic-os.up.railway.app/api/os/health -TimeoutSec 8 }
# All should be 200 in <500ms after deploy settles
```

---

## Phase 8 — GitHub & private repo

If Railway "repo not found": make repo public or reconnect:

```bash
npx @railway/cli service source connect --repo Sm0k367/epic-os-platform --branch main
# or: pwsh scripts/fix-railway-github.ps1
```

---

## Phase 9 — Post-deploy checklist

- [ ] `/api/os/health` → database connected
- [ ] `/login` → Google button → accounts.google.com
- [ ] `/auth/continue` routes correctly
- [ ] Logs: `[epic-os] DB: private Railway network (no egress fees)`
- [ ] No `DATABASE_PUBLIC_URL` on epicos
- [ ] README renders badges on GitHub
- [ ] `npm run check:secrets` passes on push

---

## Quick commands

| Task | Command |
|------|---------|
| Deploy status | `npx @railway/cli status` |
| Logs | `npx @railway/cli logs --lines 80` |
| Redeploy | `npx @railway/cli redeploy --yes` |
| Fix Postgres wire | `pwsh scripts/fix-railway-postgres.ps1` |
| Mouse stress | `python scripts/human-stress-test.py` |
| Secret scan | `npm run check:secrets` |

---

## Slash command

User can invoke: **`/epic-os-build-deploy`**

When this skill loads, confirm repo path exists, Railway linked, then execute the phase matching user intent (build / deploy / fix auth / stress test / readme).