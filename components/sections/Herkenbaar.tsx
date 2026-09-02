import { HERKENBAAR } from "@/lib/copy";
import { Sectiekop } from "@/components/Sectiekop";
import { Reveal } from "@/components/motion/Reveal";
import { Wig } from "@/components/motion/Wig";

export function Herkenbaar() {
  return (
    <section id="herkenbaar" className="band-dark herkenbaar">
      <Wig boog kleur="#1D1D1D" />
      <div className="wrap">
        <Sectiekop num={HERKENBAAR.num} label={HERKENBAAR.label} rechts={HERKENBAAR.rechts} />
      </div>
      <Reveal>
        <div className="kophold">
          <span className="badge mono">
            <span className="dot" aria-hidden="true" />
            Herkenbaar?
          </span>
          <h2>{HERKENBAAR.kop}</h2>
          <p className="sub">{HERKENBAAR.sub}</p>
        </div>
      </Reveal>
      <div className="muur">
        {HERKENBAAR.posts.map((p, i) => (
          <Reveal key={p.handle} delay={i % 2}>
          <article className="post">
            <div className="kop">
              <span className="avatar" aria-hidden="true">
                {p.name.charAt(0)}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="naam">{p.name}</p>
                <p className="meta">
                  {p.handle} · {p.role}
                </p>
              </div>
              <span className="tijd">{p.time}</span>
            </div>
            <p className="tekst">
              {p.quote} <span className="tag">{p.hashtag}</span>
            </p>
            <div className="voet">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-.98L3 21l1.98-5.5a8.5 8.5 0 1 1 16.02-4z" />
                </svg>
                {p.comments}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--dj-accent-light)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {p.likes}
              </span>
              <span className="num mono">0{i + 1}/06</span>
            </div>
          </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
