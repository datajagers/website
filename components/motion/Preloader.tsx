"use client";

// Vizier-preloader — port van curtains.js (v3): coal cover → kruislijnen
// zoeken/vergrendelen → ruit landt → woordmerk → iris-exit. MIN 2150ms,
// CAP 4500ms; dev-vlag ?plhold houdt hem vast. De overlay staat in de
// server-HTML, dus het doek dekt ook vóór hydratatie (parity met de
// synchrone pre-paint van v3).

import { useEffect, useRef, useState } from "react";

const PL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MIN = 2150;
const CAP = 4500;

export function Preloader() {
  const [weg, setWeg] = useState(false);
  const plRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const lvRef = useRef<HTMLSpanElement>(null);
  const lhRef = useRef<HTMLSpanElement>(null);
  const diaRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // reveal-beginstanden (html.js .rv) gelden pas vanaf hier — post-hydratatie,
    // onder het doek, dus geen mismatch en geen flits
    document.documentElement.classList.add("js");
    const pl = plRef.current;
    const cover = coverRef.current;
    const lv = lvRef.current, lh = lhRef.current, dia = diaRef.current, word = wordRef.current;
    if (!pl || !cover || !lv || !lh || !dia || !word) return;

    const start = Date.now();
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const canAnim = !reduce && "animate" in document.createElement("div");
    let revealed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (!canAnim) {
      lv.style.display = "none";
      lh.style.display = "none";
      dia.style.display = "none";
      word.style.top = "50%";
      word.style.transform = "translateX(-50%) translateY(-50%)";
      word.style.opacity = "1";
    } else {
      // zoeken: de lijnen tekenen zich naast/onder het doel...
      lv.animate(
        [{ transform: "translateX(-6vw) scaleY(0)" }, { transform: "translateX(-6vw) scaleY(1)" }],
        { duration: 420, delay: 150, easing: PL_EASE, fill: "forwards" });
      lh.animate(
        [{ transform: "translateY(5vh) scaleX(0)" }, { transform: "translateY(5vh) scaleX(1)" }],
        { duration: 420, delay: 320, easing: PL_EASE, fill: "forwards" });
      // ...en vergrendelen op het middelpunt
      lv.animate(
        [{ transform: "translateX(-6vw) scaleY(1)" }, { transform: "translateX(0) scaleY(1)" }],
        { duration: 520, delay: 640, easing: PL_EASE, fill: "forwards" });
      lh.animate(
        [{ transform: "translateY(5vh) scaleX(1)" }, { transform: "translateY(0) scaleX(1)" }],
        { duration: 520, delay: 800, easing: PL_EASE, fill: "forwards" });
      // de ruit landt op het kruis
      dia.animate(
        [{ transform: "translate(-50%,-50%) rotate(45deg) scale(0)" },
         { transform: "translate(-50%,-50%) rotate(45deg) scale(1)" }],
        { duration: 380, delay: 1260, easing: PL_EASE, fill: "forwards" });
      // woordmerk zet zich eronder
      word.animate(
        [{ opacity: 0, transform: "translateX(-50%) translateY(10px)" },
         { opacity: 1, transform: "translateX(-50%) translateY(0)" }],
        { duration: 450, delay: 1480, easing: PL_EASE, fill: "forwards" });
    }

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      pl.style.pointerEvents = "none";
      if (!canAnim) {
        pl.style.transition = "opacity .45s ease";
        pl.style.opacity = "0";
        timers.push(setTimeout(() => setWeg(true), 480));
        return;
      }
      // iris: het doek opent vanuit het vergrendelpunt; lijnen, ruit en
      // woordmerk zitten ín de cover en rijden mee de clip uit.
      const a = cover.animate(
        [{ clipPath: "circle(150% at 50% 50%)" }, { clipPath: "circle(0% at 50% 50%)" }],
        { duration: 760, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" });
      const done = () => setWeg(true);
      if (a.finished?.then) a.finished.then(done).catch(done);
      timers.push(setTimeout(done, 1200)); // vangnet
    };

    if (!/[?&]plhold/.test(location.search)) {
      const fire = () => timers.push(setTimeout(reveal, Math.max(0, MIN - (Date.now() - start))));
      const afterLoad = () => {
        const fonts = document.fonts?.ready ?? Promise.resolve();
        fonts.then(() => timers.push(setTimeout(fire, 350)));
      };
      if (document.readyState === "complete") afterLoad();
      else window.addEventListener("load", afterLoad, { once: true });
      timers.push(setTimeout(reveal, CAP)); // hard safety net
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  if (weg) return null;
  return (
    <div
      ref={plRef}
      id="dj-preloader"
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 3000, overflow: "hidden" }}
    >
      <div
        ref={coverRef}
        style={{ position: "absolute", inset: 0, background: "#1d1d1d", willChange: "clip-path" }}
      >
        <span ref={lvRef} style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.5)", transform: "translateX(-6vw) scaleY(0)", transformOrigin: "top", willChange: "transform" }} />
        <span ref={lhRef} style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.5)", transform: "translateY(5vh) scaleX(0)", transformOrigin: "left", willChange: "transform" }} />
        <span ref={diaRef} style={{ position: "absolute", left: "50%", top: "50%", width: 11, height: 11, background: "#93c3fd", transform: "translate(-50%,-50%) rotate(45deg) scale(0)", willChange: "transform" }} />
        <span
          ref={wordRef}
          style={{
            position: "absolute", left: "50%", top: "60%", width: "min(380px, 52vw)",
            aspectRatio: "1157 / 127", background: "#ffffff",
            transform: "translateX(-50%) translateY(10px)", opacity: 0,
            willChange: "transform, opacity",
            WebkitMask: "url('/assets/logo_wordmark.svg') center/contain no-repeat",
            mask: "url('/assets/logo_wordmark.svg') center/contain no-repeat",
          }}
        />
      </div>
    </div>
  );
}
