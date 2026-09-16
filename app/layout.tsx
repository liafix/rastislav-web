import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildPageMetadata } from "@/lib/seo/metadata";
const display = Cormorant_Garamond({
  variable: "--font-krovex-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap"
});

const sans = Manrope({
  variable: "--font-krovex-sans",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = { ...buildPageMetadata("KROVEX | Strecha pre váš domov", "Nová strecha, rekonštrukcia a oprava. Povedzte nám o svojom projekte v troch jednoduchých krokoch."), icons: { icon: "/images/roofing/krovex-logo.png" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sk" className={`${display.variable} ${sans.variable}`}><body><a href="#content" className="skip-link">Preskočiť na obsah</a><Header /><div id="content">{children}</div><Footer /></body></html>;
}
