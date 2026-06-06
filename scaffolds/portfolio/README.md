# Portfolio Scaffold

Developer portfolio with projects gallery, about, contact form, and optional blog.

## Stack
- **Frontend:** Next.js (static export) → Cloudflare Pages
- **Backend:** Hono → Cloudflare Workers (contact form API only)
- **Database:** Cloudflare D1 (SQLite) — projects + messages
- **Auth:** None (static site, optional admin for projects)

## Features
- Hero section with name, title, tagline
- About section with bio, skills, timeline
- Projects gallery with images, tags, links
- Contact form with D1 storage
- Optional blog section (from blog scaffold)
- GitHub API integration for repos
- SEO optimized
- Dark theme + glassmorphism

## Usage
```bash
cp -r scaffolds/portfolio/* ~/projects/my-portfolio/
```

## File Structure
```
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Home (hero + projects + contact)
│   │   ├── about/page.tsx        # About page
│   │   └── projects/[slug].tsx   # Project detail
│   └── components/
│       ├── Hero.tsx
│       ├── ProjectCard.tsx
│       ├── AboutSection.tsx
│       └── ContactForm.tsx
├── backend/
│   ├── src/index.ts              # Contact form API
│   ├── schema.sql
│   └── wrangler.toml
└── database/
    └── schema.sql
```
