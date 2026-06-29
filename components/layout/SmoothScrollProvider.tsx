"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bindLenisScrollTrigger } from "@/lib/motion/lenis-scrolltrigger";
import { prefersReducedMotion } from "@/lib/motion/gsap-config";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      anchors: true
    });

    const unbind = bindLenisScrollTrigger(lenis);

    return () => {
      unbind();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
