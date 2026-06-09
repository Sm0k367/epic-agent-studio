<div align="center">

# Epic Agent Studio

### Multimodal AI creative platform — text, image, audio, and video.

**Sign in with Google · Subscribe · Generate in your private studio workspace.**

<br />

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Groq](https://img.shields.io/badge/Groq-Text-a855f7?style=flat-square)](https://groq.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Live Demo](https://img.shields.io/badge/Live-epic--agent--studio-22d3ee?style=flat-square)](https://epic-agent-studio-production.up.railway.app)

</div>

---

## Overview

**Epic Agent Studio** by [Epic Tech AI](https://x.com/EpicTechAI) is a multimodal AI creative platform. One prompt powers text (Groq), images (Pixio), audio (Hugging Face), and video generation — with templates, history, and per-user workspaces backed by PostgreSQL.

Merged from **epic-os-platform** (auth, billing, admin) and **agent-platform** (multimodal studio UI).

---

## Features

| | |
|:---:|:---|
| **Text** | Groq LLM creative direction |
| **Image** | Pixio / Hugging Face image backends |
| **Audio** | Hugging Face text-to-audio |
| **Video** | Pixio / HF video concepts |
| **Templates** | Curated prompts in `/public/templates.json` |
| **History** | Generations logged to Postgres |
| **Google OAuth** | Auth.js / NextAuth v5 |
| **Stripe billing** | Weekly · monthly · yearly |
| **Admin** | Users, generations, feature flags at `/admin` |

---

## Customer journey

```text
  Landing (/)  →  Google sign-in  →  /auth/continue
        │                                    │
        │                         ┌──────────┴──────────┐
        │                         ▼                     ▼
        │                   Has plan?              No plan
        │                         │                     │
        │                         ▼                     ▼
        │                    /studio              /pricing
        │              generate + history              │
        │                         ▲                     │
        └─────────────────────────┴──── Stripe checkout ─┘
                           /studio?welcome=1
```

---

## Quick start

```bash
cd epic-agent-studio
cp .env.example .env
```

Fill `.env` with `DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and AI keys (`GROQ_API_KEY`, `PIXIO_API_KEY`, `HF_TOKEN`).

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open **http://localhost:3000**

---

## Environment variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Auth.js session secret |
| `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` | Yes | Public app URL |
| `GOOGLE_CLIENT_ID` / `SECRET` | Yes | Google OAuth |
| `STRIPE_*` | Billing | Stripe keys and price IDs |
| `GROQ_API_KEY` | Text | Groq API for text generation |
| `PIXIO_API_KEY` | Image/Video | Pixio image/video API |
| `HF_TOKEN` | Audio | Hugging Face inference token |
| `PLATFORM_ADMIN_EMAILS` | Admin | Comma-separated admin emails |

---

## Deploy on Railway

| Step | Action |
|------|--------|
| 1 | Add **Postgres** plugin |
| 2 | Set `DATABASE_URL=${{Postgres.DATABASE_URL}}` |
| 3 | Set vars from `.env.example` |
| 4 | Deploy via Docker (`Dockerfile` + `railway.toml`) |

**Health:** `GET /api/health` → `{"ok":true,"database":"connected","platform":"epic-agent-studio"}`

---

## Project structure

```text
epic-agent-studio/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Marketing landing
│   │   ├── studio/           # Protected studio UI
│   │   └── api/
│   │       ├── studio/generate/  # Multimodal generation
│   │       ├── health/           # Railway healthcheck
│   │       └── admin/generations/
│   ├── components/studio/AgentStudio.tsx
│   └── lib/                  # Auth, Stripe, tenant
├── prisma/schema.prisma      # User, Workspace, Generation
├── public/templates.json
├── Dockerfile
└── railway.toml
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Prisma generate + production build |
| `npm run start:prod` | Railway entry — fast start + background DB seed |
| `npm run db:seed` | Upsert studio modality feature flags |

---

## Billing

| Plan | Price |
|------|-------|
| Weekly | **$9.99**/week |
| Monthly | **$29.99**/month |
| Yearly | **$299**/year |

---

## Admin

Set `PLATFORM_ADMIN_EMAILS` to your Google email. First sign-in grants `PLATFORM_ADMIN`.

- **`/admin`** — users, generations, feature flags
- **`/api/admin/generations`** — recent generation log (platform admin)

---

## License

**Private repository · proprietary — all rights reserved.** Owned by **[Epic Tech AI](https://x.com/EpicTechAI)**.

---

<div align="center">

**[Epic Tech AI](https://x.com/EpicTechAI)** · Epic Agent Studio · Engineered with **Grok**

</div>