import { Hono } from "hono";
import { cors } from "hono/cors";

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

// CORS
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["cf-ray", "cf-cache-status"],
  maxAge: 86400,
}));

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", service: "blog-api", timestamp: new Date().toISOString() });
});

// ===== POSTS =====

// List published posts
app.get("/api/posts", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM posts WHERE published = 1 ORDER BY published_at DESC LIMIT 20"
  ).all();
  return c.json(results);
});

// Get single post by slug
app.get("/api/posts/:slug", async (c) => {
  const slug = c.req.param("slug");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM posts WHERE slug = ? AND published = 1"
  ).bind(slug).all();
  if (results.length === 0) return c.json({ error: "Post not found" }, 404);
  return c.json(results[0]);
});

// Create post (protected)
app.post("/api/posts", async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  await c.env.DB.prepare(
    "INSERT INTO posts (id, slug, title, excerpt, content, published, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, slug, body.title, body.excerpt, body.content, body.published || false, body.authorId).run();
  
  return c.json({ id, slug });
});

// Update post (protected)
app.put("/api/posts/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  
  await c.env.DB.prepare(
    "UPDATE posts SET title = ?, excerpt = ?, content = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(body.title, body.excerpt, body.content, body.published, id).run();
  
  return c.json({ success: true });
});

// Delete post (protected)
app.delete("/api/posts/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

// ===== CATEGORIES =====

app.get("/api/categories", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM categories ORDER BY name").all();
  return c.json(results);
});

// ===== TAGS =====

app.get("/api/tags", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM tags ORDER BY name").all();
  return c.json(results);
});

// ===== AUTHORS =====

app.get("/api/authors", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM authors").all();
  return c.json(results);
});

export default app;
