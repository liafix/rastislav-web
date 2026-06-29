import type { Metadata } from "next";
import { LocalLandingPage } from "@/components/marketing/LocalLandingPage";
import { getLocalPage } from "@/lib/content/local-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

const page = getLocalPage("rekonstrukcie-trencin");

export const metadata: Metadata = buildPageMetadata({
  title: page?.title ?? "Rekonštrukcie interiéru Trenčín | Martiš MV",
  description:
    page?.description ??
    "Interiérové rekonštrukcie pre Trenčín a okolie: kúpeľne, podlahy, obklady, sadrokartón, sanita a koordinovaný postup prác.",
  path: "/rekonstrukcie-trencin"
});

export default function RekonstrukcieTrencinPage() {
  if (!page) return null;
  return <LocalLandingPage page={page} />;
}
