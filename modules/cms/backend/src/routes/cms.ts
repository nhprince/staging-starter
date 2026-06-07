import { Hono } from "hono";
import { z } from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

constContentTypeSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  schema: z.string(), // JSON string of field definitions
});

const ContentEntrySchema = z.object({
  type_id: z.string().min(1),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(500),
  data: z.string(), // JSON string of field values
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().optional(),
});

// ─── CMS Router ───────────────────────────────────────────────────────────────

export function cmsRouter() {
  const app = new Hono<{ Bindings: { DB: D1Database; R2?: R2Bucket } }>();

  // ── Content Types ────────────────────────────────────────────────────────

  // List all content types
  app.get("/types", async (c) => {
    const db = c.env.DB;
    const { results } = await db.prepare(
      "SELECT * FROM content_types ORDER BY created_at DESC"
    ).all();
    return c.json({ types: results ?? [] });
  });

  // Get single content type
  app.get("/types/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const result = await db.prepare(
      "SELECT * FROM content_types WHERE id = ?"
    ).bind(id).first();
    if (!result) return c.json({ error: "Content type not found" }, 404);
    return c.json(result);
  });

  // Create content type
  app.post("/types", async (c) => {
    const db = c.env.DB;
    try {
      const body = await c.req.json();
      const parsed = ContentTypeSchema.parse(body);
      const id = crypto.randomUUID();
      await db.prepare(
        "INSERT INTO content_types (id, name, slug, description, schema) VALUES (?, ?, ?, ?, ?)"
      ).bind(id, parsed.name, parsed.slug, parsed.description ?? "", parsed.schema).run();
      return c.json({ id, ...parsed }, 201);
    } catch (err: any) {
      if (err.name === "ZodError") {
        return c.json({ error: "Validation failed", details: err.errors }, 400);
      }
      const msg = err.message ?? "Unknown error";
      if (msg.includes("UNIQUE")) {
        return c.json({ error: "Slug already exists" }, 409);
      }
      return c.json({ error: msg }, 500);
    }
  });

  // Update content type
  app.put("/types/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const body = await c.req.json();
      const parsed = ContentTypeSchema.partial().parse(body);
      const sets: string[] = [];
      const values: any[] = [];
      if (parsed.name) { sets.push("name = ?"); values.push(parsed.name); }
      if (parsed.slug) { sets.push("slug = ?"); values.push(parsed.slug); }
      if (parsed.description !== undefined) { sets.push("description = ?"); values.push(parsed.description); }
      if (parsed.schema) { sets.push("schema = ?"); values.push(parsed.schema); }
      if (sets.length === 0) return c.json({ error: "No fields to update" }, 400);
      values.push(id);
      await db.prepare(
        `UPDATE content_types SET ${sets.join(", ")} WHERE id = ?`
      ).bind(...values).run();
      return c.json({ success: true });
    } catch (err: any) {
      return c.json({ error: err.message ?? "Update failed" }, 400);
    }
  });

  // Delete content type
  app.delete("/types/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    await db.prepare("DELETE FROM content_types WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  });

  // ── Content Entries ──────────────────────────────────────────────────────

  // List entries (optionally filtered by type and status)
  app.get("/entries", async (c) => {
    const db = c.env.DB;
    const typeId = c.req.query("type");
    const status = c.req.query("status");
    const limit = parseInt(c.req.query("limit") || "50", 10);
    const offset = parseInt(c.req.query("offset") || "0", 10);

    let sql = "SELECT * FROM content_entries WHERE 1=1";
    const params: any[] = [];

    if (typeId) { sql += " AND type_id = ?"; params.push(typeId); }
    if (status) { sql += " AND status = ?"; params.push(status); }
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const { results } = await db.prepare(sql).bind(...params).all();
    return c.json({ entries: results ?? [], limit, offset });
  });

  // Get single entry
  app.get("/entries/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const result = await db.prepare(
      "SELECT * FROM content_entries WHERE id = ?"
    ).bind(id).first();
    if (!result) return c.json({ error: "Entry not found" }, 404);
    return c.json(result);
  });

  // Create entry
  app.post("/entries", async (c) => {
    const db = c.env.DB;
    try {
      const body = await c.req.json();
      const parsed = ContentEntrySchema.parse(body);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await db.prepare(
        "INSERT INTO content_entries (id, type_id, slug, title, data, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        id, parsed.type_id, parsed.slug, parsed.title, parsed.data,
        parsed.status, parsed.published_at ?? null, now, now
      ).run();
      return c.json({ id, ...parsed, created_at: now, updated_at: now }, 201);
    } catch (err: any) {
      if (err.name === "ZodError") {
        return c.json({ error: "Validation failed", details: err.errors }, 400);
      }
      const msg = err.message ?? "Unknown error";
      if (msg.includes("UNIQUE")) {
        return c.json({ error: "Slug already exists for this content type" }, 409);
      }
      if (msg.includes("FOREIGN KEY")) {
        return c.json({ error: "Content type not found" }, 400);
      }
      return c.json({ error: msg }, 500);
    }
  });

  // Update entry
  app.put("/entries/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const body = await c.req.json();
      const parsed = ContentEntrySchema.partial().omit({ type_id: true }).parse(body);
      const sets: string[] = [];
      const values: any[] = [];
      if (parsed.slug) { sets.push("slug = ?"); values.push(parsed.slug); }
      if (parsed.title) { sets.push("title = ?"); values.push(parsed.title); }
      if (parsed.data) { sets.push("data = ?"); values.push(parsed.data); }
      if (parsed.status) { sets.push("status = ?"); values.push(parsed.status); }
      if (parsed.published_at !== undefined) { sets.push("published_at = ?"); values.push(parsed.published_at); }
      if (sets.length === 0) return c.json({ error: "No fields to update" }, 400);
      sets.push("updated_at = ?");
      values.push(new Date().toISOString());
      values.push(id);
      await db.prepare(
        `UPDATE content_entries SET ${sets.join(", ")} WHERE id = ?`
      ).bind(...values).run();
      return c.json({ success: true });
    } catch (err: any) {
      return c.json({ error: err.message ?? "Update failed" }, 400);
    }
  });

  // Delete entry
  app.delete("/entries/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    await db.prepare("DELETE FROM content_entries WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  });

  // ── Media Library ─────────────────────────────────────────────────────────

  // List media files
  app.get("/media", async (c) => {
    const db = c.env.DB;
    const limit = parseInt(c.req.query("limit") || "50", 10);
    const offset = parseInt(c.req.query("offset") || "0", 10);
    const { results } = await db.prepare(
      "SELECT id, filename, original_name, mime_type, size_bytes, alt_text, created_at FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all();
    return c.json({ media: results ?? [] });
  });

  // Generate upload URL (client uploads to R2 directly)
  app.post("/media/upload-url", async (c) => {
    const r2 = c.env.R2;
    if (!r2) return c.json({ error: "R2 not configured" }, 500);

    const body = await c.req.json();
    const filename = body.filename as string;
    if (!filename) return c.json({ error: "filename is required" }, 400);

    const ext = filename.split(".").pop() || "bin";
    const id = crypto.randomUUID();
    const key = `media/${id}.${ext}`;

    // Store metadata in D1
    const db = c.env.DB;
    await db.prepare(
      "INSERT INTO media (id, filename, original_name, mime_type, size_bytes, r2_key, uploaded_by) VALUES (?, ?, ?, ?, 0, ?, ?)"
    ).bind(id, key, filename, body.mime_type || "application/octet-stream", key, body.uploaded_by ?? null).run();

    // Return the key for client-side upload
    return c.json({ id, key, filename });
  });

  // Delete media
  app.delete("/media/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const record = await db.prepare(
      "SELECT r2_key FROM media WHERE id = ?"
    ).bind(id).first<{ r2_key: string }>();

    if (record?.r2_key && c.env.R2) {
      await c.env.R2.delete(record.r2_key);
    }
    await db.prepare("DELETE FROM media WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  });

  return app;
}
