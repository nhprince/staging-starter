# Hono + Cloudflare Workers SKILL

## When to Use This Skill
Use when building APIs on Cloudflare Workers with Hono framework.

## Core Knowledge

### Route Organization
```typescript
// src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", cors());
app.use("*", logger());

// Routes
app.route("/api/users", userRoutes);
app.route("/api/products", productRoutes);

export default app;
```

### D1 + Drizzle ORM Integration
```typescript
// db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// db/index.ts
import { drizzle } from "drizzle-orm/d1";

export function getDB(env: Env) {
  return drizzle(env.DB);
}

// Usage in route
app.get("/api/users", async (c) => {
  const db = getDB(c.env);
  const users = await db.select().from(usersTable);
  return c.json(users);
});
```

### KV Caching Patterns
```typescript
// Cache with KV
app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const cacheKey = `product:${id}`;
  
  // Try cache first
  const cached = await c.env.KV.get(cacheKey);
  if (cached) return c.json(JSON.parse(cached));
  
  // Fetch from DB
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) return c.json({ error: "Not found" }, 404);
  
  // Cache for 1 hour
  await c.env.KV.put(cacheKey, JSON.stringify(product), { expirationTtl: 3600 });
  return c.json(product);
});
```

### R2 File Upload
```typescript
app.post("/api/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"] as File;
  
  const key = `uploads/${Date.now()}-${file.name}`;
  await c.env.R2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  
  return c.json({ key, url: `${c.env.R2_PUBLIC_URL}/${key}` });
});
```

### Auth Middleware
```typescript
import { verify } from "hono/jwt";

app.use("/api/protected/*", async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return c.json({ error: "Unauthorized" }, 401);
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("userId", payload.sub);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});
```

### Rate Limiting
```typescript
import { rateLimiter } from "hono-rate-limiter";

app.use("/api/*", rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
}));
```

### Common Pitfalls
1. **D1 limitations** — No full-text search, no pgvector, max 5GB free
2. **KV eventual consistency** — Reads may be stale for ~60 seconds
3. **R2 no egress fees** — But operations have costs at scale
4. **Worker cold starts** — Keep dependencies minimal
5. **No Node.js APIs** — Use Web APIs instead (fetch, URL, etc.)

## Verification Checklist
- [ ] Routes return proper HTTP status codes
- [ ] CORS configured for frontend domain
- [ ] Error handling middleware in place
- [ ] KV caching for expensive queries
- [ ] Auth middleware on protected routes
