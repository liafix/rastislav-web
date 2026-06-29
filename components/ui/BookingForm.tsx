"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { PAYMENT_AMOUNTS_CENTS, PAYMENT_LABELS } from "@/lib/commerce/config";
import { services } from "@/lib/content/services";
import { isPaymentType } from "@/lib/contracts";
import type { PaymentType } from "@/lib/contracts";

type ErrorMap = Partial<Record<string, string>>;

type CheckoutResponse =
  | {
      ok: true;
      leadId: number;
      bookingId: number;
      paymentId: number;
      checkoutUrl?: string | null;
    }
  | {
      ok: false;
      error?: string;
    };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\s]{9,16}$/;
const attributionFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function getServicePaymentType(serviceSlug: string): PaymentType {
  const service = services.find((item) => item.slug === serviceSlug);
  return service?.paymentType ?? "reservation_fee";
}

function formatPrice(amountCents: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(amountCents / 100);
}

function readAttributionPayload() {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const payload: Record<string, string> = {
    landing_page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer
  };

  for (const field of attributionFields) {
    const value = searchParams.get(field);
    if (value) payload[field] = value;
  }

  return payload;
}

export function BookingForm() {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [selectedService, setSelectedService] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("reservation_fee");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const nextErrors: ErrorMap = {};
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const selectedPaymentType = String(data.get("paymentType") || "");

    if (!String(data.get("name") || "").trim()) nextErrors.name = "Zadajte meno.";
    if (!phoneRegex.test(phone.trim())) nextErrors.phone = "Zadajte platné telefónne číslo.";
    if (email && !emailRegex.test(email.trim())) nextErrors.email = "Zadajte platný email.";
    if (!String(data.get("service") || "")) nextErrors.service = "Vyberte službu.";
    if (!isPaymentType(selectedPaymentType)) nextErrors.paymentType = "Vyberte typ platby.";
    if (!String(data.get("location") || "").trim()) nextErrors.location = "Zadajte lokalitu.";
    if (!String(data.get("date") || "")) nextErrors.date = "Vyberte preferovaný dátum.";
    if (!String(data.get("time") || "")) nextErrors.time = "Vyberte preferovaný čas.";
    if (!data.get("consent")) nextErrors.consent = "Potvrďte súhlas so spracovaním údajov.";

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0 || !form.checkValidity()) {
      return;
    }

    const data = new FormData(form);
    const selectedPaymentType = String(data.get("paymentType") || "");

    if (!isPaymentType(selectedPaymentType)) {
      setErrors((current) => ({ ...current, paymentType: "Vyberte typ platby." }));
      return;
    }

    const payload = {
      ...readAttributionPayload(),
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      service: String(data.get("service") || ""),
      location: String(data.get("location") || ""),
      message: String(data.get("message") || ""),
      preferredDate: String(data.get("date") || ""),
      preferredTime: String(data.get("time") || ""),
      paymentType: selectedPaymentType,
      consent: data.get("consent") === "on"
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as CheckoutResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "Platbu sa nepodarilo pripraviť." : result.error || "Platbu sa nepodarilo pripraviť.");
      }

      if (!result.checkoutUrl) {
        throw new Error("Stripe Checkout nevrátil platobnú URL.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Platbu sa nepodarilo pripraviť.");
      setIsSubmitting(false);
    }
  }

  function handleServiceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const serviceSlug = event.target.value;
    setSelectedService(serviceSlug);
    setPaymentType(getServicePaymentType(serviceSlug));
  }

  function handlePaymentTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (isPaymentType(event.target.value)) {
      setPaymentType(event.target.value);
    }
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
          <select className="field-input" id="service" name="service" required value={selectedService} onChange={handleServiceChange}>
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

      <fieldset className="grid gap-3">
        <legend className="text-sm font-black">Typ platby</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(PAYMENT_LABELS).map(([value, label]) => {
            const typedValue = value as PaymentType;
            const checked = paymentType === typedValue;

            return (
              <label
                key={typedValue}
                className={`grid cursor-pointer gap-2 rounded-md border p-4 transition ${
                  checked ? "border-[#e44f22] bg-white shadow-[0_16px_46px_rgba(228,79,34,0.13)]" : "border-black/10 bg-white/60 hover:border-black/24"
                }`}
              >
                <span className="flex items-start gap-3">
                  <input
                    className="mt-1 size-4 accent-[#e44f22]"
                    type="radio"
                    name="paymentType"
                    value={typedValue}
                    checked={checked}
                    onChange={handlePaymentTypeChange}
                    required
                  />
                  <span>
                    <span className="block font-black">{label}</span>
                    <span className="mt-1 block text-sm font-bold text-[#e44f22]">{formatPrice(PAYMENT_AMOUNTS_CENTS[typedValue])}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {errors.paymentType ? <p className="text-sm font-bold text-[#b42318]">{errors.paymentType}</p> : null}
      </fieldset>

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

      {submitError ? (
        <p className="flex items-start gap-2 rounded-md border border-[#b42318]/20 bg-[#fff4f2] p-4 text-sm font-bold leading-6 text-[#b42318]" role="alert">
          <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          <span>{submitError}</span>
        </p>
      ) : null}

      <button className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            Presmerúvame na platbu
          </span>
        ) : (
          "Pokračovať na platbu"
        )}
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
