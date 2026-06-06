---
name: scaffold-project
description: "Scaffold a new web project from framework blueprints. Use when Prince says 'build me a [type]' or 'create a new project'. Handles: project type selection, frontend/backend/database/auth choices, GitHub repo creation, Cloudflare resource provisioning, initial deploy."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [scaffolding, project-generator, framework, automation, fullstack, deployment]
    related_skills: [fullstack-developer, cloudflare-deployment, github-repo-management, plan]
---

# Scaffold Project — Framework Project Generator

## Overview

Creates a complete, production-ready web project from framework blueprints in one command. This is the **primary entry point** for building new projects. Saturday runs this when Prince says "build me a blog" or "create a SaaS".

## When to Use

- Prince says "build me a [project type]" or "create a new project"
- Starting any new web application
- Setting up a new scaffold from the framework
- **Don't use for:** modifying existing projects (use specific skills instead)

## Supported Project Types

| Type | Description | Default Stack |
|------|-------------|---------------|
| `blog` | MDX blog with admin, RSS, SEO | Next.js + Hono + D1 |
| `saas` | SaaS with auth, billing, dashboard | Next.js + Hono + D1 + Clerk |
| `portfolio` | Developer portfolio with projects | Next.js (static) + Hono + D1 |
| `api` | REST API with docs, rate limiting | Hono Workers + D1 |
| `ecommerce` | Store with cart, checkout, Stripe | Next.js + Hono + D1 |
| `landing` | Landing page with lead capture | Next.js (static) + Hono + D1 |

## Workflow

### 1. Gather Requirements

Ask Prince (or parse from prompt):
- **Project type** (blog/saas/portfolio/api/ecommerce/landing)
- **Project name** (kebab-case, used for repo + CF resources)
- **Frontend** (nextjs/astro/sveltekit/static-html, default: nextjs)
- **Backend** (hono-workers/python-vps/php-vps, default: hono-workers)
- **Database** (d1/postgres-vps/supabase/planetscale, default: d1)
- **Auth** (clerk/authjs/lucia/none, default: none for landing, clerk for saas)
- **Extras** (payments/email/cms/analytics, default: none)

### 2. Scaffold the Project

```bash
# Navigate to framework
cd ~/saturday

# Run generator
python3 scripts/new-project.py \
  --type <TYPE> \
  --name <project-name> \
  --frontend <frontend> \
  --backend <backend> \
  --db <database> \
  --auth <auth> \
  [--extras <extra1,extra2>]
```

If the generator script doesn't exist yet, scaffold manually:

```bash
# Create project directory
mkdir -p ~/projects/<project-name>

# Copy relevant scaffolds
cp -r scaffolds/<type>/* ~/projects/<project-name>/
cp -r frontends/<frontend>/ ~/projects/<project-name>/frontend/
cp -r backends/<backend>/ ~/projects/<project-name>/backend/
cp -r databases/<db>/ ~/projects/<project-name>/database/
cp -r auth/<auth>/ ~/projects/<project-name>/auth/  # if auth != none

# Merge configs (package.json, wrangler.toml, etc.)
```

### 3. Apply Prince's UI Standards

Every scaffold MUST include:
- Dark theme (`--bg-primary: #0a0a0f`)
- Glassmorphism cards (`backdrop-blur`, `bg-white/5`)
- Gradient accents (indigo → purple)
- Micro-animations (staggered entrance, hover +2px)
- Responsive design (mobile-first)
- Animated SVG score rings for dashboards

### 4. Create GitHub Repository

```bash
cd ~/projects/<project-name>
git init
git add -A
git commit -m "🚀 Initial scaffold: <type> project"

# Create repo on GitHub
gh repo create nhprince/<project-name> --public --source=. --push
```

### 5. Set Up Cloudflare Resources

```bash
export PATH="/home/nhprince/.hermes/node/bin:$PATH"

# Create KV namespace
wrangler kv namespace create <PROJECT-NAME>-KV
# Save the ID

# Create D1 database
wrangler d1 create <project-name>-db
# Save the ID

# Create Pages project
wrangler pages project create <project-name> --production-branch=main
```

### 6. Configure GitHub Secrets

```bash
gh secret set CF_API_TOKEN --body "$CF_API_TOKEN" --repo nhprince/<project-name>
gh secret set CF_ACCOUNT_ID --body "89f7e2d36d8ec57f55770ee400685f53" --repo nhprince/<project-name>
# Add KV ID, D1 ID, and any other secrets
```

### 7. Deploy

```bash
git push origin main
# Wait for GitHub Actions to complete
gh run list --limit 1 --repo nhprince/<project-name>
```

### 8. Verify

```bash
# Check frontend
curl -s -o /dev/null -w "%{http_code}" https://<project-name>.pages.dev

# Check backend
curl -s https://<project-name>.<account>.workers.dev/api/health
```

## Common Pitfalls

1. **Not checking if repo already exists** — `gh repo create` fails if repo exists. Check first.
2. **Forgetting to update wrangler.toml** — KV/D1 IDs are project-specific.
3. **Not setting all GitHub Secrets** — CI/CD fails silently if secrets are missing.
4. **Wrong project name format** — Use kebab-case, no spaces, no special chars.
5. **Not waiting for deploy** — Check `gh run list` before reporting success.

## Verification Checklist

- [ ] Project directory created with correct structure
- [ ] GitHub repo created and code pushed
- [ ] KV namespace created and ID saved
- [ ] D1 database created and ID saved
- [ ] Pages project created
- [ ] All GitHub Secrets configured
- [ ] CI/CD workflow completed successfully
- [ ] Frontend URL returns 200
- [ ] Backend /api/health returns {"status":"ok"}
- [ ] Prince's UI standards applied (dark theme, glassmorphism)

## Agent Tip 🤖

> When Prince says "build me a X", don't ask too many questions. Use sensible defaults:
> - Frontend: Next.js (best CF Pages support)
> - Backend: Hono Workers (free, fast, edge)
> - Database: D1 (SQLite at edge, zero config)
> - Auth: Clerk for SaaS, none for landing/portfolio
> - Only ask if the project type is unclear.
>
> **Self-hosted VPS:** If Prince wants to deploy to his own server instead of Cloudflare, follow the [AI VPS Setup Guide](https://github.com/nhprince/server-setup-guide) for server configuration. The guide and Saturday framework are designed to work together — guide sets up the agent, Saturday builds the projects.
