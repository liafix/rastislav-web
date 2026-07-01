import Image from "next/image";
import type { Metadata } from "next";
import { BadgeCheck, Building2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "@/lib/content/services";
import { buildPageMetadata, localBusinessJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Kontakt | Rekonštrukcie interiéru Dubnica nad Váhom | Martiš MV",
  description:
    "Kontakt na Martiš MV pre interiérové rekonštrukcie, obklady, dlažby, podlahy a sanitu v Dubnici nad Váhom a okolí.",
  path: "/kontakt"
});

const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e44f22]";

export default function ContactPage() {
  return (
    <main className="relative isolate overflow-hidden bg-[#f8f1e6] pt-28">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />

      <section className="relative isolate overflow-hidden py-16 md:py-24 lg:py-28">
        <Image
          src="/images/contact/contact-background.webp"
          alt=""
          fill
          aria-hidden="true"
          sizes="100vw"
          className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-center"
        />

        <div
          className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(251,248,240,0.96)_0%,rgba(251,248,240,0.82)_43%,rgba(251,248,240,0.48)_100%)]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_20%,rgba(228,79,34,0.12),transparent_30%),radial-gradient(circle_at_72%_48%,rgba(255,255,255,0.52),transparent_36%),radial-gradient(circle_at_92%_78%,rgba(184,93,61,0.14),transparent_30%)]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] mix-blend-soft-light [background-image:radial-gradient(circle_at_1px_1px,rgba(17,16,14,0.20)_1px,transparent_0)] [background-size:22px_22px]"
          aria-hidden="true"
        />

        <div className="container relative grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div data-motion="reveal" className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e44f22]">
              Kontakt
            </p>

            <div className="mt-4 h-px w-14 bg-[#e44f22]/80" aria-hidden="true" />

            <h1 className="mt-6 max-w-2xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#11100e] sm:text-6xl lg:text-[5rem]">
              Ozvite sa k rekonštrukcii interiéru.
            </h1>

            <div className="mt-8 max-w-2xl rounded-[1.7rem] border border-white/60 bg-[#fbf8f0]/64 p-5 shadow-[0_24px_90px_rgba(42,35,24,0.11),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md sm:p-6">
              <p className="text-base leading-8 text-black/70 sm:text-lg">
                Najrýchlejšie je zavolať alebo poslať správu cez WhatsApp s fotkami priestoru.
                Podľa rozsahu sa dohodne obhliadka, konzultácia alebo ďalší praktický krok.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={company.phoneHref}
                  aria-label={`Zavolať na číslo ${company.phoneDisplay}`}
                  className={`btn-primary border-[#11100e] bg-[#11100e] text-white shadow-[0_20px_50px_rgba(17,16,14,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-[#e44f22] hover:bg-[#e44f22] hover:shadow-[0_24px_70px_rgba(228,79,34,0.28)] ${focusClass}`}
                >
                  <Phone size={18} aria-hidden="true" />
                  {company.phoneDisplay}
                </a>

                <a
                  href={company.emailHref}
                  aria-label={`Napísať e-mail na adresu ${company.email}`}
                  className={`btn-secondary border-white/70 bg-white/78 text-[#11100e] shadow-[0_16px_40px_rgba(20,20,20,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focusClass}`}
                >
                  <Mail size={18} aria-hidden="true" />
                  E-mail
                </a>

                <a
                  href={company.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Otvoriť WhatsApp konverzáciu"
                  className={`btn-secondary border-white/70 bg-white/78 text-[#11100e] shadow-[0_16px_40px_rgba(20,20,20,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focusClass}`}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div data-motion="stagger" className="relative grid gap-4">
            <div
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.68),rgba(228,79,34,0.12)_38%,transparent_72%)] blur-2xl"
              aria-hidden="true"
            />

            <article
              data-motion-item
              className="rounded-[1.35rem] border border-white/65 bg-white/74 p-6 shadow-[0_22px_70px_rgba(42,35,24,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/88 hover:shadow-[0_28px_84px_rgba(42,35,24,0.16)]"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#ead9c7] bg-[#fff6e8] text-[#e44f22] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                  <Phone size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-black/42">
                    Telefón
                  </p>
                  <a
                    className={`mt-2 inline-flex text-3xl font-black tracking-[-0.03em] text-[#11100e] transition hover:text-[#e44f22] ${focusClass}`}
                    href={company.phoneHref}
                  >
                    {company.phoneDisplay}
                  </a>
                </div>
              </div>
            </article>

            <article
              data-motion-item
              className="rounded-[1.35rem] border border-white/65 bg-white/74 p-6 shadow-[0_22px_70px_rgba(42,35,24,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/88 hover:shadow-[0_28px_84px_rgba(42,35,24,0.16)]"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#ead9c7] bg-[#fff6e8] text-[#e44f22] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                  <Mail size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-black/42">
                    E-mail
                  </p>
                  <a
                    href={company.emailHref}
                    className={`mt-2 block break-words text-2xl font-black tracking-[-0.03em] text-[#11100e] transition hover:text-[#e44f22] sm:text-3xl ${focusClass}`}
                  >
                    {company.email}
                  </a>
                </div>
              </div>
            </article>

            <article
              data-motion-item
              className="rounded-[1.35rem] border border-white/65 bg-white/74 p-6 shadow-[0_22px_70px_rgba(42,35,24,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/88 hover:shadow-[0_28px_84px_rgba(42,35,24,0.16)]"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#ead9c7] bg-[#fff6e8] text-[#e44f22] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                  <Building2 size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-black/42">
                    Firemné údaje
                  </p>
                  <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#11100e]">
                    IČO: {company.ico}
                  </p>
                  <p className="mt-2 max-w-xl text-base leading-7 text-black/62">
                    Sídlo: {company.legalAddress}
                  </p>
                </div>
              </div>
            </article>

            <article
              data-motion-item
              className="relative min-h-80 overflow-hidden rounded-[1.6rem] border border-white/18 bg-[#11100e] p-6 text-center text-[#fffaf0] shadow-[0_34px_100px_rgba(17,16,14,0.28)]"
            >
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(228,79,34,0.26),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]"
                aria-hidden="true"
              />

              <div
                className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent"
                aria-hidden="true"
              />

              <div className="relative grid min-h-64 place-items-center">
                <div>
                  <div className="mx-auto grid size-14 place-items-center rounded-full border border-white/14 bg-white/8 text-[#e44f22] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
                    <MapPin size={24} aria-hidden="true" />
                  </div>

                  <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-white/42">
                    Mapa
                  </p>

                  <p className="mt-3 text-3xl font-black tracking-[-0.04em]">
                    {company.mapAddressTitle}
                  </p>

                  <p className="mt-2 text-white/64">{company.city}</p>
                </div>
              </div>
            </article>

            <article
              data-motion-item
              className="rounded-[1.35rem] border border-[#e44f22]/18 bg-[#11100e]/88 p-5 text-[#fffaf0] shadow-[0_22px_70px_rgba(17,16,14,0.18)] backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-[#e44f22]">
                  <BadgeCheck size={18} aria-hidden="true" />
                </span>
                <p className="text-sm leading-7 text-white/68">
                  Pri prvom kontakte je najlepšie poslať stručný popis, fotky priestoru a ideálny termín realizácie.
                  Pomôže to rýchlejšie posúdiť rozsah a navrhnúť ďalší praktický krok.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}