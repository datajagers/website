import { Hero } from "@/components/sections/Hero";
import { InCijfers } from "@/components/sections/InCijfers";
import { WieWeZijn } from "@/components/sections/WieWeZijn";
import { Herkenbaar } from "@/components/sections/Herkenbaar";
import { Diensten } from "@/components/sections/Diensten";
import { Proces } from "@/components/sections/Proces";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main id="hoofdinhoud">
        <Hero />
        <InCijfers />
        <WieWeZijn />
        <Herkenbaar />
        <Diensten />
        <Proces />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
