"use client";

// Hero — P5-mechaniek (besluit Wouter): het venster op de middenkaart-plek
// staat vast; bij één scroll-gebaar bovenaan dijt de witte RAND uit van 4px
// tot voorbij de schermranden (box-shadow-spread, GSAP-timeline) terwijl de
// foto uitzoomt van 1.75 naar 1.0 (de gemeten Revolut-zoom). Wat overblijft
// is de foto ín de kaart, midden op het paneel. Terug-gebaar bovenaan speelt
// de timeline omgekeerd; ná de animatie scrollt de pagina gewoon door.
// Copy/nav/paneel/label-fades lopen via CSS op [data-open]. Mobiel (<860),
// reduced motion en no-JS: hero en paneel als gewone gestapelde secties.

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO, IN_CIJFERS } from "@/lib/copy";
import { ArrowCta } from "@/components/ArrowCta";
import { Navbar } from "@/components/Navbar";
import { Wig } from "@/components/motion/Wig";

const RAND_START = 1; // px — de dunne witte lijn in ruststand (v3-kader was ook 1px)

export function HeroFlip() {
  const stageRef = useRef<HTMLElement>(null);
  const fotoRef = useRef<HTMLImageElement>(null);
  const vensterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const stage = stageRef.current, foto = fotoRef.current;
    const venster = vensterRef.current, label = labelRef.current, slot = slotRef.current;
    if (!stage || !foto || !venster || !label || !slot) return;
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // per gebeurtenis herbevestigen, niet cachen — frozen-breakpoint-les uit v3
    const stageMode = () => !reduce && window.matchMedia("(min-width: 860px)").matches;
    gsap.registerPlugin(ScrollTrigger);
    const s = { open: false, anim: false, openedAt: 0, ty: null as number | null };
    let tl: gsap.core.Timeline | null = null;
    let exit: gsap.core.Timeline | null = null;

    // parallax-exit: terwijl de (geopende) stage uit beeld scrollt, bewegen
    // nav, paneelinhoud en foto op eigen snelheid weg — gescrubd, omkeerbaar
    const exitDoelen = () => ({
      nav: stage.querySelector<HTMLElement>(".ke-heroscherm .nav"),
      kop: stage.querySelector<HTMLElement>(".ke-panel > div:first-child"),
      rij: stage.querySelector<HTMLElement>(".ke-panel .rij"),
      laag: stage.querySelector<HTMLElement>(".ke-foto"),
    });
    const maakExit = () => {
      exit?.scrollTrigger?.kill();
      exit?.kill();
      const d = exitDoelen();
      exit = gsap.timeline({
        scrollTrigger: { trigger: stage, start: "top top", end: "bottom top", scrub: 0.4 },
      });
      if (d.nav) exit.to(d.nav, { y: -50, autoAlpha: 0, duration: 0.5, ease: "none" }, 0);
      if (d.kop) exit.to(d.kop, { y: () => window.innerHeight * 0.12, duration: 1, ease: "none" }, 0);
      if (d.rij) exit.to(d.rij, { y: () => window.innerHeight * 0.06, duration: 1, ease: "none" }, 0);
      if (d.laag) exit.to(d.laag, { y: () => window.innerHeight * 0.1, duration: 1, ease: "none" }, 0);
    };
    const ruimExitOp = () => {
      exit?.scrollTrigger?.kill();
      exit?.kill();
      exit = null;
      const d = exitDoelen();
      gsap.set([d.nav, d.kop, d.rij, d.laag].filter(Boolean) as HTMLElement[], { clearProps: "all" });
    };

    const plaats = () => {
      const r = slot.getBoundingClientRect();
      [venster, label].forEach((el) => {
        el.style.left = `${r.left.toFixed(1)}px`;
        el.style.top = `${r.top.toFixed(1)}px`;
        el.style.width = `${r.width.toFixed(1)}px`;
        el.style.height = `${r.height.toFixed(1)}px`;
      });
      return r;
    };
    const maxSpread = (r: DOMRect) =>
      Math.max((window.innerWidth - r.width) / 2, (window.innerHeight - r.height) / 2) + 60;

    const zetRand = (px: number) => {
      venster.style.boxShadow = `0 0 0 ${px.toFixed(1)}px #f6f6f4`;
    };

    const speel = (open: boolean) => {
      if (s.anim || s.open === open) return;
      s.anim = true;
      stage.setAttribute("data-open", open ? "true" : "false");
      if (open) {
        const r = plaats();
        const proxy = { rand: RAND_START };
        tl?.kill();
        tl = gsap.timeline({
          defaults: { ease: "power3.inOut", duration: 1.15 },
          onComplete: () => { s.open = true; s.anim = false; s.openedAt = Date.now(); },
          onReverseComplete: () => { s.open = false; s.anim = false; },
        });
        tl.to(proxy, { rand: maxSpread(r), onUpdate: () => zetRand(proxy.rand) }, 0);
        // de foto leeft mee met het gebaar: subtiele zoom (1 -> 1.12) verankerd
        // op het venstermidden; ruststand blijft de normale stand
        const ox = (((r.left + r.width / 2) / window.innerWidth) * 100).toFixed(1);
        const oy = (((r.top + r.height / 2) / window.innerHeight) * 100).toFixed(1);
        tl.fromTo(foto, { scale: 1, transformOrigin: `${ox}% ${oy}%` }, { scale: 1.12 }, 0);
      } else if (tl) {
        tl.reverse();
      } else {
        s.anim = false;
      }
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

    const onResize = () => {
      if (!stageMode()) {
        stage.setAttribute("data-open", "false");
        tl?.kill(); tl = null;
        gsap.set(foto, { clearProps: "transform" });
        ruimExitOp();
        zetRand(RAND_START);
        s.open = false; s.anim = false;
        return;
      }
      const r = plaats();
      // ook de gesloten stand herstellen — na een resize de 860-grens over
      // was het 1px-kader anders onzichtbaar tot het eerste gebaar
      if (!s.anim) zetRand(s.open ? maxSpread(r) : RAND_START);
      if (!exit) maakExit();
      ScrollTrigger.refresh();
    };

    // ruststand: venster op de slotplek met het dunne lijntje + parallax-exit
    if (stageMode()) { plaats(); zetRand(RAND_START); maakExit(); }

    // warm-up onder de Vizier: paneelfoto's alvast decoderen tegen
    // first-run jank (het paneel zelf blijft gerasterd via opacity, niet
    // display/visibility)
    if (document.getElementById("dj-preloader")) {
      stage.querySelectorAll("img").forEach((im) => {
        try { im.decode?.().catch(() => {}); } catch { /* best-effort */ }
      });
    }

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
      tl?.kill();
      exit?.scrollTrigger?.kill();
      exit?.kill();
    };
  }, []);

  const [links, midden, rechts] = IN_CIJFERS.kaarten;
  const stat = (k: typeof links) => (
    <div className="kaart" key={k.label}>
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

      {/* In cijfers — paneel dat op het uitgedijde wit verschijnt; gestapeld een gewone sectie */}
      <div className="band-light cijfers ke-panel">
        <div>
          <span className="eyebrow mono" style={{ display: "block", marginBottom: "clamp(16px, 2.4vh, 26px)" }}>
            ({IN_CIJFERS.num}) ({IN_CIJFERS.label})
          </span>
          <h2>
            {IN_CIJFERS.kop} <span className="grijs">{IN_CIJFERS.kopGrijs}</span>
          </h2>
        </div>
        <div className="rij">
          {stat(links)}
          <Link ref={slotRef} className="kaart midden" href={midden.href ?? "/#verhaal"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={midden.foto} alt="" aria-hidden="true" decoding="async" />
            <div className="tint" aria-hidden="true" />
            <div className="center">
              <div className="groot">Het overzicht</div>
              <span className="pill">Ontdek verder</span>
            </div>
          </Link>
          {stat(rechts)}
        </div>
      </div>

      {/* hero→verhaal-wig: onder de fotolaag, zoals v3 */}
      <Wig kleur="#f6f6f4" sectieId="verhaal" binnen />

      {/* reislaag: de zichtbare herofoto (start ingezoomd op 1.75) */}
      <div className="ke-foto" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={fotoRef} src="/uploads/hero-character-sitting-on-top-of-clouds-692f40c3.jpg" alt="" decoding="async" />
        <div className="scrim" aria-hidden="true" />
      </div>
      {/* het vaste venster: dun wit lijntje in rust, de rand dijt uit bij het gebaar */}
      <div ref={vensterRef} className="ke-venster" aria-hidden="true" />
      {/* kaartlabel op het venster — verschijnt bij de landing */}
      <div ref={labelRef} className="ke-fotolabel">
        <div className="groot">Het overzicht</div>
        <Link href="/#verhaal" className="pill">
          Ontdek verder
        </Link>
      </div>
    </section>
  );
}
