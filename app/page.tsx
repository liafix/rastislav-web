import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { BookingActions } from "@/components/marketing/BookingActions";
import { HomePageMotion } from "@/components/motion/HomePageMotion";
import { ProofCard } from "@/components/marketing/ProofCard";
import { CoreServicesSection } from "@/components/sections/CoreServicesSection";
import { HomeHero } from "@/components/sections/HomeHero";
import { InteriorProcessSection } from "@/components/sections/InteriorProcessSection";
import { processSteps, services } from "@/lib/content/services";
import { buildPageMetadata, localBusinessJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Rekonštrukcie interiéru Dubnica nad Váhom | Martiš MV",
  description:
    "Prémiové interiérové rekonštrukcie, obklady, dlažby, podlahy, sanita, dvere a sadrokartón pre Dubnicu nad Váhom, Ilavu, Trenčín a okolie.",
  path: "/"
});

const craftPoints = [
  "zameranie priestoru",
  "čistý detail pri hranách",
  "nadväznosť profesií",
  "odovzdanie bez chaosu"
];

const proofItems = [
  {
    icon: "shield" as const,
    title: "Lokálny kontakt",
    text: "Dubnica nad Váhom, Ilava, Trenčín a okolité obce. Rýchla obhliadka a jasná komunikácia."
  },
  {
    icon: "ruler" as const,
    title: "Presný postup",
    text: "Obklady, dlažby, sanita, podlahy aj sadrokartón nadväzujú v jednom zrozumiteľnom procese."
  },
  {
    icon: "sparkles" as const,
    title: "Hotový priestor",
    text: "Cieľom nie je iba vykonaná práca, ale interiér, ktorý pôsobí pokojne, čisto a dôveryhodne."
  }
];

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

      <section
        data-scene-stage="craft"
        data-scene-intensity="medium"
        className="relative z-10 py-24 md:py-36"
      >
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
          <div data-motion="reveal" className="max-w-xl rounded-md border border-black/10 bg-[#f7f4ed]/78 p-6 backdrop-blur-xl" data-parallax="14">
            <p className="text-sm font-black uppercase text-[#e44f22]">Detail rozhoduje</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Kvalitný výsledok cítiť najmä v detailoch, ktoré nerušia.
            </h2>
            <p className="mt-5 text-base leading-8 text-black/66">
              Hrany, napojenia, škáry, podklad a poradie prác rozhodujú o tom, či bude interiér pôsobiť pokojne a čisto.
              Preto riešime prípravu aj dokončenie tak, aby výsledok fungoval technicky aj pri každodennom používaní.
            </p>
          </div>

          <div data-motion="stagger" className="grid gap-3 sm:grid-cols-2">
            {craftPoints.map((point, index) => (
              <div
                key={point}
                data-motion-item
                className="rounded-md border border-black/10 bg-white/62 p-5 shadow-[0_20px_54px_rgba(20,20,20,0.05)]"
              >
                <p className="text-xs font-black text-black/34">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-8 text-xl font-black uppercase leading-tight">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section
        data-scene-stage="proof"
        data-scene-intensity="medium"
        className="relative z-10 bg-[#ede7dc] py-24 md:py-32"
      >
        <div className="container">
          <div data-motion="reveal" className="max-w-3xl">
            <p className="text-sm font-black uppercase text-[#e44f22]">Dôkaz pred kontaktom</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Dobrý výsledok začína jasnou dohodou pred prvým zásahom do priestoru.
            </h2>
          </div>

          <div data-motion="stagger" className="mt-10 grid gap-4 md:grid-cols-3">
            {proofItems.map((item) => (
              <div key={item.title} data-motion-item>
                <ProofCard icon={item.icon} title={item.title} text={item.text} />
              </div>
            ))}
          </div>

          <div data-motion="stagger" className="mt-10 grid gap-3 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step} data-motion-item className="flex items-center gap-3 rounded-md border border-black/10 bg-[#f8f3e8]/70 p-4">
                <CheckCircle2 className="shrink-0 text-[#257a57]" size={20} aria-hidden="true" />
                <p className="text-sm font-black">
                  {String(index + 1).padStart(2, "0")} / {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
