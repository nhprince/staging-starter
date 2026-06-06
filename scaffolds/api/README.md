# API Scaffold

REST API boilerplate with versioned routes, rate limiting, API key auth, and OpenAPI docs.

## Stack
- **Backend:** Hono → Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Auth:** API key + JWT
- **Docs:** OpenAPI/Swagger UI

## Features
- Versioned API routes (`/api/v1/*`)
- Rate limiting (KV-based)
- API key authentication
- Request validation (Zod)
- OpenAPI documentation
- CORS configured
- Standardized error responses
- Health check endpoint

## Usage
```bash
cp -r scaffolds/api/* ~/projects/my-api/
```

## File Structure
```
├── backend/
│   ├── src/
│   │   ├── index.ts              # Main app
│   │   ├── middleware/
│   │   │   ├── auth.ts           # API key auth
│   │   │   ├── rateLimit.ts      # Rate limiting
│   │   │   └── validate.ts       # Zod validation
│   │   ├── routes/
│   │   │   ├── health.ts
│   │   │   ├── auth.ts
│   │   │   └── resources.ts
│   │   └── lib/
│   │       ├── errors.ts         # Standardized errors
│   │       └── responses.ts      # Standardized responses
│   ├── schema.sql
│   └── wrangler.toml
└── database/
    └── schema.sql
```
