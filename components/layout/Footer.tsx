import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Headphones } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="krovex-footer">
      <Image
        className="krovex-footer__background"
        src="/images/backgrounds/krovex-footer.webp"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="krovex-footer__inner">
        <div className="krovex-footer__main">
          <Logo />
          <p className="krovex-footer__tagline">Nová strecha. Nový <em>pocit domova.</em></p>
          <Link className="krovex-footer__cta" href="/dopyt">
            Povedzte nám o svojej streche <ArrowUpRight size={20} strokeWidth={1.7} aria-hidden="true" />
          </Link>
        </div>
        <div className="krovex-footer__rule" aria-hidden="true" />
        <div className="krovex-footer__bottom">
          <p><strong>KROVEX</strong><span aria-hidden="true" /> Fiktívna strechárska firma. Ukážkový projekt.</p>
          <Link href="/admin" className="krovex-footer__admin">
            <Headphones size={18} strokeWidth={1.45} aria-hidden="true" />
            Správa dopytov
          </Link>
        </div>
      </div>
    </footer>
  );
}
