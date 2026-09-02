import { DIENSTEN } from "@/lib/copy";
import { ArrowCta } from "@/components/ArrowCta";
import { FounderCard } from "@/components/FounderCard";
import { Reveal } from "@/components/motion/Reveal";

export function Diensten() {
  return (
    <section id="diensten" className="band-dark diensten">
      <div className="brug">
        <Reveal>
          <h2>
            {DIENSTEN.brug.wit} <span className="grijs">{DIENSTEN.brug.grijs}</span>
          </h2>
        </Reveal>
      </div>
      <div className="wrap">
        <div className="sectiekop">
          <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
            <span className="ruit" aria-hidden="true" />
            <span>({DIENSTEN.num})</span>
          </span>
          <span style={{ whiteSpace: "nowrap" }}>({DIENSTEN.label})</span>
          <span className="rechts">{DIENSTEN.rechts}</span>
        </div>
        <div className="intro">
          <h2>
            {DIENSTEN.kop} <span className="grijs" style={{ color: "#8a828c" }}>{DIENSTEN.kopGrijs}</span>
          </h2>
          <p>{DIENSTEN.intro}</p>
        </div>
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
