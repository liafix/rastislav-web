import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    number: "01",
    name: "Nová strecha",
    image: "/images/roofing/new-roof.webp",
    alt: "Pracovník pri montáži modernej plechovej strechy",
    text: "Od prvého návrhu po posledný detail. Strecha, ktorá ladí s vaším domovom a vydrží generácie.",
    note: "Pre nové začiatky"
  },
  {
    number: "02",
    name: "Rekonštrukcia",
    image: "/images/roofing/roof-reconstruction.webp",
    alt: "Porovnanie starej strechy a novej červenej krytiny",
    text: "Nový začiatok pre existujúcu strechu. Rozsah obnovy prispôsobíme jej stavu aj vašim cieľom.",
    note: "Zachováme hodnotu. Pridáme budúcnosť."
  },
  {
    number: "03",
    name: "Oprava",
    image: "/images/roofing/roof-repair.webp",
    alt: "Detail ruky pri oprave sivej strešnej krytiny",
    text: "Poškodená krytina alebo netesnosť? Začnime tým, čo vaša strecha potrebuje.",
    note: "Rýchlo. Spoľahlivo. S úctou k vášmu domu."
  }
] as const;

export function KrovexServices() {
  return (
    <section id="sluzby" className="krovex-services" aria-labelledby="krovex-services-title">
      <Image
        className="krovex-services__background"
        src="/images/backgrounds/krovex-services.webp"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="krovex-services__inner">
        <header className="krovex-services__heading">
          <div>
            <p className="krovex-section-kicker"><span>01 /</span> Naše služby</p>
            <h2 id="krovex-services-title">Každá strecha má<br />svoj <em>príbeh.</em></h2>
          </div>
          <div className="krovex-services__intro">
            <p>Staviate, obnovujete alebo riešite konkrétny problém? Vyberte si, s čím vám môžeme pomôcť.</p>
            <span>Odbornosť. Riešenia. Pokoj domova.</span>
          </div>
        </header>

        <div className="krovex-services__cards">
          {services.map((service) => (
            <article key={service.name} className="krovex-service-card">
              <div className="krovex-service-card__mobile-media">
                <Image src={service.image} alt={service.alt} fill sizes="(max-width: 767px) 100vw, 33vw" />
              </div>
              <div className="krovex-service-card__copy">
                <div className="krovex-service-card__main">
                  <span className="krovex-service-card__number">{service.number}</span>
                  <h3>{service.name}</h3>
                  <p>{service.text}</p>
                  <Link href="/dopyt" aria-label={`Nezáväzný dopyt: ${service.name}`}>
                    Mám záujem <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
                  </Link>
                </div>
                <aside className="krovex-service-card__note" aria-hidden="true">
                  {service.note}
                </aside>
              </div>
            </article>
          ))}
        </div>

        <footer className="krovex-services__footerline" aria-hidden="true">
          <span>KROVEX — strechy, ktoré chránia vaše príbehy.</span>
          <i />
          <span>01 / 03</span>
        </footer>
      </div>
    </section>
  );
}
