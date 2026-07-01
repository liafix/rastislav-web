import Link from "next/link";
import { Logo } from "@/components/Logo";
import { localPages } from "@/lib/content/local-pages";
import { company } from "@/lib/content/services";

export function Footer() {
  return (
    <footer
      data-scene-stage="footer"
      data-scene-model="ducato"
      data-scene-intensity="rest"
      className="border-t border-black/10 bg-[#141414] pb-24 pt-12 text-[#fffaf0] md:pb-12"
    >
      <div className="container grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="footer" />
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/62">{company.slogan}</p>
        </div>
        <div className="text-sm leading-7 text-white/72">
          <p className="font-bold text-white">Kontakt</p>
          <a href={company.phoneHref}>{company.phoneDisplay}</a>
          <p>{company.address}</p>
        </div>
        <div className="text-sm leading-7 text-white/72">
          <p className="font-bold text-white">Oblasť</p>
          <p>Dubnica nad Váhom</p>
          <p>Ilava, Trenčín a okolie</p>
          <p className="mt-4 text-white/42">© 2026 {company.name}</p>
        </div>
        <nav aria-label="Lokálne stránky" className="text-sm leading-7 text-white/72">
          <p className="font-bold text-white">Lokality</p>
          {localPages.map((page) => (
            <Link key={page.path} href={page.path} className="block transition hover:text-white">
              {page.location}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
