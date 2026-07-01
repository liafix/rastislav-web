"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Color, DoubleSide, Group, MathUtils, ShaderMaterial, Vector3 } from "three";
import type { Mesh } from "three";
import { SCENE_STAGE_INTENSITY_MAP } from "@/lib/contracts";
import type { SceneStage, SceneState } from "@/lib/contracts";
import { subscribeScene } from "@/lib/motion/scene-store";

const DUCATO_MODEL_PATH = "/models/ducato_optimized.glb";

const CAMERA_STATES: Record<SceneStage, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
  hero: { position: [0.4, 0.8, 5.4], target: [0.65, -0.08, 0], fov: 32 },
  value: { position: [-0.2, 0.65, 5.8], target: [1.1, -0.1, 0], fov: 35 },
  craft: { position: [1.4, 0.55, 4.8], target: [0.15, -0.02, 0], fov: 30 },
  services: { position: [0, 1.35, 5.2], target: [0.25, -0.18, 0], fov: 34 },
  index: { position: [0.35, 1.05, 5.4], target: [0.4, -0.12, 0], fov: 33 },
  proof: { position: [-1.15, 0.72, 5], target: [-0.35, -0.08, 0], fov: 32 },
  booking: { position: [0.8, 0.6, 5.6], target: [0.1, -0.16, 0], fov: 34 },
  footer: { position: [0, 0.85, 6.2], target: [0, -0.18, 0], fov: 38 }
};

const THEME_STATES: Record<SceneStage, { background: string; accent: string; grid: string }> = {
  hero: { background: "#f7f4ed", accent: "#e44f22", grid: "#6f858a" },
  value: { background: "#fbf8f0", accent: "#b7835d", grid: "#d7c9b8" },
  craft: { background: "#efe9dd", accent: "#d05a34", grid: "#9aa7a6" },
  services: { background: "#f3efe6", accent: "#e44f22", grid: "#8b9da1" },
  index: { background: "#fffaf0", accent: "#c97852", grid: "#cbbfb0" },
  proof: { background: "#e9e0d1", accent: "#257a57", grid: "#b5a996" },
  booking: { background: "#f8f3e9", accent: "#e44f22", grid: "#7f8d90" },
  footer: { background: "#141414", accent: "#fffaf0", grid: "#343434" }
};

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
          canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true }))
    );
  } catch {
    return false;
  }
}

function useSceneFallbackMode() {
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactViewport = window.matchMedia("(max-width: 1023px)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    setFallback(reducedMotion || compactViewport || coarsePointer || !canUseWebGL());
  }, []);

  return fallback;
}

function useSceneTelemetry(webglEnabled: boolean): SceneState & { layerOpacity: number } {
  const [sceneState, setSceneState] = useState<SceneState & { layerOpacity: number }>({
    stage: "hero",
    progress: 0,
    activeModel: null,
    reducedMotion: true,
    webglEnabled,
    layerOpacity: 0
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    return subscribeScene((snapshot) => {
      setSceneState({
        stage: snapshot.stage,
        progress: snapshot.progress,
        activeModel: snapshot.activeModel,
        reducedMotion: motionQuery.matches,
        webglEnabled,
        layerOpacity: snapshot.sceneOpacity
      });
    });
  }, [webglEnabled]);

  return sceneState;
}

function SceneFallback() {
  return (
    <div className="scene-fallback fixed inset-0 z-0 opacity-80" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f4ed]/10 via-[#f7f4ed]/70 to-[#f7f4ed]" />
      <div className="absolute right-[8vw] top-[14vh] hidden h-72 w-72 rounded-full border border-black/10 bg-white/24 blur-2xl md:block" />
    </div>
  );
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_: Error, __: ErrorInfo) {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function ShaderGrid({ sceneState }: { sceneState: SceneState }) {
  const materialRef = useRef<ShaderMaterial>(null);
  const meshRef = useRef<Mesh>(null);
  const theme = THEME_STATES[sceneState.stage];

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0.12 },
          uAccent: { value: new Color(theme.grid) },
          uProgress: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uOpacity;
          uniform float uProgress;
          uniform vec3 uAccent;
          varying vec2 vUv;

          float gridLine(vec2 uv, float scale) {
            vec2 grid = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
            return 1.0 - min(min(grid.x, grid.y), 1.0);
          }

          void main() {
            vec2 uv = vUv;
            float grid = gridLine(uv + vec2(uProgress * 0.02, uTime * 0.004), 16.0);
            float pulse = smoothstep(0.95, 0.15, abs(uv.y - fract(uTime * 0.035 + uProgress)));
            float vignette = smoothstep(0.95, 0.2, distance(uv, vec2(0.5)));
            float alpha = (grid * 0.42 + pulse * 0.08) * vignette * uOpacity;
            gl_FragColor = vec4(uAccent, alpha);
          }
        `
      }),
    [theme.grid]
  );

  useFrame((_, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const targetOpacity = SCENE_STAGE_INTENSITY_MAP[sceneState.stage] === "rest" ? 0.04 : 0.12;
    materialRef.current.uniforms.uTime.value += delta;
    materialRef.current.uniforms.uProgress.value = MathUtils.lerp(
      materialRef.current.uniforms.uProgress.value,
      sceneState.progress,
      0.06
    );
    materialRef.current.uniforms.uOpacity.value = MathUtils.lerp(
      materialRef.current.uniforms.uOpacity.value,
      targetOpacity,
      0.04
    );
    materialRef.current.uniforms.uAccent.value.lerp(new Color(THEME_STATES[sceneState.stage].grid), 0.04);

    meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, sceneState.progress * 0.1, 0.04);
  });

  return (
    <mesh ref={meshRef} position={[0, -0.15, -2.4]} rotation={[-Math.PI / 2.35, 0, 0]} scale={[8.5, 8.5, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

function DucatoModel() {
  const groupRef = useRef<Group>(null);
  const gltf = useGLTF(DUCATO_MODEL_PATH);
  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.scale.lerp(new Vector3(0.62, 0.62, 0.62), 0.045);
  });

  return (
    <group ref={groupRef} position={[0.8, -0.78, 0]} rotation={[0, -0.55, 0]} scale={0.55}>
      <primitive object={clonedScene} />
    </group>
  );
}

function CameraRig({ sceneState }: { sceneState: SceneState }) {
  const { camera, scene } = useThree();
  const target = useRef(new Vector3(0.65, -0.08, 0));
  const currentBackground = useRef(new Color(THEME_STATES.hero.background));

  useFrame(() => {
    const cameraState = CAMERA_STATES[sceneState.stage];
    const theme = THEME_STATES[sceneState.stage];

    camera.position.lerp(new Vector3(...cameraState.position), 0.045);
    target.current.lerp(new Vector3(...cameraState.target), 0.055);
    camera.lookAt(target.current);

    if ("fov" in camera) {
      camera.fov = MathUtils.lerp(camera.fov, cameraState.fov, 0.04);
      camera.updateProjectionMatrix();
    }

    currentBackground.current.lerp(new Color(theme.background), 0.035);
    scene.background = currentBackground.current;
  });

  return null;
}

function WebGLContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("martis:webgl-error"));
      onFailure();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
    };
  }, [gl, onFailure]);

  return null;
}

function SceneContent({ sceneState, onFailure }: { sceneState: SceneState; onFailure: () => void }) {
  const showCar = sceneState.activeModel === "ducato";

  return (
    <>
      <WebGLContextGuard onFailure={onFailure} />
      <CameraRig sceneState={sceneState} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 4, 5]} intensity={2.4} color={THEME_STATES[sceneState.stage].accent} />
      <pointLight position={[-3, 1.8, 3]} intensity={0.7} color="#fff7e8" />
      <Suspense fallback={null}>
        <ShaderGrid sceneState={sceneState} />
        {showCar ? <DucatoModel /> : null}
        <Environment preset="city" />
      </Suspense>
    </>
  );
}

export function SceneCanvas() {
  const fallback = useSceneFallbackMode();
  const sceneState = useSceneTelemetry(!fallback);
  const [sceneFailed, setSceneFailed] = useState(false);

  useEffect(() => {
    if (fallback || sceneFailed) return;

    try {
      void Promise.resolve(useGLTF.preload(DUCATO_MODEL_PATH)).catch(() => {
        setSceneFailed(true);
      });
    } catch {
      setSceneFailed(true);
    }
  }, [fallback, sceneFailed]);

  if (fallback || sceneFailed) return <SceneFallback />;

  return (
    <SceneErrorBoundary onError={() => setSceneFailed(true)}>
      <div
        className="scene-canvas fixed inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{ opacity: sceneState.layerOpacity }}
        aria-hidden="true"
      >
        <Canvas
          dpr={[1, 1.25]}
          frameloop={sceneState.activeModel === "ducato" ? "always" : "demand"}
          camera={{ position: CAMERA_STATES.hero.position, fov: CAMERA_STATES.hero.fov }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: true
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(THEME_STATES.hero.background, 1);
          }}
        >
          <SceneContent sceneState={sceneState} onFailure={() => setSceneFailed(true)} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
