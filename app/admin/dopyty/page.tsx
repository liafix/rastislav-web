import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/server";
import { adminStore } from "@/lib/admin/repository";
import { positiveId } from "@/lib/admin/handlers";
import { readAdminData } from "@/lib/admin/read";
import { ROOF_LABELS } from "@/lib/inquiries/contract";
import { AdminAction } from "@/components/admin/AdminControls";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dopyty | KROVEX", robots: { index: false, follow: false } };
const date = (value: Date) => value.toLocaleString("sk-SK", { timeZone: "Europe/Bratislava" });
const delivery = { pending: "Nepotvrdené", sent: "Odovzdané SMTP", failed: "Odoslanie zlyhalo" };
export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ before?: string; id?: string }> }) {
  let authorized = false;
  try { authorized = await isAdmin(); }
  catch { return <main className="container section-space"><h1>Prihlásenie teraz nie je dostupné.</h1></main>; }
  if (!authorized) redirect("/admin");
  const query = await searchParams;
  const before = positiveId(query.before), id = positiveId(query.id);
  let rows, detail;
  try { [rows, detail] = await readAdminData(authorized, adminStore, before, id); }
  catch { return <main className="container section-space"><h1 className="section-title">Dopyty teraz nie sú dostupné.</h1><p className="my-6">Obnovte stránku a skúste znova.</p><AdminAction /></main>; }
  const page = rows.slice(0, 20);
  return <main className="container section-space">
    <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="eyebrow">KROVEX · správa</p><h1 className="section-title">Dopyty</h1></div><AdminAction /></div>
    <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2">
      <section aria-label="Zoznam dopytov" className="min-w-0">
        {page.length === 0 ? <p className="panel">Zatiaľ tu nie sú žiadne dopyty.</p> : <ul className="grid gap-3">{page.map(row => <li key={row.id}>
          <Link className="panel block hover:border-orange-700 wrap-anywhere" href={`/admin/dopyty?id=${row.id}${before ? "&before=" + before : ""}`} aria-current={id === row.id ? "true" : undefined}>
            <div className="flex flex-wrap justify-between gap-2"><strong>#{row.id} · {row.name}</strong><span className="status-badge">{row.status === "completed" ? "Vybavený" : "Nový"}</span></div>
            <p className="mt-3">{ROOF_LABELS[row.roofType]} · {row.location}</p><p className="mt-2 text-sm text-black/65">{date(row.createdAt)}</p>
          </Link>
        </li>)}</ul>}
        <nav aria-label="Stránky dopytov" className="mt-5 flex flex-wrap gap-4">{before ? <Link className="btn-secondary" href="/admin/dopyty">Najnovšie</Link> : null}{rows.length > 20 ? <Link className="btn-secondary" href={`/admin/dopyty?before=${page[page.length - 1].id}`}>Staršie dopyty</Link> : null}</nav>
      </section>
      <section aria-label="Detail dopytu" className="panel min-w-0 self-start wrap-anywhere">
        {detail ? <><h2 className="text-2xl font-bold">Dopyt #{detail.id}</h2><dl className="detail-list">
          {[["Stav", detail.status === "completed" ? "Vybavený" : "Nový"], ["Strecha", ROOF_LABELS[detail.roofType]], ["Plocha", detail.areaM2 + " m²"], ["Lokalita", detail.location], ["Termín", detail.preferredTerm], ["Meno", detail.name], ["Email", detail.email], ["Telefón", detail.phone], ["Prijatý", date(detail.createdAt)], ["Aktualizovaný", date(detail.updatedAt)], ["Email firme", delivery[detail.companyEmailStatus]], ["Email zákazníkovi", delivery[detail.customerEmailStatus]]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>{detail.status === "new" ? <AdminAction id={detail.id} /> : <p className="font-bold text-green-800">Dopyt je vybavený.</p>}</> : <p>{id ? "Dopyt sa nenašiel." : "Vyberte dopyt zo zoznamu."}</p>}
      </section>
    </div>
  </main>;
}
