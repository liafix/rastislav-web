import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileText, Mail } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Opíšte svoju strechu",
    text: "Vyberte typ prác a doplňte približnú plochu, miesto, termín a kontakt."
  },
  {
    number: "02",
    icon: Mail,
    title: "Dostanete potvrdenie",
    text: "Po odoslaní vám pošleme email so zhrnutím vášho dopytu."
  },
  {
    number: "03",
    icon: CalendarDays,
    title: "Upresníme ďalší postup",
    text: "Ozveme sa vám a prejdeme si rozsah prác a možnosti termínu."
  }
] as const;

export function KrovexProcess() {
  return (
    <section id="postup" className="krovex-process" aria-labelledby="krovex-process-title">
      <Image
        className="krovex-process__background"
        src="/images/backgrounds/krovex-process.webp"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="krovex-process__inner">
        <div className="krovex-process__mobile-media">
          <Image
            src="/images/roofing/finished-roof.webp"
            alt="Rodinný dom s dokončenou tmavou sedlovou strechou pri západe slnka"
            fill
            sizes="100vw"
          />
        </div>
        <div className="krovex-process__content">
          <p className="krovex-section-kicker"><span>02 /</span> Ako to prebieha</p>
          <h2 id="krovex-process-title">Jasný postup.<br />Od <em>začiatku.</em></h2>
          <p className="krovex-process__lead">Žiadne zbytočné komplikácie. Stačí pár krokov a my sa postaráme o zvyšok. Váš čas aj pokoj sú pre nás dôležité.</p>

          <ol className="krovex-process__steps">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <li key={number}>
                <div className="krovex-process__icon" aria-hidden="true"><Icon size={25} strokeWidth={1.45} /></div>
                <span className="krovex-process__number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="krovex-process__actions">
            <Link className="krovex-process__cta" href="/dopyt">
              Povedzte nám o svojom projekte <ArrowUpRight size={20} strokeWidth={1.7} aria-hidden="true" />
            </Link>
            <p aria-hidden="true">Spoločne<br />k lepšiemu<br />domovu.</p>
          </div>
        </div>
        <p className="krovex-process__aside" aria-hidden="true">Istota<br />pre vaše<br />zajtra.</p>
      </div>
    </section>
  );
}
