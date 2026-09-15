import Link from "next/link";
import { Logo } from "@/components/Logo";
export function Header() {
  return <header className="site-header"><div className="container header-inner"><Logo /><nav aria-label="Hlavná navigácia"><Link href="/#sluzby" className="nav-secondary">Služby</Link><Link href="/#postup" className="nav-secondary">Ako to prebieha</Link><Link href="/dopyt" className="btn-primary">Nezáväzný dopyt <span aria-hidden="true">↗</span></Link></nav></div></header>;
}
