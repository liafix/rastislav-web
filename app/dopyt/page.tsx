import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { InquiryForm } from "@/components/ui/InquiryForm";

export const metadata = buildPageMetadata('Dopyt | KROVEX', 'Nová strecha, rekonštrukcia alebo oprava. Nezáväzný dopyt v troch krokoch.', '/dopyt');

export default function InquiryPage() {
  return (
    <main className="krovex-inquiry-page">
      <section className="krovex-inquiry-shell" aria-labelledby="krovex-inquiry-title">
        <div className="krovex-inquiry-visual">
          <Image
            src="/images/roofing/finished-roof.webp"
            alt="Rodinný dom s dokončenou tmavou strechou pri západe slnka"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 46vw"
          />
          <div className="krovex-inquiry-visual__shade" aria-hidden="true" />
          <div className="krovex-inquiry-visual__geometry" aria-hidden="true" />
          <div className="krovex-inquiry-visual__copy">
            <p className="krovex-inquiry-kicker">KROVEX · nezáväzný dopyt</p>
            <h1 id="krovex-inquiry-title">Povedzte nám<br />o svojej <em>streche.</em></h1>
            <p>Tri stručné kroky nám stačia na to, aby sme pochopili základ vášho projektu a vedeli sa ozvať s ďalším postupom.</p>
          </div>
          <p className="krovex-inquiry-visual__aside" aria-hidden="true">Od prvého<br />detailu k<br />pokojnému domovu.</p>
        </div>
        <div className="krovex-inquiry-form-zone">
          <div className="krovex-inquiry-form-zone__intro">
            <span>01 / 03</span>
            <p>Vyplnenie trvá len pár minút.</p>
          </div>
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
