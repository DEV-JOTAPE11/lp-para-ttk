"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

import styles from "./VelocityMarquee.module.css";

const ROWS = [
  ["Estratégia", "Criativo", "Mídia", "Performance", "Branding"],
  ["Conteúdo", "Tráfego", "Dados", "Social", "Growth"],
] as const;

function Spark() {
  return (
    <svg className={styles.spark} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.6 2 6 13.1h5.2L9.8 22l8.2-11.4h-5.2L13.6 2Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Duas esteiras de palavras em sentidos opostos que respondem à rolagem:
 * quanto mais rápido o dedo, mais rápido elas correm e mais inclinam
 * (skew), e o sentido acompanha a direção do scroll. A velocidade vem do
 * próprio ScrollTrigger; o laço infinito é um tween de xPercent −50 sobre
 * duas cópias idênticas, então nunca há costura visível.
 */
export function VelocityMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>(`.${styles.track}`);
        const loops = tracks.map((track, i) => {
          const loop = gsap.fromTo(
            track,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 },
          );
          // folga de 100 voltas para trás: com timeScale negativo um tween
          // repetido não passa do instante zero
          loop.totalTime(loop.duration() * 100);
          return loop;
        });

        const skew = gsap.quickTo(tracks, "skewX", { duration: 0.6, ease: "power3.out" });
        let direction = 1;

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const velocity = self.getVelocity();
            direction = self.direction;
            const boost = gsap.utils.clamp(1, 7, 1 + Math.abs(velocity) / 450);
            loops.forEach((loop) =>
              gsap.to(loop, { timeScale: boost * direction, duration: 0.25, overwrite: true }),
            );
            skew(gsap.utils.clamp(-12, 12, velocity / -220));
          },
          onToggle(self) {
            if (!self.isActive) skew(0);
          },
        });

        // quando a rolagem para, a esteira desacelera até o ritmo de cruzeiro
        const settle = () => {
          loops.forEach((loop) =>
            gsap.to(loop, { timeScale: direction, duration: 1.2, ease: "power2.out", overwrite: true }),
          );
          skew(0);
        };
        ScrollTrigger.addEventListener("scrollEnd", settle);
        return () => ScrollTrigger.removeEventListener("scrollEnd", settle);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.marquee} aria-label="Estratégia, criativo, mídia, performance, branding, conteúdo, tráfego, dados, social e growth">
      {ROWS.map((row, r) => (
        <div key={r} className={`${styles.row} ${r % 2 ? styles.outline : ""}`} aria-hidden="true">
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <div key={copy} className={styles.group}>
                {row.map((word) => (
                  <span key={word} className={styles.item}>
                    {word}
                    <Spark />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
