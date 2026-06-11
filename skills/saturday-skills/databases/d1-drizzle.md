# D1 + Drizzle ORM SKILL

## When to Use This Skill
Use when building edge-native applications with Cloudflare D1 and Drizzle ORM.

## Core Knowledge

### Drizzle Schema Definition
```typescript
// db/schema.ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // cents
  description: text("description"),
});
```

### Migrations Workflow
```bash
# Generate migration
npx drizzle-kit generate

# Apply locally
npx drizzle-kit push

# Apply to remote D1
npx drizzle-kit push --remote

# Wrangler D1 commands
wrangler d1 execute DB --local --file=./migrations/0001.sql
wrangler d1 execute DB --remote --file=./migrations/0001.sql
```

### Query Patterns
```typescript
import { drizzle } from "drizzle-orm/d1";
import { eq, and, like, desc } from "drizzle-orm";

export function getDB(env: Env) {
  return drizzle(env.DB);
}

// Select with join
const results = await db
  .select()
  .from(orders)
  .leftJoin(users, eq(orders.userId, users.id))
  .where(eq(orders.status, "pending"))
  .orderBy(desc(orders.createdAt))
  .limit(20);

// Insert
await db.insert(users).values({
  name: "John",
  email: "john@example.com",
});

// Update
await db.update(products)
  .set({ price: 2999 })
  .where(eq(products.id, productId));

// Delete
await db.delete(users).where(eq(users.id, userId));
```

### Limitations vs Full Postgres
- No full-text search (use LIKE or external service)
- No pgvector (no vector similarity search)
- No triggers or stored procedures
- No foreign key enforcement (D1 doesn't enforce FK constraints)
- Max 5GB storage (free tier)
- 5M reads/day (free tier)

## Common Pitfalls
1. **No FK enforcement** — Validate relationships in application code
2. **SQLite syntax** — Some PostgreSQL features not available
3. **Migration conflicts** — Always generate migrations, don't edit manually
4. **Remote vs local** — Test locally first, then push to remote

## Verification Checklist
- [ ] Schema defined with Drizzle
- [ ] Migrations generated and applied
- [ ] CRUD operations working
- [ ] Remote D1 database synced
