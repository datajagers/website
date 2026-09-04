"use client";

// Diagonale wig / boogkap tussen secties — port van _startWig (v3): het doel
// hobbelt met scroll-delay achter de scroll aan, een onderkritisch gedempte
// veer geeft licht overshoot. De wig hoort bij zijn oudersectie en schildert
// de aankomende grond over de vorige sectie heen.
// Smoothness-audit 2026-09: de doos staat op zijn vaste maximale hoogte en de
// vorm komt per frame volledig uit clip-path (paint-only) — de height-write
// die elke scroll-frame layout invalideerde is weg. Geometrie px-identiek:
// zichtbare rechterrand = tt·h(tt), dome = border-radius-vorm als pad.

import { useEffect, useRef } from "react";

export function Wig({
  boog = false,
  kleur,
  sectieId,
  binnen = false,
}: {
  boog?: boolean;
  kleur: string;
  /** meet de voortgang op deze sectie i.p.v. de ouder (voor een wig die
      in de vórige sectie leeft, zoals de hero-wig in v3) */
  sectieId?: string;
  /** positioneer op de bodem van de ouder (bottom 0, onder diens fotolagen)
      i.p.v. boven de eigen sectierand */
  binnen?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wig = ref.current;
    const sec = sectieId ? document.getElementById(sectieId) : wig?.parentElement;
    if (!wig || !sec) return;
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    let t = 0, v = 0, d: number | undefined;
    let raf: number | null = null;
    let vasteH = 0, breedte = 0;

    // éénmalig per (re)size: doos op de maximale hoogte; alles daaronder is
    // per frame alleen nog een clip-path-write (geen layout-invalidatie)
    const zetDoos = () => {
      vasteH = boog
        ? Math.min(180, window.innerWidth * 0.12)
        : Math.min(225, Math.max(105, window.innerWidth * 0.135));
      wig.style.height = `${vasteH.toFixed(1)}px`;
      if (boog) wig.style.borderRadius = "0";
      breedte = wig.getBoundingClientRect().width;
    };

    const step = () => {
      raf = null;
      const vh = window.innerHeight;
      const r = sec.getBoundingClientRect();
      const raw = Math.max(0, Math.min(1, (vh * 1.25 - r.top) / (vh * 0.85)));
      if (d === undefined) d = raw;
      d += (raw - d) * (reduce ? 1 : 0.07);
      if (reduce) { t = d; v = 0; }
      else {
        v += (d - t) * 0.106;
        v *= 0.875;
        t += v;
      }
      const tt = Math.max(0, Math.min(1.15, t));
      if (boog) {
        // zelfde dome als border-radius "100% 100% 0 0" op een doos van
        // hoogte h (overlappende radii → rx = W/2, ry = h/2), nu als pad
        // onderin de vaste doos
        const h = Math.max(5, (1 - Math.pow(Math.min(1, tt), 1.4)) * vasteH);
        const rx = (breedte / 2).toFixed(1), ry = (h / 2).toFixed(1);
        const xMid = (breedte / 2).toFixed(1), xEind = breedte.toFixed(1);
        const yVoet = vasteH.toFixed(1);
        const yMid = (vasteH - h / 2).toFixed(1), yTop = (vasteH - h).toFixed(1);
        wig.style.clipPath = `path("M0 ${yVoet} L0 ${yMid} A${rx} ${ry} 0 0 1 ${xMid} ${yTop} A${rx} ${ry} 0 0 1 ${xEind} ${yMid} L${xEind} ${yVoet} Z")`;
      } else {
        // zichtbare rechterrand in px = tt · h(tt); h was voorheen de
        // meegroeiende dooshoogte, nu verrekend in het clip-percentage
        const h = vasteH * (0.35 + 0.65 * Math.min(1, tt));
        wig.style.clipPath = `polygon(0 100%, 100% ${(100 - (tt * h / vasteH) * 100).toFixed(2)}%, 100% 100%)`;
      }
      if (!reduce && (Math.abs(raw - t) > 0.001 || Math.abs(v) > 0.001 || Math.abs(raw - (d ?? raw)) > 0.001)) {
        raf = requestAnimationFrame(step);
      }
    };

    const kick = () => { if (raf === null) raf = requestAnimationFrame(step); };
    const onResize = () => { zetDoos(); kick(); };
    zetDoos();
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [boog, sectieId]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={
        boog
          ? {
              position: "absolute", left: 0, right: 0, bottom: "calc(100% - 1px)",
              height: 140, background: kleur, borderRadius: "100% 100% 0 0",
              pointerEvents: "none", zIndex: 1,
            }
          : {
              position: "absolute", left: 0, right: 0,
              bottom: binnen ? 0 : "calc(100% - 1px)",
              height: "clamp(70px, 9vw, 150px)", background: kleur,
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%)",
              pointerEvents: "none", zIndex: binnen ? 3 : 1,
            }
      }
    />
  );
}
