import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Platba prijatá | mv MARTIŠ",
  description: "Ďakujeme. Platba bola prijatá a obhliadka alebo konzultácia bude potvrdená.",
  path: "/booking/success"
});

export default function BookingSuccessPage() {
  return (
    <main className="pt-28">
      <section className="container grid min-h-[60vh] place-items-center py-16 text-center">
        <div className="max-w-xl rounded-md border border-[#257a57]/20 bg-white/72 p-8">
          <CheckCircle2 className="mx-auto text-[#257a57]" size={44} aria-hidden="true" />
          <h1 className="mt-5 text-4xl font-black">Platba bola prijatá.</h1>
          <p className="mt-4 leading-7 text-black/64">
            Ďakujeme. Webhook zo Stripe je zdroj pravdy pre potvrdenie platby. Po overení sa ozveme s ďalším krokom.
          </p>
          <Link href="/" className="btn-primary mt-6">
            Späť na úvod
          </Link>
        </div>
      </section>
    </main>
  );
}
