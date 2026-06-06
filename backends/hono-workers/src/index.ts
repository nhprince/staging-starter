import { Hono } from "hono";
import { cors } from "hono/cors";

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

// CORS — applied to all routes
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["cf-ray", "cf-cache-status"],
  maxAge: 86400,
}));

// Root — Service info
app.get("/", (c) => {
  return c.json({
    service: "saturday",
    status: "running",
    version: "1.0.0",
    endpoints: ["/api/health", "/api/hello", "/api/kv/:key"],
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Example API route
app.get("/api/hello", (c) => {
  return c.json({
    message: "Hello from Cloudflare Workers! 🚀",
    powered_by: "Saturday + Prince",
  });
});

// KV read/write
app.get("/api/kv/:key", async (c) => {
  const key = c.req.param("key");
  const value = await c.env.KV.get(key);
  return c.json({ key, value: value || null });
});

app.post("/api/kv/:key", async (c) => {
  const key = c.req.param("key");
  const body = await c.req.json();
  await c.env.KV.put(key, JSON.stringify(body));
  return c.json({ success: true, key });
});

export default app;
