# Framework Rename — Systematic Rebrand Checklist

## When to Use
Use this reference when renaming a framework/project that spans multiple repos, Cloudflare resources, skills, and documentation.

## The Checklist

### 1. GitHub Repository
```bash
gh repo rename -R nhprince/<old-name> <new-name>
gh repo view nhprince/<new-name>  # verify
```

### 2. Local Directory + Git Remote
```bash
mv ~/<old-name> ~/<new-name>
cd ~/<new-name>
git remote set-url origin https://github.com/nhprince/<new-name>.git
```

### 3. Cloudflare Resources (requires CLOUDFLARE_API_TOKEN)
```bash
cd ~/<new-name>/backend
wrangler kv namespace create KV
wrangler d1 create <new-name>-db
wrangler pages project create <new-name> --production-branch=main
```

**Note:** Pages project gets a random suffix subdomain (e.g., `saturday-62d.pages.dev`). Check the actual URL in the deploy output.

### 4. Update Internal References
- `backend/wrangler.toml` — Worker name, KV ID, D1 ID
- `backend/src/index.ts` — service name in root route
- `frontend/src/app/page.tsx` — project data, URLs, github URL
- `frontend/src/app/layout.tsx` — title, meta, OG tags
- `.github/workflows/deploy.yml` — project-name, VPS paths, PM2 name
- `README.md`, `FRAMEWORK.md`, `PLAN.md` — all references
- `skills/README.md` — framework name

### 5. Update Skills
```bash
grep -rl "<old-name>" ~/.hermes/skills/
```
Use targeted `patch` — never `write_file` on large files.

### 6. Update Connected Repos
- Add cross-links in both directions
- Use `patch` for large files, never full rewrite

### 7. Commit + Push
```bash
git add -A
git commit -m "🎯 Rename framework: <old-name> → <new-name>"
git push origin main
```

## Pitfalls
- **Don't `write_file` on large files** — use `patch` or risk truncation
- **GitHub rename propagation delay** — wait 10s before pushing
- **CI/CD fails** until new Cloudflare resources exist
- **Keep old CF resources** until new ones verified
- **Pages subdomain gets random suffix** — `saturday-62d.pages.dev`, not `saturday.pages.dev`
- **Token redaction** — `***` in tokens causes shell glob; use `echo '<token>' > /tmp/cf_token && cat /tmp/cf_token | xargs -I{} <command>`
