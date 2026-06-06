---
name: email-service
description: "Add transactional email — Resend, Mailgun, or Cloudflare Email. Use when Prince says 'send emails', 'notifications', or 'transactional email'. All have free tiers."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [email, resend, mailgun, cloudflare-email, transactional, notifications]
    related_skills: [cloudflare-email-service, backend-design, fullstack-developer]
---

# Email Service Module

## Overview

Adds transactional email to any project. Three options: **Resend** (modern, developer-friendly), **Mailgun** (reliable, generous free tier), **Cloudflare Email** (Workers-native).

## When to Use

- Prince says "send emails" or "email notifications"
- Welcome emails, password resets, order confirmations
- **Don't use for:** marketing campaigns (use Mailchimp free tier)

## Provider Selection

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **Resend** | 3,000 emails/mo | Modern API, React Email |
| **Mailgun** | 5,000 emails/mo (3 months) | Reliable, established |
| **Cloudflare Email** | 100 emails/day (via Workers) | Workers-native, no external dep |

## Resend Setup (Recommended)

### 1. Install

```bash
pnpm add resend
```

### 2. Send Email

```ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: user.email,
  subject: 'Welcome!',
  html: '<h1>Welcome to our platform!</h1>',
});
```

## Cloudflare Email (Workers)

```ts
// In Worker
app.post('/api/send-email', async (c) => {
  // Use Cloudflare Email Binding or fetch to Mailgun/Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@yourdomain.com',
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hello!</p>',
    }),
  });
  return c.json({ success: res.ok });
});
```

## Common Pitfalls

1. **Not verifying domain** — All providers require domain verification (DNS records)
2. **Missing from address** — Must use verified domain
3. **Rate limits** — Respect provider limits (Resend: 10/sec)

## Verification Checklist

- [ ] API key configured
- [ ] Domain verified (DNS records added)
- [ ] Test email sends successfully
- [ ] Email received in inbox (check spam)

## Agent Tip 🤖

> Default to **Resend** for new projects — clean API, great docs, React Email support.
> Use **Cloudflare Email** only if you want zero external dependencies.
