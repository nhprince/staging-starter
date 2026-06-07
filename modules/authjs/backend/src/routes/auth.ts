import { Hono } from "hono";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function authRouter() {
  const app = new Hono<{ Bindings: { DB: D1Database; JWT_SECRET: string; FRONTEND_URL?: string } }>();

  // ── Signup ───────────────────────────────────────────────────────────────

  app.post("/signup", async (c) => {
    const db = c.env.DB;
    try {
      const body = await c.req.json();
      const parsed = SignupSchema.parse(body);

      // Check if user exists
      const existing = await db.prepare(
        "SELECT id FROM users WHERE email = ?"
      ).bind(parsed.email).first();
      if (existing) return c.json({ error: "Email already registered" }, 409);

      // Hash password using Web Crypto API
      const encoder = new TextEncoder();
      const salt = crypto.randomUUID();
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        encoder.encode(parsed.password + salt)
      );
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      // Create users table if not exists (self-bootstrapping)
      await db.prepare(
        "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, name TEXT, role TEXT DEFAULT 'user', avatar TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
      ).run();

      await db.prepare(
        "INSERT INTO users (id, email, password_hash, password_salt, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, parsed.email, hash, salt, parsed.name ?? null, now, now).run();

      // Generate JWT
      const token = await generateJWT(c.env.JWT_SECRET, { sub: id, email: parsed.email, name: parsed.name ?? null, role: "user" });

      return c.json({
        user: { id, email: parsed.email, name: parsed.name ?? null, role: "user" },
        token,
      }, 201);
    } catch (err: any) {
      if (err.name === "ZodError") {
        return c.json({ error: "Validation failed", details: err.errors }, 400);
      }
      return c.json({ error: err.message ?? "Signup failed" }, 500);
    }
  });

  // ── Login ────────────────────────────────────────────────────────────────

  app.post("/login", async (c) => {
    const db = c.env.DB;
    try {
      const body = await c.req.json();
      const parsed = LoginSchema.parse(body);

      const user = await db.prepare(
        "SELECT * FROM users WHERE email = ?"
      ).bind(parsed.email).first<{ id: string; email: string; password_hash: string; password_salt: string; name: string | null; role: string }>();

      if (!user) return c.json({ error: "Invalid email or password" }, 401);

      // Verify password
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        encoder.encode(parsed.password + user.password_salt)
      );
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (hash !== user.password_hash) {
        return c.json({ error: "Invalid email or password" }, 401);
      }

      const token = await generateJWT(c.env.JWT_SECRET, {
        sub: user.id, email: user.email, name: user.name, role: user.role,
      });

      return c.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        return c.json({ error: "Validation failed", details: err.errors }, 400);
      }
      return c.json({ error: err.message ?? "Login failed" }, 500);
    }
  });

  // ── Me (current user) ────────────────────────────────────────────────────

  app.get("/me", async (c) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const token = authHeader.slice(7);
      const payload = await verifyJWT(c.env.JWT_SECRET, token);
      return c.json({ user: payload });
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  });

  // ── Refresh token ────────────────────────────────────────────────────────

  app.post("/refresh", async (c) => {
    const body = await c.req.json();
    const refreshToken = body.refresh_token as string;
    if (!refreshToken) return c.json({ error: "refresh_token required" }, 400);

    try {
      const payload = await verifyJWT(c.env.JWT_SECRET, refreshToken);
      const newToken = await generateJWT(c.env.JWT_SECRET, {
        sub: payload.sub, email: payload.email, name: payload.name, role: payload.role,
      });
      return c.json({ token: newToken });
    } catch {
      return c.json({ error: "Invalid refresh token" }, 401);
    }
  });

  // ── OAuth state (for GitHub/Google OAuth) ────────────────────────────────

  app.get("/oauth/:provider", async (c) => {
    const provider = c.req.param("provider");
    const frontendUrl = c.env.FRONTEND_URL || "http://localhost:3000";

    if (!["github", "google"].includes(provider)) {
      return c.json({ error: "Unsupported provider" }, 400);
    }

    const state = crypto.randomUUID();
    const redirectUri = `${c.req.url.split("/oauth")[0]}/oauth/${provider}/callback`;

    const urls: Record<string, string> = {
      github: `https://github.com/login/oauth/authorize?client_id=${c.env[`${provider.toUpperCase()}_CLIENT_ID`]}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=user:email`,
      google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${c.env[`${provider.toUpperCase()}_CLIENT_ID`]}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&response_type=code&scope=openid email profile`,
    };

    return c.json({ url: urls[provider], state });
  });

  return app;
}

// ─── JWT Helpers ──────────────────────────────────────────────────────────────

async function generateJWT(secret: string, payload: Record<string, any>): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + 86400 * 7 }; // 7 days

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const payloadB64 = btoa(JSON.stringify(fullPayload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(`${headerB64}.${payloadB64}`));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${headerB64}.${payloadB64}.${sigB64}`;
}

async function verifyJWT(secret: string, token: string): Promise<any> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token format");

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );

  const sig = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const valid = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(`${parts[0]}.${parts[1]}`));
  if (!valid) throw new Error("Invalid signature");

  const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }
  return payload;
}
