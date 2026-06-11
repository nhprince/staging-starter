# React Three Fiber (R3F) Expert SKILL

## When to Use This Skill
Use when building 3D web experiences with React Three Fiber in Next.js.

## Core Knowledge

### Canvas Setup in Next.js
```typescript
// components/Scene.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Model />
      </Suspense>
    </Canvas>
  );
}

// app/page.tsx — Dynamic import to avoid SSR
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });
```

### @react-three/drei Essential Components
```typescript
import {
  OrbitControls, Environment, ContactShadows,
  Text, Html, Billboard,
  useGLTF, useTexture, useProgress,
  Float, MeshDistortMaterial, MeshWobbleMaterial,
} from "@react-three/drei";

// GLTF Model
function Model() {
  const { scene } = useGLTF("/models/scene.gltf");
  return <primitive object={scene} />;
}
useGLTF.preload("/models/scene.gltf");

// Floating animation
<Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
  <mesh><sphereGeometry /><meshStandardMaterial color="purple" /></mesh>
</Float>

// Distort material
<MeshDistortMaterial color="#8b5cf6" speed={2} distort={0.3} />

// HTML in 3D space
<Html center>
  <div className="bg-white/10 backdrop-blur px-4 py-2 rounded">Label</div>
</Html>
```

### @react-three/postprocessing
```typescript
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Noise } from "@react-three/postprocessing";

<EffectComposer>
  <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
  <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
  <ChromaticAberration offset={[0.002, 0.002]} />
  <Noise opacity={0.02} />
</EffectComposer>
```

### Scroll-Driven Animations
```typescript
import { useScroll, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function ScrollModel() {
  const mesh = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y = scroll.offset * Math.PI * 2;
      mesh.current.position.y = -scroll.offset * 5;
    }
  });
  
  return <mesh ref={mesh}><boxGeometry /><meshStandardMaterial /></mesh>;
}
```

### Performance
```typescript
import { Perf } from "r3f-perf";

// Add to Canvas for dev monitoring
<Canvas>
  <Perf position="top-left" />
  {/* ... */}
</Canvas>

// BVH for fast raycasting
import { Bvh } from "@react-three/drei";
<Bvh firstHitOnly>
  <mesh>...</mesh>
</Bvh>
```

## Common Pitfalls
1. **SSR issues** — Always use `dynamic(() => import(...), { ssr: false })`
2. **Memory leaks** — Dispose of geometries/textures on unmount
3. **Too many effects** — Postprocessing is expensive; use sparingly
4. **No Suspense** — Wrap async components in Suspense

## Verification Checklist
- [ ] Canvas renders without SSR errors
- [ ] Models load correctly
- [ ] Scroll animations smooth
- [ ] 60fps on target devices
- [ ] Postprocessing effects work
