import { Hono } from "hono";
import { z } from "zod";

const CommentSchema = z.object({
  post_id: z.string().min(1),
  parent_id: z.string().optional().nullable(),
  author_name: z.string().min(1).max(100),
  author_email: z.string().email().max(200).optional().nullable(),
  author_avatar: z.string().url().max(500).optional().nullable(),
  content: z.string().min(1).max(5000),
});

export function commentsRouter() {
  const app = new Hono<{ Bindings: { DB: D1Database } }>();

  // Get comments for a post (nested)
  app.get("/:postId", async (c) => {
    const db = c.env.DB;
    const postId = c.req.param("postId");
    const status = c.req.query("status") || "approved";

    const { results } = await db.prepare(
      "SELECT * FROM comments WHERE post_id = ? AND status = ? ORDER BY created_at ASC"
    ).bind(postId, status).all();

    // Build nested tree
    const comments = results ?? [];
    const map = new Map<string, any>();
    const roots: any[] = [];

    comments.forEach((comment: any) => {
      comment.replies = [];
      map.set(comment.id, comment);
    });

    comments.forEach((comment: any) => {
      if (comment.parent_id && map.has(comment.parent_id)) {
        map.get(comment.parent_id).replies.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return c.json({ comments: roots, total: comments.length });
  });

  // Create comment
  app.post("/", async (c) => {
    const db = c.env.DB;
    try {
      const body = await c.req.json();
      const parsed = CommentSchema.parse(body);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      await db.prepare(
        "INSERT INTO comments (id, post_id, parent_id, author_name, author_email, author_avatar, content, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)"
      ).bind(
        id, parsed.post_id, parsed.parent_id ?? null,
        parsed.author_name, parsed.author_email ?? null, parsed.author_avatar ?? null,
        parsed.content, now
      ).run();

      return c.json({
        id, ...parsed, status: "pending", created_at: now,
        message: "Comment submitted for moderation",
      }, 201);
    } catch (err: any) {
      if (err.name === "ZodError") {
        return c.json({ error: "Validation failed", details: err.errors }, 400);
      }
      return c.json({ error: err.message ?? "Failed to create comment" }, 500);
    }
  });

  // Moderate comment (approve/reject)
  app.patch("/:id/status", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const body = await c.req.json();
    const status = body.status as string;

    if (!["pending", "approved", "spam"].includes(status)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    await db.prepare(
      "UPDATE comments SET status = ? WHERE id = ?"
    ).bind(status, id).run();

    return c.json({ success: true, id, status });
  });

  // Delete comment
  app.delete("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    await db.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  });

  // Get comment count for a post
  app.get("/:postId/count", async (c) => {
    const db = c.env.DB;
    const postId = c.req.param("postId");
    const result = await db.prepare(
      "SELECT COUNT(*) as count FROM comments WHERE post_id = ? AND status = 'approved'"
    ).bind(postId).first<{ count: number }>();
    return c.json({ post_id: postId, count: result?.count ?? 0 });
  });

  return app;
}
