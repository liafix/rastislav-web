import type { Metadata } from "next";
import { LocalLandingPage } from "@/components/marketing/LocalLandingPage";
import { getLocalPage } from "@/lib/content/local-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

const page = getLocalPage("rekonstrukcie-trencianska-tepla");

export const metadata: Metadata = buildPageMetadata({
  title: page?.title ?? "Rekonštrukcie interiéru Trenčianska Teplá | mv MARTIŠ",
  description:
    page?.description ??
    "Interiérové rekonštrukcie v Trenčianskej Teplej: obklady, dlažby, podlahy, sanita, sadrokartón a praktický postup prác.",
  path: "/rekonstrukcie-trencianska-tepla"
});

export default function RekonstrukcieTrencianskaTeplaPage() {
  if (!page) return null;
  return <LocalLandingPage page={page} />;
}
