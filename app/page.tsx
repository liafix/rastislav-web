import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BookingActions } from "@/components/marketing/BookingActions";
import { HomePageMotion } from "@/components/motion/HomePageMotion";
import { CoreServicesSection } from "@/components/sections/CoreServicesSection";
import { DetailCraftSection } from "@/components/sections/DetailCraftSection";
import { HomeHero } from "@/components/sections/HomeHero";
import { InteriorProcessSection } from "@/components/sections/InteriorProcessSection";
import { ProofBeforeContactSection } from "@/components/sections/ProofBeforeContactSection";
import { services } from "@/lib/content/services";
import { buildPageMetadata, localBusinessJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Rekonštrukcie interiéru Dubnica nad Váhom | Martiš MV",
  description:
    "Prémiové interiérové rekonštrukcie, obklady, dlažby, podlahy, sanita, dvere a sadrokartón pre Dubnicu nad Váhom, Ilavu, Trenčín a okolie.",
  path: "/"
});

export default function Home() {
  return (
    <HomePageMotion>
      <main data-story-root className="relative isolate overflow-hidden">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <HomeHero />

        <InteriorProcessSection />

        <DetailCraftSection />
        <CoreServicesSection />

      <section
        data-scene-stage="index"
        data-scene-intensity="rest"
        className="relative z-10 overflow-hidden bg-[#f4ede2] py-20 text-[#17130f] md:py-28"
      >
        <div
          className="absolute inset-0 bg-cover bg-left opacity-95"
          style={{ backgroundImage: "url('/images/prace/background.webp')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.82),rgba(255,250,240,0.58)_48%,rgba(245,235,220,0.74))]"
          aria-hidden="true"
        />
        <div className="container relative grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(280px,0.72fr)] lg:items-center xl:grid-cols-[minmax(250px,0.76fr)_minmax(260px,0.58fr)_minmax(420px,1fr)]">
          <div data-motion="reveal" className="max-w-[28rem]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b85d3d]">PREHĽAD PRÁC</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.96] text-[#14110d] sm:text-6xl lg:text-[4.85rem]">
              Vyberte službu a pozrite si ďalší krok.
            </h2>
            <div className="mt-7 h-px w-16 bg-[#e44f22]" aria-hidden="true" />
            <p className="mt-7 max-w-sm text-base leading-8 text-black/66 sm:text-lg">
              Zvoľte oblasť, ktorá vás zaujíma, a zistite, čo nasleduje.
            </p>
          </div>
          <figure
            data-motion="reveal"
            className="relative mx-auto w-full max-w-[23rem] overflow-hidden rounded-lg border border-white/70 bg-white/60 p-2 shadow-[0_34px_90px_rgba(62,48,31,0.22)] backdrop-blur-sm"
          >
            <Image
              src="/images/prace/praca.webp"
              alt="Prémiový interiér kúpeľne s obkladom, umývadlom a drevenou skrinkou"
              width={1122}
              height={1402}
              sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 38vw, 88vw"
              className="aspect-[0.74] h-auto w-full rounded-md object-cover"
            />
          </figure>

          <nav
            data-motion="stagger"
            aria-label="Prehľad služieb"
            className="grid gap-3 sm:grid-cols-2 lg:col-span-2 xl:col-span-1"
          >
            {services.map((service, index) => (
              <Link
                key={service.slug}
                data-motion-item
                href={`/sluzby/${service.slug}`}
                className="group flex min-h-[82px] items-center gap-4 rounded-lg border border-white/72 bg-[#fffaf0]/82 px-4 py-4 text-left shadow-[0_18px_48px_rgba(62,48,31,0.1)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/92 hover:shadow-[0_24px_58px_rgba(62,48,31,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17130f]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#d8c6ad] bg-[#f7eadb] font-serif text-sm font-semibold text-[#9b5b38] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 text-base font-black leading-tight text-[#17130f]">{service.label}</span>
                <ArrowUpRight
                  className="shrink-0 text-[#c65f35] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#17130f]"
                  size={19}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <ProofBeforeContactSection />

      <section
        data-scene-stage="booking"
        data-scene-intensity="medium"
        className="relative z-10 bg-[#141414] py-20 pb-32 text-[#fffaf0] md:py-24"
      >
        <div className="booking-glow" data-booking-glow aria-hidden="true" />
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div data-motion="reveal" className="max-w-3xl">
            <p className="text-sm font-black uppercase text-white/48">Ďalší krok</p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">Dohodnime si obhliadku priestoru.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62">
              Najrýchlejšia cesta je zavolať, poslať fotky cez WhatsApp alebo rezervovať platený termín cez formulár.
            </p>
          </div>

          <BookingActions />
        </div>
      </section>
      </main>
    </HomePageMotion>
  );
}
