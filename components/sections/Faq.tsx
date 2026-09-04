"use client";

// FAQ-accordeon — port van FAQ v2 (v3) met de vijf micro-animaties:
// nummercirkel spring-in + kleuromslag, vraag kleurt bij en stapt naar
// rechts, accentlijn veegt vanaf links, plus roteert naar kruis, paneel
// opent via grid-rows 0fr→1fr met vertraagde tekst-fade. Inhoud is
// server-rendered (SEO), alleen de open-status is client-state.

import { useState } from "react";
import { FAQ } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";
import { Wig } from "@/components/motion/Wig";

export function Faq({ ctaHref = "/contact" }: { ctaHref?: string }) {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq" className="band-light faq">
      <Wig kleur="#f6f6f4" />
      <div className="inner">
        <Sectiekop num={FAQ.num} label={FAQ.label} />
        <div className="grid">
          <div className="zijkolom">
            <a className="mediakaart" href={ctaHref}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/floating_cocktail.jpg" srcSet="/assets/floating_cocktail-760.jpg 760w, /assets/floating_cocktail.jpg 1672w" sizes="(max-width: 859px) 82vw, 375px" alt="Man drijft ontspannen op het water met een cocktail" loading="lazy" decoding="async" />
              <span className="regel">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontWeight: 500 }}>
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true" style={{ flex: "none" }}>
                    <path d="M0 0L10 6L0 12Z" />
                  </svg>
                  {FAQ.sidebar.cta}
                </span>
                <span className="duur">{FAQ.sidebar.duur}</span>
              </span>
            </a>
            <p className="zijtekst">{FAQ.sidebar.tekst}</p>
          </div>
          <div>
            {FAQ.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className={isOpen ? "faq-item open" : "faq-item"} key={item.q}>
                  <button
                    type="button"
                    id={`faq-vraag-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="nrhold" aria-hidden="true">
                      <span className="cirkel" />
                      <span className="cijfer mono">0{i + 1}</span>
                    </span>
                    <span className="vraag">{item.q}</span>
                    <span className="plus" aria-hidden="true">
                      <svg width="17" height="17" viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
                        <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="hairline" aria-hidden="true" />
                    <span className="accentlijn" aria-hidden="true" />
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-vraag-${i}`}
                    className="paneel"
                  >
                    <div className="paneel-in">
                      <p className="antwoord">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
