import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronRight, Eye, KeyRound, MessageCircle, PenTool, Ruler } from "lucide-react";
import { CounterUp } from "@/components/motion/effects/CounterUp";
import { FloatingElement } from "@/components/motion/effects/FloatingElement";
import { MagneticButton } from "@/components/motion/effects/MagneticButton";
import { company } from "@/lib/content/services";

const heroProcess = [
  { label: "Obhliadka", icon: Eye },
  { label: "Detail", icon: Ruler },
  { label: "Realizácia", icon: PenTool },
  { label: "Odovzdanie", icon: KeyRound }
];

export function HomeHero() {
  return (
    <section
      data-scene-stage="hero"
      data-scene-intensity="high"
      className="home-hero home-hero--cinematic relative z-10 flex min-h-[100svh] items-end overflow-hidden pt-28"
    >
      <div className="hero-bg-stack" data-hero-bg aria-hidden="true">
        <Image
          src="/hero/background-interior.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          data-hero-image
          sizes="100vw"
          className="hero-bg-image object-cover object-[62%_center]"
        />
        <div className="hero-grain" />
        <div className="hero-vignette" />
        <div className="hero-scrim" />
        <div className="hero-glow-cursor" data-hero-glow aria-hidden="true" />
      </div>

      <div className="container relative z-20 pb-14 lg:pb-20">
        <div className="hero-content max-w-3xl" data-hero-content>
          <p className="hero-kicker gradient-text text-xs font-black uppercase sm:text-sm" data-hero-kicker>
            Martiš MV / Dubnica nad Váhom
          </p>

          <h1 className="hero-display-title hero-display-title--light mt-8 max-w-4xl uppercase">
            <span data-text-mask-line>Rekonštrukcie</span>
            <span data-text-mask-line>interiéru</span>
            <span data-text-mask-line>na kľúč</span>
          </h1>

          <p className="hero-lede hero-lede--light mt-7 max-w-xl font-serif text-xl leading-9 sm:text-2xl" data-hero-fade>
            Prémiové interiérové rekonštrukcie na kľúč. Obhliadka, precízny postup, čistý detail a výsledok, ktorý
            vydrží.
          </p>

          <div className="mt-8 flex flex-wrap gap-6" data-hero-fade>
            <div className="hero-stat">
              <CounterUp end={15} suffix="+" className="hero-stat__value" />
              <span className="hero-stat__label">rokov skúseností</span>
            </div>
            <div className="hero-stat">
              <CounterUp end={120} suffix="+" className="hero-stat__value" />
              <span className="hero-stat__label">realizovaných priestorov</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row" data-hero-fade>
            <MagneticButton className="inline-flex">
              <Link href="/booking" className="btn-primary hero-primary-cta hero-primary-cta--light">
                Rezervovať obhliadku
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </MagneticButton>
            <MagneticButton className="inline-flex">
              <a
                href={company.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary hero-secondary-cta hero-secondary-cta--light"
              >
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp
              </a>
            </MagneticButton>
          </div>
        </div>

        <aside className="hero-process-card hero-process-card--floating mt-10 lg:absolute lg:bottom-20 lg:right-8 lg:mt-0" data-parallax="18">
          <p className="text-xs font-black uppercase text-[#d65a2a]">Od obhliadky po odovzdanie</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-[#151311] sm:text-4xl">
            Obhliadka, detail,
            <br />
            realizácia, odovzdanie.
          </h2>
          <div className="mt-5 h-px w-12 bg-[#d65a2a]" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-black/62">
            Každý projekt vedieme cez jasný postup: posúdenie priestoru, prípravu, realizáciu a čisté odovzdanie.
          </p>

          <div className="mt-7 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-start gap-2 border-t border-black/10 pt-5">
            {heroProcess.map((item, index) => (
              <div key={item.label} className="contents">
                <div className="text-center">
                  <span data-stroke-icon className="mx-auto block w-fit">
                    <item.icon className="text-[#161412]" size={22} aria-hidden="true" strokeWidth={1.6} />
                  </span>
                  <p className="mt-3 text-[10px] font-black uppercase text-black/48">{item.label}</p>
                </div>
                {index < heroProcess.length - 1 ? (
                  <ChevronRight key={`${item.label}-arrow`} className="mt-1 text-black/28" size={18} aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </aside>

        <FloatingElement className="hero-scroll-hint hero-scroll-hint--light">
          <a href="#core-value" className="hero-scroll-hint__link">
            <span className="grid size-14 place-items-center rounded-full border border-white/32">
              <ArrowDown size={22} aria-hidden="true" />
            </span>
            <span>
              <span>Zistiť viac</span>
              <small>Posúvajte nižšie</small>
            </span>
          </a>
        </FloatingElement>
      </div>
    </section>
  );
}
