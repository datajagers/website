import Link from "next/link";
import { NAV } from "@/lib/copy";

export function Navbar({ active, solid = false }: { active?: string; solid?: boolean }) {
  return (
    <header className={solid ? "nav nav--solid" : "nav"}>
      <Link href="/" aria-label="Datajagers">
        <span className="wordmark" role="img" aria-hidden="true" />
      </Link>
      <nav aria-label="Hoofdmenu">
        {NAV.map((it) => (
          <Link
            key={it.num}
            href={it.href}
            className="navlink"
            aria-current={it.label === active ? "page" : undefined}
          >
            <span>{it.label}</span>
            <span className="num" aria-hidden="true">
              {it.num}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
