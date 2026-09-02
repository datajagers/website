// Founder-kaart — 1-op-1 uit v3, bewust anoniem (besluit Wouter 2026-09-02:
// geen naam op de kaart i.v.m. relateerbaarheid aan de huidige werkgever).
// Hover: foto zoomt licht, het merkteken rolt omhoog opnieuw in beeld.

import Link from "next/link";

export function FounderCard({ className }: { className?: string }) {
  return (
    <Link href="/contact" className={className ? `founder-card ${className}` : "founder-card"}>
      <span className="fc-foto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/lanyard_person.jpg" alt="" width={560} height={560} decoding="async" />
      </span>
      <span className="fc-tekst">
        <span className="fc-kop">Ontmoet de oprichter</span>
        <span className="fc-merk">Datajagers</span>
        <span className="fc-rol">Oprichter</span>
      </span>
      <span className="fc-hoek" aria-hidden="true">
        <span className="fc-roll">
          <span className="fc-mark" />
          <span className="fc-mark" />
        </span>
      </span>
    </Link>
  );
}
