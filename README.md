<div align="center">

# ✦ Saturday Framework

**Build any web project. 100% free. Fully automated.**

[![Cloudflare](https://img.shields.io/badge/Cloudflare-F6821F?logo=cloudflare&logoColor=white)](https://cloudflare.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=white)](https://hono.dev)
[![D1](https://img.shields.io/badge/D1-SQLite-00A9FF)](https://developers.cloudflare.com/d1/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Quick Start](#-quick-start) · [Commands](#-commands) · [Scaffolds](#-scaffolds) · [Docs](FRAMEWORK.md) · [UX Plan](UX_PLAN.md)

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
- **🎨 Beautiful Design** — Dark theme with glassmorphism, gradient accents, micro-animations
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
| **Blog** | ✅ Complete | Full blog with posts, categories, tags, MDX |
| **Landing** | ✅ Complete | Marketing page with hero, features, contact form |
| **Portfolio** | ✅ Complete | Developer portfolio with projects, skills, experience |
| **SaaS** | 📝 Planned | SaaS application with auth, payments, dashboard |
| **API** | 📝 Planned | RESTful API with documentation |
| **E-commerce** | 📝 Planned | Online store with Stripe payments |

---

## 🏗 Architecture

```
my-project/
├── saturday.yaml          # Project configuration (single source of truth)
├── frontend/              # Next.js 14 (static export)
│   ├── src/app/           # App Router pages
│   ├── src/components/    # React components
│   └── out/               # Static export output
├── backend/               # Hono on Cloudflare Workers
│   ├── src/index.ts       # Worker entry point
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
