"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { services } from "@/lib/content/services";

type ErrorMap = Partial<Record<string, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\s]{9,16}$/;

export function BookingForm() {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const nextErrors: ErrorMap = {};
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");

    if (!String(data.get("name") || "").trim()) nextErrors.name = "Zadajte meno.";
    if (!phoneRegex.test(phone.trim())) nextErrors.phone = "Zadajte platné telefónne číslo.";
    if (email && !emailRegex.test(email.trim())) nextErrors.email = "Zadajte platný email.";
    if (!String(data.get("service") || "")) nextErrors.service = "Vyberte službu.";
    if (!String(data.get("location") || "").trim()) nextErrors.location = "Zadajte lokalitu.";
    if (!String(data.get("date") || "")) nextErrors.date = "Vyberte preferovaný dátum.";
    if (!String(data.get("time") || "")) nextErrors.time = "Vyberte preferovaný čas.";
    if (!data.get("consent")) nextErrors.consent = "Potvrďte súhlas so spracovaním údajov.";

    return nextErrors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0 && form.checkValidity()) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-[#257a57]/25 bg-white/74 p-8 text-center shadow-[0_24px_70px_rgba(20,20,20,0.06)]">
        <CheckCircle2 className="mx-auto text-[#257a57]" size={42} aria-hidden="true" />
        <h2 className="mt-5 text-3xl font-black">Ďakujeme!</h2>
        <p className="mt-3 text-lg text-black/66">Ozveme sa vám čoskoro.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-md border border-black/10 bg-white/70 p-5 shadow-[0_24px_70px_rgba(20,20,20,0.06)] sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Meno" name="name" error={errors.name}>
          <input className="field-input" id="name" name="name" required autoComplete="name" />
        </Field>
        <Field label="Telefón" name="phone" error={errors.phone}>
          <input className="field-input" id="phone" name="phone" required inputMode="tel" pattern="[0-9+\\s]{9,16}" autoComplete="tel" />
        </Field>
      </div>

      <Field label="Email" name="email" error={errors.email}>
        <input className="field-input" id="email" name="email" type="email" autoComplete="email" />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Služba" name="service" error={errors.service}>
          <select className="field-input" id="service" name="service" required defaultValue="">
            <option value="" disabled>
              Vyberte službu
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Lokalita" name="location" error={errors.location}>
          <input className="field-input" id="location" name="location" required placeholder="Dubnica nad Váhom" />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Preferovaný dátum" name="date" error={errors.date}>
          <input className="field-input" id="date" name="date" type="date" required />
        </Field>
        <Field label="Preferovaný čas" name="time" error={errors.time}>
          <select className="field-input" id="time" name="time" required defaultValue="">
            <option value="" disabled>
              Vyberte čas
            </option>
            <option value="rano">ráno</option>
            <option value="popoludnie">popoludnie</option>
          </select>
        </Field>
      </div>

      <Field label="Správa" name="message">
        <textarea className="field-input min-h-32 resize-y" id="message" name="message" placeholder="Stručne opíšte priestor alebo rozsah práce." />
      </Field>

      <label className="flex gap-3 rounded-md border border-black/10 bg-white/60 p-4 text-sm leading-6">
        <input className="mt-1 size-5 accent-[#e44f22]" type="checkbox" name="consent" required />
        <span>Súhlasím so spracovaním údajov pre účel kontaktovania k obhliadke.</span>
      </label>
      {errors.consent ? <p className="-mt-3 text-sm font-bold text-[#b42318]">{errors.consent}</p> : null}

      <button className="btn-primary w-full sm:w-fit" type="submit">
        Odoslať žiadosť
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-black">
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-sm font-bold text-[#b42318]">{error}</p> : null}
    </div>
  );
}
