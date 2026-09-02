"use client";

// Hero-FLIP, kalme herinterpretatie (besluit Wouter 2026-09-02: wél de FLIP,
// significant kalmer dan v3). Eén wheel-gebaar bovenaan laat de hero-foto als
// venster krimpen tot exact de middelste cijfers-kaart (clip-path, één
// beweging); de copy fadet rustig weg, het paneel komt zacht op. Terug-gebaar
// bovenaan speelt het omgekeerde. Mobiel (<860), reduced motion en no-JS:
// hero en paneel als gewone gestapelde secties.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HERO, IN_CIJFERS } from "@/lib/copy";
import { ArrowCta } from "@/components/ArrowCta";
import { Navbar } from "@/components/Navbar";
import { Wig } from "@/components/motion/Wig";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const OPEN_MS = 1100;
const CLOSE_MS = 900;
const DICHT_CLIP = "inset(0px 0px 0px 0px round 0px)";

export function HeroFlip() {
  const stageRef = useRef<HTMLElement>(null);
  const fotoRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const stage = stageRef.current, foto = fotoRef.current, label = labelRef.current, slot = slotRef.current;
    if (!stage || !foto || !label || !slot) return;
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // per gebeurtenis herbevestigen, niet cachen — frozen-breakpoint-les uit v3
    const stageMode = () => !reduce && window.matchMedia("(min-width: 860px)").matches;
    const s = { open: false, anim: false, openedAt: 0, ty: null as number | null };

    const slotClip = () => {
      const r = slot.getBoundingClientRect();
      return {
        clip: `inset(${r.top.toFixed(1)}px ${(window.innerWidth - r.right).toFixed(1)}px ${(window.innerHeight - r.bottom).toFixed(1)}px ${r.left.toFixed(1)}px round 5px)`,
        rect: r,
      };
    };
    const plaatsLabel = (r: DOMRect) => {
      label.style.left = `${r.left.toFixed(1)}px`;
      label.style.top = `${r.top.toFixed(1)}px`;
      label.style.width = `${r.width.toFixed(1)}px`;
      label.style.height = `${r.height.toFixed(1)}px`;
    };

    const speel = (open: boolean) => {
      if (s.anim || s.open === open) return;
      s.anim = true;
      const { clip, rect } = slotClip();
      plaatsLabel(rect);
      stage.setAttribute("data-open", open ? "true" : "false");
      const a = foto.animate(
        open ? [{ clipPath: DICHT_CLIP }, { clipPath: clip }] : [{ clipPath: clip }, { clipPath: DICHT_CLIP }],
        { duration: open ? OPEN_MS : CLOSE_MS, easing: EASE, fill: "forwards" }
      );
      const done = () => { s.open = open; s.anim = false; if (open) s.openedAt = Date.now(); };
      if (a.finished?.then) a.finished.then(done).catch(done);
      else setTimeout(done, (open ? OPEN_MS : CLOSE_MS) + 60);
    };

    const bovenaan = () => (window.scrollY || 0) <= 2;

    const onWheel = (e: WheelEvent) => {
      if (!stageMode() || !bovenaan()) return;
      if (s.anim) { if (e.cancelable) e.preventDefault(); return; }
      if (!s.open && e.deltaY > 0) { if (e.cancelable) e.preventDefault(); speel(true); }
      else if (s.open && e.deltaY < 0) { if (e.cancelable) e.preventDefault(); speel(false); }
      else if (s.open && e.deltaY > 0 && Date.now() - s.openedAt < 700) {
        // restmomentum van het open-gebaar niet meteen doorscrollen
        if (e.cancelable) e.preventDefault();
      }
    };

    const onTS = (e: TouchEvent) => { s.ty = e.touches?.[0]?.clientY ?? null; };
    const onTM = (e: TouchEvent) => {
      if (!stageMode() || s.ty == null || !bovenaan()) return;
      const dy = s.ty - (e.touches?.[0]?.clientY ?? s.ty);
      if (s.anim) { if (e.cancelable) e.preventDefault(); return; }
      if (!s.open && dy > 6) { if (e.cancelable) e.preventDefault(); speel(true); }
      else if (s.open && dy < -6) { if (e.cancelable) e.preventDefault(); speel(false); }
    };

    const onKey = (e: KeyboardEvent) => {
      if (!stageMode() || s.anim || !bovenaan()) return;
      const tag = (e.target as Element)?.tagName || "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      const omlaag = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "Spacebar";
      const omhoog = e.key === "ArrowUp" || e.key === "PageUp";
      if (!s.open && omlaag) { e.preventDefault(); speel(true); }
      else if (s.open && omhoog) { e.preventDefault(); speel(false); }
    };

    // Warm-up onder de Vizier: het paneel ligt achter de fotolaag en wordt
    // pas gerasterd (en de kaartfoto's pas gedecodeerd) bij de eerste FLIP —
    // dat was de hapering bij het allereerste gebaar. Twee frames met de
    // clip open, terwijl de preloader nog dekt, laat de browser alles alvast
    // schilderen; daarna staat het in de cache.
    const pl = document.getElementById("dj-preloader");
    if (stageMode() && pl) {
      const { clip } = slotClip();
      foto.style.clipPath = clip;
      stage.querySelectorAll("img").forEach((im) => {
        try { im.decode?.().catch(() => {}); } catch { /* decode is best-effort */ }
      });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!s.open && !s.anim) foto.style.clipPath = "";
      }));
    }

    const onResize = () => {
      if (!s.open) return;
      foto.getAnimations().forEach((a) => a.cancel());
      if (!stageMode()) {
        // teruggevallen naar gestapeld: stage resetten
        stage.setAttribute("data-open", "false");
        foto.style.clipPath = "";
        s.open = false; s.anim = false;
        return;
      }
      const { clip, rect } = slotClip();
      foto.style.clipPath = clip;
      plaatsLabel(rect);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchmove", onTM, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const [links, midden, rechts] = IN_CIJFERS.kaarten;
  const stat = (k: typeof links, delay: string) => (
    <div className="kaart ke-in" style={{ transitionDelay: delay }} key={k.label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={k.foto} alt={k.alt} decoding="async" />
      <div className="tint" aria-hidden="true" />
      <div className="voet">
        <div className="lbl mono">{k.label}</div>
        <div className="val">{k.waarde}</div>
      </div>
    </div>
  );

  return (
    <section ref={stageRef} id="top" className="kehero" data-open="false">
      {/* hero-scherm: foto + nav + copy (gestapelde basis; op desktop draagt de reislaag de foto) */}
      <div className="hero ke-heroscherm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="bg"
          src="/uploads/hero-character-sitting-on-top-of-clouds-692f40c3.jpg"
          alt="Man zit ontspannen op een stoel boven de wolken"
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
        />
        <div className="scrim" aria-hidden="true" />
        <Navbar active="Home" />
        <div className="copy">
          <h1>
            {HERO.titel}
            <span className="dot">.</span>
          </h1>
          <p className="sub">{HERO.sub}</p>
          <ArrowCta href="/contact" label={HERO.cta} />
        </div>
      </div>

      {/* In cijfers — fullscreen paneel in stage-modus, gewone sectie gestapeld */}
      <div className="band-light cijfers ke-panel">
        <div className="ke-in" style={{ transitionDelay: "0.35s" }}>
          <span className="eyebrow mono" style={{ display: "block", marginBottom: "clamp(16px, 2.4vh, 26px)" }}>
            ({IN_CIJFERS.num}) ({IN_CIJFERS.label})
          </span>
          <h2>
            {IN_CIJFERS.kop} <span className="grijs">{IN_CIJFERS.kopGrijs}</span>
          </h2>
        </div>
        <div className="rij">
          {stat(links, "0.5s")}
          <Link ref={slotRef} className="kaart midden" href={midden.href ?? "/#verhaal"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={midden.foto} alt="" aria-hidden="true" decoding="async" />
            <div className="tint" aria-hidden="true" />
            <div className="center">
              <div className="groot">Het overzicht</div>
              <span className="pill">Ontdek verder</span>
            </div>
          </Link>
          {stat(rechts, "0.6s")}
        </div>
      </div>

      {/* hero→verhaal-wig: op de stagebodem, ónder de fotolaag (z3 < z5) —
          met de hero dicht dekt de foto hem af, open is hij licht-op-licht
          onzichtbaar; hij veegt pas in beeld als #verhaal nadert (v3) */}
      <Wig kleur="#f6f6f4" sectieId="verhaal" binnen />

      {/* reislaag: dezelfde hero-foto, krimpt als venster tot de middenkaart */}
      <div ref={fotoRef} className="ke-foto" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/uploads/hero-character-sitting-on-top-of-clouds-692f40c3.jpg" alt="" decoding="async" />
        <div className="scrim" aria-hidden="true" />
      </div>
      {/* kaartlabel op de reislaag — verschijnt bij de landing */}
      <div ref={labelRef} className="ke-fotolabel">
        <div className="groot">Het overzicht</div>
        <Link href="/#verhaal" className="pill">
          Ontdek verder
        </Link>
      </div>
    </section>
  );
}
