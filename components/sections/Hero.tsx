import { HERO } from "@/lib/copy";
import { ArrowCta } from "@/components/ArrowCta";
import { Navbar } from "@/components/Navbar";

export function Hero() {
  return (
    <section className="hero" id="top">
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
    </section>
  );
}
