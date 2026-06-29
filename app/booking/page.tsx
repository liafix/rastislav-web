import type { Metadata } from "next";
import { BookingForm } from "@/components/ui/BookingForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Rezervovať obhliadku | Martiš MV Dubnica nad Váhom",
  description:
    "Objednajte si obhliadku alebo konzultáciu pre interiérovú rekonštrukciu v Dubnici nad Váhom, Ilave, Trenčíne a okolí.",
  path: "/booking"
});

export default function BookingPage() {
  return (
    <main className="pt-28">
      <section className="container grid gap-10 py-16 pb-32 lg:grid-cols-[0.75fr_1fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase text-[#e44f22]">Obhliadka</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">Rezervovať obhliadku alebo konzultáciu.</h1>
          <p className="mt-6 text-lg leading-8 text-black/66">
            Vyplňte základné údaje, službu, lokalitu a preferovaný termín. Rezervačný krok za 30 EUR alebo platená
            konzultácia za 80 EUR prebehne cez bezpečnú platbu. Po prijatí požiadavky sa ozveme a potvrdíme praktické
            detaily; nejde ešte o finálne potvrdenie celej realizácie.
          </p>
        </div>
        <BookingForm />
      </section>
    </main>
  );
}
