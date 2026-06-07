# AuthJS Module

JWT-based authentication with signup, login, token refresh, and OAuth state management.

## Features

- **JWT Authentication** — Signup, login, token refresh using Web Crypto API
- **Password Hashing** — SHA-256 with unique salt per user
- **Self-Bootstrapping** — Creates users table automatically on first signup
- **OAuth State** — GitHub/Google OAuth state generation
- **Role-Based** — User roles (user/admin) embedded in JWT
- **Edge-Native** — Uses Web Crypto API (no Node.js dependencies)

## Usage

```bash
cp -r modules/authjs/backend/* ~/projects/my-project/backend/src/routes/
```

Mount the router:

```typescript
// backend/src/index.ts
import { authRouter } from "./routes/auth";
app.route("/api/auth", authRouter());
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user (requires Bearer token) |
| POST | `/api/auth/refresh` | Refresh JWT token |
| GET | `/api/auth/oauth/:provider` | Get OAuth URL (github/google) |

## Frontend Integration

```tsx
// app/layout.tsx
import { AuthProvider } from "@/modules/authjs/frontend/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

```tsx
// Any component
import { useAuth, AuthGuard } from "@/modules/authjs/frontend/AuthProvider";

function MyComponent() {
  const { user, login, logout } = useAuth();
  return <div>{user ? user.email : "Not logged in"}</div>;
}

// Protected route
<AuthGuard fallback={<LoginPage />}>
  <Dashboard />
</AuthGuard>
```

## Environment Variables

```toml
# wrangler.toml (vars)
JWT_SECRET = "your-secret-key-min-32-chars"
FRONTEND_URL = "https://my-app.pages.dev"
```

## Database

Self-creates the `users` table on first signup:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
