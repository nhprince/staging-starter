# Clerk Auth Module

Clerk authentication integration for Next.js + Hono projects.

## Usage
```bash
cp -r auth/clerk/* ~/projects/<name>/auth/
```

## What's Included
- `frontend/` — ClerkProvider, middleware, sign-in/sign-up pages
- `backend/` — Clerk webhook handler, user sync to D1
- `database/` — Users table schema for Clerk sync

## Setup
1. Create Clerk app at dashboard.clerk.com
2. Copy publishable key + secret key
3. Add to environment variables
4. Configure middleware for protected routes

## Environment Variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_liv...
CLERK_SECRET_KEY=sk_liv...
CLERK_WEBHOOK_SECRET=whsec_...
```
