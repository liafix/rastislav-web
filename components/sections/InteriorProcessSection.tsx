import Image from "next/image";
import Link from "next/link";
import { ArrowRightLeft, ArrowUpRight, Home } from "lucide-react";
import { Logo } from "@/components/Logo";

export function InteriorProcessSection() {
  return (
    <section
      id="core-value"
      data-scene-stage="value"
      data-scene-intensity="rest"
      className="relative isolate z-10 overflow-hidden bg-[#f8f1e6] py-20 md:py-28 lg:py-32"
    >
      {/* Premium static 3D-feeling background */}
      <Image
        src="/images/interior-process/interior-process-background.webp"
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-center"
      />

      {/* Readability scrims and warm editorial depth */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(251,248,240,0.96)_0%,rgba(251,248,240,0.82)_42%,rgba(251,248,240,0.46)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_46%,rgba(255,255,255,0.52),transparent_35%),radial-gradient(circle_at_16%_18%,rgba(228,79,34,0.11),transparent_32%),radial-gradient(circle_at_88%_82%,rgba(184,93,61,0.10),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-[#fbf8f0]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[#fbf8f0] to-transparent" />

      {/* Subtle premium grain/light layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-soft-light [background-image:radial-gradient(circle_at_1px_1px,rgba(17,16,14,0.22)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="container relative grid gap-12 lg:grid-cols-[0.95fr_1fr] lg:items-center">
        <div data-motion="reveal" className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b85d3d]">
            Kompletné interiérové práce
          </p>

          <div className="mt-4 h-px w-16 bg-[#b85d3d]/70" />

          <h2 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#11100e] sm:text-6xl lg:text-[5rem]">
            Od prípravy priestoru až po čisté odovzdanie.
          </h2>

          <div className="mt-8 max-w-2xl rounded-[1.6rem] border border-white/55 bg-[#fbf8f0]/58 p-5 shadow-[0_24px_80px_rgba(42,35,24,0.08)] backdrop-blur-md sm:p-6">
            <p className="text-base leading-8 text-black/70 sm:text-lg">
              Rekonštrukciu interiéru nevnímame ako zoznam samostatných úloh, ale ako jeden nadväzujúci postup.
              Obklady, dlažby, omietky, podlahy, sanita, dvere, zárubne, kovania aj sadrokartón musia spolu fungovať
              technicky, vizuálne aj prakticky.
            </p>

            <p className="mt-5 text-base leading-8 text-black/70 sm:text-lg">
              Každý detail riešime tak, aby výsledný interiér pôsobil čisto, presne a vydržal každodenné používanie.
              Dôležitá je príprava podkladu, správna nadväznosť prác, rovina, napojenia, škáry, prechody aj finálne detaily.
            </p>
          </div>
        </div>

        <div
          data-motion="reveal"
          data-parallax="10"
          className="group relative mx-auto w-full max-w-[660px]"
        >
          {/* Floating ambient glow behind the main visual */}
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.75rem] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.70),rgba(228,79,34,0.12)_38%,transparent_72%)] blur-2xl transition duration-700 group-hover:opacity-90" />
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.25rem] border border-white/40 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-sm" />

          <div className="relative overflow-hidden rounded-[1.65rem] border border-white/65 bg-white/50 shadow-[0_34px_110px_rgba(42,35,24,0.22)] backdrop-blur-xl transition duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_44px_130px_rgba(42,35,24,0.28)]">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[1.65rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-1px_0_rgba(17,16,14,0.06)]" />

            <Image
              src="/images/interior-process/section2.webp"
              alt="Hotový moderný interiér s kuchyňou, obkladom a dlažbou"
              width={1024}
              height={695}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[1.47] h-auto w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
            />

            {/* Logo glass badge */}
            <div className="absolute right-3 top-3 z-20 rounded-2xl border border-white/70 bg-white/84 p-2 shadow-[0_20px_60px_rgba(20,20,20,0.18)] backdrop-blur-2xl transition duration-500 group-hover:-translate-y-0.5 sm:right-6 sm:top-1/3 sm:p-4">
              <Logo variant="card" />
            </div>

            {/* Before / After glass card */}
            <div className="absolute bottom-3 left-3 z-20 w-[min(64%,16rem)] rounded-2xl border border-white/70 bg-white/90 p-2 shadow-[0_24px_70px_rgba(20,20,20,0.20)] backdrop-blur-2xl transition duration-500 group-hover:-translate-y-0.5 sm:bottom-5 sm:left-5 sm:w-[18rem] sm:p-2.5">
              <p className="text-sm font-black text-black/80">Pred a Po</p>

              <div className="relative mt-2 grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl">
                <figure className="relative">
                  <Image
                    src="/images/interior-process/before.webp"
                    alt="Interiér pred rekonštrukciou"
                    width={793}
                    height={1024}
                    sizes="140px"
                    className="aspect-[1.08] h-full w-full object-cover"
                  />
                  <figcaption className="absolute left-1.5 top-1.5 rounded-md bg-black/68 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                    Before
                  </figcaption>
                </figure>

                <figure className="relative">
                  <Image
                    src="/images/interior-process/after.webp"
                    alt="Interiér po rekonštrukcii"
                    width={793}
                    height={1024}
                    sizes="140px"
                    className="aspect-[1.08] h-full w-full object-cover"
                  />
                  <figcaption className="absolute right-1.5 top-1.5 rounded-md bg-black/68 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                    After
                  </figcaption>
                </figure>

                <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white text-[#11100e] shadow-[0_12px_28px_rgba(20,20,20,0.22)]">
                  <ArrowRightLeft size={16} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-white/70 bg-white/82 text-[#11100e] shadow-[0_16px_40px_rgba(20,20,20,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5">
              <Home size={22} aria-hidden="true" />
            </span>

            <Link
              href="/booking"
              className="btn-primary border-[#11100e] bg-[#11100e] text-white shadow-[0_20px_50px_rgba(17,16,14,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-[#e44f22] hover:bg-[#e44f22] hover:shadow-[0_24px_70px_rgba(228,79,34,0.28)]"
            >
              Získajte cenovú ponuku
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}