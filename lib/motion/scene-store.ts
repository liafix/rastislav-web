import type { ModelKey, SceneStage } from "@/lib/contracts";
import { SCENE_STAGE_MODEL_MAP } from "@/lib/contracts";

export type ScrollSceneSnapshot = {
  stage: SceneStage;
  progress: number;
  heroProgress: number;
  sceneOpacity: number;
  activeModel: ModelKey;
};

const defaultSnapshot: ScrollSceneSnapshot = {
  stage: "hero",
  progress: 0,
  heroProgress: 0,
  sceneOpacity: 0,
  activeModel: SCENE_STAGE_MODEL_MAP.hero
};

let snapshot: ScrollSceneSnapshot = { ...defaultSnapshot };
const listeners = new Set<(value: ScrollSceneSnapshot) => void>();

export function getSceneSnapshot() {
  return snapshot;
}

export function setSceneSnapshot(partial: Partial<ScrollSceneSnapshot>) {
  snapshot = { ...snapshot, ...partial };
  listeners.forEach((listener) => listener(snapshot));
}

export function subscribeScene(listener: (value: ScrollSceneSnapshot) => void) {
  listeners.add(listener);
  listener(snapshot);
  return () => {
    listeners.delete(listener);
  };
}

export function resetSceneSnapshot() {
  snapshot = { ...defaultSnapshot };
}
