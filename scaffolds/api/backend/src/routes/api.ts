import { Hono } from "hono";
import { z } from "zod";

export function apiRouter() {
  const app = new Hono<{ Bindings: { DB: D1Database; API_KEY?: string } }>();

  // API key middleware (optional)
  app.use("/v1/*", async (c, next) => {
    const apiKey = c.req.header("X-API-Key");
    if (c.env.API_KEY && apiKey !== c.env.API_KEY) {
      return c.json({ error: "Invalid API key" }, 401);
    }
    return next();
  });

  // Health
  app.get("/health", (c) => c.json({ status: "ok", service: "api" }));

  // Generic CRUD helper
  function crudRoutes(name: string, table: string, schema: z.ZodSchema) {
    const router = new Hono<{ Bindings: { DB: D1Database } }>();

    router.get("/", async (c) => {
      const db = c.env.DB;
      const limit = parseInt(c.req.query("limit") || "50", 10);
      const offset = parseInt(c.req.query("offset") || "0", 10);
      const { results } = await db.prepare(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(limit, offset).all();
      return c.json({ [name]: results ?? [], limit, offset });
    });

    router.get("/:id", async (c) => {
      const db = c.env.DB;
      const result = await db.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(c.req.param("id")).first();
      if (!result) return c.json({ error: `${name} not found` }, 404);
      return c.json(result);
    });

    router.post("/", async (c) => {
      const db = c.env.DB;
      try {
        const body = await c.req.json();
        const parsed = schema.parse(body);
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const keys = Object.keys(parsed);
        const values = Object.values(parsed);
        const placeholders = keys.map(() => "?").join(", ");
        await db.prepare(
          `INSERT INTO ${table} (id, ${keys.join(", ")}, created_at, updated_at) VALUES (?, ${placeholders}, ?, ?)`
        ).bind(id, ...values, now, now).run();
        return c.json({ id, ...parsed, created_at: now, updated_at: now }, 201);
      } catch (err: any) {
        if (err.name === "ZodError") return c.json({ error: "Validation failed", details: err.errors }, 400);
        return c.json({ error: err.message }, 500);
      }
    });

    // Update and delete omitted for brevity — same pattern
    router.put("/:id", async (c) => {
      const db = c.env.DB;
      const id = c.req.param("id");
      try {
        const body = await c.req.json();
        const parsed = schema.partial().parse(body);
        const sets = Object.keys(parsed).map(k => `${k} = ?`);
        const values = [...Object.values(parsed), new Date().toISOString(), id];
        await db.prepare(`UPDATE ${table} SET ${sets.join(", ")}, updated_at = ? WHERE id = ?`).bind(...values).run();
        return c.json({ success: true });
      } catch (err: any) {
        return c.json({ error: err.message }, 400);
      }
    });

    router.delete("/:id", async (c) => {
      const db = c.env.DB;
      await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(c.req.param("id")).run();
      return c.json({ success: true });
    });

    return router;
  }

  // Mount resource routes here as needed
  // Example: app.route("/v1/posts", crudRoutes("posts", "posts", PostSchema));

  return app;
}
