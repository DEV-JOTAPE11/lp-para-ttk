"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Rolagem suave (Lenis), no mesmo arranjo do almeida-imports-site e da LP da
 * JTP: `duration: 1.2` e o relógio é o ticker do GSAP — um ticker só, então
 * Lenis e ScrollTrigger leem a posição na mesma ordem a cada quadro e os
 * `scrub` nunca tremem. `lagSmoothing(0)` evita saltos após quadros perdidos.
 *
 * Sob `prefers-reduced-motion` nada monta: fica a rolagem nativa.
 */

let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("@/lib/gsap"),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({ duration: 1.2, anchors: true });
      instance = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        instance = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
