# 3D Performance Pipeline

> **Role:** Specialized 3D WebGL Performance Engineer, Three.js Optimization Expert, React Three Fiber Architect, GLSL Shader Performance Auditor, and Production Rendering Pipeline Guardian.
>
> **Purpose:** This document is the absolute **Single Source of Truth** for all 3D asset handling, WebGL rendering pipelines, custom GLSL shader implementations, scene lifecycle rules, GPU memory management, and performance budgets within this project. Every 3D feature, model, material, shader, post-processing effect, animation system, and interactive scene must comply with this pipeline before it is merged, deployed, or shipped.
>
> **Non-negotiable target:** Deliver a visually premium, Awwwards-level 3D web experience while maintaining a locked or near-locked **60 FPS desktop experience** and a stable, battery-conscious **mobile experience** with graceful degradation.

---

## 0. Performance Philosophy

The 3D layer must feel premium, but never at the cost of usability, conversion, SEO, accessibility, or Core Web Vitals.

The correct priority order is:

1. **Fast first interaction**
2. **Stable frame pacing**
3. **Low memory pressure**
4. **Predictable loading behavior**
5. **Progressive visual enhancement**
6. **Premium visual fidelity only when the device can afford it**

A scene that looks impressive but causes stutters, mobile overheating, long initial loading, layout blocking, or GPU memory leaks is considered a failed implementation.

---

## 1. Global Performance Targets

### 1.1 Frame Rate Targets

| Device tier | Target FPS | Acceptable minimum | Notes |
|---|---:|---:|---|
| High-end desktop | 60 FPS | 55 FPS | Full fidelity allowed |
| Mid-range laptop | 60 FPS | 50 FPS | Reduce DPR/post-processing if needed |
| High-end mobile | 60 FPS | 45 FPS | Avoid heavy post-processing |
| Mid-range mobile | 45–60 FPS | 35 FPS | Use adaptive quality |
| Low-end mobile | 30 FPS | 25 FPS | Fallback scene or static hero allowed |

### 1.2 Runtime Budgets

| Budget area | Desktop target | Mobile target |
|---|---:|---:|
| Initial 3D payload | ≤ 2.5 MB compressed | ≤ 1.2 MB compressed |
| Single GLB hero model | ≤ 1.5 MB compressed | ≤ 800 KB compressed |
| Total visible triangles | ≤ 150k | ≤ 50k |
| Hero scene draw calls | ≤ 80 | ≤ 40 |
| Texture memory | ≤ 256 MB | ≤ 96 MB |
| Active shadow-casting lights | 0–1 | 0 |
| Post-processing passes | 0–2 | 0–1 |
| Renderer pixel ratio | max 1.5–2 | max 1–1.25 |
| Shader compile time | no visible freeze | no visible freeze |

### 1.3 Core Web Vitals Guardrails

3D must not block:

- **LCP:** Do not delay hero text, CTA, or critical layout while 3D assets load.
- **INP:** Pointer, scroll, form, and CTA interactions must stay responsive.
- **CLS:** Canvas and 3D containers must reserve fixed layout space.
- **TTFB:** No runtime-heavy 3D work on server-rendered paths.

3D is enhancement, not the primary content delivery mechanism.

---

## 2. Architecture Principles

### 2.1 Separation of Responsibilities

The 3D system must be split into clear layers:

```txt
/app or /pages
  -> route-level UI and content
/components/3d
  -> scene wrappers and React-facing components
/lib/three
  -> loaders, disposal utilities, performance monitor, quality manager
/lib/shaders
  -> GLSL chunks, uniforms, shader materials
/public/models
  -> optimized .glb/.gltf files
/public/textures
  -> compressed texture sets
```

No page component should directly contain low-level asset loading, manual GPU disposal logic, or shader compilation logic. Route components should only compose scene modules.

### 2.2 Client-Only Rendering Boundary

All WebGL, Three.js, React Three Fiber, `window`, `document`, `navigator`, `ResizeObserver`, and WebGL context logic must live behind a client boundary.

For Next.js App Router:

```tsx
'use client';

import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => <div className="hero-3d-placeholder" aria-hidden="true" />,
});

export function HeroSceneMount() {
  return <HeroScene />;
}
```

Never SSR the actual WebGL scene.

### 2.3 Progressive Enhancement Rule

Every 3D scene must have at least one fallback:

1. Full 3D scene for capable devices.
2. Lightweight 3D scene for mobile or weak GPUs.
3. Static image/video/gradient fallback for unsupported or low-power environments.

Fallbacks are not optional.

---

## 3. Device Capability Detection

### 3.1 Quality Tiers

The app must classify device capability before enabling expensive rendering features.

Recommended tiers:

```ts
export type QualityTier = 'ultra' | 'high' | 'medium' | 'low' | 'fallback';
```

Classification inputs:

- `navigator.hardwareConcurrency`
- `navigator.deviceMemory` where available
- viewport size
- touch capability
- battery saver hints where available
- WebGL support
- measured FPS during warm-up
- renderer info where safely available

### 3.2 Example Quality Resolver

```ts
export function resolveInitialQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'fallback';

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (reducedMotion) return 'fallback';
  if (!supportsWebGL()) return 'fallback';
  if (isMobile && (cores <= 4 || memory <= 4)) return 'low';
  if (isMobile) return 'medium';
  if (cores >= 8 && memory >= 8) return 'high';

  return 'medium';
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
```

### 3.3 Adaptive Downgrade Rule

If measured FPS drops below threshold for a sustained period, reduce quality automatically.

Downgrade sequence:

```txt
ultra -> high -> medium -> low -> fallback
```

Each downgrade may reduce:

- device pixel ratio
- texture resolution
- animation frequency
- particle count
- post-processing passes
- shadow quality
- environment map resolution
- bloom intensity/samples
- number of visible mesh instances

---

## 4. Asset Pipeline & Loading Strategy

### 4.1 Mandatory Asset Rules

All 3D assets must be optimized before entering `/public/models`.

Rules:

- Use `.glb` as default delivery format.
- No raw Blender `.blend`, FBX, OBJ, or unoptimized export in production bundles.
- Apply transforms before export.
- Remove unused cameras, lights, animations, vertex groups, bones, hidden meshes, and empty nodes.
- Merge static meshes where it reduces draw calls without destroying material batching strategy.
- Split scenes into logical chunks when progressive loading improves interaction time.
- Name all important nodes semantically.

### 4.2 Draco Compression Enforcement

All `.glb` assets exceeding **1 MB** must use compression.

For geometry-heavy assets:

- Use **Draco** compression.
- Use `GLTFLoader` with properly configured `DRACOLoader`.
- Decode asynchronously.
- Keep decoder path local or CDN-stable.

```ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({ type: 'wasm' });

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
```

Compression policy:

| Asset type | Required compression |
|---|---|
| Large hero models | Draco or Meshopt |
| Repeated decorative geometry | Draco/Meshopt + instancing |
| Small simple props | Optional |
| Animated skinned characters | Test carefully; prefer Meshopt where suitable |

### 4.3 Meshopt Recommendation

For modern pipelines, consider Meshopt compression where decoding speed is more important than maximum file size reduction.

Use Meshopt especially when:

- many assets are streamed progressively
- mobile decode speed matters
- the model has many repeated vertex patterns
- Draco decompression causes visible stalls

### 4.4 Centralized LoadingManager

Use a single global `THREE.LoadingManager` to coordinate loading states, progress UI, preload gates, and analytics.

```ts
import * as THREE from 'three';

export const globalLoadingManager = new THREE.LoadingManager();

globalLoadingManager.onStart = (url, loaded, total) => {
  console.info('[3D loading started]', { url, loaded, total });
};

globalLoadingManager.onProgress = (url, loaded, total) => {
  window.dispatchEvent(
    new CustomEvent('three-loading-progress', {
      detail: { url, loaded, total, progress: total ? loaded / total : 0 },
    })
  );
};

globalLoadingManager.onLoad = () => {
  window.dispatchEvent(new CustomEvent('three-loading-complete'));
};

globalLoadingManager.onError = (url) => {
  console.error('[3D loading error]', url);
};
```

The global loading state may drive:

- route-level preloader
- hero skeleton
- progress bar
- low-res placeholder swap
- asset failure fallback
- analytics/debug logging

### 4.5 Progressive Texture Loading

Heavy textures must use multi-tier delivery.

Recommended tiers:

| Tier | Resolution | Usage |
|---|---:|---|
| Placeholder | 32–128 px blur | instant preview |
| Low | 512 px–1K | initial interactive scene |
| Medium | 1K–2K | default desktop |
| High | 2K–4K | high-end only, after interactivity |

Never load 4K textures before the page is interactive.

Hot-swap example:

```ts
async function upgradeTexture(
  material: THREE.MeshStandardMaterial,
  textureUrl: string,
  renderer: THREE.WebGLRenderer
) {
  const texture = await new THREE.TextureLoader(globalLoadingManager).loadAsync(textureUrl);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  texture.needsUpdate = true;

  const oldMap = material.map;
  material.map = texture;
  material.needsUpdate = true;

  oldMap?.dispose();
}
```

### 4.6 Texture Format Policy

Preferred production texture formats:

- **KTX2 / Basis Universal** for GPU-compressed textures.
- **WebP** for lightweight fallback images and static previews.
- **JPEG** for non-alpha photographic textures when compression is acceptable.
- **PNG** only for UI sprites, masks, alpha textures, or technical maps where required.

Avoid uncompressed 4K PNG textures in WebGL scenes.

### 4.7 KTX2 Loader Blueprint

```ts
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

export function createKTX2Loader(renderer: THREE.WebGLRenderer) {
  const loader = new KTX2Loader(globalLoadingManager);
  loader.setTranscoderPath('/basis/');
  loader.detectSupport(renderer);
  return loader;
}
```

KTX2 is strongly recommended for:

- large environment maps
- albedo maps
- normal maps
- roughness maps
- repeated decorative assets
- mobile-first scenes

### 4.8 Environment Map Policy

Environment maps must be treated as expensive GPU resources.

Rules:

- Prefer 512 px or 1K HDRI for most scenes.
- Avoid 4K HDRI except for controlled high-end showcases.
- Pre-filter environment maps through PMREM.
- Dispose original HDR/equirectangular textures after PMREM generation.
- Use one shared environment map per scene whenever possible.

```ts
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const envTexture = await hdrLoader.loadAsync('/env/studio_1k.hdr');
const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;

scene.environment = envMap;

envTexture.dispose();
pmremGenerator.dispose();
```

---

## 5. Geometry Optimization Rules

### 5.1 Triangle Budget

Recommended triangle limits:

| Scene type | Desktop | Mobile |
|---|---:|---:|
| Hero abstract scene | 50k–120k | 20k–50k |
| Product/service object showcase | 80k–150k | 30k–70k |
| Background decorative particles | 5k–30k | 1k–10k |
| Full 3D storytelling section | 150k–250k max | 50k–100k max |

If a model exceeds budget, optimize before shipping:

- decimate geometry
- bake detail into normal maps
- remove hidden interior faces
- merge static objects
- use LODs
- use instancing
- reduce bevel segments
- reduce subdivision levels

### 5.2 Draw Call Budget

Draw calls are often more expensive than triangles in web scenes.

Targets:

| Scene | Desktop max | Mobile max |
|---|---:|---:|
| Hero scene | 80 | 40 |
| Decorative scene | 40 | 20 |
| Product configurator | 120 | 60 |
| Storytelling page | 150 | 70 |

Optimization methods:

- merge meshes sharing the same material
- use `InstancedMesh` for repeated objects
- use texture atlases
- minimize material variants
- avoid hundreds of independent transparent meshes
- avoid nested groups with many separate renderable children

### 5.3 Instancing Rule

Any repeated object used more than 10 times must be evaluated for instancing.

```ts
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: '#ffffff' });
const mesh = new THREE.InstancedMesh(geometry, material, 100);

const matrix = new THREE.Matrix4();

for (let i = 0; i < 100; i++) {
  matrix.makeTranslation(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  );
  mesh.setMatrixAt(i, matrix);
}

mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);
```

### 5.4 LOD Policy

Use LOD for objects that can move away from the camera or are scroll-driven across depth.

LOD tiers:

| Distance | Geometry |
|---|---|
| Near | full detail |
| Mid | 50% reduced |
| Far | 10–25% reduced |
| Very far | billboard/sprite/static card |

```ts
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(midDetailMesh, 10);
lod.addLevel(lowDetailMesh, 25);
scene.add(lod);
```

### 5.5 Geometry Attribute Hygiene

Remove unused attributes from production geometry.

Common unnecessary attributes:

- vertex colors when not used
- tangents when no normal maps are used
- UV2 when no AO/lightmaps are used
- skinning attributes for static meshes
- morph target data when no morphing is used

---

## 6. Material Rules

### 6.1 Material Complexity Budget

Material complexity directly impacts fragment shader cost.

Allowed default materials:

- `MeshBasicMaterial` for unlit backgrounds, masks, simple UI-like planes
- `MeshLambertMaterial` for cheap diffuse lighting
- `MeshStandardMaterial` for most physically-based objects
- custom `ShaderMaterial` only when justified

Avoid using `MeshPhysicalMaterial` by default. It is expensive and should be reserved for hero assets where clearcoat, transmission, iridescence, or advanced physical properties are essential.

### 6.2 Material Count Rule

One model should not contain excessive unique materials.

Recommended:

- Small prop: 1–3 materials
- Hero object: 3–6 materials
- Complex scene: 8–12 materials max

Every unique material may create additional shader variants and draw calls.

### 6.3 Transparency Policy

Transparency is expensive and can cause sorting artifacts.

Rules:

- Avoid large overlapping transparent surfaces.
- Avoid high counts of transparent glass cards in 3D.
- Prefer CSS/glassmorphism for UI panels instead of WebGL transparency when possible.
- Use `alphaTest` instead of full `transparent` for cutouts where suitable.
- Keep transparent objects separate and minimal.

```ts
const material = new THREE.MeshStandardMaterial({
  map,
  alphaMap,
  alphaTest: 0.5,
  transparent: false,
});
```

### 6.4 Material Reuse Rule

Never create identical materials repeatedly inside render loops or component re-renders.

Bad:

```tsx
<mesh material={new THREE.MeshStandardMaterial({ color: 'white' })} />
```

Good:

```tsx
const material = useMemo(
  () => new THREE.MeshStandardMaterial({ color: 'white' }),
  []
);
```

---

## 7. Lighting Rules

### 7.1 Lighting Budget

| Light type | Desktop | Mobile |
|---|---:|---:|
| AmbientLight | allowed | allowed |
| HemisphereLight | allowed | allowed |
| DirectionalLight | 1–2 | 1 |
| PointLight | 0–3 | 0–1 |
| SpotLight | 0–1 | 0 |
| Shadow-casting light | 0–1 | 0 |

### 7.2 Shadow Policy

Realtime shadows are expensive.

Allowed only when:

- they are visually essential
- the scene budget allows them
- shadow map size is capped
- mobile can disable them

Recommended shadow map sizes:

| Tier | Shadow map size |
|---|---:|
| Desktop high | 1024–2048 |
| Desktop medium | 512–1024 |
| Mobile | disabled or 512 max |

Prefer:

- baked ambient occlusion
- contact shadows with low samples
- blob shadows
- projected plane shadows
- CSS gradient shadows for decorative objects

### 7.3 No Accidental Shadow Rule

All meshes must explicitly declare shadow behavior.

```ts
mesh.castShadow = false;
mesh.receiveShadow = false;
```

Enable only on specific objects.

---

## 8. Renderer Configuration

### 8.1 Default Renderer Settings

```ts
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  alpha: true,
  powerPreference: 'high-performance',
  stencil: false,
  depth: true,
});

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(width, height, false);
```

### 8.2 Pixel Ratio Policy

Never blindly use full device pixel ratio.

```ts
const maxDprByTier = {
  ultra: 2,
  high: 1.5,
  medium: 1.25,
  low: 1,
  fallback: 1,
};

renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDprByTier[tier]));
```

High DPR is one of the fastest ways to destroy mobile performance.

### 8.3 Resize Handling

Resize events must be debounced or handled through `ResizeObserver` carefully.

```ts
const resizeObserver = new ResizeObserver(() => {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });
});
```

Always disconnect observers on unmount.

---

## 9. React Three Fiber Rules

### 9.1 Canvas Defaults

```tsx
<Canvas
  frameloop="demand"
  dpr={[1, 1.5]}
  gl={{
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
  }}
  performance={{ min: 0.5 }}
>
  <Scene />
</Canvas>
```

Use `frameloop="demand"` when the scene is mostly static.
Use `frameloop="always"` only when continuous animation is required.

### 9.2 `useFrame` Discipline

Every `useFrame` callback is part of the render loop budget.

Rules:

- No allocations inside `useFrame`.
- No `setState` inside `useFrame` except extremely controlled cases.
- No object creation inside `useFrame`.
- Reuse vectors, matrices, quaternions, and colors.
- Keep math simple.
- Avoid DOM reads inside `useFrame`.

Bad:

```tsx
useFrame(() => {
  setPosition([Math.random(), Math.random(), Math.random()]);
});
```

Good:

```tsx
const tmp = useMemo(() => new THREE.Vector3(), []);

useFrame((state, delta) => {
  tmp.set(Math.sin(state.clock.elapsedTime), 0, 0);
  mesh.current.position.lerp(tmp, Math.min(delta * 4, 1));
});
```

### 9.3 Suspense Loading Rule

Use Suspense for asset loading, but do not let Suspense block critical page content.

```tsx
<Suspense fallback={<ScenePlaceholder />}>
  <HeroModel />
</Suspense>
```

The page’s main copy and CTA must render independently from the 3D scene.

### 9.4 Preload Rule

Preload critical models only when they are likely to be used.

```ts
import { useGLTF } from '@react-three/drei';

useGLTF.preload('/models/hero-optimized.glb');
```

Do not preload every model globally.

### 9.5 Drei Usage Policy

Drei helpers are allowed, but must be audited.

Potentially expensive helpers:

- `Environment`
- `ContactShadows`
- `MeshTransmissionMaterial`
- `Float` with many children
- `Html` overlays inside WebGL
- `Stars` with high counts
- `Sparkles` with high counts
- `AccumulativeShadows`

Use them intentionally and profile them.

---

## 10. Animation Pipeline

### 10.1 Animation Priority

Animation must support storytelling, not decorate everything randomly.

Preferred animation types:

- subtle camera parallax
- controlled scroll-driven object transform
- low-frequency idle motion
- meaningful product/service state transitions
- shader-based ambient movement with cheap math

Avoid:

- dozens of independent GSAP timelines controlling 3D objects
- physics simulations for decorative elements
- high-frequency DOM + WebGL sync
- continuous particle updates on mobile
- scroll handlers doing heavy work every pixel

### 10.2 Scroll Animation Rule

Scroll-driven 3D must be normalized, throttled, and interpolated.

```ts
const targetScroll = { current: 0 };
const smoothScroll = { current: 0 };

window.addEventListener('scroll', () => {
  targetScroll.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
}, { passive: true });

useFrame((_, delta) => {
  smoothScroll.current += (targetScroll.current - smoothScroll.current) * Math.min(delta * 6, 1);
  group.current.rotation.y = smoothScroll.current * Math.PI * 2;
});
```

### 10.3 GSAP + Three.js Rule

GSAP may animate Three.js values, but timelines must be killed on unmount.

```ts
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(mesh.current.rotation, {
      y: Math.PI * 2,
      duration: 8,
      repeat: -1,
      ease: 'none',
    });
  });

  return () => ctx.revert();
}, []);
```

### 10.4 Reduced Motion Compliance

If `prefers-reduced-motion: reduce` is active:

- disable continuous camera motion
- disable floating idle motion
- disable particle animation
- use static lighting
- show static fallback if needed

```ts
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 11. Shader Pipeline & GLSL Rules

### 11.1 Shader Approval Rule

Custom shaders must be reviewed before production use.

Every shader must define:

- purpose
- expected device tier
- uniform list
- texture dependency list
- fragment complexity risk
- fallback material
- maximum number of instances
- mobile behavior

### 11.2 Shader Cost Rules

Avoid expensive operations in fragment shaders:

- complex loops
- dynamic loops
- excessive noise layers
- multiple texture lookups
- high precision everywhere
- branches inside hot fragment paths
- `pow`, `sin`, `cos`, `tan` in dense fragment loops unless necessary

Prefer:

- precomputed values
- vertex shader movement
- low-frequency uniform updates
- baked texture data
- simple gradient math
- cheap hash/noise functions

### 11.3 Uniform Update Discipline

Uniforms should update only when necessary.

Bad:

```ts
material.uniforms.uColor.value = new THREE.Color(color);
```

inside every frame.

Good:

```ts
const colorRef = useMemo(() => new THREE.Color(color), [color]);

useEffect(() => {
  material.uniforms.uColor.value.copy(colorRef);
}, [colorRef, material]);
```

### 11.4 ShaderMaterial Blueprint

```ts
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 0.35 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision mediump float;

    varying vec2 vUv;
    uniform float uTime;
    uniform float uIntensity;

    void main() {
      vec2 uv = vUv;
      float glow = smoothstep(0.8, 0.2, distance(uv, vec2(0.5)));
      vec3 color = mix(vec3(0.05, 0.08, 0.15), vec3(0.25, 0.45, 1.0), glow * uIntensity);
      gl_FragColor = vec4(color, glow);
    }
  `,
  transparent: true,
  depthWrite: false,
});
```

### 11.5 Shader Precision Policy

Use appropriate precision.

- Use `mediump` for mobile-friendly fragment shaders where possible.
- Use `highp` only when visual artifacts require it.
- Test mobile GPUs specifically.

### 11.6 Shader Fallback Policy

Every custom shader material must have fallback:

```ts
const fallbackMaterial = new THREE.MeshBasicMaterial({
  color: '#3b82f6',
  transparent: true,
  opacity: 0.65,
});
```

Fallback triggers:

- shader compile failure
- WebGL unsupported
- low-quality tier
- sustained FPS degradation
- memory pressure

---

## 12. Post-Processing Policy

### 12.1 Post-Processing Budget

Post-processing can quickly destroy performance, especially on mobile.

Allowed by tier:

| Effect | Desktop high | Desktop medium | Mobile |
|---|---|---|---|
| Bloom | yes | reduced | rarely |
| Vignette | yes | yes | yes if cheap |
| FXAA/SMAA | yes | yes | test |
| Depth of Field | rare | no | no |
| SSR | no by default | no | no |
| SSAO | limited | no | no |
| Motion Blur | no by default | no | no |
| Chromatic Aberration | subtle only | subtle only | no |

### 12.2 Bloom Rule

Bloom must be subtle, cheap, and capped.

Use bloom only for:

- emissive hero highlights
- subtle neon glow
- premium glass edges

Avoid full-screen overbloom.

### 12.3 Composer Disposal

Effect composers and passes must be disposed on unmount.

```ts
composer.passes.forEach((pass) => {
  if ('dispose' in pass && typeof pass.dispose === 'function') {
    pass.dispose();
  }
});
```

---

## 13. Memory Management & Lifecycle Control

### 13.1 Strict Disposal Policy

To prevent catastrophic WebGL memory leaks during Next.js route transitions, React component unmounts, modal scene swaps, or dynamic scene replacement, all WebGL resources must be disposed explicitly.

Resources requiring disposal:

- geometries
- materials
- textures
- render targets
- skeletons
- controls
- post-processing composers
- custom frame loops
- event listeners
- resize observers
- workers/loaders where applicable
- animation mixers/actions

### 13.2 Disposal Blueprint

```ts
import * as THREE from 'three';

export function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;

    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });

  scene.clear();
}

export function disposeMaterial(material: THREE.Material) {
  Object.keys(material).forEach((key) => {
    const value = (material as unknown as Record<string, unknown>)[key];

    if (value && typeof value === 'object' && 'dispose' in value) {
      const disposable = value as { dispose?: () => void };
      disposable.dispose?.();
    }
  });

  material.dispose();
}
```

### 13.3 Safer Texture Disposal

When disposing material properties, avoid accidentally disposing shared textures still used elsewhere.

For shared resource systems, use reference counting.

```ts
type DisposableResource = { dispose: () => void };

class ResourceRegistry {
  private refs = new Map<DisposableResource, number>();

  retain<T extends DisposableResource>(resource: T): T {
    this.refs.set(resource, (this.refs.get(resource) ?? 0) + 1);
    return resource;
  }

  release(resource: DisposableResource) {
    const count = this.refs.get(resource) ?? 0;

    if (count <= 1) {
      resource.dispose();
      this.refs.delete(resource);
      return;
    }

    this.refs.set(resource, count - 1);
  }
}
```

### 13.4 Renderer Disposal

On full scene teardown:

```ts
renderer.dispose();
renderer.forceContextLoss();
renderer.domElement = null as unknown as HTMLCanvasElement;
```

Use `forceContextLoss()` only when fully destroying the renderer, not during normal scene swaps.

### 13.5 Animation Mixer Cleanup

```ts
mixer.stopAllAction();
uncacheActions.forEach((clip) => mixer.uncacheClip(clip));
```

Stop and uncache actions when animated models unmount.

---

## 14. WebGL Context Loss Handling

### 14.1 Required Event Listeners

Canvas must handle context loss gracefully.

```ts
canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  console.warn('[WebGL] Context lost');
  showFallbackScene();
});

canvas.addEventListener('webglcontextrestored', () => {
  console.info('[WebGL] Context restored');
  rebuildScene();
});
```

### 14.2 Context Loss Response

On context loss:

- stop render loop
- hide interactive 3D controls
- show static fallback
- prevent repeated rebuild loops
- log diagnostic metadata
- rebuild only when safe

---

## 15. Scene Visibility & Tab Lifecycle

### 15.1 Page Visibility Rule

Pause expensive rendering when tab is hidden.

```ts
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopRenderLoop();
  } else {
    resumeRenderLoop();
  }
});
```

### 15.2 IntersectionObserver Rule

Scenes outside viewport must reduce or stop rendering.

```ts
const observer = new IntersectionObserver(
  ([entry]) => {
    setSceneActive(entry.isIntersecting);
  },
  { threshold: 0.1 }
);
```

If the scene is not visible:

- pause animation
- stop post-processing
- stop scroll-linked 3D updates
- optionally switch `frameloop` to demand

---

## 16. Particles & Decorative Effects

### 16.1 Particle Budget

| Tier | Max particles |
|---|---:|
| High desktop | 10k–30k GPU points |
| Medium desktop | 3k–10k |
| Mobile | 500–3k |
| Low mobile | static/no particles |

### 16.2 Particle Rules

- Use `Points` or instancing, not individual mesh particles.
- Avoid CPU-updating thousands of objects each frame.
- Use shader-based motion where possible.
- Reduce count on mobile.
- Disable particles under reduced motion.

Bad:

```ts
particles.forEach((particle) => {
  particle.position.x += Math.random();
});
```

Good:

- static buffer geometry
- time uniform
- vertex shader animation

---

## 17. Camera & Controls

### 17.1 Camera Rules

- Use one main camera per scene unless multi-camera rendering is justified.
- Avoid extreme FOV values.
- Keep near/far planes tight to improve depth precision.

Recommended:

```ts
const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
```

Avoid:

```ts
new THREE.PerspectiveCamera(90, aspect, 0.001, 10000);
```

### 17.2 Controls Policy

OrbitControls or custom controls must be disabled when not needed.

```ts
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false;
```

Dispose controls:

```ts
controls.dispose();
```

---

## 18. Raycasting & Interaction

### 18.1 Raycasting Budget

Raycasting can become expensive in dense scenes.

Rules:

- Raycast only against interactive objects.
- Use layers or dedicated arrays.
- Throttle pointer move raycasts.
- Avoid raycasting against full scene graph.
- Use simplified collider meshes when needed.

```ts
const interactiveObjects: THREE.Object3D[] = [];
raycaster.intersectObjects(interactiveObjects, false);
```

### 18.2 Pointer Events Rule

Do not perform heavy calculations on every `pointermove`.

Use requestAnimationFrame throttling:

```ts
let pointerRaf = 0;

function onPointerMove(event: PointerEvent) {
  cancelAnimationFrame(pointerRaf);
  pointerRaf = requestAnimationFrame(() => {
    updatePointer(event.clientX, event.clientY);
  });
}
```

---

## 19. Mobile Strategy

### 19.1 Mobile Default Rules

Mobile must not receive desktop 3D by default.

Mobile defaults:

- DPR capped at 1–1.25
- no heavy post-processing
- no real-time shadows
- fewer particles
- lower texture resolution
- reduced geometry
- fewer transparent layers
- simplified shaders
- lower animation intensity
- optional static fallback for low-end devices

### 19.2 Touch Interaction Rules

Mobile interactions should be simple:

- avoid complex drag/rotate requirements
- do not hijack scroll
- avoid horizontal scroll conflicts
- avoid forcing gestures that compete with page navigation
- ensure CTA remains accessible

### 19.3 Thermal/Battery Awareness

For long pages or idle states:

- reduce animation speed after inactivity
- stop rendering when not visible
- reduce particles after 10–20 seconds
- avoid permanent full-screen GPU load

---

## 20. Accessibility Requirements

### 20.1 Canvas Accessibility

3D canvas must never be the only way to understand the page.

Rules:

- Important information must exist in HTML text.
- Canvas should usually be `aria-hidden="true"` when decorative.
- Interactive 3D controls require keyboard and non-3D alternatives.
- Respect reduced motion.
- Avoid flashing effects.

```tsx
<canvas aria-hidden="true" />
```

### 20.2 Reduced Motion Fallback

Reduced motion users should receive:

- static preview image
- paused 3D scene
- or low-motion gradient fallback

---

## 21. SEO & Conversion Safety

3D must support the landing page, not replace it.

Rules:

- Never put primary copy inside canvas only.
- Do not delay CTA rendering until model load.
- Keep semantic HTML intact.
- Use image fallbacks with descriptive alt text where meaningful.
- Reserve canvas space to avoid layout shift.
- Avoid blocking main thread during asset decode.

Recommended layout pattern:

```tsx
<section className="hero">
  <div className="hero-copy">
    <h1>Premium web experiences with measurable business impact</h1>
    <p>Fast, conversion-focused, and optimized for search visibility.</p>
    <a href="/kontakt">Start project</a>
  </div>

  <div className="hero-visual" aria-hidden="true">
    <HeroSceneMount />
  </div>
</section>
```

---

## 22. Error Handling & Fallbacks

### 22.1 Asset Failure Policy

If model or texture loading fails:

- show fallback visual
- log the failed URL
- do not crash the page
- do not block the CTA
- do not retry infinitely

```ts
try {
  const gltf = await loader.loadAsync('/models/hero.glb');
  scene.add(gltf.scene);
} catch (error) {
  console.error('[3D asset failed]', error);
  showFallbackScene();
}
```

### 22.2 Shader Failure Policy

If custom shader fails to compile:

- replace with fallback material
- log shader name and uniforms
- disable related effect
- preserve page usability

---

## 23. Build-Time Asset Optimization

### 23.1 Recommended Tools

Use these tools before committing production assets:

- Blender for cleanup, decimation, UVs, baking
- gltf-transform for compression and optimization
- gltfpack for mesh optimization
- KTX-Software / toktx for KTX2 texture compression
- Squoosh/ImageMagick for static preview compression

### 23.2 glTF Transform Example

```bash
npx gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp \
  --resize 2048
```

### 23.3 Inspect Asset

```bash
npx gltf-transform inspect model.glb
```

Audit:

- file size
- texture size
- material count
- mesh count
- primitive count
- animation clips
- vertex count

### 23.4 Texture Resize Example

```bash
npx gltf-transform resize input.glb output.glb --width 2048 --height 2048
```

### 23.5 Compression Checklist

Before asset approval:

- [ ] File size under project budget
- [ ] Textures resized appropriately
- [ ] Draco/Meshopt applied where needed
- [ ] Unused nodes removed
- [ ] Draw call count reviewed
- [ ] Material count reduced
- [ ] Geometry normals checked
- [ ] UVs verified
- [ ] Animations trimmed
- [ ] Mobile version created if needed

---

## 24. Folder & Naming Conventions

### 24.1 Folder Structure

```txt
/public
  /models
    /hero
      hero.high.glb
      hero.medium.glb
      hero.low.glb
    /props
    /fallbacks
  /textures
    /env
    /ktx2
    /webp
  /draco
  /basis

/src
  /components/3d
  /lib/three
  /lib/shaders
  /lib/performance
```

### 24.2 File Naming

Use clear performance-tier names:

```txt
classic-nightstand.high.glb
classic-nightstand.medium.glb
classic-nightstand.low.glb
mid-century-lounge-chair.mobile.glb
studio-env.1k.ktx2
studio-env.512.ktx2
```

Avoid:

```txt
final_final_model_new_4k_test.glb
chair_export2.glb
scene123.glb
```

---

## 25. Scene Budget Manifest

Every major scene must have a budget manifest.

Example:

```ts
export const heroSceneBudget = {
  maxInitialPayloadKb: 1500,
  maxTrianglesDesktop: 120_000,
  maxTrianglesMobile: 45_000,
  maxDrawCallsDesktop: 80,
  maxDrawCallsMobile: 40,
  maxTextureMemoryMbDesktop: 192,
  maxTextureMemoryMbMobile: 64,
  maxPostProcessingPassesDesktop: 2,
  maxPostProcessingPassesMobile: 0,
  allowRealtimeShadows: false,
};
```

No scene should ship without explicit budgets.

---

## 26. Performance Monitoring

### 26.1 Runtime Metrics

Track:

- FPS
- frame time
- draw calls
- triangles
- geometries
- textures
- shader programs
- memory trend after route changes
- asset load time
- context loss events

### 26.2 Three.js Renderer Info

```ts
function logRendererInfo(renderer: THREE.WebGLRenderer) {
  console.table({
    calls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    points: renderer.info.render.points,
    lines: renderer.info.render.lines,
    geometries: renderer.info.memory.geometries,
    textures: renderer.info.memory.textures,
    programs: renderer.info.programs?.length ?? 0,
  });
}
```

### 26.3 FPS Monitor Blueprint

```ts
class FpsMonitor {
  private frames = 0;
  private last = performance.now();
  private fps = 60;

  tick() {
    this.frames++;
    const now = performance.now();

    if (now - this.last >= 1000) {
      this.fps = Math.round((this.frames * 1000) / (now - this.last));
      this.frames = 0;
      this.last = now;
    }

    return this.fps;
  }
}
```

### 26.4 Automatic Quality Downgrade

```ts
if (fps < 45 && tier !== 'low') {
  downgradeQualityTier();
}

if (fps < 30) {
  disablePostProcessing();
  reduceDpr();
}
```

---

## 27. Testing Protocol

### 27.1 Mandatory Test Devices

Test at minimum:

- high-end desktop Chrome
- mid-range laptop Chrome
- Safari desktop if supporting macOS users
- iPhone Safari
- Android Chrome
- low-end or throttled mobile simulation

### 27.2 Browser DevTools Checklist

Check:

- Performance tab frame chart
- Memory tab heap snapshots
- GPU memory trend where available
- Network waterfall
- Coverage for unused JS
- Lighthouse/Core Web Vitals
- WebGL context warnings
- shader compilation stalls

### 27.3 Route Transition Leak Test

Procedure:

1. Open page with 3D scene.
2. Wait until scene fully loads.
3. Record renderer memory stats.
4. Navigate away.
5. Force garbage collection in devtools if available.
6. Navigate back.
7. Repeat 10 times.
8. Geometries/textures/programs must not grow indefinitely.

### 27.4 Stress Test Checklist

- [ ] Rapid route transitions
- [ ] Resize browser repeatedly
- [ ] Switch tabs for 1 minute and return
- [ ] Toggle reduced motion
- [ ] Simulate slow 4G
- [ ] Simulate low-end mobile CPU throttling
- [ ] Disconnect network during model loading
- [ ] Trigger asset loading failure
- [ ] Test context loss manually if possible

---

## 28. CI / Pull Request Requirements

A pull request touching 3D must include:

- [ ] Asset size before/after
- [ ] Triangle count before/after
- [ ] Draw call estimate
- [ ] Texture resolution list
- [ ] Desktop FPS result
- [ ] Mobile FPS result or throttled equivalent
- [ ] Memory leak check result
- [ ] Fallback behavior confirmed
- [ ] Reduced motion behavior confirmed
- [ ] Screenshot or short recording

### 28.1 PR Template

```md
## 3D Performance Review

### Asset Changes
- Models added/changed:
- Total compressed size:
- Largest asset:

### Geometry
- Triangle count desktop:
- Triangle count mobile:
- Draw calls:

### Textures
- Texture formats:
- Largest texture:
- KTX2/WebP used:

### Runtime
- Desktop FPS:
- Mobile FPS:
- DPR setting:
- Post-processing passes:

### Lifecycle
- Disposal implemented:
- Route transition leak checked:
- Context loss fallback:

### Accessibility
- Reduced motion:
- Static fallback:
- HTML content remains accessible:
```

---

## 29. Common Anti-Patterns

These are forbidden unless explicitly justified and profiled.

- Loading 4K GLB files directly in the hero before text/CTA render.
- Using multiple 4K PNG textures in mobile scenes.
- Creating materials/geometries inside React render repeatedly.
- Using `setState` every frame.
- Full-screen bloom on mobile.
- Enabling shadows on many objects by default.
- Raycasting against entire scene graph on pointer move.
- Running animation loops while section is offscreen.
- Not disposing materials/textures on route changes.
- Using transparent glass meshes everywhere instead of CSS.
- Shipping uncompressed GLB assets.
- Importing heavy Three.js examples into global bundles unnecessarily.
- Using SSR for WebGL components.
- Treating 3D as required content instead of progressive enhancement.

---

## 30. Recommended Production Scene Pattern

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import { resolveInitialQualityTier } from '@/lib/performance/quality-tier';
import { HeroModel } from './HeroModel';
import { SceneFallback } from './SceneFallback';

export function HeroScene() {
  const tier = useMemo(() => resolveInitialQualityTier(), []);

  if (tier === 'fallback') {
    return <SceneFallback />;
  }

  return (
    <Canvas
      aria-hidden="true"
      frameloop={tier === 'low' ? 'demand' : 'always'}
      dpr={tier === 'high' ? [1, 1.5] : [1, 1.25]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
    >
      <Suspense fallback={null}>
        <HeroModel tier={tier} />
      </Suspense>
    </Canvas>
  );
}
```

---

## 31. Emergency Degradation Strategy

If production monitoring shows poor performance, apply this order:

1. Disable post-processing.
2. Cap DPR to 1.
3. Disable shadows.
4. Reduce particle count.
5. Switch to low-resolution textures.
6. Load low-poly model variant.
7. Disable continuous animation.
8. Replace 3D scene with static fallback.

The site must remain visually polished even after degradation.

---

## 32. Final Approval Checklist

Before any 3D scene ships:

- [ ] Scene has a defined budget manifest.
- [ ] Initial model payload is compressed.
- [ ] Textures are optimized and correctly sized.
- [ ] Mobile quality tier exists.
- [ ] Static fallback exists.
- [ ] Reduced motion fallback exists.
- [ ] Renderer DPR is capped.
- [ ] No unnecessary shadows.
- [ ] No excessive post-processing.
- [ ] No uncontrolled `useFrame` work.
- [ ] No React state updates every frame.
- [ ] All geometries/materials/textures dispose correctly.
- [ ] Route transition leak test passed.
- [ ] Context loss does not crash page.
- [ ] Primary content is semantic HTML, not canvas-only.
- [ ] CTA remains available before 3D load.
- [ ] FPS is acceptable on desktop and mobile.
- [ ] Performance has been profiled, not guessed.

---

## 33. Absolute Rules

These rules override aesthetic preference:

1. **Do not ship unprofiled 3D.**
2. **Do not block conversion-critical content with WebGL loading.**
3. **Do not load 4K assets first.**
4. **Do not run expensive animations offscreen.**
5. **Do not ignore mobile performance.**
6. **Do not create GPU resources repeatedly during render.**
7. **Do not skip disposal.**
8. **Do not treat shader errors as acceptable warnings.**
9. **Do not allow visual ambition to break UX.**
10. **Fallback is mandatory.**

---

## 34. Implementation Summary

This pipeline exists to keep the project visually ambitious but technically disciplined. The goal is not to remove premium 3D visuals. The goal is to make them stable, scalable, measurable, and production-safe.

Every 3D decision must answer these questions:

- Does this improve the user experience?
- Does it protect conversion and loading speed?
- Does it work on mobile?
- Can it degrade gracefully?
- Can it be measured?
- Can it be safely disposed?

If the answer is not clear, the feature must be simplified, profiled, or moved behind a quality tier.
