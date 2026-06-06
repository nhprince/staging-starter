---
name: add-database
description: "Add a database to any project — D1, PostgreSQL, Supabase, or PlanetScale. Use when Prince says 'add database', 'store data', or 'I need persistence'. Covers schema design, migrations, and client setup."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [database, d1, postgresql, supabase, planetscale, sqlite, migrations, schema]
    related_skills: [database-design, fullstack-developer, configure-cloudflare, backend-design]
---

# Add Database — Database Adapter Module

## Overview

Adds database connectivity to any project. Four options: **D1** (Cloudflare SQLite, default), **PostgreSQL** (VPS), **Supabase** (managed Postgres), **PlanetScale** (managed MySQL). All have generous free tiers.

## When to Use

- Prince says "add database" or "store data" or "I need persistence"
- Building any app that needs to save user data, posts, orders, etc.
- Adding database to an existing project
- **Don't use for:** static sites with no data needs

## Database Selection

| Database | Best For | Free Tier | Driver |
|----------|----------|-----------|--------|
| **D1** (SQLite) | CF Workers, edge, simple apps | 5GB, 5M reads/day | Built-in binding |
| **PostgreSQL** (VPS) | Complex queries, full control | Unlimited (on server) | pg, drizzle-orm |
| **Supabase** | Managed Postgres, real-time, auth | 500MB, 2GB bandwidth | @supabase/supabase-js |
| **PlanetScale** | Managed MySQL, branching | 5GB, 1B row reads/month | @planetscale/database |

## D1 Setup (Default for CF Workers)

### 1. Schema

```sql
-- schema.sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 2. Apply

```bash
wrangler d1 execute <project>-db --file=./schema.sql
```

### 3. Query in Worker

```ts
// In Hono handler
app.get("/api/posts", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM posts WHERE published = ? ORDER BY created_at DESC"
  ).bind(true).all();
  return c.json(results);
});
```

## PostgreSQL Setup (VPS)

### 1. Install on server

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
CREATE DATABASE <project>;
CREATE USER <user> WITH PASSWORD '<password>';
GRANT ALL PRIVILEGES ON DATABASE <project> TO <user>;
```

### 2. Connection

```ts
// Using Drizzle ORM
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);
```

## Supabase Setup

### 1. Client

```bash
pnpm add @supabase/supabase-js
```

### 2. Init

```ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
```

## Common Pitfalls

1. **D1 is SQLite** — No `ALTER TABLE ADD COLUMN` with constraints. Use simple types.
2. **Forgetting migrations** — D1 doesn't auto-create tables from schema in code.
3. **Connection pooling** — For Postgres, always use a pool (PgBouncer for production).
4. **Not using prepared statements** — Always bind values, never interpolate.

## Verification Checklist

- [ ] Database created (D1/Postgres/Supabase/PlanetScale)
- [ ] Schema/tables created
- [ ] Connection string or binding configured
- [ ] Test query works (SELECT 1 or health check)
- [ ] Migrations are idempotent (can run multiple times)

## Agent Tip 🤖

> Default to **D1** for Cloudflare Workers projects (zero config, edge-located).
> Use **Postgres on VPS** for complex relational data or when Workers isn't enough.
> Use **Supabase** when you need real-time subscriptions or built-in auth.
