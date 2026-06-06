# Stripe Payments Module

Stripe checkout, subscriptions, and webhook handling.

## Usage
```bash
cp -r modules/payments-stripe/* ~/projects/<name>/modules/payments/
```

## What's Included
- `backend/src/routes/checkout.ts` — Checkout session creation
- `backend/src/routes/webhooks.ts` — Stripe webhook handler
- `frontend/components/PricingTable.tsx` — Pricing display
- `frontend/components/CheckoutButton.tsx` — Checkout trigger
- `database/schema.sql` — Subscriptions table

## Setup
1. Create Stripe account
2. Create products/prices in Stripe Dashboard
3. Set up webhook endpoint
4. Add secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID
