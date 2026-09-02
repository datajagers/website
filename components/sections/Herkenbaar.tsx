"use client";

// Herkenbaar — port van de v3 "struggles wall": badge, titel (mix-blend
// exclusion) en subtitel pinnen in het schermmidden; de zes kaarten liggen
// verstrooid (één per rij, verdeeld over vier kolommen) en schalen 0 → 1 → 0
// terwijl ze door de viewport reizen, óver de gepinde tekst heen. De stack
// fadet weg vóór het einde van de muur; de scroll-hint fadet op de eerste
// meters. Mobiel (<860) en reduced motion: badge/kop/sub statisch en de
// kaarten gewoon onder elkaar.

import { useEffect, useRef } from "react";
import { HERKENBAAR } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";
import { Wig } from "@/components/motion/Wig";

const KOLOMMEN = 4;

// deterministische scatter — v3 buildLayout: eerst even, dan oneven kolommen
function scatter(count: number, cols: number) {
  const perm: number[] = [];
  for (let k = 0; k < cols; k += 2) perm.push(k);
  for (let k = 1; k < cols; k += 2) perm.push(k);
  return Array.from({ length: count }, (_, i) => perm[i % cols]);
}

export function Herkenbaar() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hint = root.querySelector<HTMLElement>(".hk-hint");
    const badge = root.querySelector<HTMLElement>(".hk-badge");
    const titel = root.querySelector<HTMLElement>(".hk-titel");
    const sub = root.querySelector<HTMLElement>(".hk-sub");
    const kaarten = Array.from(root.querySelectorAll<HTMLElement>(".hk-cel .post"));
    const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    let raf: number | null = null;

    const stap = () => {
      raf = null;
      if (window.innerWidth < 860) return; // gelineariseerd: driver slaapt
      const vh = window.innerHeight;
      const rect = root.getBoundingClientRect();
      const total = rect.height - vh;
      const p = total > 0 ? clamp(-rect.top / total) : 0;

      if (hint) hint.style.opacity = (1 - clamp(p / 0.12)).toFixed(3);

      // titelstack volledig weg vóór het einde van de muur (v3-fallbackpad)
      const e4 = clamp((p - 0.8) / 0.1);
      const fade = (1 - e4).toFixed(3);
      const vis = e4 >= 0.999 ? "hidden" : "visible";
      [badge, titel, sub].forEach((el) => {
        if (!el) return;
        el.style.opacity = fade;
        el.style.visibility = vis;
      });

      // elke kaart scrubt scale 0 -> 1 -> 0 over zijn reis door de viewport;
      // meet de ongetransformeerde cel, niet de geschaalde kaart
      for (const kaart of kaarten) {
        const cel = (kaart.parentElement || kaart).getBoundingClientRect();
        const span = vh + (cel.height || 1);
        const t = clamp((vh - cel.top) / span);
        let s: number;
        if (t <= 0.5) { const u = t * 2; s = 1 - (1 - u) * (1 - u); }
        else { const u = (t - 0.5) * 2; s = 1 - u * u; }
        kaart.style.transform = `scale(${Math.max(0, s).toFixed(3)})`;
      }
    };

    const kick = () => { if (raf === null) raf = requestAnimationFrame(stap); };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const posities = scatter(HERKENBAAR.posts.length, KOLOMMEN);

  return (
    <section id="herkenbaar" className="band-dark herkenbaar" ref={rootRef}>
      <Wig boog kleur="#1D1D1D" />
      {/* zelfde kolom als de kaartenmuur (1180), zodat de hairline spoort */}
      <div className="kopwrap">
        <Sectiekop num={HERKENBAAR.num} label={HERKENBAAR.label} rechts={HERKENBAAR.rechts} />
      </div>

      {/* scroll-hint — midden-onder op het eerste scherm, fadet bij scroll */}
      <div className="hk-hint" aria-hidden="true">
        <span className="mono">Scroll</span>
        <span className="lijn" />
      </div>

      {/* gepinde titelstack — drie sticky broers; alleen de h2 draagt de blend */}
      <div className="hk-spacer" aria-hidden="true" />
      <div className="hk-badge">
        <span className="badge mono">
          <span className="dot" aria-hidden="true" />
          Herkenbaar?
        </span>
      </div>
      <h2 className="hk-titel">{HERKENBAAR.kop}</h2>
      <div className="hk-subhold">
        <p className="hk-sub">{HERKENBAAR.sub}</p>
      </div>

      {/* verstrooide kaartenmuur — één kaart per rij, over de sticky tekst heen */}
      <div className="muur">
        {HERKENBAAR.posts.map((p, i) => (
          <div className="hk-rij" key={p.handle}>
            {Array.from({ length: KOLOMMEN }, (_, kol) => (
              <div className={kol === posities[i] ? "hk-cel gevuld" : "hk-cel"} key={kol} data-kant={kol < KOLOMMEN / 2 ? "l" : "r"}>
                {kol === posities[i] ? (
                  <article className="post">
                    <div className="kop">
                      <span className="avatar" aria-hidden="true">
                        {p.name.charAt(0)}
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p className="naam">{p.name}</p>
                        <p className="meta">
                          {p.handle} · {p.role}
                        </p>
                      </div>
                      <span className="tijd">{p.time}</span>
                    </div>
                    <p className="tekst">
                      {p.quote} <span className="tag">{p.hashtag}</span>
                    </p>
                    <div className="voet">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-.98L3 21l1.98-5.5a8.5 8.5 0 1 1 16.02-4z" />
                        </svg>
                        {p.comments}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--dj-accent-light)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {p.likes}
                      </span>
                      <span className="num mono">0{i + 1}/06</span>
                    </div>
                  </article>
                ) : null}
              </div>
            ))}
          </div>
        ))}
        <div aria-hidden="true" style={{ height: "clamp(48px, 7vh, 96px)" }} />
      </div>
    </section>
  );
}
