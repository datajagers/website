import Link from "next/link";
import { FOOTER, NAV } from "@/lib/copy";
import { ArrowCta } from "@/components/ArrowCta";

export function Footer() {
  return (
    <footer id="site-footer" className="footer">
      <div className="wrap">
        <div className="grid">
          <div>
            <div className="uitnodiging">{FOOTER.uitnodiging}</div>
            <a className="mail" href={`mailto:${FOOTER.email}`}>
              {FOOTER.email}
            </a>
            <div>
              <ArrowCta href="/contact" label={FOOTER.cta} />
            </div>
          </div>
          <nav aria-label="Footer">
            {NAV.map((it) => (
              <Link key={it.num} href={it.href}>
                <span>{it.label}</span>
                <span className="num" aria-hidden="true">
                  {it.num}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="onderregel">
          <div className="socials">
            {FOOTER.socials.map((s) => (
              <a key={s.label} href={s.href}>
                {s.label}
              </a>
            ))}
          </div>
          <span>© 2026</span>
        </div>
        <span className="wordmark-groot" role="img" aria-label="datajagers" />
      </div>
    </footer>
  );
}
