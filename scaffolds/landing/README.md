# Landing Page Scaffold

High-converting landing page with hero, features, pricing, FAQ, and lead capture.

## Stack
- **Frontend:** Next.js (static export) → Cloudflare Pages
- **Backend:** Hono → Cloudflare Workers (lead API only)
- **Database:** Cloudflare D1 (SQLite) — leads table
- **Auth:** None (public site)

## Features
- Hero section with CTA
- Features grid
- How it works (3-step)
- Pricing table (optional)
- Testimonials
- FAQ accordion
- Final CTA section
- Lead capture form
- SEO optimized
- Dark theme + glassmorphism

## Usage
```bash
cp -r scaffolds/landing/* ~/projects/my-landing/
```

## File Structure
```
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Full landing page
│   │   └── api/leads/route.ts    # Lead capture API
│   └── components/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Pricing.tsx
│       ├── FAQ.tsx
│       ├── Testimonials.tsx
│       ├── CTA.tsx
│       └── LeadForm.tsx
├── backend/
│   ├── src/index.ts              # Lead API
│   ├── schema.sql
│   └── wrangler.toml
└── database/
    └── schema.sql
```
