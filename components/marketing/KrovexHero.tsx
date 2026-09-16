import Link from "next/link";
import Image from "next/image";
import { FileText, ListChecks, MailCheck } from "lucide-react";

const proofItems = [
  { icon: ListChecks, title: "3 kroky", detail: "Bez zbytočností" },
  { icon: FileText, title: "Nezáväzný dopyt", detail: "Bez platby" },
  { icon: MailCheck, title: "Emailové potvrdenie", detail: "Po odoslaní" }
];

export function KrovexHero() {
  return (
    <section className="krovex-hero" aria-labelledby="krovex-hero-title">
      <Image
        className="krovex-hero__background"
        src="/images/backgrounds/krovex-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="krovex-hero__ambient" aria-hidden="true" />
      <div className="krovex-hero__container">
        <div className="krovex-hero__copy">
          <p className="krovex-hero__eyebrow">KROVEX — strechy a strechárske práce</p>
          <h1 id="krovex-hero-title" className="krovex-hero__title">
            Domov začína<br />
            dobrou <em>strechou.</em>
          </h1>
          <p className="krovex-hero__description">
            Nová strecha, rekonštrukcia alebo oprava. Povedzte nám, čo plánujete.
            Spoločne upresníme ďalší krok.
          </p>
          <div className="krovex-hero__action-row">
            <Link className="krovex-hero__cta" href="/dopyt">
              Začať nezáväzný dopyt <span aria-hidden="true">↗</span>
            </Link>
            <div className="krovex-hero__proof" aria-label="Čo môžete očakávať">
              {proofItems.map(({ icon: Icon, title, detail }) => (
                <div className="krovex-hero__proof-item" key={title}>
                  <Icon size={23} strokeWidth={1.45} aria-hidden="true" />
                  <span>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="krovex-hero__aside krovex-hero__aside--left" aria-hidden="true">
          Viac než strecha.<br />Pocit domova.
        </p>
        <p className="krovex-hero__aside krovex-hero__aside--right" aria-hidden="true">
          Strechy,<br />ktoré chránia<br />váš príbeh.
        </p>
      </div>
    </section>
  );
}
