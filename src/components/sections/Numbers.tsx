"use client";

import { useRef, type PointerEvent } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";

import styles from "./Numbers.module.css";

type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  area: string;
};

const STATS: readonly Stat[] = [
  { value: 42, prefix: "R$ ", suffix: " mi", label: "em mídia gerenciada nos últimos 3 anos", area: "a" },
  { value: 6.4, decimals: 1, suffix: "x", label: "ROAS médio das contas de e-commerce", area: "b" },
  { value: 180, prefix: "+", label: "marcas atendidas, do varejo local à fintech", area: "c" },
];

const BARS = [28, 36, 33, 48, 55, 52, 68, 74, 81, 92] as const;
const RETENTION = 94;

const fmt = (v: number, decimals = 0) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * EM NÚMEROS — bento de vidro.
 *
 * Os números contam de zero no primeiro encontro; o anel de "carga" é
 * desenhado com DrawSVG até a taxa de retenção; as barras de crescimento
 * sobem em cascata. Com o mouse, um holofote violeta acompanha o cursor e
 * acende a borda dos cards mais próximos (o Magic Bento do almeida-imports,
 * reescrito com custom properties e sem criar nós no DOM).
 */
export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cells = gsap.utils.toArray<HTMLElement>(`.${styles.cell}`);

        gsap.from(cells, {
          y: 90,
          autoAlpha: 0,
          rotationX: -18,
          transformPerspective: 1200,
          transformOrigin: "50% 100%",
          duration: 1.4,
          ease: "expo.out",
          stagger: { each: 0.09, from: "start" },
          scrollTrigger: { trigger: `.${styles.grid}`, start: "top 82%", once: true },
        });

        section.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const decimals = Number(el.dataset.decimals ?? 0);
          const proxy = { v: 0 };
          el.textContent = fmt(0, decimals);
          gsap.to(proxy, {
            v: target,
            duration: 2.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = fmt(proxy.v, decimals);
            },
          });
        });

        gsap.fromTo(
          `.${styles.ringValue}`,
          { drawSVG: "0%" },
          {
            drawSVG: `${RETENTION}%`,
            duration: 2.4,
            ease: "power3.inOut",
            scrollTrigger: { trigger: `.${styles.ring}`, start: "top 85%", once: true },
          },
        );

        gsap.from(`.${styles.bar}`, {
          scaleY: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: `.${styles.bars}`, start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  // holofote: só atualiza duas custom properties por card, sem re-render
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const section = root.current;
    if (!section) return;
    section.querySelectorAll<HTMLElement>(`.${styles.cell}`).forEach((cell) => {
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--mx", `${event.clientX - r.left}px`);
      cell.style.setProperty("--my", `${event.clientY - r.top}px`);
    });
  };

  return (
    <section
      ref={root}
      className={styles.numbers}
      aria-labelledby="numeros-title"
      onPointerMove={onPointerMove}
    >
      <div className={styles.head}>
        <p className="eyebrow">Em números</p>
        <SplitReveal id="numeros-title" className={`display ${styles.title}`}>
          Carga que vira <span className="accent">resultado.</span>
        </SplitReveal>
      </div>

      <div className={styles.grid}>
        {STATS.map((stat) => (
          <article key={stat.area} className={`glass ${styles.cell}`} style={{ gridArea: stat.area }}>
            <p className={styles.value}>
              {stat.prefix}
              <span data-count={stat.value} data-decimals={stat.decimals ?? 0}>
                {fmt(stat.value, stat.decimals)}
              </span>
              {stat.suffix}
            </p>
            <p className={styles.label}>{stat.label}</p>
          </article>
        ))}

        <article className={`glass ${styles.cell} ${styles.ringCell}`} style={{ gridArea: "d" }}>
          <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden="true">
            <circle className={styles.ringTrack} cx="60" cy="60" r="52" />
            <circle className={styles.ringValue} cx="60" cy="60" r="52" />
          </svg>
          <div className={styles.ringCenter}>
            <p className={styles.value}>
              <span data-count={RETENTION}>{RETENTION}</span>%
            </p>
            <p className={styles.label}>de retenção de clientes ano após ano</p>
          </div>
        </article>

        <article className={`glass ${styles.cell} ${styles.barsCell}`} style={{ gridArea: "e" }}>
          <div>
            <p className={styles.kicker}>Crescimento médio de receita</p>
            <p className={styles.value}>
              +<span data-count={218}>218</span>%
            </p>
            <p className={styles.label}>nos primeiros 12 meses de circuito ligado</p>
          </div>
          <div className={styles.bars} aria-hidden="true">
            {BARS.map((h, i) => (
              <span key={i} className={styles.bar} style={{ height: `${h}%` }} />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
