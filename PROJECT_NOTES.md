# Staging Starter — Project Notes

## Quick Reference
- **Repo:** https://github.com/nhprince/staging-starter
- **Frontend:** https://staging-starter.pages.dev
- **Backend:** https://staging-starter.nurulhudaprince18.workers.dev
- **Local:** ~/staging-starter/

## Tech Stack
- Frontend: Next.js (static export) → Cloudflare Pages
- Backend: Hono → Cloudflare Workers
- Database: D1 (SQLite)
- Storage: KV namespace
- CI/CD: GitHub Actions (auto-deploy on push)

## Cloudflare
- Account ID: 89f7e2d36d8ec57f55770ee400685f53
- KV Namespace ID: 7b004b371012438ebe4500ef6a4e2361
- D1 Database ID: 1c83b423-7b72-4ebe-a321-53a8ecc667ee

## Commands
```bash
# Work on project
cd ~/staging-starter

# Edit code, then deploy:
git add -A && git commit -m "..." && git push

# Check deployment status:
gh run list --limit 3

# View logs:
gh run view <run-id> --log
```

## What We Built
- Full-stack template with dual deployment (Cloudflare default, VPS fallback)
- Professional test dashboard with 19 diagnostic tests across 5 categories
- Dark theme UI with glassmorphism, micro-animations, SVG score ring
- Auto-deploy pipeline via GitHub Actions

## Next Steps (When Resuming)
- Build actual projects using this template
- Add more backend API endpoints
- Connect D1 database queries
- Add authentication (Clerk)
- Deploy custom domain
