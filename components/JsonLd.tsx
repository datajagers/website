// JSON-LD structured data — server-rendered, zodat crawlers het altijd zien.
// sameAs (LinkedIn/Instagram) volgt zodra de echte social-URL's er zijn
// (open beslissing §7 in de handoff).

import { FAQ } from "@/lib/copy";

const ORGANISATIE = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Datajagers",
  url: "https://www.datajagers.nl",
  logo: "https://www.datajagers.nl/assets/logo_mark.svg",
  email: "info@datajagers.nl",
  description:
    "Datajagers maakt data begrijpelijk en besluitvorming scherper. Procesoptimalisatie, dashboards en AI-workflows — gebouwd mét je team.",
};

export function OrganizationLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATIE) }}
    />
  );
}

export function FaqLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
