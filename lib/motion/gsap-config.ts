import gsap from "gsap";

export const MOTION_EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out"
} as const;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isDesktopMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
}

export function gsapQuickTo(target: gsap.TweenTarget, property: string, duration = 0.45) {
  return gsap.quickTo(target, property, { duration, ease: MOTION_EASE.out });
}
