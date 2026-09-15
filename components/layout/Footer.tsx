import Link from "next/link";
import { Logo } from "@/components/Logo";
export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><Logo /><p>Nová strecha. Nový pocit domova.</p><Link href="/dopyt" className="btn-primary">Povedzte nám o svojej streche ↗</Link></div><div className="footer-bottom"><p>KROVEX · Fiktívna strechárska firma. Ukážkový projekt.</p><Link href="/admin">Správa dopytov</Link></div></div></footer>;
}
