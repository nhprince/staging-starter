# Clerk Auth Module for Saturday Framework

## Overview

Complete authentication module using [Clerk](https://clerk.com) — the most developer-friendly auth provider.

**Cost:** Free tier includes 10,000 monthly active users.

## Setup

### 1. Create Clerk Application

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key**

### 2. Configure Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Backend (Worker secrets)
wrangler secret put CLERK_SECRET_KEY
```

### 3. Install Dependencies

```bash
# Frontend
pnpm add @clerk/nextjs

# Backend (for JWT verification)
pnpm add hono @hono/clerk-auth
```

## Frontend Integration

Copy the files from `frontend/src/` into your project's `frontend/src/`:

- `middleware.ts` — Clerk middleware for route protection
- `app/login/[[...login]]/page.tsx` — Login page
- `app/signup/[[...signup]]/page.tsx` — Signup page
- `components/SignInButton.tsx` — Sign in button component
- `components/SignUpButton.tsx` — Sign up button component
- `components/UserButton.tsx` — User profile button
- `components/AuthGuard.tsx` — Client-side auth guard

## Backend Integration

Copy the files from `backend/src/` into your project's `backend/src/`:

- `middleware/auth.ts` — JWT verification middleware
- `routes/protected.ts` — Example protected routes

## Usage

### Protecting Routes (Frontend)

```tsx
import { AuthGuard } from "@/components/AuthGuard";

export default function Dashboard() {
  return (
    <AuthGuard>
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

### Protecting API Routes (Backend)

```typescript
import { authMiddleware } from "./middleware/auth";

app.use("/api/protected/*", authMiddleware);
app.get("/api/protected/data", (c) => {
  const user = c.get("user");
  return c.json({ message: `Hello ${user.email}` });
});
```

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Frontend | Clerk publishable key |
| `CLERK_SECRET_KEY` | Frontend + Backend | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Backend | Webhook secret (optional) |

## File Structure

```
clerk/
├── frontend/
│   └── src/
│       ├── middleware.ts
│       ├── app/
│       │   ├── login/[[...login]]/page.tsx
│       │   └── signup/[[...signup]]/page.tsx
│       └── components/
│           ├── SignInButton.tsx
│           ├── SignUpButton.tsx
│           ├── UserButton.tsx
│           └── AuthGuard.tsx
└── backend/
    └── src/
        ├── middleware/auth.ts
        └── routes/protected.ts
```
