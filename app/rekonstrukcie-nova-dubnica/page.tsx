import type { Metadata } from "next";
import { LocalLandingPage } from "@/components/marketing/LocalLandingPage";
import { getLocalPage } from "@/lib/content/local-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

const page = getLocalPage("rekonstrukcie-nova-dubnica");

export const metadata: Metadata = buildPageMetadata({
  title: page?.title ?? "Rekonštrukcie interiéru Nová Dubnica | mv MARTIŠ",
  description:
    page?.description ??
    "Rekonštrukcie interiérov pre Novú Dubnicu: lokálny kontakt, obhliadka, kúpeľne, podlahy, obklady, sanita a sadrokartón.",
  path: "/rekonstrukcie-nova-dubnica"
});

export default function RekonstrukcieNovaDubnicaPage() {
  if (!page) return null;
  return <LocalLandingPage page={page} />;
}
