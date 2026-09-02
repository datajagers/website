import { FAQ } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";

export function Faq({ ctaHref = "/contact" }: { ctaHref?: string }) {
  return (
    <section id="faq" className="band-light faq">
      <div className="inner">
        <Sectiekop num={FAQ.num} label={FAQ.label} />
        <div className="grid">
          <div>
            <a className="mediakaart" href={ctaHref}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/floating_cocktail.jpg" alt="Man drijft ontspannen op het water met een cocktail" loading="lazy" decoding="async" />
              <span className="regel">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontWeight: 500 }}>
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true" style={{ flex: "none" }}>
                    <path d="M0 0L10 6L0 12Z" />
                  </svg>
                  {FAQ.sidebar.cta}
                </span>
                <span className="duur">{FAQ.sidebar.duur}</span>
              </span>
            </a>
            <p className="zijtekst">{FAQ.sidebar.tekst}</p>
          </div>
          <div>
            {FAQ.items.map((item, i) => (
              <details key={item.q}>
                <summary>
                  <span className="nr" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span>{item.q}</span>
                  <span className="plus" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
                      <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="antwoord">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
