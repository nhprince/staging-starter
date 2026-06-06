# Next.js Frontend Blueprint

Next.js app optimized for Cloudflare Pages static export with Prince's dark theme.

## Usage
```bash
cp -r frontends/nextjs/* ~/projects/<name>/frontend/
```

## What's Included
- `next.config.ts` — Static export config
- `tailwind.config.ts` — Tailwind with Prince's color palette
- `postcss.config.js` — PostCSS config
- `tsconfig.json` — TypeScript config
- `src/app/layout.tsx` — Root layout with Inter font + dark theme
- `src/app/page.tsx` — Empty home page
- `src/app/globals.css` — Prince's dark theme CSS variables + glassmorphism
- `src/components/` — Reusable components (Button, Card, Nav, Footer, Badge, Modal, Input)
- `package.json` — Dependencies (Next.js, Tailwind, etc.)

## Prince's Theme (Pre-configured)
- Dark background: `#0a0a0f`
- Glassmorphism cards with `backdrop-blur`
- Gradient accents: indigo → purple
- Micro-animations: staggered entrance, hover +2px
- Responsive: mobile-first
