"use client";

import Link from "next/link";
import { Clock3, MessageCircle, Phone } from "lucide-react";
import { MagneticButton } from "@/components/motion/effects/MagneticButton";
import { company } from "@/lib/content/services";

export function BookingActions() {
  return (
    <div data-motion="stagger" className="grid gap-3 sm:min-w-72">
      <MagneticButton className="inline-flex">
        <Link
          data-motion-item
          href="/booking"
          className="btn-primary w-full border-white/20 bg-[#e44f22] text-white hover:bg-[#c83f18]"
        >
          Objednať obhliadku
          <Clock3 size={18} aria-hidden="true" />
        </Link>
      </MagneticButton>
      <MagneticButton className="inline-flex">
        <a
          data-motion-item
          href={company.phoneHref}
          className="btn-secondary w-full border-white/15 bg-white/8 text-white hover:bg-white/14"
        >
          <Phone size={18} aria-hidden="true" />
          {company.phoneDisplay}
        </a>
      </MagneticButton>
      <MagneticButton className="inline-flex">
        <a
          data-motion-item
          href={company.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary w-full border-white/15 bg-white/8 text-white hover:bg-white/14"
        >
          <MessageCircle size={18} aria-hidden="true" />
          WhatsApp
        </a>
      </MagneticButton>
    </div>
  );
}
