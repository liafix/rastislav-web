"use client";

import { useEffect, useState } from "react";
import { getSceneSnapshot, subscribeScene, type ScrollSceneSnapshot } from "@/lib/motion/scene-store";

export function useScrollScene() {
  const [scene, setScene] = useState<ScrollSceneSnapshot>(() => getSceneSnapshot());

  useEffect(() => subscribeScene(setScene), []);

  return scene;
}
