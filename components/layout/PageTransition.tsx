"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion/gsap-config";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const overlay = document.querySelector<HTMLElement>("[data-page-transition]");
    if (!overlay) return;

    gsap.set(overlay, { scaleY: 1, transformOrigin: "top" });
    gsap.to(overlay, {
      scaleY: 0,
      duration: 0.55,
      ease: "power3.inOut",
      transformOrigin: "bottom"
    });
  }, [pathname]);

  return (
    <>
      <div data-page-transition className="page-transition" aria-hidden="true" />
      {children}
    </>
  );
}
