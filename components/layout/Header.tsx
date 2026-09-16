"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className={`site-header ${isHome ? "site-header--home" : "site-header--solid"}`}>
      <div className="container header-inner">
        <Logo variant={isHome ? "light" : "dark"} />
        <nav className="header-links" aria-label="Hlavná navigácia">
          <Link href="/#sluzby" className="nav-secondary">Služby</Link>
          <Link href="/#postup" className="nav-secondary">Ako to prebieha</Link>
        </nav>
        <Link href="/dopyt" className={isHome ? "header-cta header-cta--accent" : "btn-primary header-primary-action"}>
          Nezáväzný dopyt <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
