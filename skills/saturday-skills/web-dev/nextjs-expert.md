# Next.js Expert SKILL

## When to Use This Skill
Use when building, debugging, or optimizing Next.js applications (v14+ with App Router).

## Core Knowledge

### App Router Architecture
- `app/` directory with layout/page/template/loading/error/not-found conventions
- Server Components (default) vs Client Components (`"use client"`)
- Server Actions for form handling and mutations
- Parallel routes, intercepting routes, route groups

### Static Export for Cloudflare Pages
```typescript
// next.config.ts
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
```

### Data Fetching
- Server Components: async/await directly in component
- `fetch()` with `cache: "force-cache"` (static) or `cache: "no-store"` (dynamic)
- `generateStaticParams()` for dynamic routes at build time
- ISR not available with static export — use client-side fetching for dynamic data

### Metadata API
```typescript
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
  openGraph: { title: "OG Title", images: ["/og.png"] },
};
```

### Image Optimization
- With static export: `unoptimized: true` in config
- Use regular `<img>` tags or `@next/image` with loader
- For external images: add domains to `next.config.ts`

### Common Gotchas
1. **Hydration mismatch** — Don't use `window`/`document` in Server Components
2. **Client/Server boundary** — Pass serializable props only (no functions, classes)
3. **Environment variables** — `NEXT_PUBLIC_` prefix for client-side, plain for server-only
4. **Dynamic routes** — Must use `generateStaticParams()` for static export
5. **API routes** — Not available with static export; use Cloudflare Workers instead

## Code Templates

### Page with Data Fetching
```typescript
// app/products/[slug]/page.tsx
export async function generateStaticParams() {
  const products = await fetch(`${process.env.API_URL}/products`).then(r => r.json());
  return products.map((p: Product) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetch(`${process.env.API_URL}/products/${params.slug}`).then(r => r.json());
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
```

### Client Component with State
```typescript
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```

## Verification Checklist
- [ ] `next build` completes without errors
- [ ] Static HTML generated in `out/` directory
- [ ] No server-only code in client components
- [ ] All dynamic routes have `generateStaticParams()`
- [ ] Images work with `unoptimized: true`
