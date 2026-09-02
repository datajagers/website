import { DIENSTEN } from "@/lib/copy";
import { ArrowCta } from "@/components/ArrowCta";
import { FounderCard } from "@/components/FounderCard";
import { Reveal } from "@/components/motion/Reveal";

export function Diensten() {
  return (
    <section id="diensten" className="band-dark diensten">
      {/* sectiekop + intro leven in de estafette-scène (zoals v3) */}
      <div className="wrap">
        <div className="rijen">
          {DIENSTEN.rows.map((d) => (
            <Reveal key={d.num}>
            <div className="rij">
              <div style={{ minWidth: 0 }}>
                <span className="nr mono">{d.num}</span>
                <h3>{d.titel}</h3>
                <p className="kort">{d.kort}</p>
              </div>
              <ul>
                {d.deliverables.map((dl) => (
                  <li key={dl}>{dl}</li>
                ))}
              </ul>
            </div>
            </Reveal>
          ))}
        </div>
        <div className="onder">
          <ArrowCta href="/contact" label={DIENSTEN.cta} />
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(18px, 3vw, 40px)", flexWrap: "wrap" }}>
            <span className="meetlat mono">{DIENSTEN.meetlat}</span>
            <FounderCard />
          </div>
        </div>
      </div>
    </section>
  );
}
