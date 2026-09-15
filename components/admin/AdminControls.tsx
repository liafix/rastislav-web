"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export function AdminLogin() {
  const router = useRouter(), busy = useRef(false);
  const [pending, setPending] = useState(false), [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy.current) return;
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    busy.current = true; setPending(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }), signal: AbortSignal.timeout(15000) });
      if (!response.ok) { setError(response.status === 401 ? "Nesprávne heslo." : "Prihlásenie teraz nie je dostupné. Skúste znova."); return; }
      router.replace("/admin/dopyty"); router.refresh();
    } catch { setError("Spojenie zlyhalo. Skúste znova."); }
    finally { busy.current = false; setPending(false); }
  }
  return <form onSubmit={submit} className="panel grid gap-5">
    <label htmlFor="password" className="font-bold">Heslo</label>
    <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={1024} className="field-input" disabled={pending} />
    <button className="btn-primary" disabled={pending}>{pending ? "Prihlasujeme…" : "Prihlásiť sa"}</button>
    <p role="alert" className="text-sm text-red-800">{error}</p>
  </form>;
}
export function AdminAction({ id }: { id?: number }) {
  const router = useRouter(), busy = useRef(false);
  const [pending, setPending] = useState(false), [error, setError] = useState("");
  async function act() {
    if (busy.current) return; busy.current = true; setPending(true); setError("");
    try {
      const response = await fetch(id ? `/api/admin/inquiries/${id}` : "/api/admin/logout", { method: id ? "PATCH" : "POST", signal: AbortSignal.timeout(15000) });
      if (response.status === 401) { router.replace("/admin"); router.refresh(); return; }
      if (!response.ok) { setError("Zmenu sa nepodarilo potvrdiť. Obnovte stránku alebo skúste znova."); return; }
      if (!id) router.replace("/admin");
      router.refresh();
    } catch { setError("Spojenie zlyhalo. Obnovte stránku a skontrolujte stav."); }
    finally { busy.current = false; setPending(false); }
  }
  return <div className="min-w-0"><button type="button" onClick={act} disabled={pending} className={id ? "btn-primary" : "btn-secondary"}>{pending ? "Čakajte…" : id ? "Označiť ako vybavený" : "Odhlásiť sa"}</button><p role="alert" className="mt-2 text-sm text-red-800">{error}</p></div>;
}
