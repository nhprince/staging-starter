---
name: build-blog
description: "Build a complete blog with MDX content, admin panel, RSS, SEO, and dark theme. Use when Prince says 'build me a blog' or 'create a blog'. Full-stack with Next.js + Hono + D1."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [blog, mdx, content, rss, seo, nextjs, hono, d1]
    related_skills: [scaffold-project, add-auth, add-database, frontend-design, fullstack-developer]
---

# Build Blog — Complete Blog Engine

## Overview

Builds a full-featured blog with MDX content, admin panel, RSS feed, SEO optimization, and Prince's dark theme. Stack: Next.js frontend + Hono Workers backend + D1 database.

## When to Use

- Prince says "build me a blog" or "create a blog"
- Content-driven site with posts, categories, tags
- **Don't use for:** simple landing pages (use landing scaffold)

## Architecture

```
Frontend (Next.js)          Backend (Hono + D1)
├── /                       ├── /api/health
├── /blog                   ├── /api/posts (CRUD)
├── /blog/[slug]            ├── /api/categories
├── /admin                  ├── /api/tags
│   ├── /posts              └── /api/auth/*
│   └── /settings
├── /rss.xml
└── /sitemap.xml
```

## Database Schema

```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,          -- MDX content
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  author_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id TEXT,
  tag_id TEXT,
  PRIMARY KEY (post_id, tag_id)
);
```

## Key Features

1. **MDX Content** — Write posts in Markdown with JSX components
2. **Admin Panel** — `/admin` with post editor (protected by auth)
3. **RSS Feed** — `/rss.xml` auto-generated from published posts
4. **Sitemap** — `/sitemap.xml` for SEO
5. **Reading Time** — Auto-calculated from content
6. **Search** — Full-text search via D1
7. **Dark Theme** — Prince's standard dark + glassmorphism

## Workflow

1. Scaffold with `scaffold-project --type blog`
2. Apply database schema
3. Build frontend pages (listing, single post, admin)
4. Build backend API (CRUD, auth)
5. Add RSS + sitemap generation
6. Deploy and verify

## Verification Checklist

- [ ] Homepage shows published posts
- [ ] Single post page renders MDX
- ] Admin panel accessible after login
- [ ] Create/edit/delete posts works
- [ ] RSS feed at /rss.xml
- [ ] Sitemap at /sitemap.xml
- [ ] Dark theme applied
- ] Responsive on mobile

## Agent Tip 🤖

> Use `next-mdx-remote` or `@next/mdx` for MDX rendering.
> For the admin editor, use a simple textarea with MDX preview.
