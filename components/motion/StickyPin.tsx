"use client";

// Sectiepin — port van _fitPageHold (v3): sticky top = -(hoogte - viewport),
// zodat de sectie pint zodra zijn onderkant de viewportbodem raakt en
// compositor-stil staat terwijl de volgende sectie (met wig) eroverheen
// schuift. Voor secties korter dan de viewport wordt dat top 0.

import { useEffect, useRef } from "react";

export function StickyPin({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const val = `${(-Math.max(0, el.offsetHeight - window.innerHeight)).toFixed(0)}px`;
      if (el.style.position !== "sticky") el.style.position = "sticky";
      if (el.style.top !== val) el.style.top = val;
    };
    fit();
    window.addEventListener("resize", fit);
    let ro: ResizeObserver | undefined;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(fit);
      ro.observe(el);
    }
    return () => {
      window.removeEventListener("resize", fit);
      ro?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
