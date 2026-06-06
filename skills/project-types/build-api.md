---
name: build-api
description: "Build a REST API with Hono on Cloudflare Workers — versioned routes, rate limiting, API key auth, OpenAPI docs. Use when Prince says 'build an API' or 'create a backend'."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [api, rest, hono, workers, openapi, rate-limiting, cloudflare]
    related_skills: [scaffold-project, add-auth, add-database, backend-design, fullstack-developer]
---

# Build API — REST API Boilerplate

## Overview

Builds a production-ready REST API with Hono on Cloudflare Workers. Includes versioned routes, rate limiting, API key authentication, and OpenAPI documentation.

## When to Use

- Prince says "build an API" or "create a backend"
- Backend-only project (no frontend)
- Microservice
- **Don't use for:** full-stack apps (use blog/saas scaffolds)

## Architecture

```
Hono Worker
├── /api/v1/health          # Health check
├── /api/v1/auth/*          # Auth endpoints
├── /api/v1/users/*         # User CRUD
├── /api/v1/resources/*     # Your resources
├── /api/v1/docs            # OpenAPI/Swagger UI
└── /api/v1/rate-limit      # Rate limit status
```

## Rate Limiting

```ts
import { rateLimiter } from 'hono-rate-limiter';

app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  keyGenerator: (c) => c.req.header('x-api-key') || c.req.header('x-forwarded-for') || 'anonymous',
}));
```

## API Key Auth

```ts
app.use('/api/v1/*', async (c, next) => {
  const apiKey = c.req.header('x-api-key');
  if (!apiKey) return c.json({ error: 'API key required' }, 401);
  
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM api_keys WHERE key = ? AND active = 1'
  ).bind(apiKey).all();
  
  if (results.length === 0) return c.json({ error: 'Invalid API key' }, 403);
  c.set('userId', results[0].user_id);
  await next();
});
```

## OpenAPI Docs

```ts
// Use @hono/swagger-ui
import { swaggerUI } from '@hono/swagger-ui';

app.get('/api/v1/docs', swaggerUI({ url: '/api/v1/doc' }));
app.doc('/api/v1/doc', {
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0.0' },
});
```

## Verification Checklist

- [ ] Health endpoint returns 200
- [ ] Rate limiting works (429 after limit)
- [ ] API key auth blocks unauthenticated requests
- [ ] CRUD operations work
- [ ] OpenAPI docs accessible at /api/v1/docs
- [ ] CORS configured for frontend access

## Agent Tip 🤖

> Always version your API (`/api/v1/`). It saves you from breaking changes later.
> Use Hono's built-in validator (Zod) for request validation.
