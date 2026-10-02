"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import type { PointerEvent } from "react";

import fundo from "@assets/FUNDO.png";
import robo from "@assets/ROBO.png";

import { MagneticCta } from "./MagneticCta";
import {
  CONTENT_DELAY,
  EASE,
  EASE_ARRIVAL,
  EASE_ENTRADA,
  PARALLAX_SPRING,
} from "./motion";
import styles from "./Hero.module.css";

const BRAND = "VOLTAGEM";
const LETTERS = BRAND.split("");
const CENTER = (LETTERS.length - 1) / 2;

/** Letras nascem do centro (de trás da cabeça) para as bordas, no
 *  `gsapEntrada` do code-flow: sobem saindo do desfoque. */
const letterVariants: Variants = {
  hidden: { opacity: 0, y: "32%", filter: "blur(18px)" },
  shown: (distance: number) => ({
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: {
      duration: 2.1,
      delay: 0.35 + distance * 0.09,
      ease: EASE_ENTRADA,
    },
    // sem filtro residual depois da entrada: o texto volta a ser só texto
    transitionEnd: { filter: "none" },
  }),
};

/** `FadeUp` do code-flow, disparado no carregamento (a hero já está na dobra). */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  shown: (order: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: CONTENT_DELAY + order * 0.12, ease: EASE },
    transitionEnd: { filter: "none" },
  }),
};

export function Hero() {
  const reduce = useReducedMotion();
  const initial = reduce ? false : "hidden";

  // Parallax do Fruity: o fundo quase parado, o nome deriva com o cursor e o
  // robô contra-deriva — três planos de profundidade.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(useTransform(mx, (v) => v * -10), PARALLAX_SPRING);
  const bgY = useSpring(useTransform(my, (v) => v * -6), PARALLAX_SPRING);
  const wordX = useSpring(useTransform(mx, (v) => v * 22), PARALLAX_SPRING);
  const wordY = useSpring(useTransform(my, (v) => v * 12), PARALLAX_SPRING);
  const robotX = useSpring(useTransform(mx, (v) => v * -14), PARALLAX_SPRING);
  const robotY = useSpring(useTransform(my, (v) => v * -8), PARALLAX_SPRING);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - bounds.left) / bounds.width - 0.5);
    my.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      className={styles.hero}
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* CAMADA 1 — background */}
      <motion.div
        className={styles.background}
        style={{ x: bgX, y: bgY }}
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease: EASE_ENTRADA }}
        aria-hidden="true"
      >
        <Image
          src={fundo}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className={styles.backgroundImage}
        />
      </motion.div>
      <div className={styles.atmosphere} aria-hidden="true" />

      {/* CAMADA 2 — nome gigante, texto HTML real */}
      <motion.div className={styles.wordLayer} style={{ x: wordX, y: wordY }}>
        <h1 id="hero-title" className={styles.word}>
          <span className={styles.srOnly}>Voltagem, agência de marketing em Brasília</span>
          <motion.span
            className={styles.wordLine}
            aria-hidden="true"
            initial={initial}
            animate="shown"
          >
            {LETTERS.map((letter, index) => (
              <motion.span
                key={index}
                className={styles.letter}
                variants={letterVariants}
                custom={Math.abs(index - CENTER)}
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        </h1>
      </motion.div>

      {/* CAMADA 3 — robô */}
      <div className={styles.robot}>
        <motion.div className={styles.robotParallax} style={{ x: robotX, y: robotY }}>
          {/* `hero-robot-arrival` do code-flow */}
          <motion.div
            className={styles.robotArrival}
            initial={reduce ? false : { y: "62%" }}
            animate={{ y: ["62%", "7%", "0%"] }}
            transition={{
              duration: 1.42,
              delay: 0.18,
              ease: EASE_ARRIVAL,
              times: [0, 0.76, 1],
            }}
          >
            <div className={styles.robotGlow} aria-hidden="true" />
            {/* flutuação ociosa dos sprites do Fruity, bem mais contida */}
            <motion.div
              className={styles.robotFloat}
              animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, 0.5, -0.35, 0] }}
              transition={{
                duration: 9,
                delay: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src={robo}
                alt="Busto humanoide de cromo negro com veias de energia roxa"
                priority
                quality={90}
                sizes="(max-width: 767px) 140vw, (max-width: 1023px) 92vw, 60vw"
                className={styles.robotImage}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* DEMAIS ELEMENTOS */}
      <div className={styles.content}>
        <motion.p
          className={styles.eyebrow}
          variants={fadeUp}
          custom={0}
          initial={initial}
          animate="shown"
        >
          <span className={styles.pulse} aria-hidden="true" />
          Energia que converte
        </motion.p>

        <motion.p
          className={styles.meta}
          variants={fadeUp}
          custom={1}
          initial={initial}
          animate="shown"
        >
          Agência de marketing
          <span aria-hidden="true"> · </span>
          Brasília, DF
        </motion.p>

        <motion.p
          className={styles.lede}
          variants={fadeUp}
          custom={2}
          initial={initial}
          animate="shown"
        >
          Estratégia, criativo e mídia ligados no mesmo circuito. Cada campanha
          carrega a carga que faz sua marca ser sentida, não apenas vista.
        </motion.p>

        <motion.div
          className={styles.ctaSlot}
          variants={fadeUp}
          custom={3}
          initial={initial}
          animate="shown"
        >
          <MagneticCta href="#contato">Iniciar projeto</MagneticCta>
        </motion.div>
      </div>
    </section>
  );
}
