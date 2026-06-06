---
name: build-saas
description: "Build a complete SaaS with auth, billing, dashboard, and settings. Use when Prince says 'build me a SaaS' or 'create a startup'. Stack: Next.js + Hono + D1 + Clerk + Stripe."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [saas, startup, billing, dashboard, clerk, stripe, subscription]
    related_skills: [scaffold-project, add-auth, add-database, stripe-payments, frontend-design, fullstack-developer]
---

# Build SaaS — Complete SaaS Starter Kit

## Overview

Builds a production-ready SaaS with authentication, subscription billing, user dashboard, settings, and admin panel. Stack: Next.js + Hono Workers + D1 + Clerk + Stripe.

## When to Use

- Prince says "build me a SaaS" or "create a startup"
- Any app with user accounts, billing, and a dashboard
- **Don't use for:** simple sites (use blog or landing)

## Architecture

```
Frontend (Next.js)              Backend (Hono + D1)
├── /                           ├── /api/health
├── /pricing                    ├── /api/auth/webhook (Clerk)
├── /sign-in                    ├── /api/checkout (Stripe)
├── /sign-up                    ├── /api/webhooks/stripe
├── /dashboard                  ├── /api/user
│   ├── /overview               ├── /api/subscription
│   ├── /settings               └── /api/admin
│   └── /billing
└── /admin
```

## Key Features

1. **Auth** — Clerk (sign in, sign up, org support)
2. **Billing** — Stripe subscriptions (free/pro/enterprise tiers)
3. **Dashboard** — User dashboard with stats, recent activity
4. **Settings** — Profile, password, notification preferences
5. **Admin** — User management, analytics (admin role only)
6. **Landing** — Marketing page with pricing table

## Database Schema

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,        -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free',   -- free/pro/enterprise
  stripe_customer_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,       -- active/canceled/past_due
  current_period_end DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Workflow

1. Scaffold with `scaffold-project --type saas`
2. Set up Clerk (auth)
3. Set up Stripe (billing)
4. Build landing page + pricing
5. Build dashboard + settings
6. Build admin panel
7. Add Stripe webhook handler
8. Deploy and verify

## Verification Checklist

- [ ] Sign up/sign in works (Clerk)
- [ ] Landing page with pricing table
- ] Dashboard accessible after login
- [ ] Stripe checkout creates subscription
- [ ] Webhook updates subscription status
- [ ] Admin panel shows users
- [ ] Dark theme + glassmorphism throughout

## Agent Tip 🤖

> Start with the auth + billing flow first — everything else depends on knowing who the user is.
> Use Clerk's `<UserButton />` component for instant profile UI.
