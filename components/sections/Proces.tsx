import { PROCES } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";

const WEKEN = 11;
const pct = (v: number) => `${((v / WEKEN) * 100).toFixed(2)}%`;

export function Proces() {
  return (
    <section className="band-dark proces">
      <div className="wrap">
        <Sectiekop num={PROCES.num} label={PROCES.label} rechts={PROCES.rechts} />
        <h3>
          {PROCES.kop} <span className="grijs">{PROCES.kopGrijs}</span>
        </h3>
        <p className="intro">{PROCES.intro}</p>
        <div className="gantt" role="img" aria-label="Tijdlijn van de vier fasen, elkaar overlappend over elf weken">
          {PROCES.fasen.map((f) => (
            <div className="lane" key={f.num}>
              <div className="bar" style={{ left: pct(f.start - 1), width: pct(f.end - f.start + 1) }}>
                <span>{f.titel}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="uitleg">
          {PROCES.fasen.map((f) => (
            <div className="fase" key={f.num}>
              <span className="num mono">({f.num})</span>
              <span className="titel">{f.titel}</span>
              <p>{f.tekst}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
