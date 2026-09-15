import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo/metadata";
export const metadata: Metadata = { ...buildPageMetadata("KROVEX | Strecha pre váš domov", "Nová strecha, rekonštrukcia a oprava. Povedzte nám o svojom projekte v troch jednoduchých krokoch."), icons: { icon: "/images/roofing/krovex-logo.png" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sk"><body><a href="#content" className="skip-link">Preskočiť na obsah</a><Header /><div id="content">{children}</div><Footer /></body></html>;
}
