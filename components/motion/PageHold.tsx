"use client";

// Page-hold — port van _fitPageHold (v3): sticky top = -(inhoudshoogte -
// viewport), zodat de content pint zodra zijn onderkant de viewportbodem
// raakt en compositor-stil staat terwijl de footer-sheet eroverheen schuift.

import { useEffect, useRef } from "react";

export function PageHold({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const top = -(Math.max(0, el.offsetHeight - window.innerHeight));
      if (el.style.position !== "sticky") el.style.position = "sticky";
      const val = `${top.toFixed(0)}px`;
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
    <div ref={ref} style={{ position: "relative" }}>
      {children}
    </div>
  );
}
