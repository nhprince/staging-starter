# 🏗️ Saturday Framework

> **Build any web project. 100% free infrastructure. Agent-driven.**

## Quick Start

```bash
# Tell Saturday:
"Build me a blog called my-blog"
"Create a SaaS called tiny-tools"
"Make a portfolio site"
"Build an API for my app"
"Create a landing page for my product"
"Build an e-commerce store"
```

Saturday handles everything: scaffold → configure → deploy → verify.

## Framework Structure

```
saturday/
├── scaffolds/           # Complete project blueprints
│   ├── blog/           # MDX blog with admin, RSS, SEO
│   ├── saas/           # SaaS with auth, billing, dashboard
│   ├── portfolio/      # Developer portfolio
│   ├── api/            # REST API with docs
│   ├── ecommerce/      # Store with Stripe
│   └── landing/        # Marketing site
├── frontends/          # Frontend framework options
│   ├── nextjs/         # Next.js (default)
│   ├── astro/          # Astro (fast builds)
│   ├── sveltekit/      # SvelteKit (interactive)
│   └── static-html/    # Pure HTML (no build)
├── backends/           # Backend runtime options
│   ├── hono-workers/   # Hono on CF Workers (default)
│   ├── python-vps/     # FastAPI on VPS
│   └── php-vps/        # PHP on VPS
├── databases/          # Database adapters
│   ├── d1/             # Cloudflare D1 (SQLite, default)
│   ├── postgres-vps/   # PostgreSQL on VPS
│   ├── supabase/       # Supabase (managed Postgres)
│   └── planetscale/    # PlanetScale (managed MySQL)
├── auth/               # Auth provider modules
│   ├── clerk/          # Clerk (managed, easiest)
│   ├── authjs/         # Auth.js (flexible)
│   └── lucia/          # Lucia (lightweight)
├── modules/            # Feature modules (plugins)
│   ├── cms/            # Headless CMS
│   ├── comments/       # Comment system
│   ├── payments-stripe/# Stripe payments
│   ├── email/          # Transactional email
│   ├── file-upload/    # R2 file uploads
│   └── analytics/      # Privacy-friendly analytics
├── deploy/             # Deployment configurations
│   ├── cloudflare-pages/
│   ├── cloudflare-workers/
│   └── vps-ssh/
├── scripts/            # Automation scripts
│   └── new-project.py  # Project generator
└── skills/             # Saturday skills for building
    ├── framework/      # Framework-level skills
    ├── project-types/  # Project-type build skills
    ├── frontends/      # Frontend skills
    ├── backends/       # Backend skills
    ├── auth/           # Auth skills
    ├── databases/      # Database skills
    ├── modules/        # Module skills
    ├── deploy/         # Deployment skills
    └── testing/        # Testing skills
```

## Project Types

| Type | Stack | Deploy |
|------|-------|--------|
| **Blog** | Next.js + Hono + D1 | CF Pages + Workers |
| **SaaS** | Next.js + Hono + D1 + Clerk + Stripe | CF Pages + Workers |
| **Portfolio** | Next.js (static) + Hono + D1 | CF Pages + Workers |
| **API** | Hono + D1 | CF Workers |
| **E-Commerce** | Next.js + Hono + D1 + Stripe | CF Pages + Workers |
| **Landing** | Next.js (static) + Hono + D1 | CF Pages + Workers |

## Free Infrastructure

| Service | Free Tier |
|---------|-----------|
| Cloudflare Pages | Unlimited bandwidth |
| Cloudflare Workers | 100K requests/day |
| Cloudflare D1 | 5GB, 5M reads/day |
| Cloudflare KV | 100K reads/day |
| Cloudflare R2 | 10GB storage |
| GitHub Actions | 2,000 min/month |
| GitHub Repos | Unlimited |
| OpenRouter | Multiple free models |
| Clerk | 10K MAU |
| Stripe | Free to set up (2.9% + 30¢/tx) |
| Resend | 3,000 emails/month |

## Prince's UI Standards

Every scaffold includes:
- **Dark theme** — `#0a0a0f` background
- **Glassmorphism** — `backdrop-blur` cards with subtle borders
- **Gradient accents** — indigo → purple
- **Micro-animations** — staggered entrance, hover +2px lift
- **Responsive** — mobile-first design
- **Typography** — Inter font, clear hierarchy

## How Saturday Builds

```
Prince: "Build me a blog called my-blog"
  ↓
1. scaffold-project (create repo, CF resources)
2. add-database (D1 schema)
3. add-auth (Clerk for admin)
4. Build frontend (Next.js + MDX)
5. Build backend (Hono API)
6. Deploy (git push → auto)
7. Verify (health checks)
  ↓
Returns: live URLs
```

## Skills

Saturday uses skills from `skills/` directory to build projects. Each skill contains:
- Overview and when to use
- Step-by-step workflow
- Common pitfalls
- Verification checklist
- Agent tips

## Contributing

To add a new scaffold:
1. Create directory in `scaffolds/<type>/`
2. Add README.md with stack, features, usage
3. Add database schema in `database/schema.sql`
4. Create build skill in `skills/project-types/build-<type>.md`
5. Update this file

To add a new module:
1. Create directory in `modules/<name>/`
2. Add README.md with setup instructions
3. Add database schema if needed
4. Create skill in `skills/modules/<name>.md`

## Connect with the AI VPS Setup Guide

This framework works seamlessly with the **[100% Free AI Agent Driven Development Workflow](https://github.com/nhprince/server-setup-guide)** guide:

- ✅ Use the guide to set up your AI agent (Saturday) on a free VPS
- ✅ Then use Saturday to build projects with 100% free infrastructure
- ✅ The guide includes Saturday-specific commands and workflows

**Live Dashboard:** [saturday-62d.pages.dev](https://saturday-62d.pages.dev)

**Recommended next step:** [Follow the server setup guide →](https://github.com/nhprince/server-setup-guide)

> **🤖 Agent Tip:** Just say *"Set up my VPS using the AI Agent guide"* and Saturday will handle all the server configuration automatically.