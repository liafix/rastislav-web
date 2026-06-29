"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion/gsap-config";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  glare?: boolean;
};

export function TiltCard({ children, className = "", glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const glareEl = element.querySelector<HTMLElement>("[data-tilt-glare]");

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = py * -10;
      const rotateY = px * 12;

      element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      element.style.setProperty("--elev", String(Math.abs(px) + Math.abs(py)));

      if (glareEl && glare) {
        glareEl.style.opacity = "1";
        glareEl.style.background = `radial-gradient(circle at ${event.clientX - rect.left}px ${event.clientY - rect.top}px, rgba(255,255,255,0.35), transparent 45%)`;
      }
    };

    const onLeave = () => {
      element.style.transform = "";
      element.style.removeProperty("--elev");
      if (glareEl) glareEl.style.opacity = "0";
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [glare]);

  return (
    <div ref={ref} className={`tilt-card ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {glare ? <span data-tilt-glare className="tilt-card__glare" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}
