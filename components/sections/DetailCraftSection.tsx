import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const detailFeatures = [
  "ZAMERANIE PRIESTORU",
  "ČISTÝ DETAIL PRI HRANÁCH",
  "NADVÄZNOSŤ PROFESIÍ",
  "ODOVZDANIE BEZ CHAOSU"
];

export function DetailCraftSection() {
  return (
    <section
      data-scene-stage="craft"
      data-scene-intensity="medium"
      className="relative z-10 min-h-[700px] overflow-hidden bg-[#efe5d8] py-16 text-[#17130f] md:py-24 lg:min-h-[730px] lg:py-28 xl:min-h-[760px]"
    >
      <Image
        src="/images/detail/background2.webp"
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-[49%_center] md:object-[50%_center] lg:object-[51%_center]"
      />
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(244,234,220,0.78)_0%,rgba(244,234,220,0.38)_34%,rgba(244,234,220,0.18)_52%,rgba(244,234,220,0.62)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_48%,rgba(255,204,142,0.24),transparent_25rem),linear-gradient(180deg,rgba(255,255,255,0.42)_0%,transparent_34%,rgba(219,202,179,0.24)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 z-[3] h-36 bg-[linear-gradient(180deg,transparent,rgba(238,226,210,0.72))]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-[min(1600px,calc(100%_-_32px))] gap-6 md:w-[min(1600px,calc(100%_-_48px))] lg:grid-cols-[minmax(0,0.95fr)_minmax(96px,0.26fr)_minmax(0,0.78fr)] lg:items-center lg:gap-8 xl:gap-10">
        <article
          data-motion="reveal"
          data-parallax="10"
          className="relative overflow-hidden rounded-[24px] border border-white/70 bg-[#fffaf0]/78 p-6 shadow-[0_34px_110px_rgba(58,45,30,0.18),inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-xl sm:p-8 md:p-10 lg:min-h-[500px] lg:p-12 xl:min-h-[545px] xl:rounded-[28px] xl:p-14"
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.82),transparent_22rem),linear-gradient(135deg,rgba(255,255,255,0.32),transparent_45%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-white/90"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c96a3f] sm:text-sm">
              DETAIL ROZHODUJE
            </p>
            <div className="mt-7 h-px w-12 bg-[#c96a3f]/62" aria-hidden="true" />
            <h2 className="mt-7 max-w-[12ch] font-serif text-5xl font-semibold leading-[0.98] tracking-normal text-[#211f1b] sm:text-6xl md:text-[4.6rem] lg:text-[4.25rem] xl:text-[5rem]">
              Kvalitný výsledok cítiť najmä v detailoch, ktoré nerušia.
            </h2>
            <p className="mt-7 max-w-[37rem] text-base leading-8 text-black/64 sm:text-lg sm:leading-9">
              Hrany, napojenia, škáry, podklad a poradie prác rozhodujú o tom, či bude interiér pôsobiť pokojne a
              čisto. Preto riešime prípravu aj dokončenie tak, aby výsledok fungoval technicky aj pri každodennom
              používaní.
            </p>
          </div>
        </article>

        <div className="hidden lg:block" aria-hidden="true" />

        <div data-motion="stagger" className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {detailFeatures.map((feature, index) => (
            <article
              key={feature}
              data-motion-item
              className="group relative min-h-[190px] overflow-hidden rounded-[20px] border border-white/72 bg-[#fffaf0]/72 p-6 shadow-[0_24px_76px_rgba(58,45,30,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-[#fffaf0]/84 hover:shadow-[0_30px_90px_rgba(58,45,30,0.18),inset_0_1px_0_rgba(255,255,255,0.92)] sm:min-h-[215px] md:p-7 lg:min-h-[230px] xl:min-h-[245px] xl:rounded-[22px] xl:p-8"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.58),transparent_54%),radial-gradient(circle_at_85%_15%,rgba(255,237,212,0.62),transparent_16rem)]"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col">
                <p className="font-serif text-lg font-semibold leading-none text-[#c96a3f]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mt-5 h-px w-7 bg-[#c96a3f]/58" aria-hidden="true" />
                <h3 className="mt-7 max-w-[12rem] text-xl font-black uppercase leading-[1.16] tracking-normal text-[#20201d] sm:text-[1.35rem]">
                  {feature}
                </h3>
                <span className="mt-auto grid size-10 self-end rounded-full border border-[#d99270]/62 bg-white/38 text-[#c96a3f] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#c96a3f]/80 group-hover:text-[#17130f]">
                  <ArrowUpRight className="m-auto" size={17} strokeWidth={1.7} aria-hidden="true" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
