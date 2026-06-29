"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/gsap-config";

gsap.registerPlugin(ScrollTrigger);

type CounterUpProps = {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
};

export function CounterUp({ end, suffix = "", prefix = "", className = "", duration = 1.6 }: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      element.textContent = `${prefix}${end}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    const context = gsap.context(() => {
      gsap.to(counter, {
        value: end,
        duration,
        ease: "power2.out",
        snap: { value: 1 },
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          once: true
        },
        onUpdate: () => {
          element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
        }
      });
    });

    return () => context.revert();
  }, [duration, end, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
