---
name: add-auth
description: "Add authentication to any project — Clerk, Auth.js, or Lucia. Use when Prince says 'add login', 'add auth', or 'users should sign in'. Covers setup, middleware, protected routes, and UI components."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [authentication, auth, clerk, authjs, lucia, sessions, login, security]
    related_skills: [frontend-design, backend-design, fullstack-developer, database-design]
---

# Add Auth — Authentication Module

## Overview

Adds authentication to any project. Three provider options: **Clerk** (managed, easiest), **Auth.js** (flexible, self-hosted), **Lucia** (lightweight, session-based). All are free tier compatible.

## When to Use

- Prince says "add login/signup/auth" to a project
- Building SaaS, dashboard, or any app with user accounts
- Adding protected routes or admin panels
- **Don't use for:** public-only sites (landing pages, blogs without admin)

## Provider Selection

| Provider | Best For | Free Tier | Complexity |
|----------|----------|-----------|------------|
| **Clerk** | SaaS, quick setup, managed | 10K MAU | Low |
| **Auth.js** | Flexibility, OAuth, credentials | Unlimited (self-hosted) | Medium |
| **Lucia** | Full control, lightweight, D1-compatible | Unlimited (self-hosted) | Medium |

## Clerk Setup (Recommended for SaaS)

### 1. Install

```bash
cd frontend
pnpm add @clerk/nextjs
```

### 2. Environment

```env
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Middleware

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 4. Layout Wrapper

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 5. Sign In/Up Pages

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';
export default function Page() { return <SignIn />; }

// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';
export default function Page() { return <SignUp />; }
```

### 6. User Button & Protected Content

```tsx
import { UserButton, useUser } from '@clerk/nextjs';

function Dashboard() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <Loading />;
  return (
    <div>
      <UserButton />
      <h1>Welcome, {user?.firstName}!</h1>
    </div>
  );
}
```

## Auth.js Setup (NextAuth v5)

### 1. Install

```bash
pnpm add next-auth @auth/drizzle-adapter
```

### 2. Config

```ts
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  adapter: DrizzleAdapter(db),
});
```

## Lucia Setup (D1-Compatible)

### 1. Install

```bash
pnpm add lucia @lucia-auth/adapter-drizzle
```

### 2. Best for: Workers + D1 projects where you control sessions

## Common Pitfalls

1. **Missing middleware** — Protected routes won't redirect without it
2. **Wrong env var names** — Clerk uses `NEXT_PUBLIC_` prefix for client-side
3. **Not handling loading state** — `useUser()` is async, show skeleton
4. **Forgetting server-side auth** — Use `auth()` server function for API routes

## Verification Checklist

- [ ] Auth provider installed and configured
- [ ] Environment variables set
- [ ] Middleware protecting routes
- [ ] Sign in/sign up pages working
- [ ] User button shows in header
- [ ] Protected routes redirect to sign-in
- [ ] Session persists across page reloads

## Agent Tip 🤖

> Default to **Clerk** for SaaS projects (fastest setup, great UI components).
> Use **Lucia** for API-heavy projects or when you need D1 session storage.
> Use **Auth.js** when you need specific OAuth providers Clerk doesn't support.
