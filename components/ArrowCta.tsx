import Link from "next/link";

export function ArrowCta({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="cta-line" data-cta="">
      <span className="cta-label">{label}</span>
      <svg className="cta-arrow" viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" style={{ flex: "none" }}>
        <path d="M1 11 11 1M4 1h7v7" />
      </svg>
    </Link>
  );
}
