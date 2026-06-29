import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { company } from "@/lib/content/services";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: `${company.name} - ${company.slogan}`,
  description:
    "Interiérové rekonštrukcie, obklady, dlažby, podlahy, sanita a sadrokartón v Dubnici nad Váhom, Ilave, Trenčíne a okolí.",
  path: "/"
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body>
        <SmoothScrollProvider>
          <PageTransition>
            <Header />
            {children}
            <Footer />
            <MobileActionBar />
          </PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
