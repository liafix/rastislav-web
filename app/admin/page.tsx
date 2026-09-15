import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/AdminControls";
export const metadata: Metadata = { title: "Prihlásenie | KROVEX", robots: { index: false, follow: false } };
export default function AdminPage() {
  return <main className="container section-space"><div className="mx-auto max-w-md"><p className="eyebrow">KROVEX · správa dopytov</p><h1 className="section-title mb-8">Prihlásenie</h1><AdminLogin /></div></main>;
}
