# 🔧 Saturday Framework — Fix & Complete Plan

> **Created:** 2026-06-06
> **Status:** Planning
> **Goal:** Fix all identified issues and make the framework fully working

---

## Phase 1: Cleanup & Rename (Quick Wins)

### 1.1 Fix all remaining "Staging Starter" references (24 occurrences)

**Files to fix:**

| File | Lines | Change |
|------|-------|--------|
| `package.json` | 2 | `"name": "saturday"` |
| `scripts/new-project.py` | 3,55,197,223,300 | All "Staging Starter" → "Saturday" |
| `PROJECT_NOTES.md` | 1-7,24 | All refs → "saturday" |
| `backends/hono-workers/src/index.ts` | 23 | `service: "saturday"` |
| `backends/hono-workers/wrangler.toml` | 2,13 | `name = "saturday"`, `database_name = "saturday-db"` |
| `frontends/nextjs/src/app/page.tsx` | 19-20,398,410,497,499,501 | All URLs → "saturday" |
| `frontends/nextjs/src/app/layout.tsx` | 8 | `title: "System Status \| Saturday"` |
| `skills/framework/build-project.md` | 21 | `cd ~/saturday` |

### 1.2 Fix `.gitignore`

Add:
```
frontend/out/
frontend/.next/
frontend/tsconfig.tsbuildinfo
backend/.wrangler/
*.tsbuildinfo
```

Then remove committed build artifacts:
```bash
git rm -r frontend/out/ frontend/tsconfig.tsbuildinfo
```

### 1.3 Fix `PROJECT_NOTES.md`

Either delete it (it's empty placeholder) or populate with actual project notes.

### 1.4 Fix root `package.json`

- `"name": "saturday"`
- `"description": "Saturday Framework — Build any web project on 100% free infrastructure"`

---

## Phase 2: Skills — Move Into Repo

### 2.1 Copy framework-specific skills from `~/.hermes/skills/` into repo

**Skills to copy (17 framework-specific):**

From `~/.hermes/skills/devops/`:
- `scaffold-project/SKILL.md` → `skills/devops/scaffold-project/SKILL.md`
- `cloudflare-deployment/SKILL.md` → `skills/devops/cloudflare-deployment/SKILL.md`
- `configure-cloudflare/SKILL.md` → `skills/devops/configure-cloudflare/SKILL.md`
- `configure-vps/SKILL.md` → `skills/devops/configure-vps/SKILL.md`

From `~/.hermes/skills/software-development/`:
- `build-blog/SKILL.md` → `skills/project-types/build-blog/SKILL.md`
- `build-saas/SKILL.md` → `skills/project-types/build-saas/SKILL.md`
- `build-portfolio/SKILL.md` → `skills/project-types/build-portfolio/SKILL.md`
- `build-api/SKILL.md` → `skills/project-types/build-api/SKILL.md`
- `build-ecommerce/SKILL.md` → `skills/project-types/build-ecommerce/SKILL.md`
- `build-landing/SKILL.md` → `skills/project-types/build-landing/SKILL.md`
- `add-auth/SKILL.md` → `skills/auth/add-auth/SKILL.md`
- `add-database/SKILL.md` → `skills/databases/add-database/SKILL.md`
- `astro-scaffold/SKILL.md` → `skills/frontends/astro-scaffold/SKILL.md`
- `sveltekit-scaffold/SKILL.md` → `skills/frontends/sveltekit-scaffold/SKILL.md`
- `stripe-payments/SKILL.md` → `skills/modules/stripe-payments/SKILL.md`
- `email-service/SKILL.md` → `skills/modules/email-service/SKILL.md`
- `file-upload/SKILL.md` → `skills/modules/file-upload/SKILL.md`
- `playwright-e2e/SKILL.md` → `skills/testing/playwright-e2e/SKILL.md`

Also copy any reference files from `~/.hermes/skills/devops/cloudflare-deployment/references/`.

### 2.2 Update `skills/README.md`

Update the structure diagram to match what actually exists.

---

## Phase 3: Deduplicate Backend Code

### 3.1 Remove duplicate `backends/hono-workers/`

The `backends/hono-workers/` directory is a copy of `backend/`. Instead:
- Delete `backends/hono-workers/src/index.ts` and `backends/hono-workers/wrangler.toml`
- Keep only `backends/hono-workers/README.md` (as documentation)
- Update `scripts/new-project.py` to copy from `backend/` template instead

### 3.2 Create a proper backend template

Create `templates/backend/` with:
- `src/index.ts` — Hono template with CORS, root route, health check
- `wrangler.toml` — Template with `{{PROJECT_NAME}}` placeholders
- `package.json` — Template with `{{PROJECT_NAME}}`
- `drizzle.config.ts` — Drizzle ORM config
- `src/schema.ts` — Drizzle schema template

---

## Phase 4: Build Complete Blog Scaffold

### 4.1 Create working blog scaffold in `scaffolds/blog/`

**Frontend (`scaffolds/blog/frontend/`):**
- `src/app/page.tsx` — Blog home with post listing
- `src/app/blog/[slug]/page.tsx` — Single post page
- `src/app/admin/page.tsx` — Admin panel (protected)
- `src/app/rss.xml/route.ts` — RSS feed
- `src/app/sitemap.ts` — Sitemap
- `src/components/PostCard.tsx` — Post card component
- `src/components/MDXRenderer.tsx` — MDX renderer
- `src/lib/mdx.ts` — MDX utilities
- `content/posts/` — Sample blog posts

**Backend (`scaffolds/blog/backend/`):**
- `src/index.ts` — Hono API with CRUD for posts
- `src/schema.ts` — Drizzle schema for posts
- `schema.sql` — D1 schema
- `wrangler.toml` — Template

**Database (`scaffolds/blog/database/`):**
- `schema.sql` — Full D1 schema (posts, users, sessions)

### 4.2 Test the blog scaffold end-to-end

---

## Phase 5: Real Tests

### 5.1 Add Playwright E2E tests

Create `tests/e2e/`:
- `homepage.spec.ts` — Test dashboard loads
- `health.spec.ts` — Test backend health endpoint
- `projects.spec.ts` — Test project card rendering
- `tests.spec.ts` — Test test modal functionality

### 5.2 Fix dashboard test modal

Replace `Math.random()` with real API calls:
- Frontend Load → `fetch(FRONTEND_URL)` and check 200
- Backend Health → `fetch(BACKEND_URL + /api/health)` and check response
- API Response → `fetch(BACKEND_URL + /api/hello)` and check JSON
- CORS Headers → Check response headers for CORS
- Security Headers → Check for expected headers

### 5.3 Add CI test step

Add a test job to `.github/workflows/deploy.yml`:
```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install
    - run: cd frontend && pnpm build
    - run: npx playwright test
```

---

## Phase 6: PM2 & VPS Deploy

### 6.1 Create PM2 config

Create `server-deploy/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'saturday',
    script: 'backend/dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    env: { NODE_ENV: 'production' }
  }]
};
```

### 6.2 Create deploy script

Create `server-deploy/deploy.sh`:
```bash
#!/bin/bash
set -e
cd ~/saturday
git pull origin main
pnpm install
cd frontend && pnpm build && cd ..
cd backend && pnpm install && cd ..
pm2 restart saturday || pm2 start server-deploy/ecosystem.config.js
echo "✅ Deployed to server"
```

### 6.3 Add nginx config

Create `server-deploy/nginx.conf` for reverse proxy.

---

## Phase 7: Drizzle Migrations

### 7.1 Set up Drizzle properly

- Create `backend/drizzle.config.ts`
- Create `backend/src/schema.ts` with Drizzle schema
- Add migration scripts to `package.json`:
  - `db:generate` — `drizzle-kit generate`
  - `db:migrate` — `drizzle-kit migrate`
  - `db:studio` — `drizzle-kit studio`

### 7.2 Create initial migration

Generate the first migration from the schema.

---

## Phase 8: Frontend Blueprint Fix

### 8.1 Fix `frontends/nextjs/`

This is a separate Next.js app (not the main dashboard). It's a "system status" page. Either:
- **Option A:** Delete it (the main dashboard already exists at `frontend/`)
- **Option B:** Make it a proper standalone status page with real data

### 8.2 Decide on purpose

The `frontends/nextjs/` directory seems to be a duplicate/alternative dashboard. Need to clarify its role.

---

## Execution Order

| Priority | Phase | Estimated Time |
|----------|-------|---------------|
| 🔴 P0 | Phase 1: Cleanup & Rename | 30 min |
| 🔴 P0 | Phase 2: Skills into repo | 20 min |
| 🔴 P0 | Phase 3: Deduplicate backend | 20 min |
| 🟡 P1 | Phase 4: Blog scaffold | 2-3 hours |
| 🟡 P1 | Phase 5: Real tests | 1-2 hours |
| 🟡 P1 | Phase 6: PM2 & VPS deploy | 30 min |
| 🟢 P2 | Phase 7: Drizzle migrations | 1 hour |
| 🟢 P2 | Phase 8: Frontend blueprint | 30 min |

**Total estimated time:** 6-8 hours

---

## Success Criteria

- [ ] Zero "Staging Starter" references in any file
- [ ] All 17 framework skills in repo under `skills/`
- [ ] `.gitignore` properly excludes build artifacts
- [ ] Blog scaffold works end-to-end (scaffold → deploy → view)
- [ ] Dashboard test modal runs real API checks
- [ ] Playwright E2E tests pass in CI
- [ ] PM2 config exists and VPS deploy works
- [ ] Drizzle migrations set up
- [ ] No duplicate code between `backend/` and `backends/hono-workers/`
- [ ] All CI/CD runs pass
