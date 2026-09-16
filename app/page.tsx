import { KrovexHero } from "@/components/marketing/KrovexHero";
import { KrovexServices } from "@/components/marketing/KrovexServices";
import { KrovexProcess } from "@/components/marketing/KrovexProcess";
import { KrovexCTA } from "@/components/marketing/KrovexCTA";
import { siteUrl } from "@/lib/seo/metadata";

export default function HomePage() {
  const origin = siteUrl();

  return (
    <main className="krovex-home">
      {origin ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "KROVEX",
              url: origin,
              description: "Ukážkový projekt fiktívnej strechárskej firmy."
            }).replace(/</g, "\\u003c")
          }}
        />
      ) : null}
      <KrovexHero />
      <KrovexServices />
      <KrovexProcess />
      <KrovexCTA />
    </main>
  );
}
