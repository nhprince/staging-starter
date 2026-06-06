---
name: astro-scaffold
description: "Scaffold an Astro project with static export, Tailwind, and Prince's dark theme. Use when building content sites, blogs, or landing pages with Astro."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [astro, frontend, static-site, tailwind, scaffolding]
    related_skills: [frontend-design, fullstack-developer, scaffold-project]
---

# Astro Scaffold — Static Site Blueprint

## Overview

Creates an Astro project optimized for Cloudflare Pages static export. Best for content-heavy sites, blogs, and landing pages where you want faster builds than Next.js.

## When to Use

- Prince wants a blog or content site
- Build speed matters (Astro builds 3-5x faster than Next.js)
- You want islands architecture (selective JS hydration)
- **Don't use for:** highly interactive apps (use Next.js instead)

## Scaffold Commands

```bash
# Create
pnpm create astro@latest <project-name> -- --template minimal --typescript strict

# Add Tailwind
cd <project-name>
pnpm add -D @astrojs/tailwind tailwindcss
```

## Config

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [tailwind()],
});
```

## Prince's Theme Setup

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0a0a0f;
  --bg-card: rgba(255, 255, 255, 0.05);
  --accent-indigo: #6366f1;
  --accent-purple: #a855f7;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

## Project Structure

```
src/
├── layouts/
│   └── Base.astro        # Main layout with nav/footer
├── components/
│   ├── Hero.astro
│   ├── Card.astro        # Glassmorphism card
│   └── Nav.astro
├── pages/
│   ├── index.astro
│   └── blog/
│       └── [...slug].astro
└── styles/
    └── global.css
```

## Verification Checklist

- [ ] `pnpm build` succeeds
- [ ] `dist/` folder generated
- [ ] Dark theme applied
- [ ] Tailwind classes working
- [ ] Responsive on mobile

## Agent Tip 🤖

> Astro is perfect for Prince's blogs and content sites. Use `.astro` components for static content and `.tsx` only when you need React interactivity (islands).
