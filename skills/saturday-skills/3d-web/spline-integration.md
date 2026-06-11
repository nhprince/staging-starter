# Spline Integration SKILL

## When to Use This Skill
Use when integrating Spline 3D scenes into Next.js applications.

## Core Knowledge

### Embed from Spline
```typescript
// components/SplineScene.tsx
"use client";
import Spline from "@splinetool/react-spline";
import dynamic from "next/dynamic";

export function SplineScene({ sceneUrl }: { sceneUrl: string }) {
  return <Spline scene={sceneUrl} />;
}

// Usage with dynamic import (no SSR)
const SplineScene = dynamic(() => import("./SplineScene"), { ssr: false });
```

### Event Handling
```typescript
<Spline
  scene="https://prod.spline.design/xxx/scene.splinecode"
  onMouseDown={(e) => console.log("Clicked:", e.target.name)}
  onMouseHover={(e) => console.log("Hovered:", e.target.name)}
  onLoad={(spline) => {
    const obj = spline.findObjectByName("Cube");
    obj.position.x = 100;
  }}
/>
```

### Performance Considerations
- Spline embeds are heavy (2-5MB+ per scene)
- Use `loading="lazy"` for below-the-fold scenes
- Consider static export fallback for SEO
- Free tier: 3 scenes, public only

## Common Pitfalls
1. **SSR issues** — Always use dynamic import with ssr: false
2. **Large bundle** — Spline scenes are heavy; lazy load
3. **Free tier limits** — 3 scenes max on free plan

## Verification Checklist
- [ ] Scene loads without SSR errors
- [ ] Events fire correctly
- [ ] Performance acceptable (lazy load if needed)
