"use client";

import Image from "next/image";
import { useRef } from "react";

import fundo from "@assets/FUNDO.png";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

import styles from "./Atmosphere.module.css";

/**
 * O céu da página inteira. A nebulosa da hero (FUNDO.png) fica fixa atrás de
 * todas as seções, apagada, e três nuvens de luz violeta derivam devagar
 * conforme a página rola — é isso que dá ao vidro dos cards algo para
 * desfocar. Por cima, uma trama de ruído para tirar o aspecto digital.
 *
 * Também mora aqui a barra de progresso fina no topo: a "carga" da página.
 */
export function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scrub = {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        };

        gsap.to(".orb-a", { xPercent: 60, yPercent: 140, scale: 1.3, ease: "none", scrollTrigger: scrub });
        gsap.to(".orb-b", { xPercent: -80, yPercent: -60, scale: 0.8, ease: "none", scrollTrigger: scrub });
        gsap.to(".orb-c", { xPercent: 40, yPercent: -120, ease: "none", scrollTrigger: scrub });
        gsap.to(`.${styles.nebula}`, { scale: 1.18, yPercent: -4, ease: "none", scrollTrigger: scrub });

        gsap.fromTo(
          `.${styles.progress}`,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { ...scrub, scrub: 0.3 } },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true">
      <div className={styles.sky}>
        <div className={styles.nebula}>
          <Image src={fundo} alt="" fill sizes="100vw" quality={80} className={styles.nebulaImage} />
        </div>
        <div className={`${styles.orb} ${styles.orbA} orb-a`} />
        <div className={`${styles.orb} ${styles.orbB} orb-b`} />
        <div className={`${styles.orb} ${styles.orbC} orb-c`} />
        <div className={styles.veil} />
        <div className={styles.grain} />
      </div>
      <div className={styles.progress} />
    </div>
  );
}
