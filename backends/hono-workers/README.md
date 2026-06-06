# Hono Workers Backend Blueprint

Hono framework on Cloudflare Workers with KV + D1 bindings.

## Usage
```bash
cp -r backends/hono-workers/* ~/projects/<name>/backend/
```

## What's Included
- `src/index.ts` — Hono app with CORS, health check, KV routes
- `schema.sql` — D1 schema template
- `wrangler.toml` — KV + D1 bindings (fill in your IDs)
- `package.json` — Hono + drizzle-orm + wrangler
- `tsconfig.json` — TypeScript config

## Features
- CORS configured for all routes
- Standardized error responses
- KV read/write helpers
- D1 query helpers
- Health check endpoint
- Ready for auth middleware
