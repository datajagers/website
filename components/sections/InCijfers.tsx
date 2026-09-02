import Link from "next/link";
import { IN_CIJFERS } from "@/lib/copy";

export function InCijfers() {
  const [links, midden, rechts] = IN_CIJFERS.kaarten;
  const stat = (k: typeof links) => (
    <div className="kaart" key={k.label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={k.foto} alt={k.alt} loading="lazy" decoding="async" />
      <div className="tint" aria-hidden="true" />
      <div className="voet">
        <div className="lbl mono">{k.label}</div>
        <div className="val">{k.waarde}</div>
      </div>
    </div>
  );
  return (
    <section className="band-light cijfers">
      <span className="eyebrow mono">
        ({IN_CIJFERS.num}) ({IN_CIJFERS.label})
      </span>
      <h2>
        {IN_CIJFERS.kop} <span className="grijs">{IN_CIJFERS.kopGrijs}</span>
      </h2>
      <div className="rij">
        {stat(links)}
        <Link className="kaart midden" href={midden.href ?? "/#verhaal"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={midden.foto} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="tint" aria-hidden="true" />
          <div className="center">
            <div className="groot">Het overzicht</div>
            <span className="pill">Ontdek verder</span>
          </div>
        </Link>
        {stat(rechts)}
      </div>
    </section>
  );
}
