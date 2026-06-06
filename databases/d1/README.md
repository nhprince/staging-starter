# D1 Database Adapter

Cloudflare D1 (SQLite) database adapter for Hono Workers.

## Usage
```bash
cp databases/d1/schema.sql ~/projects/<name>/database/
# Apply: wrangler d1 execute <db-name> --file=./schema.sql
```

## What's Included
- `schema.sql` — Base schema (users, sessions, api_keys, content)
- `migrations/` — Migration pattern
- `seed.sql` — Seed data template
- `queries/` — Common query patterns

## D1 Query Patterns

```ts
// Select with filter
const { results } = await c.env.DB.prepare(
  "SELECT * FROM content WHERE status = ? ORDER BY created_at DESC LIMIT ?"
).bind('published', 10).all();

// Insert
await c.env.DB.prepare(
  "INSERT INTO content (id, slug, title, body, author_id) VALUES (?, ?, ?, ?, ?)"
).bind(id, slug, title, body, authorId).run();

// Update
await c.env.DB.prepare(
  "UPDATE content SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
).bind(title, body, id).run();

// Delete
await c.env.DB.prepare("DELETE FROM content WHERE id = ?").bind(id).run();
```

## Notes
- D1 is SQLite-compatible but has some limitations
- No `ALTER TABLE ADD COLUMN` with constraints
- Use `IF NOT EXISTS` for idempotent migrations
- Batch operations for better performance
