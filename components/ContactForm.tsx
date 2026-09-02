"use client";

// Mailto-flow — bewust besluit (2026-09-02): geen extern endpoint. De submit
// opent het mailprogramma van de bezoeker met alle velden in de body.

import { useState } from "react";
import { CONTACT } from "@/lib/copy";

const ONDERWERPEN: Record<string, string> = Object.fromEntries(
  CONTACT.onderwerpen.map((o) => [o.value, o.value ? o.label : "Niet opgegeven"])
);

type Velden = { voornaam: string; achternaam: string; onderwerp: string; email: string; bericht: string };
const LEEG: Velden = { voornaam: "", achternaam: "", onderwerp: "", email: "", bericht: "" };

export function ContactForm() {
  const [form, setForm] = useState<Velden>(LEEG);
  const [fouten, setFouten] = useState<Partial<Velden>>({});
  const [verzonden, setVerzonden] = useState(false);

  const zet = (k: keyof Velden) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setFouten((f) => ({ ...f, [k]: undefined }));
    setVerzonden(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    const onderwerp = ONDERWERPEN[form.onderwerp] || "Niet opgegeven";
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
    setFouten({});
    setVerzonden(true);
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

  return (
    <form onSubmit={onSubmit} noValidate>
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
      {verzonden || heeftFouten ? (
        <p role="status" aria-live="polite" className={verzonden ? "status ok" : "status err"}>
          {verzonden
            ? "Je mailprogramma is geopend met je bericht. Verstuur het daar om de aanvraag af te ronden."
            : "Controleer de gemarkeerde velden."}
        </p>
      ) : null}
      <button type="submit" className={verzonden ? "verzonden" : undefined}>
        {verzonden ? "Geopend in je mailprogramma" : "Verstuur"}
      </button>
    </form>
  );
}
