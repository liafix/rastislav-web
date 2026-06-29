import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { company, getService, services } from "@/lib/content/services";
import {
  breadcrumbJsonLd,
  buildServiceMetadata,
  faqJsonLd,
  serviceJsonLd
} from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildServiceMetadata(service);
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const jsonLd = [
    serviceJsonLd(service),
    faqJsonLd(service),
    breadcrumbJsonLd([
      { name: "Domov", path: "/" },
      { name: "Služby", path: "/sluzby" },
      { name: service.label, path: `/sluzby/${service.slug}` }
    ])
  ];

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

      <section className="container grid gap-10 py-16 lg:grid-cols-[1fr_340px]">
        <article>
          <p className="text-sm font-black uppercase text-[#e44f22]">{service.label}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight">{service.h1}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/66">{service.intro}</p>

          <div className="mt-8 flex flex-wrap gap-2" aria-label="Obsluhované lokality">
            {service.localities.map((locality) => (
              <span key={locality} className="rounded-md border border-black/10 bg-white/60 px-3 py-2 text-sm font-bold">
                {locality}
              </span>
            ))}
          </div>

          <section className="mt-16">
            <h2 className="text-3xl font-black">Čo je dôležité pri tejto službe</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {service.benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 rounded-md border border-black/10 bg-white/62 p-5">
                  <CheckCircle2 className="mt-1 shrink-0 text-[#257a57]" size={20} aria-hidden="true" />
                  <p className="leading-7 text-black/66">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black">Ako pracujeme</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {service.processSteps.map((step, index) => (
                <div key={step.title} className="rounded-md border border-black/10 bg-white/62 p-5">
                  <span className="text-xs font-black text-black/36">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-8 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black">Časté otázky</h2>
            <div className="mt-6 grid gap-4">
              {service.faq.map((item) => (
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
            <CheckCircle2 className="text-[#257a57]" size={28} aria-hidden="true" />
            <p className="mt-5 text-2xl font-black">Začnite jasným ďalším krokom.</p>
            <p className="mt-3 text-sm leading-6 text-black/62">
              Vyplníte krátky formulár, vyberiete službu a pokračujete na bezpečnú platbu za obhliadku alebo konzultáciu.
              Po prijatí požiadavky sa ozveme k praktickému potvrdeniu detailov.
            </p>
            <Link href={`/booking?service=${service.slug}`} className="btn-primary mt-6 w-full">
              {service.primaryCta}
            </Link>
            <a href={company.whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary mt-3 w-full">
              <MessageCircle size={18} aria-hidden="true" />
              {service.secondaryCta}
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
