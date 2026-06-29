import type { Metadata } from "next";
import { LocalLandingPage } from "@/components/marketing/LocalLandingPage";
import { getLocalPage } from "@/lib/content/local-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

const page = getLocalPage("rekonstrukcie-ilava");

export const metadata: Metadata = buildPageMetadata({
  title: page?.title ?? "Rekonštrukcie interiéru Ilava | mv MARTIŠ",
  description:
    page?.description ??
    "Rekonštrukcie interiérov v Ilave: obhliadka, kúpeľne, obklady, dlažby, podlahy, sadrokartón a čisté dokončenie detailov.",
  path: "/rekonstrukcie-ilava"
});

export default function RekonstrukcieIlavaPage() {
  if (!page) return null;
  return <LocalLandingPage page={page} />;
}
