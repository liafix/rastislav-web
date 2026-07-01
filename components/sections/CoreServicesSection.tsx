import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content/services";

export function CoreServicesSection() {
  return (
    <section
      id="sluzby"
      aria-labelledby="core-services-title"
      data-scene-stage="services"
      data-scene-intensity="high"
      className="relative z-10 overflow-hidden bg-[#f4efe5] py-24 text-[#17130f] md:py-32"
    >
      <div
        className="absolute inset-0 opacity-[0.34]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.18) 48%, rgba(166,143,112,0.18) 100%)"
        }}
      />
      <div
        className="absolute right-0 top-0 hidden h-full w-[34%] border-l border-black/5 bg-[linear-gradient(90deg,rgba(244,239,229,0),rgba(221,210,193,0.42))] lg:block"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div data-motion="reveal" className="max-w-[760px]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b552f] sm:text-sm">SLUŽBY V JEDNOM POSTUPE</p>
            <h2
              id="core-services-title"
              className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.96] tracking-normal text-[#080705] sm:text-6xl lg:text-[5.35rem]"
            >
              Kompletná práca v interiéri.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-black/68 sm:text-lg">
              Obklady, dlažby, podlahy, sanita, dvere aj sadrokartón na seba musia nadväzovať. Preto riešime rozsah,
              poradie prác a detail ako jeden zrozumiteľný celok.
            </p>
          </div>

          <div data-motion="reveal" className="flex flex-wrap items-center gap-4 lg:block lg:min-w-48 lg:pt-10">
            <div className="grid size-20 place-items-center rounded-md border border-white/70 bg-white/72 font-serif text-4xl font-semibold text-[#7c5f39] shadow-[0_20px_54px_rgba(48,39,26,0.18)] backdrop-blur-xl lg:ml-auto lg:size-24 lg:text-5xl">
              01
            </div>
            <Link
              href="/sluzby"
              className="btn-primary mt-0 min-h-12 border-[#17130f] bg-[#17130f] px-5 text-[#fffaf0] shadow-[0_18px_42px_rgba(23,19,15,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17130f] lg:mt-16"
            >
              Pozrieť služby
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div data-motion="assemble" className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {services.map((service, index) => (
            <div key={service.slug} data-motion-item>
              <Link
                href={`/sluzby/${service.slug}`}
                className="group relative grid min-h-[205px] overflow-hidden rounded-lg border border-white/62 bg-[#f8f4eb] p-5 shadow-[0_22px_58px_rgba(50,42,31,0.13)] transition duration-300 hover:-translate-y-1 hover:border-white/90 hover:shadow-[0_30px_72px_rgba(50,42,31,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17130f]"
              >
                <Image
                  src={service.cardImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-[0.72] transition duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,252,245,0.92)_0%,rgba(255,252,245,0.74)_42%,rgba(255,252,245,0.36)_100%)]"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(255,252,245,0.92),rgba(255,252,245,0))]"
                  aria-hidden="true"
                />

                <span className="relative flex items-start justify-between gap-4">
                  <span className="text-xs font-black text-black/46">{String(index + 1).padStart(2, "0")}</span>
                  <ArrowUpRight
                    className="text-[#7f6948] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#17130f]"
                    size={19}
                    aria-hidden="true"
                  />
                </span>

                <span className="relative mt-10 block self-end">
                  <span className="block font-serif text-[1.7rem] font-semibold leading-[1.02] text-[#080705]">{service.label}</span>
                  <span className="line-clamp-3 mt-3 block text-sm leading-6 text-black/70">{service.cardPreview ?? service.intro}</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
