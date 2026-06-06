# 🚀 Staging Starter — Full-Stack Template

Default project template for Prince's projects.
Dual deployment: **Cloudflare** (default) or **VPS** (fallback).

## Quick Start

```bash
# Install dependencies
pnpm install

# Start frontend (Next.js)
pnpm dev:frontend

# Start backend (Hono worker)
pnpm dev:backend
```

## Deployment

| Target | Trigger | Config |
|--------|---------|--------|
| **Cloudflare** (default) | `git push` → auto | `wrangler.toml` |
| **VPS** (fallback) | GitHub Actions manual | `.github/workflows/deploy.yml` |

## Switching Deploy Target

Go to GitHub → Actions → Deploy → Run workflow → select `cloudflare` or `server`.

## Project Structure

```
├── frontend/          # Next.js app (Cloudflare Pages)
├── backend/           # Hono worker (Cloudflare Workers)
├── .github/           # CI/CD workflows
├── wrangler.toml      # Cloudflare config
└── package.json       # Root workspace config
```
