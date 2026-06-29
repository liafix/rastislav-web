import type { Metadata } from "next";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { services } from "@/lib/content/services";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Služby | Rekonštrukcie interiéru Dubnica nad Váhom | mv MARTIŠ",
  description:
    "Prehľad služieb mv MARTIŠ: obklady, dlažby, omietky, podlahy, sanita, dvere, sadrokartón a rekonštrukcie interiéru na kľúč.",
  path: "/sluzby"
});

export default function ServicesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.label,
      url: absoluteUrl(`/sluzby/${service.slug}`)
    }))
  };

  return (
    <main className="pt-28">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <section className="container py-16">
        <p className="text-sm font-black uppercase text-[#e44f22]">Služby</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight">
          Interiérové práce pre Dubnicu nad Váhom a okolie.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/64">
          Vyberte službu a pozrite si jednoduchý postup obhliadky, ponuky, realizácie a odovzdania. Každá služba má
          vlastnú stránku s lokálnym kontextom, častými otázkami a jasným ďalším krokom.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
