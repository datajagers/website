"use client";

// Estafette — port van estafette-driver.js (v3): het adempauze-statement
// ("Niet je mensen zitten vast.") wordt in-place vervangen door de
// diensten-kop; het woord "tooling" blijft staan en reist mee van slot a
// naar slot b (FLIP tussen live rects, kleuromslag naar blurple op 55%).
// 220vh-baan met sticky 62vh-stage; smoothstep-vensters exact v3
// (uit 0.18/0.30, in 0.40/0.56, loper 0.22/0.70 — klaar bij ~0.96 zodat
// er geen dood gepind scherm overblijft). Mobiel (<860), reduced motion
// en no-JS: beide scenes statisch onder elkaar met "tooling" gewoon in
// de zin.

import { useEffect, useRef } from "react";
import { DIENSTEN } from "@/lib/copy";

export function Estafette() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const stage = track.querySelector<HTMLElement>(".es-stage");
    const s1 = track.querySelector<HTMLElement>(".es-scene1");
    const s2 = track.querySelector<HTMLElement>(".es-scene2");
    const woord = track.querySelector<HTMLElement>(".es-woord");
    const slotA = track.querySelector<HTMLElement>('[data-es-slot="a"]');
    const slotB = track.querySelector<HTMLElement>('[data-es-slot="b"]');
    if (!stage || !s1 || !s2 || !woord || !slotA || !slotB) return;

    let raf: number;
    const sm = (t: number) => t * t * (3 - 2 * t);
    const clamp = (x: number) => Math.max(0, Math.min(1, x));

    const step = () => {
      raf = requestAnimationFrame(step);
      if (document.hidden) return; // een gepauzeerde tab heeft niets te scrubben
      if (reduce || window.innerWidth < 860) { woord.style.opacity = "0"; return; }
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      if (vh > 0 && (r.bottom < -vh || r.top > vh * 2)) return;
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      const outT = sm(clamp((p - 0.18) / 0.3));
      const inT = sm(clamp((p - 0.4) / 0.56));
      const w = sm(clamp((p - 0.22) / 0.7));
      s1.style.opacity = (1 - outT).toFixed(3);
      s1.style.transform = `translateY(${(-outT * 5).toFixed(2)}vh)`;
      s2.style.opacity = inT.toFixed(3);
      s2.style.transform = `translateY(${((1 - inT) * 6).toFixed(2)}vh)`;
      const sr = stage.getBoundingClientRect();
      const ra = slotA.getBoundingClientRect();
      const rb = slotB.getBoundingClientRect();
      const ax = ra.left - sr.left, ay = ra.top - sr.top;
      const by = rb.top - sr.top + (rb.height - ra.height) * 0.5 * w;
      const bx = rb.left - sr.left;
      const scale = 1 + (rb.height / Math.max(ra.height, 1) - 1) * w;
      woord.style.opacity = "1";
      woord.style.transform = `translate(${(ax + (bx - ax) * w).toFixed(1)}px,${(ay + (by - ay) * w).toFixed(1)}px) scale(${scale.toFixed(4)})`;
      woord.style.fontSize = getComputedStyle(slotA).fontSize;
      woord.style.color = w > 0.55 ? "#93c3fd" : "#ffffff";
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const woord = DIENSTEN.woord;
  const [grijsVoor, grijsNa] = DIENSTEN.brug.grijs.split(woord);
  const [kopVoor, kopNa] = DIENSTEN.kop.split(woord);

  return (
    <div className="band-dark estafette" ref={trackRef}>
      <div className="es-stage">
        {/* scene 1 — adempauze */}
        <div className="es-scene1">
          <span className="mono eyebrow">HERKENBAAR?</span>
          <h2 className="es-h2">
            {DIENSTEN.brug.wit}{" "}
            <span className="grijs">
              {grijsVoor}
              <span className="es-slot" data-es-slot="a">
                {woord}
              </span>
              {grijsNa}
            </span>
          </h2>
        </div>
        {/* scene 2 — de dienstenkop neemt het over */}
        <div className="es-scene2">
          <div className="binnen">
            <div className="es-kopregel mono">
              <span>({DIENSTEN.num})</span>
              <span>({DIENSTEN.label})</span>
              <span className="rechts">{DIENSTEN.rechts}</span>
            </div>
            <h2 className="es-h2">
              {kopVoor}
              <span className="es-slot" data-es-slot="b">
                {woord}
              </span>
              {kopNa} <span className="grijs">{DIENSTEN.kopGrijs}</span>
            </h2>
            <p className="es-intro">{DIENSTEN.intro}</p>
          </div>
        </div>
        {/* de loper */}
        <span className="es-woord" aria-hidden="true">
          {woord}
        </span>
      </div>
    </div>
  );
}
