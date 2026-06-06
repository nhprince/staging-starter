# SvelteKit Frontend Blueprint

SvelteKit project with static adapter for Cloudflare Pages and Prince's dark theme.

## Usage
```bash
cp -r frontends/sveltekit/* ~/projects/<name>/frontend/
cd frontend && pnpm install
```

## What's Included
- `package.json` — SvelteKit + static adapter + Tailwind
- `svelte.config.js` — Static adapter config
- `tailwind.config.js` — Tailwind with Prince's colors
- `vite.config.ts` — Vite config
- `src/routes/+layout.svelte` — Root layout
- `src/routes/+page.svelte` — Home page
- `src/app.css` — Prince's dark theme CSS
- `src/lib/components/` — Hero, Card, Nav, Footer components
