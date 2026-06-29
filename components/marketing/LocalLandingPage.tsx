import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MapPin } from "lucide-react";
import type { LocalPage } from "@/lib/content/local-pages";
import { company, getService } from "@/lib/content/services";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo/metadata";

type LocalLandingPageProps = {
  page: LocalPage;
};

function localPageJsonLd(page: LocalPage) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.h1,
      description: page.description,
      url: absoluteUrl(page.path),
      about: {
        "@type": "Service",
        name: page.h1,
        provider: {
          "@type": "HomeAndConstructionBusiness",
          name: company.name,
          url: absoluteUrl("/")
        },
        areaServed: {
          "@type": "Place",
          name: page.location
        },
        serviceType: "Interiérové rekonštrukcie"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    },
    breadcrumbJsonLd([
      { name: "Domov", path: "/" },
      { name: page.location, path: page.path }
    ])
  ];
}

export function LocalLandingPage({ page }: LocalLandingPageProps) {
  const jsonLd = localPageJsonLd(page);

  return (
    <main className="pt-28">
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_360px] lg:items-start">
        <article>
          <p className="text-sm font-black uppercase text-[#e44f22]">{page.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight">{page.h1}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/66">{page.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/booking?location=${encodeURIComponent(page.location)}`} className="btn-primary">
              {page.ctaText}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/kontakt" className="btn-secondary">
              Kontaktovať
            </Link>
          </div>

          <section className="mt-16">
            <h2 className="text-3xl font-black">{page.contextTitle}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-black/66">{page.context}</p>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black">{page.includedTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {page.included.map((item) => (
                <div key={item} className="flex gap-3 rounded-md border border-black/10 bg-white/62 p-5">
                  <CheckCircle2 className="mt-1 shrink-0 text-[#257a57]" size={20} aria-hidden="true" />
                  <p className="leading-7 text-black/66">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black">{page.processTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {page.process.map((step, index) => (
                <div key={step.title} className="rounded-md border border-black/10 bg-white/62 p-5">
                  <span className="text-xs font-black text-black/36">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-8 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black">Časté otázky pre lokalitu {page.location}</h2>
            <div className="mt-6 grid gap-4">
              {page.faq.map((item) => (
                <div key={item.question} className="rounded-md border border-black/10 bg-white/62 p-5">
                  <h3 className="font-black">{item.question}</h3>
                  <p className="mt-3 leading-7 text-black/62">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass-surface rounded-md p-5">
            <MapPin className="text-[#e44f22]" size={28} aria-hidden="true" />
            <p className="mt-5 text-2xl font-black">{page.location}</p>
            <p className="mt-3 text-sm leading-6 text-black/62">
              V tejto lokalite vieme podľa rozsahu riešiť obhliadku, konzultáciu alebo konkrétne interiérové práce.
            </p>
            <Link href={`/booking?location=${encodeURIComponent(page.location)}`} className="btn-primary mt-6 w-full">
              Rezervovať obhliadku
            </Link>
            <Link href="/kontakt" className="btn-secondary mt-3 w-full">
              Kontaktovať
            </Link>
          </div>

          <nav aria-label={`Služby pre ${page.location}`} className="mt-4 rounded-md border border-black/10 bg-white/62 p-5">
            <p className="text-sm font-black uppercase text-black/42">Relevantné služby</p>
            <div className="mt-3 grid gap-2">
              {page.serviceLinks.map((slug) => {
                const service = getService(slug);
                if (!service) return null;

                return (
                  <Link
                    key={slug}
                    href={`/sluzby/${service.slug}`}
                    className="flex items-center justify-between gap-3 border-b border-black/10 py-3 font-bold last:border-b-0"
                  >
                    {service.shortLabel}
                    <ArrowUpRight className="text-black/36" size={18} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>
      </section>
    </main>
  );
}
