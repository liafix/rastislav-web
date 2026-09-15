import Image from "next/image";
import Link from "next/link";
import { siteUrl } from "@/lib/seo/metadata";
const services = [
  { name: "Nová strecha", image: "new-roof.webp", alt: "Pracovník pri montáži modernej plechovej strechy", text: "Od prvého návrhu po posledný detail. Strecha, ktorá ladí s vaším domovom." },
  { name: "Rekonštrukcia", image: "roof-reconstruction.webp", alt: "Porovnanie starej strechy a novej červenej krytiny", text: "Nový začiatok pre existujúcu strechu. Rozsah obnovy prispôsobíme jej stavu." },
  { name: "Oprava", image: "roof-repair.webp", alt: "Detail ruky pri oprave sivej strešnej krytiny", text: "Poškodená krytina alebo netesnosť? Začnime tým, čo vaša strecha potrebuje." }
];
export default function HomePage() {
  const origin = siteUrl();
  return <main>
    {origin ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "KROVEX", url: origin, description: "Ukážkový projekt fiktívnej strechárskej firmy." }).replace(/</g, "\\u003c") }} /> : null}
    <section className="roof-hero">
      <div className="container hero-grid">
        <div className="hero-copy"><p className="eyebrow">KROVEX · strechy a strechárske práce</p><h1>Domov začína<br />dobrou <em>strechou.</em></h1><p className="hero-description">Nová strecha, rekonštrukcia alebo oprava. Povedzte nám, čo plánujete. Spoločne upresníme ďalší krok.</p><Link className="btn-accent" href="/dopyt">Začať nezáväzný dopyt <span aria-hidden="true">↗</span></Link><p className="hero-note">Tri jednoduché kroky. Všetko podstatné na jednom mieste.</p></div>
        <div className="hero-photo"><Image src="/images/roofing/hero-roof.webp" alt="Strechár v oranžovom pracovnom oblečení pri práci na škridlovej streche" fill priority sizes="(min-width: 1024px) 55vw, 100vw" /><div className="photo-caption"><span>PRE VÁŠ DOMOV</span><span>Od krytiny po detail ↗</span></div></div>
      </div>
    </section>
    <section id="sluzby" className="container section-space">
      <div className="section-heading"><div><p className="eyebrow">01 / Čomu sa venujeme</p><h2 className="section-title">Každá strecha má<br />svoj príbeh.</h2></div><p>Staviate, obnovujete alebo riešite konkrétny problém? Vyberte si, s čím vám môžeme pomôcť.</p></div>
      <div className="service-grid">{services.map((service, index) => <article key={service.name} className="service-card"><div className={"service-image" + (index === 1 ? " comparison" : "")}><Image src={`/images/roofing/${service.image}`} alt={service.alt} fill sizes="(min-width: 768px) 33vw, 100vw" /></div><div className="service-copy"><span className="eyebrow">0{index + 1}</span><h3>{service.name}</h3><p>{service.text}</p><Link href="/dopyt" aria-label={`Nezáväzný dopyt: ${service.name}`}>Mám záujem <span aria-hidden="true">↗</span></Link></div></article>)}</div>
    </section>
    <section id="postup" className="process-section"><div className="container process-grid">
      <div className="process-photo"><Image src="/images/roofing/finished-roof.webp" alt="Rodinný dom s dokončenou tmavou sedlovou strechou za súmraku" fill sizes="(min-width: 1024px) 50vw, 100vw" /><p>Priestor pre pokojný domov.</p></div>
      <div><p className="eyebrow">02 / Od dopytu k ďalšiemu kroku</p><h2 className="section-title">Jasný postup.<br />Od začiatku.</h2><ol className="process-list">
        <li><span>01</span><div><h3>Opíšte svoju strechu</h3><p>Vyberte typ prác a doplňte približnú plochu, miesto, termín a kontakt.</p></div></li>
        <li><span>02</span><div><h3>Dostanete potvrdenie</h3><p>Po odoslaní vám pošleme email so zhrnutím vášho dopytu.</p></div></li>
        <li><span>03</span><div><h3>Upresníme ďalší postup</h3><p>Ozveme sa vám a prejdeme si rozsah prác a možnosti termínu.</p></div></li>
      </ol><Link className="btn-primary" href="/dopyt">Povedzte nám o svojom projekte ↗</Link></div>
    </div></section>
    <section className="container closing-cta"><p className="eyebrow">Vaša strecha. Váš ďalší krok.</p><h2 className="section-title">Začnime jednoduchým dopytom.</h2><Link className="btn-accent" href="/dopyt">Vyplniť nezáväzný dopyt ↗</Link></section>
  </main>;
}
