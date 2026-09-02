"use client";

// Contactformulier — Formspark (besluit 2026-09-02). Zolang er geen form-ID
// in lib/formspark.ts staat, valt de submit terug op de mailto-flow zodat
// het formulier nooit dood is. Spam: honeypot-veld `_honeypot` (Formspark
// negeert de inzending stil als een bot het invult) + hun standaardfilter.

import { useState } from "react";
import { CONTACT } from "@/lib/copy";
import { FORMSPARK_FORM_ID, FORMSPARK_URL } from "@/lib/formspark";

const ONDERWERPEN: Record<string, string> = Object.fromEntries(
  CONTACT.onderwerpen.map((o) => [o.value, o.value ? o.label : "Niet opgegeven"])
);

type Velden = { voornaam: string; achternaam: string; onderwerp: string; email: string; bericht: string };
const LEEG: Velden = { voornaam: "", achternaam: "", onderwerp: "", email: "", bericht: "" };

type Status = "leeg" | "bezig" | "verzonden" | "mislukt";

export function ContactForm() {
  const [form, setForm] = useState<Velden>(LEEG);
  const [fouten, setFouten] = useState<Partial<Velden>>({});
  const [status, setStatus] = useState<Status>("leeg");
  const [honing, setHoning] = useState("");

  const zet = (k: keyof Velden) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setFouten((f) => ({ ...f, [k]: undefined }));
    if (status === "verzonden" || status === "mislukt") setStatus("leeg");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "bezig") return;
    const errs: Partial<Velden> = {};
    if (!form.voornaam.trim()) errs.voornaam = "Vul je voornaam in.";
    if (!form.achternaam.trim()) errs.achternaam = "Vul je achternaam in.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "Vul een geldig e-mailadres in.";
    if (!form.bericht.trim()) errs.bericht = "Laat een bericht achter.";
    if (Object.keys(errs).length) {
      setFouten(errs);
      const eerste = (["voornaam", "achternaam", "email", "bericht"] as const).find((k) => errs[k]);
      if (eerste) (e.currentTarget.elements.namedItem(eerste) as HTMLElement | null)?.focus();
      return;
    }
    setFouten({});
    const onderwerp = ONDERWERPEN[form.onderwerp] || "Niet opgegeven";

    if (!FORMSPARK_FORM_ID) {
      // vangnet zolang het form-ID ontbreekt: de mailto-flow van v3
      const body = [
        `Naam: ${form.voornaam} ${form.achternaam}`,
        `E-mail: ${form.email}`,
        `Onderwerp: ${onderwerp}`,
        "",
        "Bericht:",
        form.bericht,
      ].join("\n");
      window.location.href =
        "mailto:info@datajagers.nl" +
        `?subject=${encodeURIComponent(`Aanvraag via datajagers.nl — ${onderwerp}`)}` +
        `&body=${encodeURIComponent(body)}`;
      setStatus("verzonden");
      return;
    }

    setStatus("bezig");
    try {
      const res = await fetch(FORMSPARK_URL(FORMSPARK_FORM_ID), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          voornaam: form.voornaam,
          achternaam: form.achternaam,
          email: form.email,
          onderwerp,
          bericht: form.bericht,
          _honeypot: honing,
          _email: { subject: `Aanvraag via datajagers.nl — ${onderwerp}` },
        }),
      });
      if (!res.ok) throw new Error(`Formspark ${res.status}`);
      setStatus("verzonden");
    } catch {
      setStatus("mislukt");
    }
  };

  const veld = (k: keyof Velden, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label>
      <span className="lbl">{label}</span>
      <input
        name={k}
        value={form[k]}
        onChange={zet(k)}
        aria-required="true"
        aria-invalid={fouten[k] ? "true" : "false"}
        aria-describedby={`err-${k}`}
        {...props}
      />
      {fouten[k] ? (
        <p id={`err-${k}`} className="fout">
          {fouten[k]}
        </p>
      ) : null}
    </label>
  );

  const heeftFouten = Object.values(fouten).some(Boolean);
  const viaFormspark = !!FORMSPARK_FORM_ID;
  const statusTekst =
    status === "verzonden"
      ? viaFormspark
        ? "Bedankt! Je bericht is verstuurd — je hoort binnen 24 uur van ons."
        : "Je mailprogramma is geopend met je bericht. Verstuur het daar om de aanvraag af te ronden."
      : status === "mislukt"
        ? "Versturen lukte niet. Probeer het opnieuw, of mail ons direct via info@datajagers.nl."
        : heeftFouten
          ? "Controleer de gemarkeerde velden."
          : "";
  const knopTekst =
    status === "bezig"
      ? "Versturen…"
      : status === "verzonden"
        ? viaFormspark
          ? "Verstuurd"
          : "Geopend in je mailprogramma"
        : "Verstuur";

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* honeypot — onzichtbaar voor mensen, bots vullen hem in */}
      <input
        type="text"
        name="_honeypot"
        value={honing}
        onChange={(e) => setHoning(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="velden">
        {veld("voornaam", "Voornaam*", { type: "text", autoComplete: "given-name", placeholder: "Jim", required: true })}
        {veld("achternaam", "Achternaam*", { type: "text", autoComplete: "family-name", placeholder: "Hopper", required: true })}
        <label>
          <span className="lbl">Onderwerp</span>
          <select name="onderwerp" value={form.onderwerp} onChange={zet("onderwerp")} style={{ color: form.onderwerp ? "#ffffff" : "#7d7d7d" }}>
            {CONTACT.onderwerpen.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg className="chevron" aria-hidden="true" width="15" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>
        {veld("email", "E-mail*", { type: "email", autoComplete: "email", placeholder: "naam@bedrijf.nl", required: true })}
        <label style={{ gridColumn: "1 / -1" }}>
          <span className="lbl">Bericht*</span>
          <textarea
            name="bericht"
            rows={4}
            value={form.bericht}
            onChange={zet("bericht")}
            placeholder="Typ je bericht…"
            aria-required="true"
            aria-invalid={fouten.bericht ? "true" : "false"}
            aria-describedby="err-bericht"
            required
          />
          {fouten.bericht ? (
            <p id="err-bericht" className="fout">
              {fouten.bericht}
            </p>
          ) : null}
        </label>
      </div>
      {statusTekst ? (
        <p role="status" aria-live="polite" className={status === "verzonden" ? "status ok" : "status err"}>
          {statusTekst}
        </p>
      ) : null}
      <button type="submit" disabled={status === "bezig"} className={status === "verzonden" ? "verzonden" : undefined}>
        {knopTekst}
      </button>
    </form>
  );
}
