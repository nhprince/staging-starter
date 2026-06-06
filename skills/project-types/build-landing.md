---
name: build-landing
description: "Build a high-converting landing page with hero, features, pricing, FAQ, and lead capture. Use when Prince says 'build a landing page' or 'create a marketing site'. Static Next.js + Hono lead API."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [landing-page, marketing, lead-capture, seo, static]
    related_skills: [scaffold-project, frontend-design, fullstack-developer]
---

# Build Landing Page — Marketing Site

## Overview

Builds a high-converting landing page with all standard sections: hero, features, pricing, FAQ, testimonials, CTA, and lead capture form. Static Next.js export + Hono lead API.

## When to Use

- Prince says "build a landing page" or "create a marketing site"
- Product launch page
- Portfolio splash page
- **Don't use for:** apps with user accounts (use SaaS scaffold)

## Page Sections (Top to Bottom)

1. **Nav** — Logo, links, CTA button (sticky, glassmorphism)
2. **Hero** — Headline, subheadline, CTA buttons, hero image/illustration
3. **Logos** — Trusted by / As seen in
4. **Features** — 3-6 feature cards with icons
5. **How It Works** — 3-step process
6. **Pricing** — Free/Pro/Enterprise cards (if applicable)
7. **Testimonials** — Customer quotes with avatars
8. **FAQ** — Accordion-style questions
9. **CTA** — Final call-to-action section
10. **Footer** — Links, social, copyright

## Lead Capture

```ts
// Backend: POST /api/leads
app.post('/api/leads', async (c) => {
  const { email, name } = await c.req.json();
  await c.env.DB.prepare(
    'INSERT INTO leads (email, name) VALUES (?, ?)'
  ).bind(email, name).run();
  return c.json({ success: true });
});
```

```tsx
// Frontend: Lead form
function LeadForm() {
  const [email, setEmail] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    alert('Thanks! We\'ll be in touch.');
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
      <button type="submit">Get Early Access</button>
    </form>
  );
}
```

## SEO Essentials

```tsx
// app/layout.tsx
export const metadata = {
  title: 'Your Product — Tagline Here',
  description: 'Compelling description for search engines',
  openGraph: { images: ['/og-image.png'] },
};
```

## Verification Checklist

- [ ] All sections render correctly
- [ ] Lead capture form submits to API
- [ ] Mobile responsive (test on 3 screen sizes)
- [ ] Page load < 3s (Lighthouse)
- [ ] SEO meta tags present
- [ ] Dark theme + glassmorphism
- [ ] Smooth scroll between sections

## Agent Tip 🤖

> Landing pages should load FAST. Use `next/image` for optimized images.
> Keep the hero above the fold — no scrolling needed to see the CTA.
