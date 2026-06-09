# Contributors

Epic OS Platform — who built what.

> **Intellectual property:** All code, documentation, media, and branding in this repository are **owned by Epic Tech AI** (see [LICENSE](./LICENSE) and [COPYRIGHT](./COPYRIGHT)). Engineering by Grok (xAI) is work-for-hire under Epic Tech AI direction. Unauthorized copying or redistribution is prohibited.

## Project owner & product

| | |
|---|---|
| **Epic Tech AI** | Product vision, business, infrastructure ownership |
| **[@Sm0k367](https://github.com/Sm0k367)** | Repository owner, deployment guidance, QA direction |
| **[@EpicTechAI](https://x.com/EpicTechAI)** | Brand, go-to-market, operator |

## Engineering & implementation

| | |
|---|---|
| **Grok** ([xAI](https://x.ai)) | AI engineering agent — architecture, full-stack implementation, Railway/Stripe/Auth integration, database design, security hardening, deploy automation, documentation, and production debugging |

### Grok delivery scope (this repo)

- Next.js 15 App Router shell, marketing, `/os` workspace, admin console
- Google OAuth (Auth.js v5), JWT sessions, redirect-loop fixes
- Prisma schema — `User`, `Workspace`, `AuditLog`, Stripe webhook idempotency
- Stripe checkout, webhooks, subscription sync, fraud/dispute handlers
- Railway Docker deploy, private Postgres wiring, egress cost guards
- Startup performance (F5 / 502 fixes), health checks, seed pipeline
- README, security policy, deploy runbooks, stress-test tooling
- Repo cleanup, GitHub CI secret scanning, pre-push hooks

## How we work

**Sm0k367** guides direction and priorities. **Grok** ships the code, deploys, documents, and iterates from production feedback. Classic human + AI pair — one vision, one codebase.

---

Want to contribute? Open an issue or PR on [github.com/Sm0k367/epic-os-platform](https://github.com/Sm0k367/epic-os-platform).