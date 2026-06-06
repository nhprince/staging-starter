# Backend Template — Hono on Cloudflare Workers

Copy this directory as a starting point for new project backends.

## Setup
1. Copy to your project: `cp -r backends/hono-workers ~/projects/my-project/backend/`
2. Update `wrangler.toml` with your project name and resource IDs
3. Update `package.json` name field
4. Run `pnpm install`

## Features
- Hono framework (fast, lightweight)
- CORS on all routes
- Root route for health checks
- KV and D1 bindings configured
- TypeScript

## API Routes
- `GET /` — Service info
- `GET /api/health` — Health check
- `GET /api/hello` — Example endpoint
- `GET /api/kv/:key` — KV read
- `POST /api/kv/:key` — KV write
