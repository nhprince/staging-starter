# Astro Frontend Blueprint

Astro project optimized for Cloudflare Pages static export with Prince's dark theme.

## Usage
```bash
cp -r frontends/astro/* ~/projects/<name>/frontend/
cd frontend && pnpm install
```

## What's Included
- `package.json` — Astro + Cloudflare adapter + Tailwind
- `astro.config.mjs` — Static export config
- `tailwind.config.mjs` — Tailwind with Prince's colors
- `tsconfig.json` — TypeScript config
- `src/layouts/Base.astro` — Base layout with dark theme
- `src/pages/index.astro` — Home page
- `src/styles/global.css` — Prince's dark theme CSS
- `src/components/` — Hero, Card, Nav, Footer components

## Prince's Theme (Pre-configured)
- Dark background: `#0a0a0f`
- Glassmorphism cards with `backdrop-blur`
- Gradient accents: indigo → purple
- Micro-animations via CSS
- Responsive: mobile-first
