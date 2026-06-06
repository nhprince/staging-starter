# Backend Template

This directory contains the backend template for new projects.
Copy this entire directory when scaffolding a new project backend.

## Files
- `src/index.ts` — Hono app template with CORS, health check, KV/D1 bindings
- `wrangler.toml` — Cloudflare Workers config (update placeholders)
- `package.json` — Dependencies (update name)
- `README.md` — This file

## Usage
1. Copy: `cp -r templates/backend ~/projects/my-project/backend/`
2. Update `wrangler.toml` with your KV namespace ID and D1 database ID
3. Update `package.json` name field
4. Run `pnpm install`
5. Develop: `pnpm dev`
6. Deploy: `pnpm deploy`
