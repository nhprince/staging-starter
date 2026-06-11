# Three.js Expert SKILL

## When to Use This Skill
Use when building 3D web experiences with Three.js (vanilla, not React).

## Core Knowledge

### Scene Setup
```typescript
import * as THREE from "three";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

// Camera
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

### Lighting Rigs
```typescript
// Ambient light (soft fill)
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Directional light (sun-like)
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 5, 5);
scene.add(directional);

// Point light (localized)
const point = new THREE.PointLight(0x6366f1, 2, 100);
point.position.set(0, 2, 0);
scene.add(point);
```

### Materials
```typescript
// Standard material (PBR)
const standard = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  roughness: 0.4,
  metalness: 0.6,
});

// Physical material (advanced PBR)
const physical = new THREE.MeshPhysicalMaterial({
  color: 0x8b5cf6,
  roughness: 0.2,
  metalness: 0.8,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});

// Shader material (custom GLSL)
const shader = new THREE.ShaderMaterial({
  vertexShader: `...`,
  fragmentShader: `...`,
  uniforms: { time: { value: 0 } },
});
```

### GLTF Loading + Draco
```typescript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const draco = new DRACOLoader();
draco.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(draco);

loader.load("/models/scene.glb", (gltf) => {
  scene.add(gltf.scene);
});
```

### Performance
```typescript
// Instancing (1000+ objects)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
const instanced = new THREE.InstancedMesh(geometry, material, 1000);

// LOD (Level of Detail)
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(mediumDetailMesh, 50);
lod.addLevel(lowDetailMesh, 100);

// Cleanup
geometry.dispose();
material.dispose();
texture.dispose();
```

## Common Pitfalls
1. **Memory leaks** — Always dispose geometries, materials, textures
2. **Too many draw calls** — Use instancing for repeated objects
3. **No pixel ratio cap** — Cap at 2x for performance
4. **Missing resize handler** — Update camera/renderer on window resize

## Verification Checklist
- [ ] Scene renders without errors
- [ ] Lighting looks correct
- [ ] Models load with Draco compression
- [ ] 60fps on target devices
- [ ] Memory cleanup on unmount
