"use client";

import { useState } from "react";
import { TESTIMONIALS } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";
import { ArrowCta } from "@/components/ArrowCta";

export function Testimonials() {
  const [actief, setActief] = useState(0);
  const n = TESTIMONIALS.quotes.length;
  const stap = (d: number) => setActief((a) => (a + d + n) % n);

  return (
    <section id="proof-quotes" className="band-light tm">
      <div className="backdrop" aria-hidden="true" />
      <div className="wrap" style={{ position: "relative" }}>
        <Sectiekop
          num={TESTIMONIALS.num}
          label={TESTIMONIALS.label}
          rechts={`${TESTIMONIALS.quotes[actief].num} / 0${n}`}
        />
        <h2>
          {TESTIMONIALS.kop}
          <br />
          <span className="grijs">{TESTIMONIALS.kopGrijs}</span>
        </h2>
        <p className="intro">{TESTIMONIALS.intro}</p>
        <div className="podium">
          <div className="pijlen">
            <button type="button" aria-label="Vorige quote" onClick={() => stap(-1)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" aria-label="Volgende quote" onClick={() => stap(1)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <div aria-live="polite">
            {TESTIMONIALS.quotes.map((q, i) => (
              // alle quotes staan in de DOM (server-rendered, dus vindbaar);
              // alleen de actieve is zichtbaar
              <div key={q.num} hidden={i !== actief}>
                <blockquote>
                  <span className="aanhaling">“</span>
                  {q.quote}
                  <span className="aanhaling">”</span>
                </blockquote>
                <div className="auteur">{q.author}</div>
                <div className="rol mono">{q.role}</div>
              </div>
            ))}
            <ArrowCta href="/contact" label={TESTIMONIALS.cta} />
          </div>
        </div>
        <div className="telrij" aria-hidden="true">
          <span className="teller mono">/{TESTIMONIALS.quotes[actief].num}</span>
          <span className="meetlat mono">{TESTIMONIALS.meetlat}</span>
        </div>
      </div>
    </section>
  );
}
