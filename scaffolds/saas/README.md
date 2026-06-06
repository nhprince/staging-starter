# SaaS Scaffold

Production-ready SaaS starter with auth, billing, dashboard, and settings.

## Stack
- **Frontend:** Next.js → Cloudflare Pages
- **Backend:** Hono → Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Auth:** Clerk (with org support)
- **Billing:** Stripe subscriptions

## Features
- Clerk authentication (sign in, sign up, org support)
- Stripe subscription billing (free/pro/enterprise tiers)
- User dashboard with stats and activity
- Settings page (profile, password, notifications)
- Admin panel (user management, analytics)
- Landing page with pricing table
- Webhook handlers (Clerk + Stripe)
- Dark theme + glassmorphism throughout

## Usage
```bash
cp -r scaffolds/saas/* ~/projects/my-saas/
# Configure: Clerk keys, Stripe keys, KV/D1 IDs
```

## File Structure
```
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/page.tsx      # Pricing table
│   │   ├── sign-in/...           # Clerk auth pages
│   │   ├── sign-up/...
│   │   ├── dashboard/            # User dashboard (protected)
│   │   ├── settings/             # User settings
│   │   └── admin/                # Admin panel (admin only)
│   └── components/
│       ├── PricingTable.tsx
│       ├── DashboardStats.tsx
│       └── BillingCard.tsx
├── backend/
│   ├── src/index.ts              # Hono API
│   ├── schema.sql                # D1 schema
│   └── wrangler.toml
└── database/
    └── schema.sql
```

## Required Secrets
```
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=
STRIPE_PRICE_ID_ENTERPRISE=
```
