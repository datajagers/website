import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Faq } from "@/components/sections/Faq";
import { ContactForm } from "@/components/ContactForm";
import { PageHold } from "@/components/motion/PageHold";
import { CONTACT } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Contact — Datajagers",
  description:
    "Laat je vraag achter en we reageren binnen 24 uur. Of plan direct een gratis sparringsessie van 30 minuten.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHold>
      <main id="hoofdinhoud">
        <section className="band-dark contact" id="contact">
          <Navbar active="Contact" solid />
          <div className="grid">
            <div className="beeld">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/lanyard_person.jpg" alt="" loading="lazy" decoding="async" />
              <span className="merk" aria-hidden="true" />
            </div>
            <div>
              <h1>{CONTACT.titel}</h1>
              <p className="sub">{CONTACT.sub}</p>
              <ContactForm />
            </div>
          </div>
        </section>
        <Faq ctaHref="#contact" />
        <div aria-hidden="true" style={{ height: "clamp(200px, 38vh, 420px)", background: "var(--dj-surface, #f6f6f4)" }} />
      </main>
      </PageHold>
      <Footer />
    </>
  );
}
