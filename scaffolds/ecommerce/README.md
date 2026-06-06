# E-Commerce Scaffold

Online store with product catalog, cart, Stripe checkout, and order management.

## Stack
- **Frontend:** Next.js → Cloudflare Pages
- **Backend:** Hono → Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Payments:** Stripe Checkout

## Features
- Product catalog with categories
- Product detail pages
- Shopping cart (localStorage + API)
- Stripe checkout session
- Order management
- Inventory tracking
- Order confirmation emails
- Webhook handler for Stripe events
- Dark theme + glassmorphism

## Usage
```bash
cp -r scaffolds/ecommerce/* ~/projects/my-store/
# Configure: Stripe keys, KV/D1 IDs
```

## File Structure
```
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Home / product listing
│   │   ├── products/[slug].tsx   # Product detail
│   │   ├── cart/page.tsx         # Cart page
│   │   ├── checkout/page.tsx     # Checkout (redirect to Stripe)
│   │   ├── orders/page.tsx       # Order history (protected)
│   │   └── success/page.tsx      # Post-checkout success
│   └── components/
│       ├── ProductCard.tsx
│       ├── CartItem.tsx
│       └── OrderSummary.tsx
├── backend/
│   ├── src/index.ts
│   ├── schema.sql
│   └── wrangler.toml
└── database/
    └── schema.sql
```

## Required Secrets
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
