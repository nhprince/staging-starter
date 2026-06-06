---
name: build-ecommerce
description: "Build an e-commerce store with product catalog, cart, checkout, and order management. Use when Prince says 'build a store' or 'create e-commerce'. Next.js + Hono + D1 + Stripe."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [ecommerce, store, shop, cart, checkout, stripe, products]
    related_skills: [scaffold-project, add-database, stripe-payments, frontend-design, fullstack-developer]
---

# Build E-Commerce — Online Store

## Overview

Builds a complete e-commerce store with product catalog, shopping cart, Stripe checkout, and order management. Stack: Next.js + Hono Workers + D1 + Stripe.

## When to Use

- Prince says "build a store" or "create e-commerce"
- Selling products or digital goods
- **Don't use for:** simple landing pages

## Architecture

```
Frontend                    Backend
├── /                       ├── /api/products
├── /products               ├── /api/cart
├── /products/[slug]        ├── /api/checkout (Stripe)
├── /cart                   ├── /api/orders
├── /checkout               ├── /api/webhooks/stripe
├── /orders                 └── /api/inventory
└── /account
```

## Database Schema

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  image_url TEXT,
  inventory INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  stripe_session_id TEXT,
  status TEXT DEFAULT 'pending', -- pending/paid/shipped/delivered
  total_cents INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  product_id TEXT,
  quantity INTEGER,
  price_cents INTEGER
);
```

## Cart (Client-Side)

```ts
// Using localStorage for guest cart, API for logged-in users
const cart = {
  items: [] as CartItem[],
  add(product: Product, qty = 1) { /* ... */ },
  remove(productId: string) { /* ... */ },
  total() { return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0); },
};
```

## Verification Checklist

- [ ] Product listing page
- [ ] Product detail page
- [ ] Add to cart works
- [ ] Cart page shows items
- [ ] Stripe checkout creates order
- [ ] Order confirmation page
- [ ] Webhook updates order status
- [ ] Dark theme throughout

## Agent Tip 🤖

> Store prices in cents (integers) to avoid floating-point issues.
> Use Stripe Checkout for fastest implementation — no custom payment form needed.
