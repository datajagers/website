import { HeroFlip } from "@/components/sections/HeroFlip";
import { WieWeZijn } from "@/components/sections/WieWeZijn";
import { Herkenbaar } from "@/components/sections/Herkenbaar";
import { Diensten } from "@/components/sections/Diensten";
import { Proces } from "@/components/sections/Proces";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/Footer";
import { PageHold } from "@/components/motion/PageHold";

export default function Home() {
  return (
    <>
      <PageHold>
        <main id="hoofdinhoud">
          <HeroFlip />
          <WieWeZijn />
          <Herkenbaar />
          <Diensten />
          <Proces />
          <Testimonials />
          <Faq />
          {/* uitloop: laatste vraag volledig in beeld vóór de footer-reveal */}
          <div aria-hidden="true" style={{ height: "clamp(200px, 38vh, 420px)", background: "var(--dj-surface, #f6f6f4)" }} />
        </main>
      </PageHold>
      <Footer />
    </>
  );
}
