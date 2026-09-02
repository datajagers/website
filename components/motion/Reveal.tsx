"use client";

// Kalme scroll-reveal: element start 26px lager op 0-opacity en zet zich
// eenmalig neer zodra het in beeld komt (v3-taal: .7s, dj-ease). De
// verborgen beginstand geldt alleen onder html.js, zodat no-JS-bezoekers
// en crawlers alles gewoon zien; reduced motion toont alles direct.

import { useEffect, useRef } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            el.classList.add("rv-in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `rv ${className}` : "rv"}
      style={delay ? { transitionDelay: `${(delay * 0.12).toFixed(2)}s` } : undefined}
    >
      {children}
    </div>
  );
}
