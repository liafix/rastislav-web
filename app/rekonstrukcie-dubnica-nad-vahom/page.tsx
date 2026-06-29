import type { Metadata } from "next";
import { LocalLandingPage } from "@/components/marketing/LocalLandingPage";
import { getLocalPage } from "@/lib/content/local-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

const page = getLocalPage("rekonstrukcie-dubnica-nad-vahom");

export const metadata: Metadata = buildPageMetadata({
  title: page?.title ?? "Rekonštrukcie interiéru Dubnica nad Váhom | Martiš MV",
  description:
    page?.description ??
    "Prémiové rekonštrukcie interiéru v Dubnici nad Váhom: obklady, dlažby, podlahy, sanita, sadrokartón a práca na kľúč.",
  path: "/rekonstrukcie-dubnica-nad-vahom"
});

export default function RekonstrukcieDubnicaPage() {
  if (!page) return null;
  return <LocalLandingPage page={page} />;
}
