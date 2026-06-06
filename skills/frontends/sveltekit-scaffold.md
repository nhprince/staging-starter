---
name: sveltekit-scaffold
description: "Scaffold a SvelteKit project with static adapter, Tailwind, and Prince's dark theme. Use when building interactive apps with Svelte."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [sveltekit, svelte, frontend, tailwind, scaffolding]
    related_skills: [frontend-design, fullstack-developer, scaffold-project]
---

# SvelteKit Scaffold — Interactive App Blueprint

## Overview

Creates a SvelteKit project with static export for Cloudflare Pages. Best for interactive apps where you want fine-grained reactivity without React's overhead.

## When to Use

- Prince wants a highly interactive app
- You want smaller bundle size than React
- Real-time features, animations, complex state
- **Don't use for:** content-heavy sites (use Astro instead)

## Scaffold Commands

```bash
# Create
pnpm create svelte@latest <project-name>
# Select: Skeleton project, TypeScript, ESLint, Prettier

# Add static adapter
cd <project-name>
pnpm add -D @sveltejs/adapter-static

# Add Tailwind
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Config

```ts
// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'out', assets: 'out', fallback: 'index.html' }),
  },
};
```

## Prince's Theme

```css
/* src/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0a0a0f;
  --bg-card: rgba(255, 255, 255, 0.05);
  --accent-indigo: #6366f1;
  --accent-purple: #a855f7;
}

body { background: var(--bg-primary); color: #f1f5f9; }
```

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── about/+page.svelte
├── lib/
│   ├── components/
│   │   ├── Hero.svelte
│   │   └── Card.svelte
│   └── stores/
│       └── theme.ts
└── app.css
```

## Verification Checklist

- [ ] `pnpm build` succeeds
- [ ] `out/` folder generated
- [ ] Dark theme applied
- [ ] Svelte reactivity working
- [ ] Responsive on mobile

## Agent Tip 🤖

> SvelteKit's static adapter outputs to `out/` by default. Make sure `kit.adapter.fallback` is set for SPA-style routing.
