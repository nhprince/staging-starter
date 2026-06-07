<div align="center">

# ✦ Saturday Framework

**Build any web project. 100% free. Fully automated. AI-powered.**

[![Cloudflare](https://img.shields.io/badge/Cloudflare-F6821F?logo=cloudflare&logoColor=white)](https://cloudflare.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=white)](https://hono.dev)
[![D1](https://img.shields.io/badge/D1-SQLite-00A9FF)](https://developers.cloudflare.com/d1/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Quick Start](#-quick-start) · [Commands](#-commands) · [Scaffolds](#-scaffolds) · [Modules](#-modules) · [Docs](FRAMEWORK.md)

</div>

---

## 🚀 Quick Start

```bash
# Install the CLI
npm install -g saturday

# Create your first project
saturday new blog my-blog

# Start developing
cd ~/projects/my-blog
saturday dev

# Deploy to Cloudflare
saturday deploy

# Verify deployment
saturday verify
```

**That's it.** Your blog is live at `https://my-blog-xxx.pages.dev`.

---

## ✨ What is Saturday?

Saturday is a **full-stack web development framework** where:

> *"Tell Saturday what you want to build. It scaffolds, configures, deploys, and verifies — fully automated. Zero manual steps. 100% free infrastructure."*

### Key Features

- **🤖 Agent-Driven** — Built for AI agents. Every command works non-interactively with `--yes` and `--json` flags
- **💰 100% Free** — Cloudflare free tier handles everything. No credit card needed
- **⚡ Edge-First** — Your app runs at 300+ locations worldwide via Cloudflare
- **🎨 21st.dev Components** — Browse and install thousands of React/Tailwind components via `saturday ui`
- **📦 Modular** — CMS, Auth, Comments, Payments, Email — pick what you need
- **🔄 Auto Deploy** — Push to `main` → GitHub Actions builds → deploys to Cloudflare
- **🔒 Secure** — HTTPS enforced, security headers automatic, D1 database with encryption

---

## 📦 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | Static export, React, great DX |
| **Backend** | Hono on Cloudflare Workers | Fast, lightweight, edge-deployed |
| **Database** | Cloudflare D1 (SQLite) | Serverless, zero-config, free |
| **Storage** | Cloudflare KV + R2 | Key-value and object storage |
| **Deployment** | Cloudflare Pages + Workers | Automatic via GitHub Actions |
| **CLI** | TypeScript/Node.js | Cross-platform, agent-friendly |
| **UI Components** | 21st.dev + Tailwind CSS | Community-driven component library |

**100% free on Cloudflare's free tier.**

---

## 🛠 Commands

### Project Management

```bash
saturday new <type> <name>     # Create a new project from a scaffold
saturday dev                    # Start local development (frontend + backend)
saturday deploy                 # Deploy to Cloudflare
saturday status                 # Show project status
saturday verify                 # Verify deployment health
saturday rollback               # Rollback to previous deployment
saturday destroy <name>         # Remove project completely
```

### UI Components (21st.dev)

```bash
saturday ui browse              # Browse components interactively
saturday ui search <query>      # Search for components
saturday ui add <slug>          # Install a component
saturday ui list                # List installed components
saturday ui remove <slug>       # Remove a component
saturday ui sync                # Sync component cache
saturday ui categories          # List categories
saturday ui info <slug>         # Component details
```

### Configuration

```bash
saturday config show            # Show full configuration
saturday config get <key>       # Get a config value (dot notation)
saturday config set <key> <val> # Set a config value
saturday config validate        # Validate saturday.yaml
saturday secrets list           # List environment variables
saturday secrets set <key> <val> # Set a secret
```

### Setup & Diagnostics

```bash
saturday init                   # First-time setup wizard
saturday setup                  # Set up Cloudflare resources (KV, D1, Pages)
saturday doctor                 # Diagnose and fix common issues
saturday update                 # Update framework
saturday projects               # List all projects
```

### Agent Automation

Every command supports `--yes` (skip prompts) and `--json` (machine-readable output):

```bash
# Non-interactive project creation
saturday new blog my-blog --yes --json

# Automated deployment with verification
saturday deploy --yes && saturday verify --json

# Health check (returns JSON)
saturday status --json
```

---

## 📁 Scaffolds

Pre-built project templates. Each includes frontend, backend, database schema, and CI/CD.

| Scaffold | Status | Description |
|----------|--------|-------------|
| **Landing** | ✅ Complete | Marketing page with hero, features, testimonials, pricing, CTA |
| **Blog** | ✅ Complete | Full blog with CMS-powered posts, search, categories |
| **Portfolio** | ✅ Complete | Developer portfolio with projects, skills, experience, contact |
| **SaaS** | ✅ Complete | SaaS with teams, subscriptions, usage tracking |
| **E-commerce** | ✅ Complete | Online store with products, orders, coupons, Stripe |
| **API** | ✅ Complete | RESTful API scaffold with generic CRUD helper |

---

## 🧩 Modules

Pluggable backend modules. Copy into your project to add functionality.

| Module | Description | Backend | Database |
|--------|-------------|---------|----------|
| **CMS** | Headless CMS with content types, entries, media library | ✅ | ✅ |
| **AuthJS** | JWT authentication with signup/login/refresh | ✅ | ✅ |
| **Comments** | Nested comments with moderation | ✅ | ✅ |
| **Payments** | Stripe checkout, subscriptions, webhooks | ✅ | ✅ |
| **Email** | Transactional emails via Resend | ✅ | — |

### Using Modules

```bash
# Copy a module into your project
cp -r modules/cms/backend/* ~/projects/my-project/backend/src/routes/
cp modules/cms/schema.sql ~/projects/my-project/database/

# Mount the router in your Worker
# In backend/src/index.ts:
import { cmsRouter } from "./routes/cms";
app.route("/api/cms", cmsRouter());
```

---

## 🏗 Architecture

```
my-project/
├── saturday.yaml          # Project configuration (single source of truth)
├── frontend/              # Next.js 14 (static export)
│   ├── src/app/           # App Router pages
│   ├── src/components/    # React components
│   ├── src/components/ui/ # 21st.dev installed components
│   └── out/               # Static export output
├── backend/               # Hono on Cloudflare Workers
│   ├── src/index.ts       # Worker entry point
│   ├── src/routes/        # Module routes (CMS, Auth, etc.)
│   └── wrangler.toml      # Worker configuration
├── database/
│   └── schema.sql         # D1 database schema
├── .github/workflows/
│   └── deploy.yml         # CI/CD pipeline
└── README.md
```

---

## 🔄 Workflow

### For Developers

```bash
# 1. Create
saturday new landing my-landing

# 2. Develop
cd ~/projects/my-landing
saturday dev

# 3. Deploy
saturday deploy

# 4. Verify
saturday verify
```

### For AI Agents

```bash
# Fully automated — zero human intervention
saturday new blog tech-notes --auth clerk --yes --json
cd ~/projects/tech-notes
saturday setup --yes
saturday deploy --yes
saturday verify --json
# Returns: { success: true, urls: { pages: "...", worker: "..." } }
```

---

## 📖 Documentation

- [Framework Architecture](FRAMEWORK.md) — Detailed technical documentation
- [UX Enhancement Plan](UX_PLAN.md) — UX research and implementation plan
- [Implementation Plan](PLAN.md) — 12-phase development plan
- [Server Setup Guide](https://github.com/nhprince/server-setup-guide) — AI VPS setup

---

## 🤝 Contributing

Saturday is open source and built for the community. Contributions welcome!

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by [Prince](https://github.com/nhprince) · Powered by [Cloudflare](https://cloudflare.com)**

</div>
