"use client";

import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * Ponto único de registro do GSAP (mesmo padrão do almeida-imports-site).
 * Desde a 3.13 todos os plugins são livres: SplitText faz as máscaras de
 * linha, DrawSVG desenha a "corrente" que atravessa os serviços.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
}

/** Curvas da hero traduzidas para o GSAP (ver hero/motion.ts). */
export const EASE_OUT = "expo.out";
export const EASE_SOFT = "power3.out";

/** Condição comum a toda animação de rolagem: quem pede menos movimento
 *  recebe o CSS no estado final, sem nenhum ScrollTrigger. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
