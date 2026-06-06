---
name: stripe-payments
description: "Add Stripe payments — checkout, subscriptions, webhooks. Use when Prince says 'add payments', 'accept cards', or 'subscriptions'. Free to set up, Stripe takes 2.9% + 30¢ per transaction."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [stripe, payments, checkout, subscriptions, billing, ecommerce]
    related_skills: [backend-design, fullstack-developer, add-database]
---

# Stripe Payments Module

## Overview

Adds Stripe payment processing to any project. Supports one-time checkout, subscriptions, and webhook handling. Works with both Next.js frontend and Hono/CF Workers backend.

## When to Use

- Prince says "add payments" or "accept cards"
- Building e-commerce or SaaS
- Subscription/membership features
- **Don't use for:** free projects (Stripe takes 2.9% + 30¢)

## Setup

### 1. Install

```bash
pnpm add stripe @stripe/stripe-js
```

### 2. Backend (Hono Worker)

```ts
import Stripe from 'stripe';
const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

// Create checkout session
app.post('/api/checkout', async (c) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription', // or 'payment' for one-time
    line_items: [{ price: c.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${c.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${c.env.FRONTEND_URL}/pricing`,
  });
  return c.json({ url: session.url });
});

// Webhook handler
app.post('/api/webhooks/stripe', async (c) => {
  const body = await c.req.text();
  const sig = c.req.header('stripe-signature')!;
  const event = stripe.webhooks.constructEvent(body, sig, c.env.STRIPE_WEBHOOK_SECRET);
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Fulfill order
      break;
    case 'customer.subscription.updated':
      // Update subscription status
      break;
  }
  return c.json({ received: true });
});
```

### 3. Frontend (Next.js)

```tsx
// Pricing page
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

async function handleSubscribe() {
  const res = await fetch('/api/checkout', { method: 'POST' });
  const { url } = await res.json();
  window.location.href = url; // Redirect to Stripe Checkout
}
```

## Secrets Required

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_KEY=pk_live_...
```

## Common Pitfalls

1. **Webhook signature verification** — Always verify, never trust raw body
2. **Not handling async events** — Webhooks can arrive out of order
3. **Mixing test/live keys** — Use `.env.local` for test, secrets for live

## Verification Checklist

- [ ] Stripe account created
- [ ] Products/prices configured in Stripe Dashboard
- [ ] Checkout session creates successfully
- [ ] Webhook endpoint receives events
- [ ] Success/cancel URLs work

## Agent Tip 🤖

> Use Stripe Checkout (hosted page) for fastest setup — no custom payment forms needed.
> For embedded forms, use Stripe Elements.
