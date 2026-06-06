# Saturday — Project Notes

## Quick Info
- **Repo:** https://github.com/nhprince/saturday
- **Frontend:** https://saturday-62d.pages.dev
- **Backend:** https://saturday.nurulhudaprince18.workers.dev
- **Local:** ~/saturday/
- **Server Guide:** https://github.com/nhprince/server-setup-guide

## Cloudflare Resources
- **Account ID:** 89f7e2d36d8ec57f55770ee400685f53
- **KV Namespace ID:** 63858eda52204fb6af299d8c9dfeccce
- **D1 Database ID:** 18acbc13-4c3d-4024-aafe-98187fd8d382
- **Pages Project:** saturday (saturday-62d.pages.dev)
- **Worker:** saturday (saturday.nurulhudaprince18.workers.dev)

## Commands
```bash
# Local dev
cd ~/saturday
pnpm dev:frontend  # http://localhost:3000
pnpm dev:backend   # http://localhost:8787

# Deploy manually
cd frontend && pnpm build && wrangler pages deploy out --project-name=saturday
cd backend && wrangler deploy

# Create new project
python3 scripts/new-project.py --type blog --name my-blog
```

## CI/CD
- Push to `main` → auto-deploys to Cloudflare
- Manual VPS deploy: GitHub Actions → Deploy → Run workflow → select "server"

## Skills
17 framework skills in `skills/` directory + `~/.hermes/skills/`

## Status
- ✅ All 12 phases complete
- ✅ CI/CD passing
- ✅ Backend live
- ✅ Frontend live
- ✅ Server guide cross-linked
