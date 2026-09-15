import { buildPageMetadata } from "@/lib/seo/metadata";
import { InquiryForm } from "@/components/ui/InquiryForm";

export const metadata = buildPageMetadata('Dopyt | KROVEX', 'Nová strecha, rekonštrukcia alebo oprava. Nezáväzný dopyt v troch krokoch.', '/dopyt');
export default function InquiryPage() {
  return (
    <main className="container py-8 sm:py-14">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-wider text-[#a13c1a]">KROVEX</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Povedzte nám o svojej streche.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-black/70">Vyberte typ prác, približnú plochu, lokalitu a termín. Na záver doplňte kontakt, aby sme sa vám mohli ozvať.</p>
        </div>
        <InquiryForm />
      </div>
    </main>
  );
}
