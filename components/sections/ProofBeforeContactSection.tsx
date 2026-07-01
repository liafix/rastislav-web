import Image from "next/image";
import { Ruler, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

const proofItems = [
  {
    icon: ShieldCheck,
    title: "Lokálny kontakt",
    text: "Dubnica nad Váhom, Ilava, Trenčín a okolie obce. Rýchla obhliadka a jasná komunikácia."
  },
  {
    icon: Ruler,
    title: "Presný postup",
    text: "Obklady, dlažby, sanita, podlahy aj sadrokartón nadväzujú v jednom zrozumiteľnom procese."
  },
  {
    icon: Sparkles,
    title: "Hotový priestor",
    text: "Cieľom nie je iba vykonaná práca, ale interiér, ktorý pôsobí pokojne, čisto a dôveryhodne."
  }
] satisfies Array<{
  icon: LucideIcon;
  title: string;
  text: string;
}>;

const processSteps = ["Obhliadka", "Cenová ponuka", "Realizácia", "Odovzdanie"];

export function ProofBeforeContactSection() {
  return (
    <section
      id="dokaz-pred-kontaktom"
      aria-labelledby="dokaz-pred-kontaktom-title"
      data-scene-stage="proof"
      data-scene-intensity="medium"
      className="relative z-10 isolate overflow-hidden bg-[#efe5d7] text-[#17120e]"
    >
      <div className="absolute inset-0 -z-20 bg-[#efe5d7]" aria-hidden="true" />
      <Image
        src="/images/proof/dokaz-pred-kontaktom.webp"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover object-[28%_center] sm:object-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,249,238,0.94) 0%, rgba(255,249,238,0.78) 36%, rgba(255,249,238,0.34) 61%, rgba(241,226,208,0.58) 100%)"
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_13%_25%,rgba(255,255,255,0.74),transparent_24rem),radial-gradient(circle_at_77%_23%,rgba(255,255,255,0.48),transparent_19rem),linear-gradient(180deg,rgba(255,250,240,0.15),rgba(226,196,161,0.34))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-[linear-gradient(180deg,transparent,rgba(255,246,232,0.82)_50%,rgba(232,207,178,0.58))]"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[720px] w-[min(1540px,calc(100%_-_32px))] flex-col justify-between gap-10 py-14 sm:w-[min(1540px,calc(100%_-_48px))] md:min-h-[760px] md:py-18 xl:min-h-[820px] xl:py-20">
        <div className="grid gap-10 xl:grid-cols-[minmax(340px,0.78fr)_minmax(720px,1.22fr)] xl:items-center xl:pt-8">
          <div data-motion="reveal" className="max-w-[39rem]">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#d45a1b] sm:text-sm">
              DÔKAZ PRED KONTAKTOM
            </p>
            <div className="mt-5 h-px w-12 bg-[#e44f22]" aria-hidden="true" />
            <h2
              id="dokaz-pred-kontaktom-title"
              className="mt-6 max-w-[11.5ch] font-serif text-[clamp(3rem,10vw,5.7rem)] font-semibold leading-[0.98] tracking-normal text-[#18140f] sm:text-[clamp(4.2rem,8vw,6.6rem)] xl:text-[6.4rem]"
            >
              Dobrý výsledok začína jasnou dohodou pred prvým zásahom do priestoru.
            </h2>
          </div>

          <div data-motion="stagger" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {proofItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  data-motion-item
                  className="group relative min-h-[252px] overflow-hidden rounded-[28px] border border-white/65 bg-[#fff8ec]/90 p-6 shadow-[0_26px_70px_rgba(72,52,31,0.16),inset_0_1px_0_rgba(255,255,255,0.78)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_86px_rgba(72,52,31,0.2),inset_0_1px_0_rgba(255,255,255,0.86)] supports-[backdrop-filter]:bg-[#fff8ec]/58 supports-[backdrop-filter]:backdrop-blur-2xl sm:p-7 xl:min-h-[296px]"
                >
                  <span
                    className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.62),transparent_13rem),linear-gradient(145deg,rgba(255,255,255,0.2),transparent_42%)]"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <span className="grid size-12 place-items-center text-[#e45b1e]">
                      <Icon size={35} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <h3 className="mt-7 text-2xl font-black leading-tight text-[#17120e]">{item.title}</h3>
                    <div className="mt-6 h-px w-14 bg-[#e44f22]" aria-hidden="true" />
                    <p className="mt-7 max-w-[18rem] text-base leading-8 text-[#3f372f]">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <ol
          data-motion="stagger"
          className="grid gap-3 rounded-[30px] border border-white/60 bg-[#fff7eb]/86 p-3 shadow-[0_22px_70px_rgba(75,54,31,0.14),inset_0_1px_0_rgba(255,255,255,0.82)] supports-[backdrop-filter]:bg-[#fff7eb]/54 supports-[backdrop-filter]:backdrop-blur-2xl sm:grid-cols-2 xl:grid-cols-4 xl:gap-0 xl:rounded-[36px] xl:p-4"
        >
          {processSteps.map((step, index) => (
            <li
              key={step}
              data-motion-item
              className="relative flex items-center gap-4 rounded-[22px] px-3 py-3 sm:px-4 xl:rounded-none xl:px-7"
            >
              <span
                className="grid size-14 shrink-0 place-items-center rounded-full border border-white/80 bg-[#fffaf1]/92 font-serif text-lg font-semibold text-[#d95a1f] shadow-[0_12px_30px_rgba(196,111,47,0.2),0_0_22px_rgba(255,255,255,0.72),inset_0_1px_0_rgba(255,255,255,0.9)]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="min-w-0 text-base font-bold leading-tight text-[#1d1813]">
                <span className="mr-3 text-[#e44f22]" aria-hidden="true">
                  /
                </span>
                {step}
              </p>
              {index < processSteps.length - 1 ? (
                <span
                  className="absolute right-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-white/58 xl:block"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
