"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Saída da hero. A hero fica presa no lugar (pin sem espaçamento) enquanto o
 * manifesto de vidro sobe por cima dela, como uma lâmina. Durante essa
 * rolagem um único número, `--exit` (0 → 1), escorre para dentro da hero:
 * o Hero.module.css o usa para abrir o tracking do nome gigante, erguer o
 * robô e apagar a copy. Assim o GSAP nunca disputa `transform` com as molas
 * do motion que já animam as camadas por dentro.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
              scrub: true,
            },
          })
          .fromTo(el, { "--exit": 0 }, { "--exit": 1, ease: "none", duration: 1 }, 0)
          .fromTo(el, { scale: 1 }, { scale: 0.9, ease: "power1.in", duration: 1 }, 0)
          .to(el, { autoAlpha: 0, ease: "power2.in", duration: 0.35 }, 0.65);
      });
    },
    { scope: stage },
  );

  return (
    <div ref={stage} style={{ position: "relative", zIndex: 0, transformOrigin: "50% 100%" }}>
      {children}
    </div>
  );
}
