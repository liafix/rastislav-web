"use client";

import { Ruler, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { TiltCard } from "@/components/motion/effects/TiltCard";

const proofIcons = {
  shield: ShieldCheck,
  ruler: Ruler,
  sparkles: Sparkles
} satisfies Record<string, LucideIcon>;

type ProofCardProps = {
  icon: keyof typeof proofIcons;
  title: string;
  text: string;
};

export function ProofCard({ icon, title, text }: ProofCardProps) {
  const Icon = proofIcons[icon];

  return (
    <TiltCard className="h-full">
      <article
        className="h-full rounded-md border border-black/10 bg-white/62 p-6"
        style={{
          boxShadow: "0 calc(16px + var(--elev, 0) * 14px) calc(36px + var(--elev, 0) * 20px) rgba(20,20,20,0.07)"
        }}
      >
        <span data-stroke-icon className="block w-fit">
          <Icon className="text-[#e44f22]" size={28} aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-2xl font-black">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-black/62">{text}</p>
      </article>
    </TiltCard>
  );
}
