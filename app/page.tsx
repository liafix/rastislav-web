import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { BookingActions } from "@/components/marketing/BookingActions";
import { HomePageMotion } from "@/components/motion/HomePageMotion";
import { ProofCard } from "@/components/marketing/ProofCard";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { HomeHero } from "@/components/sections/HomeHero";
import { processSteps, services } from "@/lib/content/services";
import { buildPageMetadata, localBusinessJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Rekonštrukcie interiéru Dubnica nad Váhom | mv MARTIŠ",
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

      <section
  id="core-value"
  data-scene-stage="value"
  data-scene-model="chair"
  data-scene-intensity="rest"
  className="relative z-10 bg-[#fbf8f0]/92 py-24 backdrop-blur-xl md:py-32"
>
  <div className="container">
    <div data-motion="reveal" className="max-w-3xl">
      <p className="text-sm font-black uppercase text-[#e44f22]">
        Kompletné interiérové práce
      </p>

      <h2 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
        Od prípravy priestoru až po čisté odovzdanie.
      </h2>

      <p className="mt-6 text-lg leading-8 text-black/64">
        Rekonštrukciu interiéru nevnímame ako zoznam samostatných úloh, ale ako jeden nadväzujúci postup.
        Obklady, dlažby, omietky, podlahy, sanita, dvere, zárubne, kovania aj sadrokartón musia spolu fungovať
        technicky, vizuálne aj prakticky.
      </p>

      <p className="mt-5 text-lg leading-8 text-black/64">
        Každý detail riešime tak, aby výsledný interiér pôsobil čisto, presne a vydržal každodenné používanie.
        Dôležitá je príprava podkladu, správna nadväznosť prác, rovina, napojenia, škáry, prechody aj finálne detaily.
      </p>
    </div>
  </div>
</section>

      <section
        data-scene-stage="craft"
        data-scene-model="nightstand"
        data-scene-intensity="medium"
        className="relative z-10 py-24 md:py-36"
      >
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
          <div data-motion="reveal" className="max-w-xl rounded-md border border-black/10 bg-[#f7f4ed]/78 p-6 backdrop-blur-xl" data-parallax="14">
            <p className="text-sm font-black uppercase text-[#e44f22]">Detail rozhoduje</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Rekonštrukcia pôsobí luxusne vtedy, keď nič nevyrušuje.
            </h2>
            <p className="mt-5 text-base leading-8 text-black/66">
              Hrany, napojenia, škáry, podklad a poradie prác vytvárajú pocit kvality. Táto časť stránky je pomalšia,
              technická a presná, aby vizuál podporil remeslo.
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

      <section
        data-scene-stage="services"
        data-scene-model="coffeeTable"
        data-scene-intensity="high"
        className="relative z-10 bg-[#f7f4ed]/90 py-24 backdrop-blur-xl md:py-32"
      >
        <div className="container">
          <div data-motion="reveal" className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase text-[#e44f22]">Služby ako showroom</p>
              <h2 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">Kompletná práca v interiéri.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-black/64">
                Vysoký vizuálny moment patrí sem: služby sa ukážu ako jeden systém, nie ako náhodný zoznam prác.
              </p>
            </div>
            <Link href="/sluzby" className="btn-secondary w-fit">
              Všetky služby
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <div data-motion="assemble" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div key={service.slug} data-motion-item>
                <ServiceCard service={service} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        data-scene-stage="index"
        data-scene-model="coffeeTable"
        data-scene-intensity="rest"
        className="relative z-10 bg-[#fffaf0] py-20 md:py-28"
      >
        <div className="container grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div data-motion="reveal">
            <p className="text-sm font-black uppercase text-[#e44f22]">Tichý index služieb</p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">Tu sa má dať čítať bez efektov.</h2>
          </div>
          <nav data-motion="stagger" aria-label="Prehľad služieb" className="grid gap-2 sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                data-motion-item
                href={`/sluzby/${service.slug}`}
                className="group flex min-h-16 items-center justify-between gap-4 border-b border-black/10 py-4 text-left"
              >
                <span className="text-lg font-black">{service.label}</span>
                <ArrowUpRight className="text-black/32 transition group-hover:text-[#e44f22]" size={20} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section
        data-scene-stage="proof"
        data-scene-model="sideTable"
        data-scene-intensity="medium"
        className="relative z-10 bg-[#ede7dc] py-24 md:py-32"
      >
        <div className="container">
          <div data-motion="reveal" className="max-w-3xl">
            <p className="text-sm font-black uppercase text-[#e44f22]">Dôkaz pred kontaktom</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Stránka má pôsobiť draho, ale zákazník musí cítiť istotu.
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
        data-scene-model="sideTable"
        data-scene-intensity="medium"
        className="relative z-10 bg-[#141414] py-20 pb-32 text-[#fffaf0] md:py-24"
      >
        <div className="booking-glow" data-booking-glow aria-hidden="true" />
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div data-motion="reveal" className="max-w-3xl">
            <p className="text-sm font-black uppercase text-white/48">Ďalší krok</p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">Dohodnime si obhliadku priestoru.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62">
              Najrýchlejšia cesta je zavolať, poslať fotky cez WhatsApp alebo vyplniť krátky formulár.
            </p>
          </div>

          <BookingActions />
        </div>
      </section>
      </main>
    </HomePageMotion>
  );
}
