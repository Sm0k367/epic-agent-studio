# Auth & billing fixes (battle-tested)

## Google sign-in loop

**Symptoms:** `/login?callbackUrl=/os` ↔ Google ↔ back to login; `JWTSessionError`, `Invalid Compact JWE`, `PrismaClient is not configured to run in Edge Runtime` in logs.

**Root causes:**
1. Middleware `auth()` on Edge couldn't read DB sessions / ran Prisma in JWT callback
2. Stale cookies from old database session strategy

**Fixes applied:**
```typescript
// auth.ts — JWT only; Prisma in jwt callback ONLY when user?.id (Node sign-in)
session: { strategy: "jwt" }

// middleware.ts — no auth() wrapper; optional cookie clear on /login?error

// login — signIn redirectTo: "/auth/continue"
// auth/continue/page.tsx — redirectAuthenticatedUser()
```

**User fix:** Clear all cookies for `epic-os.up.railway.app`.

## Subscription → OS access

1. User pays on Stripe
2. Webhook `checkout.session.completed` → `setWorkspacePlanSecure`
3. Redirect `success_url` → `/os?welcome=1`
4. `os/page.tsx` calls `syncSubscriptionForUser` if `welcome=1`
5. `requireActiveSubscription` passes → Shell renders

## Audit trail

- `customer.signup` / `customer.signin` on Auth `signIn` event
- `billing.checkout_completed` on webhook
- `billing.plan_activated` on sync API