---
name: cloudflare-deployment
description: "Cloudflare-first deployment pipeline — Pages, Workers, D1, KV, R2 with GitHub Actions dual-deploy switch. Free-tier architecture for full-stack apps."
version: 1.2.0
author: Saturday (for Prince)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [cloudflare, pages, workers, deployment, github-actions, d1, kv, r2, free-tier, edge]
---

# Cloudflare-First Deployment

## Philosophy

**Default target: Cloudflare (free). Fallback: this server via GitHub Actions.**

This skill governs the deployment architecture for all of Prince's projects. The principle is: deploy to Cloudflare by default (zero cost, zero server resources), and only use the VPS for stacks that Cloudflare doesn't support (PHP, Python backends, etc.).

## Architecture Overview

```
GitHub Repository
    │
    ├── frontend/ (Next.js / Astro / SvelteKit)
    │       └── Cloudflare Pages (auto-deploy on push)
    │
    ├── backend/ (Hono / Express on Workers)
    │       └── Cloudflare Workers (via wrangler deploy)
    │
    └── .github/workflows/deploy.yml
            └── Deploy switch: "cloudflare" (default) | "server"
                    │
                    ├── cloudflare → auto (no action needed)
                    │
                    └── server → GitHub Actions → SSH → VPS
```

## Cloudflare Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| **Pages** | Unlimited sites, unlimited bandwidth, 500 build min/month |
| **Workers** | 100K requests/day, 10ms CPU/request, 30 scripts |
| **D1** | 5 databases, 5GB storage, 5M rows read/day, 100K rows written/day |
| **KV** | 10 namespaces, 100K reads/day, 1K writes/day |
| **R2** | 10GB storage, 1M Class A ops/month, **zero egress** |
| **Cron Triggers** | 3 per worker |

These limits are generous enough for development, staging, and low-traffic production.

## Stack A: Full Cloudflare (DEFAULT)

For TypeScript/JavaScript projects. This is the recommended default.

### Frontend on Cloudflare Pages

**Supported frameworks** (all have CF Pages adapters):
- **Next.js** — via `@cloudflare/next-on-pages`
- **Astro** — via `@astrojs/cloudflare`
- **SvelteKit** — via `@sveltejs/adapter-cloudflare`
- **Remix** — via `@remix-run/cloudflare`
- **Nuxt** — via `nitro/cloudflare`
- **Static HTML/CSS/JS** — just upload

### Backend on Cloudflare Workers

**Supported runtimes:** JavaScript/TypeScript (native), Python (via WASM/Pyodide), Rust (via WASM), C/C++ (via WASM)

**Recommended frameworks:**
- **Hono** (16KB, fastest, best for APIs)
- **Itty Router** (500 bytes, minimal)
- **Express** (works but heavier)

### Database: Cloudflare D1

D1 = SQLite at the edge. Use `drizzle-orm` or `kysely` as ORM.

```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "myproject-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### File Storage: Cloudflare R2

R2 = S3-compatible storage with **zero egress fees**. Free tier = 10GB.

### Authentication

- **JWT in Worker** — stateless, no extra service
- **Cloudflare Access** — for admin panels (free for up to 50 users)
- **NextAuth.js** — works on Pages via adapter

## Stack B: Cloudflare Frontend + Server Backend

For PHP, Python (Django/Flask/FastAPI), Ruby, Java, or any stack that doesn't run on Workers.

## The Deploy Switch

One `.github/workflows/deploy.yml` with a manual dispatch input:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      deploy_target:
        description: 'Deploy target'
        required: true
        default: 'cloudflare'
        type: choice
        options: [cloudflare, server]
```

## Project Structure

```
myproject/
├── .github/workflows/deploy.yml    # Dual-deploy switch
├── frontend/                       # Next.js / Astro / SvelteKit
│   ├── app/ or src/
│   ├── public/
│   ├── next.config.ts             # CF adapter configured
│   └── package.json
├── backend/                        # Hono / Express for Workers
│   ├── src/index.ts
│   ├── wrangler.toml
│   ├── drizzle.config.ts
│   └── package.json
└── server-deploy/                  # For server fallback
    ├── nginx.conf
    ├── ecosystem.config.js         # PM2
    └── deploy.sh
```

## Tools

| Tool | Purpose | Install |
|------|---------|---------|
| `wrangler` | CF Workers CLI | `npm i -g wrangler` (or `~/.hermes/node/bin/wrangler` on Hermes servers) |
| `gh` | GitHub CLI | `apt install gh` |
| `act` | Run GH Actions locally | See act installation docs |

**PATH note for Hermes-managed servers:** wrangler may be at `~/.hermes/node/bin/wrangler`. If `wrangler: command not found`, add to `~/.bashrc`:
```bash
export PATH="$HOME/.hermes/node/bin:$PATH"
```

## Setup Steps (One-Time Per Project)

1. `wrangler login` (or `export CLOUDFLARE_API_TOKEN=***` on headless servers)
2. `wrangler d1 create myproject-db` — create D1 database, copy the database_id
3. `wrangler kv:namespace create CACHE` — create KV namespace, copy the id
4. `wrangler r2 bucket create myproject-files` — create R2 bucket (optional)
5. Copy IDs into `backend/wrangler.toml`
6. **IMPORTANT:** Ensure `wrangler.toml` is NOT in `.gitignore` — the default Hermes gitignore includes it. Remove it from `.gitignore` or use `git add -f backend/wrangler.toml`.
7. **Create the Pages project BEFORE first deploy:** `wrangler pages project create <project-name> --production-branch=main`. Without this, the deploy fails with "Project not found" error.
8. Set GitHub Secrets: `CF_API_TOKEN`, `CF_ACCOUNT_ID`, `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`
9. Done. Push to main = auto-deploy.

## Pitfalls (Learned the Hard Way)

### ❌ GitHub Actions: wrangler-action needs accountId
The `cloudflare/wrangler-action@v3` requires **both** `apiToken` AND `accountId`:
```yaml
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CF_API_TOKEN }}
    accountId: ${{ secrets.CF_ACCOUNT_ID }}   # ← REQUIRED, not optional
```
**Symptom if missing:** URL becomes `accounts//pages/projects/...` (empty account ID), error: `Could not route to /client/v4/accounts//pages/projects/... [code: 7003]`

### ❌ Pages project must exist before first deploy
`wrangler pages deploy` does NOT auto-create the project. Run first:
```bash
wrangler pages project create <name> --production-branch=main
```
**Symptom if missing:** `Project not found. The specified project name does not match any of your existing projects. [code: 8000007]`

### ❌ Worker URL uses account email subdomain, not GitHub username
Cloudflare Workers are deployed to `<worker-name>.<account-subdomain>.workers.dev`. The subdomain is derived from the **Cloudflare account email**, NOT the GitHub username. For account `nurulhudaprince18@gmail.com`, the URL would be `saturday.nurulhudaprince18.workers.dev`, NOT `saturday.nhprince.workers.dev`. Always check with `wrangler deployments list` or the deploy output.

### ❌ Tailwind CSS v4 requires different setup than v3
Tailwind v4 uses `@import "tailwindcss"` in CSS (not `@tailwind base; @tailwind components; @tailwind utilities;`) and requires the `@tailwindcss/postcss` plugin:

**postcss.config.js:**
```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**frontend/package.json devDependencies:**
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

**globals.css:**
```css
@import "tailwindcss";
/* custom CSS variables and utilities below */
```

Do NOT use the old v3 directives (`@tailwind base; @tailwind components; @tailwind utilities;`) — they will fail silently or produce no styles.

### ❌ pnpm workspace config required for monorepo
For the root `package.json` to properly link frontend and backend workspaces, create `pnpm-workspace.yaml` at the root:
```yaml
packages:
  - "frontend"
  - "backend"
```
Without this, `pnpm install` at the root won't link the workspace packages and builds will fail in CI with "lockfile not found" errors.

### ❌ gh repo create uses HTTPS remote even with SSH auth
After `gh repo create <name> --clone` or `gh repo create <name> --source=. --remote=origin`, the remote is set to HTTPS even if `gh auth login` was configured with SSH. Always check and switch:
```bash
git remote set-url origin git@github.com:<owner>/<repo>.git
```

### ❌ wrangler.toml must not be in .gitignore
The default Hermes `.gitignore` includes `wrangler.toml`. Remove it from `.gitignore` or the deploy will fail. Ensure it's tracked:
```bash
# Check if it's being ignored
git check-ignore backend/wrangler.toml
# If yes, remove from .gitignore or force-add:
git add -f backend/wrangler.toml
```

### ❌ Worker root route missing causes dashboard/test failures
Cloudflare Workers with only `/api/*` routes return **404 on `GET /`**. Any external health check, dashboard, or uptime monitor hitting the bare Worker URL will see a 404 even though the Worker is healthy. Always add a root route:

```typescript
// In your Hono app — BEFORE or alongside /api/* routes
app.get("/", (c) => {
  return c.json({
    service: "my-project",
    status: "running",
    endpoints: ["/api/health", "/api/hello"],
    timestamp: new Date().toISOString(),
  });
});
```

**CORS note:** `app.use("/api/*", cors())` only covers `/api/*` routes. The root `/` path does NOT inherit this. If the dashboard fetches the root URL cross-origin and needs CORS headers, add `app.use("*", cors())` or a separate `app.use("/", cors())`.

**Symptom:** Dashboard shows "Worker Routing: Failed" or "Failed to fetch" even though `/api/health` works fine. `curl` to the bare Worker URL returns `404 Not Found`.

### ❌ Credential files in backend/.wrangler/ get committed
Wrangler stores account tokens in `backend/.wrangler/cache/wrangler-account.json`. This file contains credentials and must NOT be committed. Ensure `.wrangler/` is in `.gitignore`:
```bash
echo ".wrangler/" >> .gitignore
```
Or if already committed: `git rm --cached backend/.wrangler/cache/wrangler-account.json` and add to `.gitignore`.

### ❌ gh auth login resets git protocol and invalidates token
Running `gh auth login` and switching from HTTPS to SSH invalidates the previous PAT. Re-authenticate with a token that has these scopes: `repo`, `read:org`, `workflow`. Re-add all secrets afterward.

### ❌ Pages project subdomain gets random suffix
When creating a new Pages project, Cloudflare assigns a random suffix to the subdomain (e.g., `saturday-62d.pages.dev`, NOT `saturday.pages.dev`). The clean name is NOT available as the URL. Always check the actual deployment URL in the `wrangler pages deploy` output and update all code/config references accordingly.

**Symptom:** `curl https://<name>.pages.dev` returns 404 even though deploy succeeded. The actual URL is `https://<random-hash>.<name>-<suffix>.pages.dev`.

**Fix:** Use the deployment-specific URL from the wrangler output, or add a custom domain in the Cloudflare dashboard.

### ❌ API token with `***` redaction causes shell glob expansion
When a token contains `***` (e.g., from chat redaction masking), the shell interprets it as a glob pattern, breaking commands. Workaround: write token to a temp file and pipe it:

```bash
echo '<token>' > /tmp/cf_token
cat /tmp/cf_token | xargs -I{} wrangler kv namespace create KV
rm /tmp/cf_token
```

Never paste tokens with `***` directly into shell commands.

### ❌ write_file on large files causes truncation
When editing files with >100 lines (especially README.md, SKILL.md, or documentation), **never use `write_file`** unless you have the complete file content. Use `patch` for targeted edits instead. Writing a partial file silently truncates the rest.

**Symptom:** File shrinks from 1197 lines to 321 lines after an edit. Git diff shows massive deletion.

**Recovery:** `git checkout HEAD -- <file>` to restore, then use `patch` for targeted edits.

**Reference:** `references/framework-rename-checklist.md` — systematic rebrand checklist for renaming a framework across repos, skills, and Cloudflare resources.

### ❌ SSH secret key must be complete
When adding `SERVER_SSH_KEY` to GitHub secrets, include the full key with header/footer:
```bash
# Easiest approach — pipe directly
cd ~/myproject
gh secret set SERVER_SSH_KEY < ~/.ssh/id_ed25519
```
Do NOT strip the `[REDACTED PRIVATE KEY]` markers.

## What Cloudflare Workers Does NOT Support

Deploy these to the server instead:
- PHP (no runtime)
- Ruby (no runtime)
- Java (no runtime)
- Python backends (Django/Flask/FastAPI — no native runtime)
- ASP.NET
- Any service that needs a persistent process (use PM2 on server)

## References

- `references/deploy-dual.yml` — Full GitHub Actions workflow for cloudflare/server switch
- `references/server-dev-setup.md` — Server resource budget and dev environment constraints (842MB RAM)
- `references/worker-root-route-fix.md` — Fix for "Worker Routing: Failed" when Worker has no root `/` route
