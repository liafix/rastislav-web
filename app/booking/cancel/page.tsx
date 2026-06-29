import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Platba nebola dokončená | mv MARTIŠ",
    description: "Platba nebola dokončená. Môžete sa vrátiť k objednávke obhliadky alebo nás kontaktovať telefonicky.",
    path: "/booking/cancel"
  }),
  robots: {
    index: false,
    follow: false
  }
};

export default function BookingCancelPage() {
  return (
    <main className="pt-28">
      <section className="container grid min-h-[60vh] place-items-center py-16 text-center">
        <div className="max-w-xl rounded-md border border-black/10 bg-white/72 p-8">
          <p className="text-sm font-black uppercase text-[#e44f22]">Platba nedokončená</p>
          <h1 className="mt-4 text-4xl font-black">Platba nebola dokončená.</h1>
          <p className="mt-4 leading-7 text-black/64">
            Objednávku môžete skúsiť znova alebo sa ozvať telefonicky či cez WhatsApp.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/booking" className="btn-primary">
              Späť na obhliadku
            </Link>
            <Link href="/kontakt" className="btn-secondary">
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
