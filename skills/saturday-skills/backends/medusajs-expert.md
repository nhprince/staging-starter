# Medusa.js Expert SKILL

## When to Use This Skill
Use when building e-commerce backends with Medusa.js v2, especially on resource-constrained VPS.

## Core Knowledge

### VPS Installation (Memory-Limited)
```bash
# Create project
npx create-medusa-app@latest my-store --seed

# PM2 ecosystem.config.js
module.exports = {
  apps: [{
    name: "medusa",
    script: "node_modules/.bin/medusa",
    args: "start",
    max_memory_restart: "380M",
    node_args: "--max-old-space-size=350",
    env: {
      DATABASE_URL: process.env.SUPABASE_URL,
      REDIS_URL: process.env.UPSTASH_REDIS_URL,
      NODE_ENV: "production"
    }
  }]
};
```

### Database: Supabase (Not Self-Hosted)
```env
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```
- Free tier: 500MB Postgres
- Don't self-host Postgres on 842MB VPS

### Cache: Upstash Redis (Not Self-Hosted)
```env
REDIS_URL=redis://default:[password]@[host]:6379
```
- Free tier: 10k commands/day

### Custom Routes
```typescript
// src/api/store/custom/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({ message: "Custom endpoint" });
}
```

### Custom Modules
```typescript
// src/modules/custom/service.ts
import { MedusaService } from "@medusajs/framework/utils";

class CustomService extends MedusaService({}) {
  // Custom business logic
}

export default CustomService;
```

### Storefront API Integration
```typescript
// lib/medusa.ts
import { createMedusaClient } from "@medusajs/js-sdk";

export const medusa = createMedusaClient({
  baseUrl: process.env.MEDUSA_URL!,
  apiKey: process.env.MEDUSA_API_KEY!,
});

// Fetch products
const { products } = await medusa.store.product.list({
  limit: 12,
  offset: 0,
});
```

### Product + Variant Modeling
```typescript
// Custom product fields via metadata
const product = await medusa.admin.product.create({
  title: "Custom T-Shard",
  options: [
    { title: "Size", values: ["S", "M", "L", "XL"] },
    { title: "Color", values: ["Black", "White"] },
  ],
  variants: [
    {
      title: "S / Black",
      prices: [{ amount: 2999, currency_code: "usd" }],
      options: [{ value: "S" }, { value: "Black" }],
    },
  ],
  metadata: { design_payload: JSON.stringify(designData) },
});
```

### Order Metadata for Design Payloads
```typescript
// Attach design data to order
await medusa.admin.order.update(orderId, {
  metadata: {
    design_data: JSON.stringify(fabricJsPayload),
    design_preview_url: previewUrl,
  },
});
```

## Common Pitfalls
1. **Memory limits** — Medusa can spike to 500MB+ during startup; PM2 restart at 380M
2. **No self-hosted DB** — Always use Supabase/Upstash on this VPS
3. **Cold starts** — First request after restart is slow; use PM2 cluster mode if needed
4. **Module compilation** — Run `pnpm build` after adding custom modules

## Verification Checklist
- [ ] `medusa start` runs without OOM kills
- [ ] Database migrations applied successfully
- [ ] Storefront API returns products
- [ ] Admin panel accessible
- [ ] PM2 shows process as "online"
