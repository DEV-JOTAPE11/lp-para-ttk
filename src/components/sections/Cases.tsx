"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

import cerrado from "@assets/images/case-cerrado.jpg";
import lume from "@assets/images/case-lume.jpg";
import nebula from "@assets/images/case-nebula.jpg";
import orbita from "@assets/images/case-orbita.jpg";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";

import styles from "./Cases.module.css";

type Case = {
  client: string;
  sector: string;
  headline: string;
  copy: string;
  metrics: readonly { value: string; label: string }[];
  image: StaticImageData;
};

/* Clientes e números de demonstração — troque pelos cases reais. */
const CASES: readonly Case[] = [
  {
    client: "Nébula Cosméticos",
    sector: "E-commerce · Mídia & Criativo",
    headline: "+312% de receita em 6 meses",
    copy: "Reposicionamos a marca para o público 25–34, reconstruímos o funil de mídia e colocamos criativos em sprint semanal.",
    metrics: [
      { value: "7,8x", label: "ROAS" },
      { value: "−41%", label: "CAC" },
    ],
    image: nebula,
  },
  {
    client: "Cerrado Motors",
    sector: "Concessionária · Performance",
    headline: "1.240 leads qualificados por mês",
    copy: "Campanhas por modelo e por região, landing pages dedicadas e integração direta com o CRM das lojas.",
    metrics: [
      { value: "−58%", label: "Custo por lead" },
      { value: "2,3x", label: "Vendas" },
    ],
    image: cerrado,
  },
  {
    client: "Órbita Fintech",
    sector: "Lançamento · Branding & Growth",
    headline: "68 mil contas abertas no lançamento",
    copy: "Da plataforma de marca à campanha de pré-cadastro: um lançamento pensado como produto, com teste A/B em cada etapa.",
    metrics: [
      { value: "68 mil", label: "Contas" },
      { value: "R$ 3,10", label: "CPA médio" },
    ],
    image: orbita,
  },
  {
    client: "Lume Arquitetura",
    sector: "Rebranding · Conteúdo",
    headline: "+410% de alcance orgânico",
    copy: "Nova identidade, linha editorial em vídeo e um feed que passou a vender projeto antes da primeira reunião.",
    metrics: [
      { value: "+410%", label: "Alcance" },
      { value: "3x", label: "Orçamentos" },
    ],
    image: lume,
  },
];

/**
 * CASES — pilha de cartões.
 *
 * Cada case é `sticky` e para um pouco abaixo do anterior; quando o próximo
 * sobe, o de baixo recua: encolhe, inclina para trás e escurece, como cartas
 * empurradas para o fundo da mesa. O recuo é `scrub`, preso ao avanço do
 * card seguinte. Dentro de cada card a imagem corre em parallax.
 */
export function Cases() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${styles.case}`);

        cards.forEach((card, i) => {
          const panel = card.querySelector<HTMLElement>(`.${styles.panel}`)!;
          const image = card.querySelector<HTMLElement>(`.${styles.media} img`);
          const next = cards[i + 1];

          if (image) {
            gsap.fromTo(
              image,
              { yPercent: -8, scale: 1.18 },
              {
                yPercent: 8,
                scale: 1.05,
                ease: "none",
                scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }

          gsap.from(card.querySelectorAll(`.${styles.reveal}`), {
            y: 40,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: card, start: "top 70%", once: true },
          });

          if (!next) return;
          gsap.to(panel, {
            scale: 0.88,
            rotationX: 8,
            yPercent: -4,
            transformPerspective: 1600,
            transformOrigin: "50% 0%",
            "--dim": 0.72,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top+=10%",
              scrub: true,
            },
          });
        });
      });

      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.utils.toArray<HTMLElement>(`.${styles.case}`).forEach((card) => {
          gsap.from(card, {
            y: 70,
            autoAlpha: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="cases" className={styles.cases} aria-labelledby="cases-title">
      <div className={styles.head}>
        <p className="eyebrow">Cases</p>
        <SplitReveal id="cases-title" className={`display ${styles.title}`}>
          Marcas que ligaram <span className="accent">na tomada certa.</span>
        </SplitReveal>
      </div>

      <div className={styles.stack}>
        {CASES.map((item, i) => (
          <article
            key={item.client}
            className={styles.case}
            style={{ "--i": i } as React.CSSProperties}
            aria-label={item.client}
          >
            <div className={`glass ${styles.panel}`}>
              <div className={styles.media}>
                <Image src={item.image} alt="" fill quality={80} sizes="(max-width: 767px) 100vw, 50vw" />
                <span className={styles.index}>0{i + 1}</span>
              </div>

              <div className={styles.info}>
                <p className={`${styles.sector} ${styles.reveal}`}>{item.sector}</p>
                <h3 className={`${styles.client} ${styles.reveal}`}>{item.client}</h3>
                <p className={`display ${styles.headline} ${styles.reveal}`}>{item.headline}</p>
                <p className={`${styles.copy} ${styles.reveal}`}>{item.copy}</p>
                <dl className={`${styles.metrics} ${styles.reveal}`}>
                  {item.metrics.map((m) => (
                    <div key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
