import { Atmosphere } from "@/components/effects/Atmosphere";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { Header } from "@/components/header/Header";
import { Hero } from "@/components/hero/Hero";
import { HeroStage } from "@/components/hero/HeroStage";
import { Cases } from "@/components/sections/Cases";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Manifesto } from "@/components/sections/Manifesto";
import { Numbers } from "@/components/sections/Numbers";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { VelocityMarquee } from "@/components/sections/VelocityMarquee";

/* A ordem dos componentes é a ordem dos ScrollTriggers: as seções com pin
   precisam ser criadas de cima para baixo para que cada uma calcule seu
   início já contando o espaço dos pins anteriores. */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Atmosphere />
      <Header />
      <main>
        <HeroStage>
          <Hero />
        </HeroStage>
        <Manifesto />
        <VelocityMarquee />
        <Services />
        <Numbers />
        <Cases />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
