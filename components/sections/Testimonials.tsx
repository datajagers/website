"use client";

// Port van Testimonials Concept (v3): 15s-cyclus (echte quotes zijn ~55
// woorden), woord-voor-woord reveal (1,5s totaal, stagger gecapt op 0,18s),
// WCAG 2.2.2-pauze op hover/focus, klik onderbreekt de lopende overgang.
// Alle drie de quotes staan server-rendered in de DOM (SEO); alleen de
// actieve is zichtbaar.

import { useCallback, useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";
import { ArrowCta } from "@/components/ArrowCta";
import { Wig } from "@/components/motion/Wig";

const CYCLE = 15000;
const REVEAL = 1.5;
const stagger = (n: number) => Math.min(0.18, REVEAL / Math.max(1, n));

type Fase = "idle" | "out" | "in";

export function Testimonials() {
  const [actief, setActief] = useState(0);
  const [getoond, setGetoond] = useState(0);
  const [fase, setFase] = useState<Fase>("idle");
  const n = TESTIMONIALS.quotes.length;
  const timers = useRef<{ cycle?: ReturnType<typeof setInterval>; t1?: ReturnType<typeof setTimeout>; t2?: ReturnType<typeof setTimeout> }>({});
  const reduce = useRef(false);
  const faseRef = useRef<Fase>("idle");
  const actiefRef = useRef(0);
  faseRef.current = fase;
  actiefRef.current = actief;

  const ga = useCallback((i: number, force = false) => {
    if (i === actiefRef.current) return;
    if (faseRef.current !== "idle") {
      // klik onderbreekt: overgang afkappen, gekozen quote direct tonen
      if (!force) return;
      clearTimeout(timers.current.t1);
      clearTimeout(timers.current.t2);
      setActief(i); setGetoond(i); setFase("idle");
      return;
    }
    if (reduce.current) { setActief(i); setGetoond(i); return; }
    setFase("out");
    setActief(i);
    timers.current.t1 = setTimeout(() => {
      setGetoond(i);
      setFase("in");
      const w = TESTIMONIALS.quotes[i].quote.split(" ").length;
      const totaal = (0.24 + (w - 1) * stagger(w) + 1.0) * 1000;
      timers.current.t2 = setTimeout(() => setFase("idle"), totaal + 250);
    }, 560);
  }, []);

  const startCycle = useCallback(() => {
    clearInterval(timers.current.cycle);
    timers.current.cycle = setInterval(() => {
      ga((actiefRef.current + 1) % n);
    }, CYCLE);
  }, [ga, n]);

  const pauze = useCallback(() => clearInterval(timers.current.cycle), []);

  useEffect(() => {
    reduce.current = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (!reduce.current) startCycle();
    const t = timers.current;
    return () => {
      clearInterval(t.cycle);
      clearTimeout(t.t1);
      clearTimeout(t.t2);
    };
  }, [startCycle]);

  const stap = (d: number) => {
    ga((actiefRef.current + d + n) % n, true);
    if (!reduce.current) startCycle();
  };

  const cur = TESTIMONIALS.quotes[getoond];
  const woorden = cur.quote.split(" ");
  const st = stagger(woorden.length);
  const wStyle = (i: number): React.CSSProperties =>
    fase === "in"
      ? { display: "inline-block", animation: `tmWord 1s cubic-bezier(0.22,1,0.36,1) ${(0.24 + i * st).toFixed(2)}s both` }
      : { display: "inline-block" };
  const metaStyle = (delay: number): React.CSSProperties =>
    fase === "out"
      ? { transition: "opacity 0.48s ease, transform 0.52s ease", opacity: 0, transform: "translateY(-8px)" }
      : fase === "in"
        ? { animation: `tmMeta 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s both` }
        : {};

  return (
    <section
      id="proof-quotes"
      className="band-light tm"
      onMouseEnter={pauze}
      onMouseLeave={() => { if (!reduce.current) startCycle(); }}
      onFocus={pauze}
      onBlur={() => { if (!reduce.current) startCycle(); }}
    >
      <Wig kleur="#f6f6f4" />
      <div className="backdrop" aria-hidden="true" />
      <div className="wrap" style={{ position: "relative" }}>
        <Sectiekop
          num={TESTIMONIALS.num}
          label={TESTIMONIALS.label}
          rechts={`${TESTIMONIALS.quotes[actief].num} / 0${n}`}
        />
        {/* v3: kop en intro lijnen uit op de quotekolom (108px-offset) */}
        <div className="koprij">
          <div aria-hidden="true" />
          <div>
            <h2>
              {TESTIMONIALS.kop}
              <br />
              <span className="grijs">{TESTIMONIALS.kopGrijs}</span>
            </h2>
            <p className="intro">{TESTIMONIALS.intro}</p>
          </div>
        </div>
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
          <div>
            <div aria-live="polite">
              {/* actieve quote: woord-voor-woord; layout staat vast, dus geen reflow */}
              <blockquote
                style={fase === "out" ? { transition: "opacity 0.48s ease", opacity: 0 } : { opacity: 1 }}
              >
                <span className="aanhaling">“</span>
                {woorden.map((w, i) => (
                  <span key={`${getoond}-${i}`} style={wStyle(i)}>
                    {w}
                    {i < woorden.length - 1 ? " " : ""}
                  </span>
                ))}
                <span className="aanhaling" style={wStyle(woorden.length)}>”</span>
              </blockquote>
              <div className="auteur" style={metaStyle(0.3)}>{cur.author}</div>
              <div className="rol mono" style={metaStyle(0.5)}>{cur.role}</div>
            </div>
            {/* inactieve quotes: server-rendered voor crawlers, visueel verborgen */}
            <div hidden>
              {TESTIMONIALS.quotes.filter((_, i) => i !== getoond).map((q) => (
                <blockquote key={q.num}>
                  “{q.quote}” — {q.author}, {q.role}
                </blockquote>
              ))}
            </div>
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
