# Auth.js (NextAuth v5) Module

Flexible authentication with OAuth providers + credentials.

## Usage
```bash
cp -r auth/authjs/* ~/projects/<name>/auth/
```

## What's Included
- `auth.ts` — Auth.js config with Drizzle adapter
- `middleware.ts` — Route protection
- `app/api/auth/[...nextauth]/route.ts` — Auth API route
- `components/SignInButton.tsx` — Sign in button component

## Setup
```bash
pnpm add next-auth @auth/drizzle-adapter
```

## Environment Variables
```
AUTH_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```
