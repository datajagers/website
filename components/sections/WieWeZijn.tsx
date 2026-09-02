"use client";

// Wie we zijn — port van de v3-choreografie: fase 1 is de gepinde quote
// (380vh-baan; de woorden lichten op van grijs naar inkt over scroll 5–50%),
// fase 2 (58–100%) is de horizontale wipe: quote + portret parallaxen naar
// links weg terwijl het statements-canvas van rechts binnenschuift. Waar
// ViewTimeline bestaat draait de wipe op de compositor (framesync met de
// native sticky quote); anders neemt de JS-fallback het per frame over.
// Mobiel: zelfde effect op een kortere baan (240vh); reduced motion en
// no-JS: alles statisch onder elkaar met de quote in volle inkt.

import { useEffect, useRef } from "react";
import { WIE_WE_ZIJN } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";
import { ArrowCta } from "@/components/ArrowCta";
import { Reveal } from "@/components/motion/Reveal";

export function WieWeZijn() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stmtRef = useRef<HTMLDivElement>(null);
  const qwRef = useRef<HTMLDivElement>(null);
  const portretRef = useRef<HTMLImageElement>(null);
  const kopRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current, stmt = stmtRef.current, qw = qwRef.current;
    const portret = portretRef.current, kop = kopRef.current;
    if (!track || !stmt || !qw) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const woorden = Array.from(track.querySelectorAll<HTMLSpanElement>(".st-woord"));
    const laatsteAlpha: string[] = [];
    let trackTop: number | null = null;
    let trackH = 0;
    let raf: number | null = null;
    let anims: Animation[] = [];
    let cssDriven = false;

    // ── compositor-pad: de wipe hangt aan een ViewTimeline (contain 58→100%),
    //    exact v3 — de verticale pin is lineair (scrollcompensatie), de rest
    //    veegt met easeInOut. JS houdt alleen de woord-oplichting over.
    const bindTimeline = () => {
      const VT = (window as unknown as { ViewTimeline?: new (o: object) => AnimationTimeline }).ViewTimeline;
      if (!VT || typeof CSS === "undefined" || !CSS.percent) return false;
      let timeline: AnimationTimeline;
      try { timeline = new VT({ subject: track, axis: "block" }); } catch { return false; }
      if ((timeline as { currentTime?: unknown }).currentTime == null) return false;
      const wipeVh = ((track.offsetHeight - window.innerHeight) * 0.42) / window.innerHeight * 100;
      const WIPE = {
        timeline,
        rangeStart: { rangeName: "contain", offset: CSS.percent(58) },
        rangeEnd: { rangeName: "contain", offset: CSS.percent(100) },
        fill: "both" as FillMode,
      };
      const EASE = "cubic-bezier(0.45, 0, 0.55, 1)";
      anims = [
        stmt.animate([{ translate: `0 -${wipeVh.toFixed(1)}vh` }, { translate: "0 0" }], { easing: "linear", ...WIPE }),
        stmt.animate([{ transform: "translateX(100vw)" }, { transform: "translateX(0)" }], { easing: EASE, ...WIPE }),
        qw.animate(
          [{ transform: "translateX(0)", opacity: 1 }, { transform: "translateX(-60vw)", opacity: 0.1 }],
          { easing: EASE, ...WIPE }),
      ];
      if (portret) anims.push(portret.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-130%)" }], { easing: EASE, ...WIPE }));
      if (kop) anims.push(kop.animate([{ opacity: 1 }, { opacity: 0 }], { easing: EASE, ...WIPE }));
      return true;
    };
    cssDriven = bindTimeline();

    const stap = () => {
      raf = null;
      const vh = window.innerHeight;

      // A/C-teller in de sticky rail volgt het zichtbare statement (v3 _apply)
      // — vóór de track-bail: de statements leven grotendeels vóórbij de baan
      if (currentRef.current) {
        const sr = stmt.getBoundingClientRect();
        if (sr.bottom > -vh && sr.top < vh * 2) {
          let cur: string | null = null;
          stmt.querySelectorAll<HTMLElement>("[data-letter]").forEach((b) => {
            const rb = b.getBoundingClientRect();
            if (rb.top < vh * 0.65 && rb.bottom > 0) cur = b.getAttribute("data-letter");
          });
          if (cur) {
            const label = `${cur} / C`;
            if (currentRef.current.textContent !== label) currentRef.current.textContent = label;
          }
        }
      }

      if (trackTop == null) {
        trackTop = track.getBoundingClientRect().top + window.scrollY;
        trackH = track.offsetHeight;
      }
      const top = trackTop - window.scrollY;
      if (vh > 0 && (top + trackH < -vh || top > vh * 2)) return;
      const total = trackH - vh;
      const p = Math.min(1, Math.max(0, -top / Math.max(1, total)));

      // leesfase: woorden lichten op (5–50% van de baan)
      const pr = Math.min(1, Math.max(0, (p - 0.05) / 0.45));
      const n = woorden.length;
      const F = window.innerWidth < 860 ? 0.4 : 0.22;
      for (let i = 0; i < n; i++) {
        const span = 1.6 / n, start = (i / n) * (1 - span);
        const t = Math.min(1, Math.max(0, (pr - start) / span));
        const a = (F + t * (1 - F)).toFixed(3);
        if (laatsteAlpha[i] !== a) {
          laatsteAlpha[i] = a;
          woorden[i].style.color = `rgba(29,29,29,${a})`;
        }
      }

      if (cssDriven) return;
      // fallback-wipe zonder ViewTimeline — zelfde choreografie, per frame
      const ph = Math.min(1, Math.max(0, (p - 0.58) / 0.42));
      const e = ph < 0.5 ? 2 * ph * ph : 1 - Math.pow(-2 * ph + 2, 2) / 2;
      qw.style.transform = `translateX(${(-e * 0.6 * window.innerWidth).toFixed(1)}px)`;
      qw.style.opacity = (1 - e * 0.9).toFixed(3);
      if (portret) portret.style.transform = `translateX(${(-e * 130).toFixed(1)}%)`;
      if (kop) kop.style.opacity = (1 - e).toFixed(3);
      if (p >= 1) {
        if (stmt.style.transform !== "") stmt.style.transform = "";
      } else {
        stmt.style.transform = `translate3d(${((1 - e) * window.innerWidth).toFixed(1)}px, ${(-top - total).toFixed(1)}px, 0)`;
      }
    };

    const kick = () => { if (raf === null) raf = requestAnimationFrame(stap); };
    const onResize = () => { trackTop = null; kick(); };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
      anims.forEach((a) => a.cancel());
    };
  }, []);

  const [a, b, c] = WIE_WE_ZIJN.statements;
  const blok = (s: typeof a, children?: React.ReactNode) => (
    <div className="blok" data-letter={s.letter} key={s.letter}>
      <div className="ghosthold">
        <span className="ghost" aria-hidden="true">
          {s.letter} /
        </span>
        <Reveal>
          <h3>
            {s.tekst} {s.grijs ? <span className="grijs">{s.grijs}</span> : null}
          </h3>
        </Reveal>
      </div>
      {s.chips.length > 0 ? (
        <Reveal delay={1}>
          <div className="chips">
            {s.chips.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      ) : null}
      {children}
    </div>
  );

  const quoteWoorden = WIE_WE_ZIJN.quote.split(" ");

  return (
    <section id="verhaal" className="band-light wwz">
      {/* de hero→verhaal-wig leeft in de HeroFlip-stage (onder de fotolaag,
          zoals v3) — hier geen eigen wig */}
      {/* fase 1: gepinde quote-baan */}
      <div className="st-track" ref={trackRef}>
        <div className="st-sticky">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="portret" ref={portretRef} src="/assets/wouter-black-white.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div ref={kopRef}>
            <Sectiekop num={WIE_WE_ZIJN.num} label={WIE_WE_ZIJN.label} rechts="© 2026" />
          </div>
          <div className="quotewrap" ref={qwRef}>
            <blockquote>
              <span aria-hidden="true" style={{ color: "rgba(29,29,29,0.9)" }}>
                “
              </span>
              {quoteWoorden.map((w, i) => (
                <span key={i} className="st-woord">
                  {w}
                  {i < quoteWoorden.length - 1 ? " " : ""}
                </span>
              ))}
            </blockquote>
          </div>
        </div>
      </div>
      {/* fase 2: statements-canvas schuift van rechts over de quote heen */}
      <div className="st-statements" ref={stmtRef}>
        <div className="wrap">
          <div className="grid">
            {/* sticky linkerrail — pint een vol scherm terwijl A/B/C passeren */}
            <div className="rail">
              <div className="rail-top">
                <h2>Wie we zijn</h2>
                <span className="current mono" ref={currentRef}>
                  A / C
                </span>
              </div>
              <div className="railfoot">
                <p>{WIE_WE_ZIJN.rail}</p>
                <ArrowCta href="/contact" label={WIE_WE_ZIJN.cta} />
              </div>
            </div>
            <div>
              {blok(a)}
              {blok(b)}
              {blok(
                c,
                <>
                  <div className="duo">
                    <div className="kaart">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/uploads/character-windows-xp-9146bdbb.jpg" alt="Werkplek met een computer uit 2005" loading="lazy" decoding="async" style={{ filter: "grayscale(0.4)" }} />
                      <div className="voet">
                        <div className="lbl mono">HERKENBAAR?</div>
                        <div className="val">Zo werk jij misschien nog</div>
                      </div>
                    </div>
                    <div className="kaart">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/hero-shoes-on-desk-tall.jpg" alt="Man leunt ontspannen achterover met de voeten op het bureau, hoog boven de bergen" loading="lazy" decoding="async" style={{ objectPosition: "87% 100%" }} />
                      <div className="voet">
                        <div className="lbl mono">HET KAN ANDERS</div>
                        <div className="val">Zo voelt de maandag met overzicht</div>
                      </div>
                    </div>
                  </div>
                  <div className="strip">
                    {WIE_WE_ZIJN.strip.map((s) => (
                      <div className="item" key={s.num}>
                        <span className={s.accent ? "num mono accent" : "num mono"}>{s.num}</span>
                        <span className="txt">{s.tekst}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
