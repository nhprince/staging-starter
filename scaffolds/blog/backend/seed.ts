# Saturday Blog — Seed Data
# Run: cd backend && npx tsx seed.ts

import { readFileSync } from "fs";
import { resolve } from "path";

const DB_PATH = resolve(".wrangler/state/v3/d1/miniflare-D1DatabaseObject");

async function seed() {
  const { createClient } = await import("better-sqlite3");
  const db = createClient(`${DB_PATH}/db.sqlite`);

  // Create tables
  db.exec(readFileSync(resolve("../schema.sql"), "utf-8"));

  // Seed posts
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  const insertPost = db.prepare(`
    INSERT OR IGNORE INTO posts (id, slug, title, excerpt, content, published, author_id, published_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 1, 'author-1', ?, ?, ?)
  `);

  insertPost.run(
    "post-1",
    "welcome-to-saturday",
    "Welcome to Saturday Framework",
    "Saturday is a full-stack web development framework that lets you scaffold, build, and deploy projects on 100% free Cloudflare infrastructure.",
    `# Welcome to Saturday Framework

Saturday is a **full-stack web development framework** that lets you scaffold, build, and deploy projects on 100% free Cloudflare infrastructure.

## What You Get

- **Frontend**: Next.js, Astro, or SvelteKit — your choice
- **Backend**: Hono on Cloudflare Workers — fast, lightweight, edge-deployed
- **Database**: Cloudflare D1 (SQLite) — serverless, zero-config
- **Storage**: Cloudflare KV + R2 — key-value and object storage
- **Deployment**: Cloudflare Pages + Workers — automatic via GitHub Actions

## Quick Start

\`\`\`bash
# Scaffold a new blog
saturday new blog my-blog

# Deploy
cd my-blog && saturday deploy
\`\`\`

## Why Saturday?

1. **100% Free** — Cloudflare's free tier is generous
2. **Edge-First** — Your app runs at 300+ locations worldwide
3. **Agent-Driven** — Built for AI agents to scaffold and deploy
4. **Dark Theme** — Every scaffold starts with a beautiful dark UI

Happy building! 🚀`,
    yesterday,
    yesterday,
    now
  );

  insertPost.run(
    "post-2",
    "building-with-cloudflare-workers",
    "Building with Cloudflare Workers",
    "Learn how to build serverless APIs with Hono on Cloudflare Workers — fast, lightweight, and edge-deployed.",
    `# Building with Cloudflare Workers

Cloudflare Workers lets you run serverless code at the edge — close to your users, everywhere.

## Why Hono?

**Hono** is a lightweight web framework designed for edge runtimes:

- **Fast**: Built for Workers, Deno, Bun, and Node.js
- **Small**: Zero dependencies, ~4KB
- **TypeScript-first**: Full type safety out of the box

## Example API

\`\`\`typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from the edge!' });
});

export default app;
\`\`\`

## D1 Database

Pair Workers with **D1** for a complete serverless stack:

\`\`\`typescript
app.get('/api/posts', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM posts WHERE published = 1')
    .all();
  return c.json({ posts: results });
});
\`\`\`

That's it — a full API with database, running at the edge.`,
    now,
    now,
    now
  );

  insertPost.run(
    "post-3",
    "dark-theme-design-system",
    "Saturday's Dark Theme Design System",
    "Every Saturday scaffold starts with a polished dark theme — glassmorphism, gradient accents, and micro-animations.",
    `# Saturday's Dark Theme Design System

Every Saturday scaffold starts with a **polished dark theme** that looks professional out of the box.

## Design Tokens

\`\`\`css
:root {
  --bg-primary: #0a0a0f;
  --bg-card: rgba(18, 18, 26, 0.7);
  --accent-indigo: #6366f1;
  --accent-purple: #8b5cf6;
  --border-subtle: rgba(255, 255, 255, 0.06);
}
\`\`\`

## Glassmorphism Cards

\`\`\`css
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  backdrop-filter: blur(12px);
}
\`\`\`

## Micro-Animations

- **Hover lift**: Cards rise 2px on hover
- **Staggered entrance**: Items fade in sequentially
- **Glow on hover**: Indigo glow effect on interactive elements

## Gradient Accents

The signature gradient: **indigo → purple**

\`\`\`css
--gradient-main: linear-gradient(135deg, #6366f1, #8b5cf6);
\`\`\`

Every scaffold uses these tokens for a consistent, beautiful UI.`,
    now,
    now,
    now
  );

  console.log("✅ Database seeded with 3 blog posts");
  db.close();
}

seed().catch(console.error);
