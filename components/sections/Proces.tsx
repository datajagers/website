"use client";

// Proces-gantt — port van Proces Gantt (v3): balken scaleX-en in vanaf links
// (gestaffeld) zodra de sectie 25% in beeld is; labels en fase-uitleg faden
// mee. Eenmalig, via IntersectionObserver.

import { useEffect, useRef } from "react";
import { PROCES } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";

const WEKEN = 11;
const pct = (v: number) => `${((v / WEKEN) * 100).toFixed(2)}%`;

export function Proces() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.setAttribute("data-on", "true");
      return;
    }
    if (!window.IntersectionObserver) { root.setAttribute("data-on", "true"); return; }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            root.setAttribute("data-on", "true");
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="band-dark proces">
      <div className="wrap">
        <Sectiekop num={PROCES.num} label={PROCES.label} rechts={PROCES.rechts} />
        <h3 className="pg-in">
          {PROCES.kop} <span className="grijs">{PROCES.kopGrijs}</span>
        </h3>
        <p className="intro pg-in" style={{ transitionDelay: "0.08s" }}>{PROCES.intro}</p>
        <div className="gantt" role="img" aria-label="Tijdlijn van de vier fasen, elkaar overlappend over elf weken">
          {PROCES.fasen.map((f, i) => (
            <div className="lane" key={f.num}>
              <div
                className="bar"
                style={{ left: pct(f.start - 1), width: pct(f.end - f.start + 1), transitionDelay: `${(i * 0.12).toFixed(2)}s` }}
              >
                <span>{f.titel}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="uitleg">
          {PROCES.fasen.map((f, i) => (
            <div className="fase pg-in" key={f.num} style={{ transitionDelay: `${(i * 0.12).toFixed(2)}s` }}>
              <span className="num mono">({f.num})</span>
              <span className="titel">{f.titel}</span>
              <p>{f.tekst}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
