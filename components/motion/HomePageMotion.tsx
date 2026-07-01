"use client";

import dynamic from "next/dynamic";
import { MotionOrchestrator } from "@/components/motion/MotionOrchestrator";
import { isDesktopMotion, prefersReducedMotion } from "@/lib/motion/gsap-config";
import { useEffect, useState, type ReactNode } from "react";

const SceneCanvas = dynamic(() => import("@/components/3d/SceneCanvas").then((mod) => mod.SceneCanvas), {
  ssr: false
});

export function HomePageMotion({ children }: { children: ReactNode }) {
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const hasIntentionalCarScene = Boolean(document.querySelector("main[data-story-root] [data-scene-model='ducato']"));
    setShowScene(!prefersReducedMotion() && isDesktopMotion() && hasIntentionalCarScene);
  }, []);

  return (
    <MotionOrchestrator>
      {showScene ? <SceneCanvas /> : null}
      {children}
    </MotionOrchestrator>
  );
}
