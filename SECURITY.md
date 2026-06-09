# Security Policy

Epic OS Platform handles authentication, billing, and per-user workspaces. **API keys and personal data must never appear in git, logs, or client bundles.**

**Intellectual property:** This repository is proprietary software owned by Epic Tech AI. See [LICENSE](./LICENSE). Unauthorized copying or redistribution is prohibited.

## Where secrets live

| Secret | Store in | Never in |
|--------|----------|----------|
| `DATABASE_URL` | Railway / local `.env` | Repo, Docker image, logs |
| `AUTH_SECRET` | Railway / local `.env` | Repo |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Railway / local `.env` | Repo |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Railway only | Repo, browser, CI logs |
| `STRIPE_PRICE_WEEKLY` / `MONTHLY` / `YEARLY` | Railway | Repo |
| `NEXT_PUBLIC_SITE_URL` | Railway | Repo (public site URL only) |

Local overrides: copy `.env.example` → `.env` (gitignored).  
Provisioning output: `bootstrap/secrets/` (gitignored).

## Automated checks

- **Every push / PR:** GitHub Actions runs `npm run check:secrets`
- **Local pre-push hook:** `npm run install:hooks` (also runs on `npm install` via `prepare`)
- **Manual:** `npm run check:secrets` before committing

The scanner blocks Stripe keys, Supabase JWTs, OAuth secrets, Railway/Vercel tokens, and database URLs with passwords.

## Safe practices

1. **Rotate** any key that was pasted in chat, screenshots, or old commits.
2. **Stripe setup:** run `npx tsx scripts/setup-stripe.ts` locally; copy vars from `bootstrap/secrets/stripe.env` into the Railway dashboard — do not commit that file.
3. **Google OAuth:** redirect URI must match `{AUTH_URL}/api/auth/callback/google` exactly.
4. **Production errors:** webhook and API routes return generic messages; no stack traces or secret values to clients.
5. **Client bundle:** only `NEXT_PUBLIC_*` vars are exposed to the browser. Server keys (`STRIPE_SECRET_KEY`, `GOOGLE_CLIENT_SECRET`, etc.) stay in API routes and server components.

## Stripe fraud & chargeback protection

Code-level controls (see `src/lib/stripe-security.ts`, `src/lib/stripe-webhook-handlers.ts`):

| Control | What it does |
|---------|----------------|
| Webhook signature verification | Rejects forged events (`STRIPE_WEBHOOK_SECRET`) |
| Event idempotency | `StripeWebhookEvent` table blocks replay attacks |
| Paid-only provisioning | Access granted only when `payment_status === paid` and subscription is `active`/`trialing` |
| Price allowlist | Only known `STRIPE_PRICE_*` IDs can activate a plan |
| Customer ↔ workspace binding | Webhooks verify `workspaceId` matches Stripe customer metadata |
| 3D Secure | Checkout requests SCA (`request_three_d_secure: automatic`) |
| Billing address required | Stronger cardholder verification at checkout |
| Checkout rate limit | Max 8 sessions/hour per signed-in user |
| Duplicate sub block | Active subscribers must use billing portal, not new checkout |
| Dispute handler | `charge.dispute.created` suspends workspace immediately |
| Fraud warning handler | `radar.early_fraud_warning.created` suspends workspace proactively |
| Failed payment handler | `invoice.payment_failed` revokes access until payment resolves |

**Stripe Dashboard** (enable manually — see `scripts/stripe-security-checklist.md`):

- Turn on **Radar** fraud rules and review high-risk payments
- Enable **email alerts** for disputes and early fraud warnings
- Use **restricted API keys** for non-production environments only
- Never expose `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in client code or git
- Webhook URL: `https://epic-os.up.railway.app/api/stripe/webhook`

## Reporting

If you discover exposed credentials in the repo or production:

1. Rotate the affected keys immediately (Stripe, Google, Supabase, Railway).
2. Email [epichtechai@gmail.com](mailto:epichtechai@gmail.com) or reach out on [X @EpicTechAI](https://x.com/EpicTechAI).

## Platform admin

`PLATFORM_ADMIN_EMAILS` is set in Railway environment variables only — not in source code.

---

*Security architecture implemented by [Grok](https://x.ai) (xAI) for [Epic Tech AI](https://x.com/EpicTechAI). See [CONTRIBUTORS.md](./CONTRIBUTORS.md).*