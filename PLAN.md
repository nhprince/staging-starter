# 🏗️ Staging Starter — Full Framework Transformation Plan

> **Vision:** Turn `staging-starter` from a simple template into a **full agent-driven framework** that can scaffold, configure, and deploy **any type of web project** using 100% free infrastructure.
>
> **Core Principle:** Prince tells Saturday *"build me a blog"* or *"create a SaaS"* — and Saturday does everything: scaffold, configure, deploy, verify. Zero manual steps.

---

## 🎯 Target: What the Framework Does

```
Prince: "Build me a blog with dark theme and comments"
  ↓
Saturday: 
  1. Scaffolds full project (frontend + backend + DB)
  2. Configures auth, database, storage
  3. Pushes to new GitHub repo
  4. Auto-deploys to Cloudflare
  5. Verifies everything works
  6. Returns live URLs
```

---

## 📐 Architecture Overview

```
staging-starter/              ← Framework repo (the ENGINE)
├── scaffolds/                ← Project type blueprints
│   ├── blog/
│   ├── saas/
│   ├── portfolio/
│   ├── api/
│   ├── ecommerce/
│   └── landing/
├── frontends/                ← Frontend framework options
│   ├── nextjs/
│   ├── astro/
│   ├── sveltekit/
│   └── static-html/
├── backends/                 ← Backend runtime options
│   ├── hono-workers/        ← Cloudflare Workers (default)
│   ├── python-vps/          ← FastAPI/Flask on VPS
│   └── php-vps/             ← Laravel/PHP on VPS
├── databases/                ← Database adapters
│   ├── d1/                  ← Cloudflare D1 (SQLite)
│   ├── postgres-vps/        ← PostgreSQL on VPS
│   ├── supabase/            ← Supabase free tier
│   └── planetscale/         ← PlanetScale free tier (MySQL)
├── auth/                     ← Auth provider modules
│   ├── clerk/
│   ├── authjs/
│   └── lucia/
├── modules/                  ← Reusable feature modules
│   ├── cms/
│   ├── comments/
│   ├── payments-stripe/
│   ├── email/
│   ├── file-upload/
│   └── analytics/
├── deploy/                   ← Deployment configurations
│   ├── cloudflare-pages/
│   ├── cloudflare-workers/
│   └── vps-ssh/
├── dashboard/                ← Project management dashboard
│   ├── app/                  ← The dashboard app itself
│   └── tests/                ← Diagnostic tests
├── scripts/                  ← Agent automation scripts
│   ├── new-project.py        ← Main project generator
│   ├── setup-cloudflare.py   ← Auto-configure CF resources
│   └── setup-vps.sh          ← Auto-configure VPS side
└── skills/                   ← Saturday skills for building
    └── build-project.md      ← Complete build workflow
```

---

## 🗺️ Phase-by-Phase Plan

### Phase 1: Framework Skeleton ✅ START HERE
**Goal:** Restructure repo so it can house all blueprints.

| # | Task | What Changes | Priority |
|---|------|-------------|----------|
| 1.1 | Create `scaffolds/` directory structure | Add empty scaffold directories for blog, saas, portfolio, api, ecommerce, landing | HIGH |
| 1.2 | Create `frontends/` directory | Add subdirectories for nextjs, astro, sveltekit, static-html | HIGH |
| 1.3 | Create `backends/` directory | Add subdirectories for hono-workers, python-vps, php-vps | HIGH |
| 1.4 | Create `databases/` directory | Add adapter configs for d1, postgres-vps, supabase, planetscale | MEDIUM |
| 1.5 | Create `auth/` directory | Add integration configs for clerk, authjs, lucia | MEDIUM |
| 1.6 | Create `modules/` directory | Add plugin directories for cms, comments, payments, email, file-upload, analytics | LOW |
| 1.7 | Create `deploy/` directory | Add deploy configs for cloudflare-pages, cloudflare-workers, vps-ssh | HIGH |
| 1.8 | Create `scripts/` directory | Add new-project.py, setup-cloudflare.py, setup-vps.sh templates | HIGH |
| 1.9 | Add `FRAMEWORK.md` | Framework documentation: how to use, how it works | HIGH |
| 1.10 | Update `README.md` | Reflect new framework identity, quick-start for each project type | HIGH |

---

### Phase 2: Project Generator Script
**Goal:** One command/ prompt scaffolds a complete project.

| # | Task | Details | Priority |
|---|------|---------|----------|
| 2.1 | Build `scripts/new-project.py` | CLI tool: `python new-project.py --type blog --name my-blog --frontend nextjs --backend hono --db d1` | HIGH |
| 2.2 | Interactive mode | When no flags given, prompts interactively for choices | HIGH |
| 2.3 | Template merging | Script copies relevant scaffold + frontend + backend + db + auth into new project directory | HIGH |
| 2.4 | GitHub repo auto-create | Uses `gh` CLI to create new repo and push scaffolded project | HIGH |
| 2.5 | Cloudflare auto-setup | Creates KV namespace, D1 database, Workers project via API | MEDIUM |
| 2.6 | GitHub Secrets auto-configure | Sets CF_API_TOKEN, CF_ACCOUNT_ID, etc. via `gh secret set` | MEDIUM |
| 2.7 | Return live URLs preview | After deploy, prints frontend + backend URLs | MEDIUM |

---

### Phase 3: Frontend Framework Blueprints
**Goal:** Multiple frontend options, all optimized for Cloudflare Pages.

| # | Framework | Blueprint Contents | Priority |
|---|-----------|-------------------|----------|
| 3.1 | `frontends/nextjs/` | Next.js + Tailwind + dark theme + glassmorphism starter (evolve current frontend) | HIGH |
| 3.2 | `frontends/astro/` | Astro + Tailwind minimal starter, static export, islands architecture | MEDIUM |
| 3.3 | `frontends/sveltekit/` | SvelteKit + adapter-static, Tailwind, motion animations | MEDIUM |
| 3.4 | `frontends/static-html/` | Pure HTML/CSS/JS with Tailwind CDN, no build step needed | LOW |

**Each frontend includes:**
- Prince's preferred dark theme (#0a0a0f bg, glassmorphism, gradient accents)
- Micro-animations (staggered entrance, hover +2px)
- Responsive meta viewport
- Connected to backend API (configurable BACKEND_URL)
- Pre-wired for auth integration

---

### Phase 4: Backend Runtime Blueprints
**Goal:** Multiple backend options depending on project needs.

| # | Runtime | Use Case | Blueprint Contents | Priority |
|---|---------|----------|-------------------|----------|
| 4.1 | `backends/hono-workers/` | Default — serverless, edge, free | Hono + CORS + KV + D1 helpers, evolved from current backend | HIGH |
| 4.2 | `backends/python-vps/` | Heavy processing, ML, scraping | FastAPI + uvicorn + PM2 config, Nginx reverse proxy | MEDIUM |
| 4.3 | `backends/php-vps/` | WordPress, Laravel, traditional PHP | PHP-FPM + Nginx config, Composer setup | LOW |

**Each backend includes:**
- Health check endpoint
- CORS configured
- Database connection helper
- Auth middleware hook
- Error handling

---

### Phase 5: Database Adapters
**Goal:** Scaffold projects with any database, all free tier.

| # | Database | Adapter Contents | Priority |
|---|----------|-----------------|----------|
| 5.1 | `databases/d1/` | D1 SQL schema template, KV helper functions, migration pattern | HIGH |
| 5.2 | `databases/postgres-vps/` | PostgreSQL schema template, connection pool, migration script | MEDIUM |
| 5.3 | `databases/supabase/` | Supabase client setup, Row Level Security policies, edge functions pattern | MEDIUM |
| 5.4 | `databases/planetscale/` | PlanetScale connect URL template, Prisma/TypeORM config snippet | LOW |

---

### Phase 6: Auth Modules
**Goal:** Plug-and-play authentication, all free tiers.

| # | Provider | What's Included | Priority |
|---|----------|-----------------|----------|
| 6.1 | `auth/clerk/` | Clerk SDK, middleware, sign-in/sign-up pages, user button | HIGH |
| 6.2 | `auth/authjs/` | Auth.js (NextAuth) config for credentials + OAuth providers | MEDIUM |
| 6.3 | `auth/lucia/` | Lucia Auth session config, D1 adapter, login/register routes | MEDIUM |

---

### Phase 7: Pre-built Project Scaffolds
**Goal:** Complete project blueprints — pick one and go.

#### 7.1 `scaffolds/blog/` — Full Blog Engine
- **Frontend:** MDX.content layer, post listing, single post, dark theme
- **Backend:** CRUD API for posts, categories, tags
- **DB:** D1 schema for posts, categories, tags, authors
- **Auth:** Admin authentication for writing posts
- **Extras:** RSS feed, sitemap, SEO meta, reading time
- **Deploy:** Cloudflare Pages + Workers

#### 7.2 `scaffolds/saas/` — SaaS Starter Kit
- **Frontend:** Landing page + dashboard + settings + billing UI
- **Backend:** User management, subscription API, webhook handler
- **DB:** Users, subscriptions, plans, usage tracking
- **Auth:** Clerk with org support
- **Extras:** Stripe integration, email notifications, tiered access
- **Deploy:** Cloudflare Pages + Workers

#### 7.3 `scaffolds/portfolio/` — Developer Portfolio
- **Frontend:** Projects gallery, about, contact form, blog section
- **Backend:** Contact form API, optional admin for projects
- **DB:** Projects table, messages table
- **Extras:** GitHub API integration, analytics
- **Deploy:** Cloudflare Pages (static)

#### 7.4 `scaffolds/api/` — REST API Boilerplate
- **Frontend:** API documentation (Swagger/OpenAPI)
- **Backend:** Versioned API, rate limiting, request logging
- **DB:** Customizable schema template
- **Auth:** API key + JWT
- **Extras:** OpenAPI spec generation, Postman collection
- **Deploy:** Cloudflare Workers

#### 7.5 `scaffolds/ecommerce/` — E-Commerce Starter
- **Frontend:** Product catalog, cart, checkout UI, order tracking
- **Backend:** Product CRUD, cart API, order management, webhook handler
- **DB:** Products, orders, customers, inventory
- **Extras:** Stripe payments, email receipts, inventory tracking
- **Deploy:** Cloudflare Pages + Workers + VPS (for webhooks)

#### 7.6 `scaffolds/landing/` — Landing Page Builder
- **Frontend:** Hero, features, pricing, FAQ, contact — all sections
- **Backend:** Lead capture API, newsletter signup
- **DB:** Leads table, subscribers table
- **Extras:** A/B test ready, SEO optimized, analytics
- **Deploy:** Cloudflare Pages (static)

---

### Phase 8: Feature Modules (Plugins)
**Goal:** Add capabilities to any project.

| # | Module | What It Adds | Priority |
|---|--------|-------------|----------|
| 8.1 | `modules/cms/` | Headless CMS with admin panel, content types, media library | MEDIUM |
| 8.2 | `modules/comments/` | Comment system with moderation, nested replies | LOW |
| 8.3 | `modules/payments-stripe/` | Stripe checkout, subscriptions, webhooks | MEDIUM |
| 8.4 | `modules/email/` | Transactional email via Resend free tier or Mailgun free tier | MEDIUM |
| 8.5 | `modules/file-upload/` | R2 file upload with presigned URLs, image optimization | MEDIUM |
| 8.6 | `modules/analytics/` | Privacy-friendly analytics (Plausible free tier or self-hosted) | LOW |

---

### Phase 9: Deployment System
**Goal:** One push deploys everything. Zero config.

| # | Task | Details | Priority |
|---|------|---------|----------|
| 9.1 | Cloudflare Pages deploy config | Evolved `deploy/cloudflare-pages/` workflow template | HIGH |
| 9.2 | Cloudflare Workers deploy config | Evolved `deploy/cloudflare-workers/` workflow template | HIGH |
| 9.3 | VPS SSH deploy config | Evolved `deploy/vps-ssh/` workflow template | MEDIUM |
| 9.4 | Multi-project monorepo support | Deploy matrix — detect what changed, deploy only affected services | LOW |
| 9.5 | Custom domain automation | Script to add CF custom domain and DNS records | LOW |
| 9.6 | Environment management | Staging vs production branches, preview deployments | MEDIUM |

---

### Phase 10: Dashboard → Project Management Panel
**Goal:** The existing dashboard becomes a real project control center.

| # | Feature | Details | Priority |
|---|---------|---------|----------|
| 10.1 | Project list | Shows all projects, their status, live URLs, last deploy | HIGH |
| 10.2 | Health monitoring | Periodic health checks for all deployed projects | HIGH |
| 10.3 | One-click deploy | Trigger redeploy from dashboard | MEDIUM |
| 10.4 | Logs viewer | View recent deploy logs from GitHub Actions | MEDIUM |
| 10.5 | Resource usage | Show KV reads, D1 queries, Workers invocations (CF analytics API) | LOW |
| 10.6 | Project creation UI | Web form to create new projects (calls generator script via backend API) | LOW |

---

### Phase 11: Saturday Skills for Building
**Goal:** Document the build workflow so Saturday can do it autonomously.

| # | Skill | Contents | Priority |
|---|-------|----------|----------|
| 11.1 | `skills/build-project.md` | Complete workflow: scaffold → configure → deploy → verify for each project type | HIGH |
| 11.2 | `skills/configure-cloudflare.md` | Setting up KV, D1, R2, Pages, Workers via API | MEDIUM |
| 11.3 | `skills/configure-vps.md` | Setting up PM2, Nginx, PostgreSQL, PHP on VPS | MEDIUM |
| 11.4 | `skills/add-auth.md` | Adding Clerk/Auth.js/Lucia to any project | MEDIUM |
| 11.5 | `skills/add-database.md` | Adding any database adapter to any project | MEDIUM |

---

### Phase 12: Documentation & Guide Updates
**Goal:** Everything documented, agent-maintained.

| # | Task | Details | Priority |
|---|------|---------|----------|
| 12.1 | Update `server-setup-guide/README.md` | Section 6: "Building Projects with the Framework" | HIGH |
| 12.2 | Add `FRAMEWORK.md` to repo | Complete framework documentation | HIGH |
| 12.3 | Update weekly cron | Auto-update guide sections that change as framework evolves | LOW |
| 12.4 | Add examples section | Real projects built with the framework, live demos | MEDIUM |

---

## 🔄 Execution Order

```
Phase 1  → Phase 2  → Phase 3  → Phase 4
  ↓           ↓           ↓           ↓
Framework  Generator  Frontends  Backends
  Skeleton   Script     Blueprints  Blueprints
              ↓
         Phase 5  → Phase 6  → Phase 7
         Databases  Auth     Full Project
         Adapters   Modules  Scaffolds
              ↓
         Phase 8  → Phase 9  → Phase 10
         Feature   Deploy    Dashboard
         Modules   System    Panel
              ↓
         Phase 11 → Phase 12
         Skills    Docs
```

---

## 🤖 Agent-Driven Workflow

After the framework is built, here's how Prince uses it:

### Example 1: Blog
```
Prince: "Build me a blog called princely-blog"
Saturday:
  1. Runs: python scripts/new-project.py --type blog --name princely-blog
  2. Creates GitHub repo nhprince/princely-blog
  3. Scaffolds blog engine with MDX, dark theme, admin auth
  4. Creates D1 database and KV namespace
  5. Configures GitHub Secrets
  6. Pushes to main → auto-deploys
  7. Runs health checks
  8. Returns: Frontend URL, Backend URL, Admin URL
```

### Example 2: SaaS
```
Prince: "Create a SaaS called tiny-tools with Stripe billing"
Saturday:
  1. Runs: python scripts/new-project.py --type saas --name tiny-tools --payments stripe
  2. Scaffolds SaaS kit with Clerk auth, Stripe integration
  3. Sets up all Cloudflare resources
  4. Configures Stripe webhook handler
  5. Deploys everything
  6. Returns all URLs + warns about configuring Stripe keys
```

### Example 3: Quick Landing Page
```
Prince: "Landing page for my new project"
Saturday:
  1. Runs: python scripts/new-project.py --type landing --name my-project
  2. 2-minute scaffold and deploy
  3. Returns live URL
```

---

## 📊 Progress Tracker

| Phase | Name | Status | Skills Created |
|-------|------|--------|----------------|
| 1 | Framework Skeleton | ⬜ Not started | — |
| 2 | Project Generator | ✅ Skills done | scaffold-project |
| 3 | Frontend Blueprints | ✅ Skills done | astro-scaffold, sveltekit-scaffold |
| 4 | Backend Blueprints | ✅ Skills done | configure-vps |
| 5 | Database Adapters | ✅ Skills done | add-database |
| 6 | Auth Modules | ✅ Skills done | add-auth |
| 7 | Pre-built Scaffolds | ✅ Skills done | build-blog, build-saas, build-portfolio, build-api, build-ecommerce, build-landing |
| 8 | Feature Modules | ✅ Skills done | stripe-payments, email-service, file-upload |
| 9 | Deployment System | 🔄 Partial | configure-cloudflare |
| 10 | Dashboard Panel | ⬜ Not started | — |
| 11 | Skills | ✅ Complete | All 17 skills created |
| 12 | Documentation | 🔄 Partial | PLAN.md, skills/README.md |

## 🤖 Skills Architecture

All framework skills are installed in Saturday's skill store (`~/.hermes/skills/`) and documented in `skills/README.md`.

### Skill Categories

| Category | Skills | Purpose |
|----------|--------|---------|
| **Framework** | scaffold-project, configure-cloudflare, configure-vps | Infrastructure & scaffolding |
| **Project Types** | build-blog, build-saas, build-portfolio, build-api, build-ecommerce, build-landing | Complete project blueprints |
| **Frontends** | astro-scaffold, sveltekit-scaffold | Frontend framework setup |
| **Features** | add-auth, add-database, stripe-payments, email-service, file-upload | Add capabilities |
| **Testing** | playwright-e2e | Quality assurance |

### How Saturday Uses Skills

```
Prince: "Build me a blog"
  ↓
Saturday reads: skills/project-types/build-blog.md
  ↓
Follows workflow:
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

---

## ✅ Success Criteria

- [ ] Prince can say "build me a [type]" and get a live project in < 5 minutes
- [ ] All project types work: blog, saas, portfolio, api, ecommerce, landing
- [ ] All deployments are 100% free infrastructure
- [ ] Every phase has agent tips for Saturday
- [ ] Framework is documented so anyone can use it
- [ ] Dashboard monitors all projects
- [ ] All changes auto-update the server guide weekly
