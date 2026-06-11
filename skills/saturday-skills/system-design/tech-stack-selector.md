# Tech Stack Selector SKILL

## When to Use This Skill
Use when starting a new project and choosing the right technology stack.

## Decision Tree

```
NEW PROJECT → What type?
│
├── STATIC SITE (no backend needed)
│   └── Next.js static export → Cloudflare Pages ✓
│
├── SIMPLE APP (DB + auth needed, < 10k users)
│   ├── Use Supabase (Postgres + Auth + Storage + Edge Fns)
│   ├── Frontend: Next.js → Cloudflare Pages
│   └── No backend server needed → edge functions handle it
│
├── API / MICROSERVICE (< 100k req/day)
│   ├── Hono on Cloudflare Workers (free 100k/day)
│   └── Database: D1 (simple) or Supabase (relational)
│
├── E-COMMERCE (products, orders, inventory)
│   ├── Backend: Medusa.js v2 on VPS (PM2, 400MB limit)
│   ├── Database: Supabase Postgres (not self-hosted)
│   ├── Cache: Upstash Redis (not self-hosted)
│   ├── Frontend: Next.js storefront → Cloudflare Pages
│   └── Payments: Stripe
│
├── REAL-TIME APP (chat, collaboration, live data)
│   ├── Supabase Realtime (free tier: 200 concurrent)
│   └── OR Cloudflare Durable Objects (free tier: limited)
│
├── HEAVY COMPUTE (ML, video processing, batch jobs)
│   └── GitHub Actions (2000 min/month free)
│       → Trigger from Cloudflare Workers webhook
│
└── DESKTOP APP
    ├── Web skills available → Tauri (Rust + React)
    ├── Need Windows-native → .NET Avalonia
    └── Performance-critical → C++ Qt
```

### Database Selection
```
Need full SQL (JOINs, triggers, views)?
├── Yes → Supabase (PostgreSQL)
└── No → Need edge performance?
    ├── Yes → Cloudflare D1 (SQLite at edge)
    └── No → Either works

Need AI/vector search?
├── Yes → Supabase (pgvector)
└── No → Either works

Need realtime subscriptions?
├── Yes → Supabase Realtime
└── No → Either works

Need self-hosted?
├── Yes → Appwrite (Docker) or PocketBase (single binary)
└── No → Supabase cloud
```

### Frontend Framework Selection
```
Need SEO?
├── Yes → Next.js (SSR or static export)
└── No → SPA needed?
    ├── Yes → Vite + React (faster dev)
    └── No → Next.js (best overall)

Need 3D?
├── Yes → Next.js + React Three Fiber
└── No → Standard Next.js

Need mobile app too?
├── Yes → React Native + Expo (share React knowledge)
└── No → Web only
```

## Verification Checklist
- [ ] Stack chosen matches project requirements
- [ ] All services have free tiers sufficient for MVP
- [ ] Deployment targets identified (Cloudflare Pages/Workers/VPS)
- [ ] Database choice justified by query patterns
