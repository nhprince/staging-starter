---
name: build-portfolio
description: "Build a developer portfolio with projects gallery, about, contact form, and blog section. Use when Prince says 'build a portfolio' or 'create my personal site'. Static Next.js + Hono contact API."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [portfolio, personal-site, projects, contact, static]
    related_skills: [scaffold-project, frontend-design, fullstack-developer, build-blog]
---

# Build Portfolio — Developer Portfolio

## Overview

Builds a stunning developer portfolio with projects gallery, about section, contact form, and optional blog. Static Next.js export + Hono contact API.

## When to Use

- Prince says "build a portfolio" or "create my personal site"
- Showcasing projects and skills
- **Don't use for:** SaaS or apps with user accounts

## Page Sections

1. **Hero** — Name, title, tagline, CTA buttons
2. **About** — Bio, skills, experience timeline
3. **Projects** — Card grid with images, tags, links
4. **Blog** — Optional recent posts (from build-blog)
5. **Contact** — Form with name, email, message
6. **Footer** — Social links, copyright

## Database Schema

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  tags TEXT,  -- JSON array
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## GitHub Integration

```ts
// Fetch GitHub repos for projects section
async function getGitHubRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
  return res.json();
}
```

## Verification Checklist

- [ ] Hero section with name and tagline
- [ ] Projects grid with images and links
- [ ] About section with skills
- [ ] Contact form submits to API
- [ ] GitHub repos display (optional)
- [ ] Dark theme + glassmorphism
- [ ] Responsive on mobile

## Agent Tip 🤖

> Use `next/image` for project screenshots — auto-optimization.
> Add a "Featured" flag to projects to control which appear first.
