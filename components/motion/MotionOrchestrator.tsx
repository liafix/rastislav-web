"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCENE_DOM_ATTRIBUTES, SCENE_STAGE_MODEL_MAP, isModelKey, isSceneStage } from "@/lib/contracts";
import type { SceneStage } from "@/lib/contracts";
import { isDesktopMotion, prefersReducedMotion } from "@/lib/motion/gsap-config";
import { setSceneSnapshot } from "@/lib/motion/scene-store";

gsap.registerPlugin(ScrollTrigger);

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function resolveStage(section: HTMLElement): SceneStage | null {
  const stage = section.getAttribute(SCENE_DOM_ATTRIBUTES.stage);
  return stage && isSceneStage(stage) ? stage : null;
}

function resolveModel(section: HTMLElement, stage: SceneStage) {
  const modelAttr = section.getAttribute(SCENE_DOM_ATTRIBUTES.model);
  return modelAttr && isModelKey(modelAttr) ? modelAttr : SCENE_STAGE_MODEL_MAP[stage];
}

export function MotionOrchestrator({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      gsap.utils.toArray<HTMLElement>("[data-motion='reveal'], [data-motion-item]", root ?? document).forEach((el) => {
        gsap.set(el, { autoAlpha: 1, y: 0, clearProps: "all" });
      });
      return;
    }

    const context = gsap.context((self) => {
      const hero = root.querySelector<HTMLElement>("[data-scene-stage='hero']");
      const heroBg = root.querySelector<HTMLElement>("[data-hero-bg]");
      const heroGlow = root.querySelector<HTMLElement>("[data-hero-glow]");

      if (hero && heroBg) {
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (trigger) => {
            const progress = trigger.progress;
            heroBg.style.setProperty("--hero-scroll-progress", String(progress));
            heroBg.style.transform = `scale(${1 + progress * 0.08})`;
            heroBg.style.filter = `blur(${progress * 4}px)`;
            setSceneSnapshot({ heroProgress: progress, sceneOpacity: clamp(progress * 1.4) * 0.42 });
          }
        });
      }

      if (heroGlow && isDesktopMotion()) {
        const moveGlow = (event: PointerEvent) => {
          heroGlow.style.setProperty("--glow-x", `${event.clientX}px`);
          heroGlow.style.setProperty("--glow-y", `${event.clientY}px`);
        };
        window.addEventListener("pointermove", moveGlow, { passive: true });
        self.add(() => window.removeEventListener("pointermove", moveGlow));
      }

      const heroContent = root.querySelector<HTMLElement>("[data-hero-content]");
      if (heroContent) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          heroContent.querySelectorAll("[data-hero-kicker]"),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7 }
        );
        tl.fromTo(
          heroContent.querySelectorAll("[data-text-mask-line]"),
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.85, stagger: 0.12 },
          "-=0.35"
        );
        tl.fromTo(
          heroContent.querySelectorAll("[data-hero-fade]"),
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 },
          "-=0.45"
        );
      }

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

      gsap.utils.toArray<HTMLElement>("[data-motion='assemble']").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-motion-item]");
        if (!items.length) return;

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 48, scale: 0.94, rotateX: 8 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: group,
              start: "top 75%",
              once: true
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(`[${SCENE_DOM_ATTRIBUTES.stage}]`).forEach((section) => {
        const stage = resolveStage(section);
        if (!stage || stage === "hero") return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => {
            setSceneSnapshot({
              stage,
              activeModel: resolveModel(section, stage),
              sceneOpacity: stage === "booking" ? 0.28 : 0.42,
              progress: 0
            });
          },
          onEnterBack: () => {
            setSceneSnapshot({
              stage,
              activeModel: resolveModel(section, stage),
              sceneOpacity: stage === "booking" ? 0.28 : 0.42,
              progress: 0
            });
          },
          onLeave: () => {
            if (stage === "booking") {
              setSceneSnapshot({ sceneOpacity: 0.22 });
            }
          }
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            setSceneSnapshot({
              stage,
              progress: self.progress,
              activeModel: resolveModel(section, stage),
              sceneOpacity: stage === "booking" ? 0.28 + self.progress * 0.12 : 0.42
            });
          }
        });
      });

      const booking = root.querySelector<HTMLElement>("[data-scene-stage='booking']");
      const bookingGlow = root.querySelector<HTMLElement>("[data-booking-glow]");
      if (booking && bookingGlow && isDesktopMotion()) {
        const moveBookingGlow = (event: PointerEvent) => {
          bookingGlow.style.setProperty("--glow-x", `${event.clientX}px`);
          bookingGlow.style.setProperty("--glow-y", `${event.clientY}px`);
        };
        booking.addEventListener("pointermove", moveBookingGlow, { passive: true });
        self.add(() => booking.removeEventListener("pointermove", moveBookingGlow));
      }

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const depth = Number(element.dataset.parallax ?? 24);
        gsap.to(element, {
          y: depth,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stroke-icon]").forEach((icon) => {
        const paths = icon.querySelectorAll<SVGPathElement>("path, line, polyline, circle");
        paths.forEach((path) => {
          if (typeof path.getTotalLength !== "function") return;
          const length = path.getTotalLength();
          if (!length) return;
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: icon,
              start: "top 85%",
              once: true
            }
          });
        });
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const heroImg = root.querySelector("img[data-hero-image]");
    heroImg?.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
      setSceneSnapshot({ stage: "hero", progress: 0, heroProgress: 0, sceneOpacity: 0, activeModel: null });
    };
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
