"use client";

// Sheet-reveal footer — port van v3: een 220vh-track met sticky venster; de
// footer-sheet schuift van translateY(101%) naar 0 terwijl de page-hold de
// content ervóór stilhoudt. Reduced motion: sheet staat gewoon.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FOOTER, NAV } from "@/lib/copy";
import { ArrowCta } from "@/components/ArrowCta";

export function Footer() {
  const trackRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const sheet = sheetRef.current;
    if (!track || !sheet) return;
    const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    let raf: number | null = null;

    const apply = () => {
      raf = null;
      if (reduce) { sheet.style.transform = "none"; return; }
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
      const e = 1 - Math.pow(1 - p, 3);
      sheet.style.transform = `translateY(${((1 - e) * 101).toFixed(2)}%)`;
    };
    const kick = () => { if (raf === null) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={trackRef} className="foot-track">
      <div className="foot-sticky">
        <footer ref={sheetRef} id="site-footer" className="footer">
          <div className="wrap foot-inner">
            <div className="grid">
              <div>
                <div className="uitnodiging">{FOOTER.uitnodiging}</div>
                <a className="mail" href={`mailto:${FOOTER.email}`}>
                  {FOOTER.email}
                </a>
                <div>
                  <ArrowCta href="/contact" label={FOOTER.cta} />
                </div>
              </div>
              <nav aria-label="Footer">
                {NAV.map((it) => (
                  <Link key={it.num} href={it.href}>
                    <span>{it.label}</span>
                    <span className="num" aria-hidden="true">
                      {it.num}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="onderregel">
              <div className="socials">
                {FOOTER.socials.map((s) => (
                  <a key={s.label} href={s.href}>
                    {s.label}
                  </a>
                ))}
              </div>
              <span>© 2026</span>
            </div>
            <span className="wordmark-groot" role="img" aria-label="datajagers" />
          </div>
        </footer>
      </div>
    </section>
  );
}
