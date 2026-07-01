import Image from "next/image";
import Link from "next/link";
import { ArrowRightLeft, ArrowUpRight, Home } from "lucide-react";
import { Logo } from "@/components/Logo";

export function InteriorProcessSection() {
  return (
    <section
      id="core-value"
      data-scene-stage="value"
      data-scene-model="chair"
      data-scene-intensity="rest"
      className="relative z-10 overflow-hidden bg-[#fbf8f0]/95 py-20 backdrop-blur-xl md:py-28 lg:py-32"
    >
      <div className="container grid gap-12 lg:grid-cols-[0.95fr_1fr] lg:items-center">
        <div data-motion="reveal" className="max-w-3xl">
          <p className="text-sm font-black uppercase text-[#b85d3d]">Kompletné interiérové práce</p>

          <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[1.04] text-[#11100e] sm:text-5xl lg:text-[4.15rem]">
            Od prípravy priestoru až po čisté odovzdanie.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-black/68 sm:text-lg">
            Rekonštrukciu interiéru nevnímame ako zoznam samostatných úloh, ale ako jeden nadväzujúci postup.
            Obklady, dlažby, omietky, podlahy, sanita, dvere, zárubne, kovania aj sadrokartón musia spolu fungovať
            technicky, vizuálne aj prakticky.
          </p>

          <p className="mt-5 max-w-2xl text-base leading-8 text-black/68 sm:text-lg">
            Každý detail riešime tak, aby výsledný interiér pôsobil čisto, presne a vydržal každodenné používanie.
            Dôležitá je príprava podkladu, správna nadväznosť prác, rovina, napojenia, škáry, prechody aj finálne detaily.
          </p>
        </div>

        <div data-motion="reveal" data-parallax="10" className="relative mx-auto w-full max-w-[610px]">
          <div className="relative overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_26px_80px_rgba(42,35,24,0.16)]">
            <Image
              src="/images/interior-process/section2.webp"
              alt="Hotový moderný interiér s kuchyňou, obkladom a dlažbou"
              width={1024}
              height={695}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[1.47] h-auto w-full object-cover"
            />

            <div className="absolute right-3 top-3 rounded-md border border-black/10 bg-white/90 p-2 shadow-[0_18px_44px_rgba(20,20,20,0.15)] backdrop-blur-xl sm:right-6 sm:top-1/3 sm:p-4">
              <Logo variant="card" />
            </div>

            <div className="absolute bottom-3 left-3 w-[min(62%,16rem)] rounded-md border border-black/10 bg-white/92 p-2 shadow-[0_18px_44px_rgba(20,20,20,0.16)] backdrop-blur-xl sm:bottom-5 sm:left-5 sm:w-[18rem] sm:p-2.5">
              <p className="text-sm font-black text-black/78">Pred a Po</p>
              <div className="relative mt-2 grid grid-cols-2 gap-1.5 overflow-hidden rounded-md">
                <figure className="relative">
                  <Image
                    src="/images/interior-process/before.webp"
                    alt="Interiér pred rekonštrukciou"
                    width={793}
                    height={1024}
                    sizes="140px"
                    className="aspect-[1.08] h-full w-full object-cover"
                  />
                  <figcaption className="absolute left-1.5 top-1.5 rounded-sm bg-black/62 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
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
                  <figcaption className="absolute right-1.5 top-1.5 rounded-sm bg-black/62 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
                    After
                  </figcaption>
                </figure>
                <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white text-[#11100e] shadow-[0_10px_22px_rgba(20,20,20,0.18)]">
                  <ArrowRightLeft size={16} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-black/12 bg-white/76 text-[#11100e] shadow-[0_12px_32px_rgba(20,20,20,0.08)]">
              <Home size={22} aria-hidden="true" />
            </span>
            <Link href="/booking" className="btn-primary border-[#d94922] bg-[#e44f22] text-white hover:bg-[#c83f18]">
              Získajte cenovú ponuku
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
