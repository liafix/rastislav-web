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
      <section className="krovex-inquiry-success">
        <h2 ref={successRef} tabIndex={-1} className="krovex-inquiry-success__title">Ďakujeme. Váš dopyt bol uložený.</h2>
        <p className="krovex-inquiry-success__id">Číslo dopytu: <strong>#{receipt.inquiryId}</strong></p>
        <p className="krovex-inquiry-success__copy">
          {delivered ? "Potvrdenie sme odovzdali emailovému serveru. Skontrolujte aj priečinok nevyžiadanej pošty." :
            "Odoslanie emailových potvrdení zatiaľ nie je potvrdené. Dopyt je uložený; nemusíte ho posielať znova."}
        </p>
        {!receipt.deliveryRecorded ? <p className="krovex-inquiry-success__copy">Stav emailov sa nepodarilo úplne zaznamenať. Uloženého dopytu sa to netýka.</p> : null}
        <p className="krovex-inquiry-success__next">Dopyt si prezrieme a následne vás kontaktujeme, aby sme upresnili rozsah prác a termín.</p>
      </section>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-busy={isSubmitting}
      className="krovex-inquiry-form">
      <div className="krovex-inquiry-form__head">
        <p className="krovex-inquiry-form__step-count" aria-live="polite">Krok {step + 1} z 3</p>
        <h2 ref={headingRef} tabIndex={-1} className="krovex-inquiry-form__title">{stepNames[step]}</h2>
        <ol className="krovex-inquiry-form__progress" aria-label="Priebeh dopytu">
          {stepNames.map((name, index) => (
            <li key={name} aria-current={index === step ? "step" : undefined}
              className={index <= step ? "is-complete" : ""}>{<><span>{String(index + 1).padStart(2, "0")}</span>{name}</>}</li>
          ))}
        </ol>
      </div>

      <fieldset disabled={isSubmitting} className="krovex-inquiry-form__fields">
        <legend className="sr-only">{stepNames[step]}</legend>
        {step === 0 ? (
          <>
            <fieldset className="krovex-roof-types" aria-describedby={describedBy("roofType")}>
              <legend>Typ strechy</legend>
              {ROOF_TYPES.map((type, index) => (
                <label key={type} className={`krovex-roof-choice ${values.roofType === type ? "is-selected" : ""}`}>
                  <input id={index === 0 ? "roofType" : `roofType-${type}`} type="radio" name="roofType" value={type}
                    required checked={values.roofType === type} onChange={(event) => change("roofType", event.target.value)}
                    aria-describedby={describedBy("roofType")} className="krovex-roof-choice__input" />
                  <span className="krovex-roof-choice__mark" aria-hidden="true" />
                  <span className="krovex-roof-choice__label">{ROOF_LABELS[type]}</span>
                </label>
              ))}
              {errors.roofType ? <p id="roofType-error" className="krovex-field-error">{errors.roofType}</p> : null}
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
            <p className="krovex-inquiry-form__privacy">Údaje použijeme na spracovanie dopytu a následné kontaktovanie.</p>
          </>
        ) : null}
      </fieldset>

      {submitError ? (
        <div ref={errorRef} tabIndex={-1} role="alert" className="krovex-submit-error">
          <AlertCircle size={18} aria-hidden="true" /><p>{submitError}</p>
        </div>
      ) : null}
      {conflict ? <button type="button" className="krovex-inquiry-form__secondary" onClick={startAnother}>Začať nový dopyt s týmito údajmi</button> : null}
      <div className="krovex-inquiry-form__actions">
        {step > 0 ? <button className="krovex-inquiry-form__secondary" type="button" disabled={isSubmitting} onClick={() => {
          pendingFocus.current = "heading"; setErrors({}); setStep(step - 1);
        }}>Späť</button> : null}
        <button className="krovex-inquiry-form__submit" type="submit" disabled={isSubmitting || conflict}>
          {isSubmitting ? <><Loader2 className="krovex-spin" size={18} aria-hidden="true" />Odosielame dopyt</> :
            step < 2 ? "Pokračovať" : "Odoslať nezáväzný dopyt"}
        </button>
      </div>
      <p className="sr-only" role="status">{isSubmitting ? "Prebieha odosielanie. Počkajte, prosím." : ""}</p>
    </form>
  );
}
function Field({ name, label, error, children }: { name: InquiryField; label: string; error?: string; children: ReactNode }) {
  return <div className="krovex-field">
    <label htmlFor={name}>{label}</label>
    {children}
    {error ? <p id={`${name}-error`} className="krovex-field-error">{error}</p> : null}
  </div>;
}
