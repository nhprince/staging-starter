# Build Project — Saturday Skill

## Overview
When Prince says "build me a [type]", Saturday follows this workflow to scaffold, configure, deploy, and verify a complete project.

## Trigger
- Prince says "build me a blog/SaaS/portfolio/API/ecommerce/landing"
- Prince says "create a new project"
- Prince says "make a [type] called [name]"

## Workflow

### 1. Parse Requirements
Extract from Prince's message:
- **Type**: blog | saas | portfolio | api | ecommerce | landing
- **Name**: kebab-case project name
- **Options**: frontend, backend, database, auth (use defaults if not specified)

### 2. Scaffold
```bash
cd ~/staging-starter
python3 scripts/new-project.py --type <TYPE> --name <NAME>
```

Or manually:
```bash
mkdir -p ~/projects/<name>
cp -r scaffolds/<type>/* ~/projects/<name>/
cp -r frontends/nextjs/* ~/projects/<name>/frontend/
cp -r backends/hono-workers/* ~/projects/<name>/backend/
```

### 3. Configure
- Update `wrangler.toml` with project-specific KV/D1 IDs
- Set up GitHub repo: `gh repo create nhprince/<name> --public --source=. --push`
- Add GitHub Secrets: CF_API_TOKEN, CF_ACCOUNT_ID
- Apply D1 schema: `wrangler d1 execute <db> --file=./database/schema.sql`

### 4. Deploy
```bash
cd ~/projects/<name>
git add -A && git commit -m "🚀 Initial scaffold" && git push
# Wait for GitHub Actions
gh run list --limit 1
```

### 5. Verify
```bash
curl -s -o /dev/null -w "%{http_code}" https://<name>.pages.dev
curl -s https://<name>.workers.dev/api/health
```

### 6. Report
Return to Prince:
- ✅ Frontend URL
- ✅ Backend URL
- ✅ GitHub repo URL
- ✅ Test results

## Agent Tips
- Default to Next.js + Hono + D1 unless Prince specifies otherwise
- Always apply Prince's dark theme + glassmorphism
- Use `gh` CLI for GitHub operations
- Check `gh run list` before reporting deploy status
