"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HomeScrollMotion() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current?.parentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || reduceMotion) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-motion='reveal']").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-motion='stagger']").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-motion-item]");
        if (!items.length) return;

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: group,
              start: "top 78%",
              once: true
            }
          }
        );
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
    };
  }, []);

  return <div ref={rootRef} aria-hidden="true" className="hidden" />;
}
