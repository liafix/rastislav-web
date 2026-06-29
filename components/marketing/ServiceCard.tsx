import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/motion/effects/TiltCard";
import type { Service } from "@/lib/content/services";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <TiltCard className="h-full">
      <Link
        href={`/sluzby/${service.slug}`}
        className="group relative grid h-full min-h-44 overflow-hidden rounded-md border border-black/10 bg-white/58 p-5 shadow-[0_24px_60px_rgba(20,20,20,0.05)] transition hover:border-black/30 hover:bg-white/82"
        style={{
          boxShadow: "0 calc(16px + var(--elev, 0) * 18px) calc(40px + var(--elev, 0) * 24px) rgba(20,20,20,0.08)"
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs font-black text-black/38">{String(index + 1).padStart(2, "0")}</span>
          <ArrowUpRight className="text-black/36 transition group-hover:text-[#e44f22]" size={20} aria-hidden="true" />
        </div>
        <div className="self-end">
          <h3 className="text-xl font-black leading-tight">{service.label}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">{service.intro}</p>
        </div>
      </Link>
    </TiltCard>
  );
}
