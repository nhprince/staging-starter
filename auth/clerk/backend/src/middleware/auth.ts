import { Hono } from "hono";

/**
 * Clerk JWT verification middleware for Hono
 * 
 * Usage:
 *   app.use("/api/protected/*", clerkAuthMiddleware);
 *   app.get("/api/protected/data", (c) => {
 *     const user = c.get("user");
 *     return c.json({ email: user.email });
 *   });
 */

interface ClerkUser {
  sub: string;
  email?: string;
  name?: string;
  iat: number;
  exp: number;
}

// Simple JWT verification (Clerk uses RS256)
// In production, use @clerk/backend or verify against Clerk's JWKS
export async function clerkAuthMiddleware(c: any, next: () => Promise<void>) {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);

  try {
    // Decode JWT payload (without verification for development)
    // In production, verify against Clerk's JWKS endpoint
    const parts = token.split(".");
    if (parts.length !== 3) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString()) as ClerkUser;

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return c.json({ error: "Token expired" }, 401);
    }

    // Set user in context
    c.set("user", {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    });

    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
}

// Example protected routes
export function registerProtectedRoutes(app: Hono<{ Bindings: { DB: D1Database } }>) {
  app.use("/api/protected/*", clerkAuthMiddleware);

  app.get("/api/protected/me", (c) => {
    const user = c.get("user");
    return c.json({ user });
  });

  app.get("/api/protected/stats", async (c) => {
    const user = c.get("user");
    const db = c.env.DB;
    
    // Example: get user-specific data
    const { results } = await db
      .prepare("SELECT COUNT(*) as count FROM submissions WHERE email = ?")
      .bind(user.email)
      .all();

    return c.json({ user: user.email, stats: results?.[0] });
  });
}
