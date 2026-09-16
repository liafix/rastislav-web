import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Home, ShieldCheck } from "lucide-react";

const details = [
  { icon: ShieldCheck, label: "Odborné", detail: "poradenstvo" },
  { icon: Home, label: "Riešenie", detail: "na mieru" },
  { icon: FileText, label: "Bez záväzkov", detail: "a rýchlo" }
] as const;

export function KrovexCTA() {
  return (
    <section className="krovex-closing" aria-labelledby="krovex-closing-title">
      <Image
        className="krovex-closing__background"
        src="/images/backgrounds/krovex-cta.webp"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="krovex-closing__ambient" aria-hidden="true" />
      <div className="krovex-closing__inner">
        <span className="krovex-closing__line" aria-hidden="true" />
        <p className="krovex-closing__kicker">Vaša strecha. Váš ďalší krok.</p>
        <h2 id="krovex-closing-title">Začnime jednoduchým<br /><em>dopytom.</em></h2>
        <p className="krovex-closing__lead">Povedzte nám, čo plánujete. Pripravíme pre vás riešenie na mieru – rýchlo, odborne a bez záväzkov.</p>
        <Link className="krovex-closing__cta" href="/dopyt">
          Vyplniť nezáväzný dopyt <ArrowUpRight size={20} strokeWidth={1.7} aria-hidden="true" />
        </Link>
        <div className="krovex-closing__proof" aria-label="Priebeh konzultácie">
          {details.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="krovex-closing__proof-item">
              <Icon size={24} strokeWidth={1.35} aria-hidden="true" />
              <span><strong>{label}</strong><small>{detail}</small></span>
            </div>
          ))}
        </div>
        <p className="krovex-closing__aside" aria-hidden="true">Strechy,<br />ktoré chránia<br />vaše príbehy.</p>
      </div>
    </section>
  );
}
