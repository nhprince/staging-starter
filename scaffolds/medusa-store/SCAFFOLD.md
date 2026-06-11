# Medusa Store Scaffold

## Usage
```bash
saturday new medusa-store my-store
```

## Structure
```
my-store/
├── storefront/          → Next.js (Cloudflare Pages)
│   ├── src/app/         → Product listings, cart, checkout
│   └── src/lib/medusa.ts → Medusa JS client
├── backend/             → Medusa.js v2 (VPS, PM2)
│   ├── medusa-config.ts
│   ├── src/
│   │   └── modules/     → Custom modules (design studio integration)
│   └── ecosystem.config.js  → PM2 with memory limits
├── .github/workflows/
│   ├── deploy-storefront.yml → Cloudflare Pages
│   └── deploy-backend.yml   → VPS via SSH
└── saturday.yaml
```

## PM2 Config
```javascript
// backend/ecosystem.config.js
module.exports = {
  apps: [{
    name: "medusa",
    script: "node_modules/.bin/medusa",
    args: "start",
    max_memory_restart: "380M",
    node_args: "--max-old-space-size=350",
    env: {
      DATABASE_URL: process.env.SUPABASE_URL,
      REDIS_URL: process.env.UPSTASH_REDIS_URL,
      NODE_ENV: "production"
    }
  }]
};
```

## Environment Variables
```env
# Backend
DATABASE_URL=postgresql://postgres:***@db.[project].supabase.co:5432/postgres
REDIS_URL=redis://default:***@[host]:6379
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=https://your-storefront.pages.dev
ADMIN_CORS=https://your-admin.pages.dev

# Storefront
MEDUSA_URL=https://your-medusa-backend.workers.dev
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

## Deployment
- Storefront → Cloudflare Pages (static export)
- Backend → VPS via PM2 (memory-limited)
- Database → Supabase (not self-hosted)
- Cache → Upstash Redis (not self-hosted)
