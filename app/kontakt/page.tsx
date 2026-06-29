import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { company } from "@/lib/content/services";
import { buildPageMetadata, localBusinessJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Kontakt | Rekonštrukcie interiéru Dubnica nad Váhom | Martiš MV",
  description:
    "Kontakt na Martiš MV pre interiérové rekonštrukcie, obklady, dlažby, podlahy a sanitu v Dubnici nad Váhom a okolí.",
  path: "/kontakt"
});

export default function ContactPage() {
  return (
    <main className="pt-28">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <section className="container grid gap-10 py-16 lg:grid-cols-[0.9fr_1fr]">
        <div>
          <p className="text-sm font-black uppercase text-[#e44f22]">Kontakt</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">Ozvite sa k rekonštrukcii interiéru.</h1>
          <p className="mt-6 text-lg leading-8 text-black/66">
            Najrýchlejšie je zavolať alebo poslať správu cez WhatsApp s fotkami priestoru. Podľa rozsahu sa dohodne
            obhliadka, konzultácia alebo ďalší praktický krok.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={company.phoneHref} className="btn-primary">
              <Phone size={18} aria-hidden="true" />
              {company.phoneDisplay}
            </a>
            <a href={company.whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary">
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-md border border-black/10 bg-white/66 p-6">
            <p className="text-sm font-black uppercase text-black/42">Telefón</p>
            <a className="mt-2 block text-3xl font-black" href={company.phoneHref}>
              {company.phoneDisplay}
            </a>
          </div>
          <div className="rounded-md border border-black/10 bg-white/66 p-6">
            <p className="text-sm font-black uppercase text-black/42">Adresa</p>
            <p className="mt-2 text-2xl font-black">{company.address}</p>
          </div>
          <div className="grid min-h-72 place-items-center rounded-md border border-black/10 bg-[#141414] p-6 text-center text-[#fffaf0]">
            <div>
              <p className="text-xs font-black uppercase text-white/42">Mapa</p>
              <p className="mt-3 text-2xl font-black">A. Kmeša 939/28</p>
              <p className="mt-2 text-white/64">Dubnica nad Váhom</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
