# Blog Scaffold

Complete blog engine with MDX content, admin panel, RSS feed, SEO, and Prince's dark theme.

## Stack
- **Frontend:** Next.js (static export) → Cloudflare Pages
- **Backend:** Hono → Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Auth:** Clerk (admin only)

## Features
- MDX blog posts with syntax highlighting
- Admin panel for writing/editing posts
- RSS feed (`/rss.xml`)
- Sitemap (`/sitemap.xml`)
- SEO meta tags + OpenGraph
- Reading time estimation
- Categories and tags
- Full-text search
- Dark theme + glassmorphism

## Usage
```bash
cp -r scaffolds/blog/* ~/projects/my-blog/
# Then configure wrangler.toml with your KV/D1 IDs
```

## File Structure
```
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Home with post listing
│   │   ├── blog/[slug].tsx   # Single post
│   │   ├── admin/            # Admin panel (protected)
│   │   ├── rss.xml/route.ts  # RSS feed
│   │   └── sitemap.ts        # Sitemap
│   └── components/
│       ├── PostCard.tsx
│       ├── MDXRenderer.tsx
│       └── AdminEditor.tsx
├── backend/
│   ├── src/index.ts          # Hono API
│   ├── schema.sql            # D1 schema
│   └── wrangler.toml
└── database/
    └── schema.sql
```
