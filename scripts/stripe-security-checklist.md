# Stripe security checklist — Epic OS

Protect the Stripe account that funds 24/7 operations. Run through this after provisioning billing.

## 1. Re-run Stripe setup (webhook events)

```bash
NEXT_PUBLIC_SITE_URL=https://epic-os.up.railway.app STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/setup-stripe.ts
```

This registers fraud/dispute webhook events and writes price IDs to `bootstrap/secrets/stripe.env`.

## 2. Stripe Dashboard → Settings

- [ ] **Team members** — only trusted admins; require 2FA on Stripe account
- [ ] **API keys** — use live secret key only on Railway; rotate if ever exposed
- [ ] **Restricted keys** — for local dev/test only, never in production
- [ ] **Webhook endpoint** — `https://epic-os.up.railway.app/api/stripe/webhook`
  - Events: checkout, subscription lifecycle, `invoice.payment_failed`, `charge.dispute.*`, `radar.early_fraud_warning.created`
- [ ] **Customer emails** — receipts enabled (helps reduce “unrecognized charge” disputes)

## 3. Radar (fraud prevention)

Dashboard → **Radar** → **Rules**

Recommended rules (adjust thresholds to your volume):

- Block if **CVC check fails**
- Block if **ZIP check fails** (US cards)
- Review or block payments where **Radar risk score** is elevated
- Block if **IP country ≠ card country** for first-time customers (optional, stricter)

Enable **Radar for Fraud Teams** alerts if on a plan that includes them.

## 4. Disputes & chargebacks

- [ ] **Dispute emails** — send to `epichtechai@gmail.com`
- [ ] **Early fraud warning emails** — same inbox; app auto-suspends on webhook
- [ ] Respond to disputes within Stripe’s deadline with login logs + ToS acceptance
- [ ] Billing policy states chargebacks without contacting support may suspend accounts (`/legal/billing`)

## 5. Checkout hardening (already in code)

- Sign-in required — no anonymous checkout
- Server-side price IDs only — clients cannot pick arbitrary amounts
- 3D Secure / SCA requested automatically
- Billing address required
- No promotion codes (prevents coupon abuse)
- Rate limits on checkout and billing portal

## 6. Operational hygiene

- Run `npm run check:secrets` before every push
- Never paste `whsec_` or `sk_live_` in chat or commits
- Monitor Railway logs for `stripe.dispute` / `stripe.fraud_warning` audit actions
- After any key leak: rotate Stripe secret + webhook signing secret immediately

## 7. Database migration

After deploying security code:

```bash
npx @railway/cli run -- npx prisma db push
```

Creates `StripeWebhookEvent` table for webhook idempotency.