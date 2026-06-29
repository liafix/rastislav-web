"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion/gsap-config";

export function FloatingElement({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const elements = document.querySelectorAll<HTMLElement>("[data-floating]");
    elements.forEach((element) => {
      gsap.to(element, {
        y: -8,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, []);

  return (
    <div data-floating className={className}>
      {children}
    </div>
  );
}
