# 3D Experience Scaffold

## Usage
```bash
saturday new 3d-experience my-3d-site
```

## Structure
```
my-3d-site/
├── src/
│   ├── app/
│   │   └── page.tsx          → Main page with 3D canvas
│   └── components/
│       ├── Scene.tsx          → R3F Canvas wrapper (dynamic import, ssr:false)
│       ├── Model.tsx          → GLTF model loader
│       ├── Particles.tsx      → Particle system
│       └── PostFX.tsx         → Bloom + effects
├── public/models/             → GLTF/GLB files
├── public/textures/           → Texture maps
├── .github/workflows/
│   └── deploy.yml             → Cloudflare Pages
└── next.config.ts             → output: "export"
```

## Dependencies
```json
{
  "three": "^0.170.0",
  "@react-three/fiber": "^8.17.0",
  "@react-three/drei": "^9.114.0",
  "@react-three/postprocessing": "^2.16.0",
  "r3f-perf": "^7.2.0"
}
```

## Key Files

### Scene.tsx
```typescript
"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Model />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} />
      </Suspense>
    </Canvas>
  );
}
```

### page.tsx
```typescript
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="fixed inset-0">
      <Scene />
    </main>
  );
}
```

### next.config.ts
```typescript
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["three"],
};
export default nextConfig;
```

## Deployment
- Static export → Cloudflare Pages
- Models served from /public/models/
- Draco decoder from CDN
