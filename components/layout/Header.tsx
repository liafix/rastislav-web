"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/motion/effects/MagneticButton";
import { company } from "@/lib/content/services";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "min-h-16 border-black/14 bg-[#f6f0e7]/94 shadow-[0_12px_40px_rgba(20,20,20,0.06)]"
          : "min-h-20 border-black/10 bg-[#f6f0e7]/72"
      }`}
    >
      <div className="container flex min-h-[inherit] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-5" aria-label="Martiš MV domov">
          <span className="font-serif text-3xl font-black leading-none text-[#11100e]">Martiš MV</span>
          <span className="hidden h-5 w-px bg-black/18 sm:block" aria-hidden="true" />
          <span className="hidden text-xs uppercase leading-none text-black/54 sm:inline">{company.descriptor}</span>
        </Link>

        <nav className="hidden items-center gap-14 text-base font-semibold text-black/74 md:flex">
          <Link href="/sluzby">Služby</Link>
          <Link href="/booking">Obhliadka</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>

        <MagneticButton as="a" href={company.phoneHref} className="inline-flex">
          <span className="btn-secondary min-h-14 rounded-md border-black/24 bg-transparent px-7 py-3 text-base">
            <Phone size={18} aria-hidden="true" />
            <span>{company.phoneDisplay}</span>
          </span>
        </MagneticButton>
      </div>
    </header>
  );
}
