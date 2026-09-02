import { WIE_WE_ZIJN } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";
import { ArrowCta } from "@/components/ArrowCta";
import { Reveal } from "@/components/motion/Reveal";
import { Wig } from "@/components/motion/Wig";

export function WieWeZijn() {
  const [a, b, c] = WIE_WE_ZIJN.statements;
  const blok = (s: typeof a, children?: React.ReactNode) => (
    <div className="blok" key={s.letter}>
      <Reveal>
        <span className="letter mono">{s.letter} /</span>
        <h3>
          {s.tekst} {s.grijs ? <span className="grijs">{s.grijs}</span> : null}
        </h3>
      </Reveal>
      {s.chips.length > 0 ? (
        <Reveal delay={1}>
          <div className="chips">
            {s.chips.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      ) : null}
      {children}
    </div>
  );

  return (
    <section id="verhaal" className="band-light wwz">
      <Wig kleur="#f6f6f4" />
      <div className="wrap">
        <Sectiekop num={WIE_WE_ZIJN.num} label={WIE_WE_ZIJN.label} rechts="© 2026" />
      </div>
      <div className="quotevlak">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="portret" src="/assets/wouter-black-white.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <blockquote>
          <span aria-hidden="true" style={{ color: "rgba(29,29,29,0.9)" }}>
            “
          </span>
          {WIE_WE_ZIJN.quote}
        </blockquote>
      </div>
      <div className="wrap">
        <div className="grid">
          <div className="rail">
            <h2>Wie we zijn</h2>
            <p>{WIE_WE_ZIJN.rail}</p>
            <ArrowCta href="/contact" label={WIE_WE_ZIJN.cta} />
          </div>
          <div>
            {blok(a)}
            {blok(b)}
            {blok(
              c,
              <>
                <div className="duo">
                  <div className="kaart">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/uploads/character-windows-xp-9146bdbb.jpg" alt="Werkplek met een computer uit 2005" loading="lazy" decoding="async" style={{ filter: "grayscale(0.4)" }} />
                    <div className="voet">
                      <div className="lbl mono">DE MAANDAGOCHTEND</div>
                      <div className="val">Anno 2005</div>
                    </div>
                  </div>
                  <div className="kaart">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/hero-shoes-on-desk-tall.jpg" alt="Man leunt ontspannen achterover met de voeten op het bureau, hoog boven de bergen" loading="lazy" decoding="async" style={{ objectPosition: "87% 100%" }} />
                    <div className="voet">
                      <div className="lbl mono">DE RUST</div>
                      <div className="val">De maandagochtend, nu</div>
                    </div>
                  </div>
                </div>
                <div className="strip">
                  {WIE_WE_ZIJN.strip.map((s) => (
                    <div className="item" key={s.num}>
                      <span className={s.accent ? "num mono accent" : "num mono"}>{s.num}</span>
                      <span className="txt">{s.tekst}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
