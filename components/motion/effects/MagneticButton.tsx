"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { isDesktopMotion, prefersReducedMotion } from "@/lib/motion/gsap-config";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  as?: "a" | "div";
  target?: string;
  rel?: string;
};

export function MagneticButton({ children, className = "", href, as = "div", target, rel }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion() || !isDesktopMotion()) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      xTo(dx * 0.18);
      yTo(dy * 0.18);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, []);

  if (as === "a" && href) {
    return (
      <a ref={ref} href={href} className={className} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
