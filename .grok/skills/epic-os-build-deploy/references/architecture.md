# Epic OS — architecture reference

## Stack

- Next.js 15.5 App Router, React 19, TypeScript, Tailwind 4
- Auth.js v5 (NextAuth) — Google OAuth, JWT sessions, Prisma adapter
- PostgreSQL + Prisma 5
- Stripe subscriptions (weekly/monthly/yearly)
- Railway Docker deploy, GitHub `main` auto-deploy

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing; redirects signed-in users via `auth-routing.ts` |
| `/login` | Google sign-in → `redirectTo: /auth/continue` |
| `/auth/continue` | Post-OAuth router → `/os` or `/pricing` |
| `/pricing` | Stripe checkout CTAs |
| `/os` | Shell — 88 apps, dock, onboarding |
| `/os/billing` | Subscription management |
| `/admin` | Platform admin |
| `/api/os/health` | Railway healthcheck |
| `/api/stripe/webhook` | Stripe events |
| `/api/stripe/sync` | Post-checkout plan activation |

## Prisma models (customer records)

- `User` — Google account, role
- `Workspace` — per-user OS, `plan` field
- `UserPreferences` — dock, onboarding, Stripe customer id
- `PlatformApp` — 88 catalog entries
- `AuditLog` — signin, signup, billing events
- `StripeWebhookEvent` — idempotency

## Auth files

- `src/auth.ts` — providers, JWT callbacks (no Prisma on Edge refresh)
- `src/middleware.ts` — minimal; no Auth.js wrapper
- `src/lib/auth-routing.ts` — smart redirects
- `src/app/os/layout.tsx` — requires sign-in for all `/os/*`

## Billing files

- `src/lib/stripe-sync.ts` — sync subscription after checkout
- `src/lib/stripe-webhook-handlers.ts` — provision plan on `checkout.session.completed`
- `src/lib/require-subscription.ts` — gate `/os` page