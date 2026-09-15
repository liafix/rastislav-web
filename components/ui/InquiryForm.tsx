"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { INQUIRY_FIELDS, LIMITS, ROOF_LABELS, ROOF_TYPES, STEP_FIELDS, type FieldErrors, type InquiryField, type InquiryReceipt, type InquiryValues } from "@/lib/inquiries/contract";
import { validateInquiryFields } from "@/lib/inquiries/validation";

const emptyValues: InquiryValues = { roofType: "", areaM2: "", location: "", preferredTerm: "", name: "", email: "", phone: "" };
const stepNames = ["Strecha", "Miesto a termín", "Kontakt"];
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isReceipt(value: unknown): value is InquiryReceipt {
  if (!isRecord(value) || !isRecord(value.delivery)) return false;
  return value.ok === true && Number.isSafeInteger(value.inquiryId) && Number(value.inquiryId) > 0 &&
    typeof value.duplicate === "boolean" && typeof value.deliveryRecorded === "boolean" &&
    ["pending", "sent", "failed"].includes(String(value.delivery.company)) &&
    ["pending", "sent", "failed"].includes(String(value.delivery.customer));
}
export function InquiryForm() {
  const [values, setValues] = useState<InquiryValues>(emptyValues);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [receipt, setReceipt] = useState<InquiryReceipt | null>(null);
  const inFlight = useRef(false);
  const submissionKey = useRef<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<InquiryField | "heading" | null>(null);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    const focus = pendingFocus.current;
    if (focus === "heading") headingRef.current?.focus();
    else if (focus) formRef.current?.querySelector<HTMLElement>(`[id="${focus}"]`)?.focus();
    pendingFocus.current = null;
  }, [step, errors]);
  useEffect(() => { if (submitError) errorRef.current?.focus(); }, [submitError]);
  useEffect(() => { if (receipt) successRef.current?.focus(); }, [receipt]);

  function change(field: InquiryField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }
  function showErrors(nextErrors: FieldErrors) {
    const first = INQUIRY_FIELDS.find((field) => nextErrors[field]);
    if (first) {
      pendingFocus.current = first;
      setStep(STEP_FIELDS.findIndex((fields) => fields.includes(first)));
    }
    setErrors(nextErrors);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const validation = validateInquiryFields(values);
    const relevant = step === 2 ? INQUIRY_FIELDS : STEP_FIELDS[step];
    const nextErrors: FieldErrors = {};
    for (const field of relevant) if (validation.errors[field]) nextErrors[field] = validation.errors[field];
    if (Object.keys(nextErrors).length) { showErrors(nextErrors); return; }
    if (step < 2) {
      pendingFocus.current = "heading";
      setErrors({});
      setStep(step + 1);
      return;
    }

    inFlight.current = true;
    setIsSubmitting(true);
    setSubmitError("");
    setConflict(false);
    const abort = new AbortController();
    controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 65000);
    try {
      submissionKey.current ??= crypto.randomUUID();
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, submissionKey: submissionKey.current }),
        signal: abort.signal
      });
      const result: unknown = await response.json();
      if (response.ok && isReceipt(result)) { setReceipt(result); return; }
      if (isRecord(result) && result.ok === false) {
        if (isRecord(result.fieldErrors)) {
          const serverErrors: FieldErrors = {};
          for (const field of INQUIRY_FIELDS) {
            const message = result.fieldErrors[field];
            if (typeof message === "string") serverErrors[field] = message;
          }
          if (Object.keys(serverErrors).length) { showErrors(serverErrors); return; }
        }
        setConflict(response.status === 409);
        setSubmitError(typeof result.error === "string" ? result.error : "Dopyt sa nepodarilo potvrdiť. Skúste odoslanie znova.");
      } else {
        setSubmitError("Dopyt sa nepodarilo potvrdiť. Skúste odoslanie znova.");
      }
    } catch {
      setSubmitError("Spojenie sa prerušilo alebo odpoveď neprišla včas. Údaje zostali vo formulári. Skúste odoslanie znova; rovnaký dopyt sa neuloží dvakrát.");
    } finally {
      window.clearTimeout(timeout);
      controller.current = null;
      inFlight.current = false;
      setIsSubmitting(false);
    }
  }
  function startAnother() {
    // Explicit user action only. Never change the key automatically after a timeout.
    submissionKey.current = null;
    setConflict(false);
    setSubmitError("");
  }
  function describedBy(field: InquiryField) { return errors[field] ? `${field}-error` : undefined; }

  if (receipt) {
    const delivered = receipt.delivery.company === "sent" && receipt.delivery.customer === "sent";
    return (
      <section className="min-w-0 rounded-md border border-black/10 bg-white/70 p-5 shadow-[0_24px_70px_rgba(20,20,20,0.06)] sm:p-8">
        <h2 ref={successRef} tabIndex={-1} className="text-2xl font-black">Ďakujeme. Váš dopyt bol uložený.</h2>
        <p className="mt-4 break-words">Číslo dopytu: <strong>#{receipt.inquiryId}</strong></p>
        <p className="mt-4 leading-7">
          {delivered ? "Potvrdenie sme odovzdali emailovému serveru. Skontrolujte aj priečinok nevyžiadanej pošty." :
            "Odoslanie emailových potvrdení zatiaľ nie je potvrdené. Dopyt je uložený; nemusíte ho posielať znova."}
        </p>
        {!receipt.deliveryRecorded ? <p className="mt-3 leading-7">Stav emailov sa nepodarilo úplne zaznamenať. Uloženého dopytu sa to netýka.</p> : null}
        <p className="mt-4 leading-7">Dopyt si prezrieme a následne vás kontaktujeme, aby sme upresnili rozsah prác a termín.</p>
      </section>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-busy={isSubmitting}
      className="grid min-w-0 gap-5 rounded-md border border-black/10 bg-white/70 p-5 shadow-[0_24px_70px_rgba(20,20,20,0.06)] sm:p-8">
      <div>
        <p className="text-sm font-bold text-[#a13c1a]" aria-live="polite">Krok {step + 1} z 3</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-black">{stepNames[step]}</h2>
        <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="Priebeh dopytu">
          {stepNames.map((name, index) => (
            <li key={name} aria-current={index === step ? "step" : undefined}
              className={`border-t-4 pt-2 text-xs font-bold ${index <= step ? "border-[#e44f22] text-black/80" : "border-black/10 text-black/55"}`}>{name}</li>
          ))}
        </ol>
      </div>

      <fieldset disabled={isSubmitting} className="grid min-w-0 gap-5">
        <legend className="sr-only">{stepNames[step]}</legend>
        {step === 0 ? (
          <>
            <fieldset className="grid min-w-0 gap-3" aria-describedby={describedBy("roofType")}>
              <legend className="mb-2 text-sm font-black">Typ strechy</legend>
              {ROOF_TYPES.map((type, index) => (
                <label key={type} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border p-4 ${values.roofType === type ? "border-[#e44f22] bg-white" : "border-black/15 bg-white/60"}`}>
                  <input id={index === 0 ? "roofType" : `roofType-${type}`} type="radio" name="roofType" value={type}
                    required checked={values.roofType === type} onChange={(event) => change("roofType", event.target.value)}
                    aria-describedby={describedBy("roofType")} className="size-5 shrink-0 accent-[#e44f22]" />
                  <span className="font-bold">{ROOF_LABELS[type]}</span>
                </label>
              ))}
              {errors.roofType ? <p id="roofType-error" className="text-sm font-bold text-[#b42318]">{errors.roofType}</p> : null}
            </fieldset>
            <Field name="areaM2" label="Približná plocha v m²" error={errors.areaM2}>
              <input id="areaM2" name="areaM2" className="field-input" inputMode="decimal" required maxLength={12}
                value={values.areaM2} onChange={(event) => change("areaM2", event.target.value)}
                aria-invalid={Boolean(errors.areaM2)} aria-describedby={describedBy("areaM2")} placeholder="napr. 120" />
            </Field>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Field name="location" label="Lokalita" error={errors.location}>
              <input id="location" name="location" className="field-input" required maxLength={LIMITS.location} autoComplete="address-level2"
                value={values.location} onChange={(event) => change("location", event.target.value)}
                aria-invalid={Boolean(errors.location)} aria-describedby={describedBy("location")} placeholder="Mesto alebo obec" />
            </Field>
            <Field name="preferredTerm" label="Termín / preferované obdobie" error={errors.preferredTerm}>
              <input id="preferredTerm" name="preferredTerm" className="field-input" required maxLength={LIMITS.preferredTerm}
                value={values.preferredTerm} onChange={(event) => change("preferredTerm", event.target.value)}
                aria-invalid={Boolean(errors.preferredTerm)} aria-describedby={describedBy("preferredTerm")} placeholder="napr. október 2026 alebo čo najskôr" />
            </Field>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Field name="name" label="Meno" error={errors.name}>
              <input id="name" name="name" className="field-input" required autoComplete="name" maxLength={LIMITS.name}
                value={values.name} onChange={(event) => change("name", event.target.value)}
                aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
            </Field>
            <Field name="email" label="Email" error={errors.email}>
              <input id="email" name="email" type="email" className="field-input" required autoComplete="email" maxLength={LIMITS.email}
                value={values.email} onChange={(event) => change("email", event.target.value)}
                aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
            </Field>
            <Field name="phone" label="Telefón" error={errors.phone}>
              <input id="phone" name="phone" type="tel" className="field-input" required autoComplete="tel" maxLength={LIMITS.phone}
                value={values.phone} onChange={(event) => change("phone", event.target.value)}
                aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} placeholder="+421 ..." />
            </Field>
            <p className="text-sm leading-6 text-black/65">Údaje použijeme na spracovanie dopytu a následné kontaktovanie.</p>
          </>
        ) : null}
      </fieldset>

      {submitError ? (
        <div ref={errorRef} tabIndex={-1} role="alert" className="flex min-w-0 items-start gap-2 rounded-md border border-[#b42318]/20 bg-[#fff4f2] p-4 text-sm font-bold leading-6 text-[#b42318]">
          <AlertCircle className="mt-1 shrink-0" size={18} aria-hidden="true" /><p className="min-w-0 break-words">{submitError}</p>
        </div>
      ) : null}
      {conflict ? <button type="button" className="btn-secondary" onClick={startAnother}>Začať nový dopyt s týmito údajmi</button> : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? <button className="btn-secondary" type="button" disabled={isSubmitting} onClick={() => {
          pendingFocus.current = "heading"; setErrors({}); setStep(step - 1);
        }}>Späť</button> : null}
        <button className="btn-primary min-w-0 disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting || conflict}>
          {isSubmitting ? <><Loader2 className="animate-spin shrink-0" size={18} aria-hidden="true" />Odosielame dopyt</> :
            step < 2 ? "Pokračovať" : "Odoslať nezáväzný dopyt"}
        </button>
      </div>
      <p className="sr-only" role="status">{isSubmitting ? "Prebieha odosielanie. Počkajte, prosím." : ""}</p>
    </form>
  );
}
function Field({ name, label, error, children }: { name: InquiryField; label: string; error?: string; children: ReactNode }) {
  return <div className="min-w-0">
    <label htmlFor={name} className="mb-2 block text-sm font-black">{label}</label>
    {children}
    {error ? <p id={`${name}-error`} className="mt-2 text-sm font-bold text-[#b42318]">{error}</p> : null}
  </div>;
}
