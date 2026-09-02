"use client";

// Gordijn-navigatie — port van curtains.js (v3). Ankerlinks gaan door de
// 7-slats cover naar hun sectie (landingsregel: sectietop flush op de
// viewporttop, settle-iteratie tegen sticky verschuivingen). Interne
// paginalinks dekken en navigeren client-side; na de routewissel lift het
// gordijn (de verkorte reveal — het volledige Vizier speelt op echte loads).
// Native blijven: skip-link, mailto, extern, target=_blank, downloads,
// modifier-kliks. bfcache-terug opent het gordijn weer.

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const N = 7;
const STAGGER = 40;
const COVER = 320;
const REVEAL = 360;
const HOLD = 110;

export function Curtains() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const st = useRef({ busy: false, covered: false, pendingHash: "" });

  const panels = () =>
    Array.from(overlayRef.current?.children ?? []) as HTMLDivElement[];

  const run = (from: number, to: number, dur: number) =>
    Promise.all(
      panels().map(
        (p, i) =>
          p.animate(
            [{ transform: `scaleY(${from})` }, { transform: `scaleY(${to})` }],
            { duration: dur, delay: i * STAGGER, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" }
          ).finished
      )
    );

  // Landingsregel: sectietop op de viewporttop; sticky pins verschuiven de
  // meting, dus itereren tot hij stilstaat (<2px).
  const settleScroll = (target: () => number) => {
    for (let i = 0; i < 4; i++) {
      const y = target();
      window.scrollTo(0, y);
      if (Math.abs(target() - y) < 2) break;
    }
  };

  const sectionTop = (id: string) => () => {
    const sec = document.getElementById(id);
    if (!sec) return window.scrollY || 0;
    return Math.max(0, sec.getBoundingClientRect().top + (window.scrollY || 0));
  };

  useEffect(() => {
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const canAnim = !reduce && "animate" in document.createElement("div");
    const s = st.current;

    const toEl = (id: string) => {
      if (!document.getElementById(id)) return;
      if (!canAnim) { settleScroll(sectionTop(id)); return; }
      if (s.busy) return;
      s.busy = true;
      const ov = overlayRef.current!;
      ov.style.pointerEvents = "auto";
      run(0, 1, COVER)
        .then(() => {
          settleScroll(sectionTop(id));
          return new Promise((r) => setTimeout(r, HOLD));
        })
        .then(() => run(1, 0, REVEAL))
        .then(() => {
          ov.style.pointerEvents = "none";
          s.busy = false;
        });
    };

    const coverAndGo = (url: string, hash: string) => {
      if (!canAnim) { router.push(url); return; }
      if (s.busy) return;
      s.busy = true;
      const ov = overlayRef.current!;
      ov.style.pointerEvents = "auto";
      run(0, 1, COVER).then(() => {
        s.covered = true;
        s.pendingHash = hash;
        router.push(url);
      });
    };

    // Capture-fase: wij moeten vóór Next's eigen <Link>-handler zitten, anders
    // doet Next de (settle-loze) hash-scroll en blijft het gordijn dicht.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      if (a.classList.contains("dj-skip")) return; // toegankelijkheid: direct springen
      const href = a.getAttribute("href") || "";
      const neem = () => { e.preventDefault(); e.stopPropagation(); };
      if (href.startsWith("#")) {
        if (href.length < 2 || !document.getElementById(href.slice(1))) return;
        neem();
        toEl(href.slice(1));
        return;
      }
      if (!href.startsWith("/")) return; // extern/mailto blijft native
      const [padDeel, hash = ""] = href.split("#");
      const pad = padDeel || "/";
      if (pad === pathname) {
        if (hash && document.getElementById(hash)) {
          neem();
          toEl(hash);
        } else if (!hash) {
          neem();
          toEl("top");
        }
        return;
      }
      neem();
      coverAndGo(pad, hash);
    };

    const onPageshow = (e: PageTransitionEvent) => {
      if (e.persisted && overlayRef.current) {
        panels().forEach((p) => { p.style.transform = "scaleY(0)"; });
        overlayRef.current.style.pointerEvents = "none";
        s.busy = false;
        s.covered = false;
      }
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", onPageshow);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageshow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Routewissel klaar terwijl het gordijn dicht is: land (eventueel op het
  // anker), geef de nieuwe pagina één frame, en lift dan de slats.
  useEffect(() => {
    const s = st.current;
    if (!s.covered) return;
    const hash = s.pendingHash;
    s.pendingHash = "";
    const timer = setTimeout(() => {
      if (hash && document.getElementById(hash)) settleScroll(sectionTop(hash));
      else window.scrollTo(0, 0);
      run(1, 0, REVEAL).then(() => {
        const ov = overlayRef.current;
        if (ov) ov.style.pointerEvents = "none";
        s.covered = false;
        s.busy = false;
      });
    }, 180);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const w = 100 / N;
  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 2000, overflow: "hidden", pointerEvents: "none" }}
    >
      {Array.from({ length: N }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${i * w}%`, width: `${w + 0.6}%`, // lichte overlap tegen subpixel-naden
            transformOrigin: "top", transform: "scaleY(0)",
            background: "#1D1D1D", willChange: "transform", backfaceVisibility: "hidden",
          }}
        />
      ))}
    </div>
  );
}
