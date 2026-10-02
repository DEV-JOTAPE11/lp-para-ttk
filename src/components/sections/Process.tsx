"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";

import styles from "./Process.module.css";

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    time: "Semana 1–2",
    copy: "Raio-x da marca, da concorrência, da mídia e do funil. Saímos com um mapa claro de onde a energia está vazando.",
  },
  {
    n: "02",
    title: "Arquitetura",
    time: "Semana 3",
    copy: "Plano de 90 dias com metas por canal, mensagens, verba e o painel que vai medir cada uma delas.",
  },
  {
    n: "03",
    title: "Ativação",
    time: "Semana 4+",
    copy: "Campanhas no ar, criativos em sprint semanal e otimização diária. Tudo documentado, nada no escuro.",
  },
  {
    n: "04",
    title: "Escala",
    time: "Contínuo",
    copy: "Dobramos o que funciona, abrimos novos canais e subimos a voltagem com segurança — mês após mês.",
  },
] as const;

/**
 * PROCESSO — o fio que energiza.
 *
 * Um fio vertical corre ao lado das etapas e se enche de luz com a rolagem;
 * a faísca na ponta desce junto. Quando ela passa pelo nó de uma etapa, a
 * etapa "liga": o nó acende, o card ganha borda violeta e o número pulsa.
 * O título fica preso (sticky) à esquerda enquanto as etapas passam.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const list = section.querySelector<HTMLElement>(`.${styles.list}`)!;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scrub = {
          trigger: list,
          start: "top 62%",
          end: "bottom 62%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        };

        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: scrub })
          .fromTo(`.${styles.fill}`, { scaleY: 0 }, { scaleY: 1 }, 0)
          .fromTo(`.${styles.spark}`, { y: 0 }, { y: () => list.offsetHeight }, 0);

        gsap.utils.toArray<HTMLElement>(`.${styles.step}`).forEach((step) => {
          gsap.from(step.querySelector(`.${styles.card}`), {
            x: 60,
            autoAlpha: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: step, start: "top 85%", once: true },
          });

          // liga quando a faísca passa pelo nó (mesma linha de 62% do fio)
          // e desliga só se ela voltar para cima dele
          ScrollTrigger.create({
            trigger: step,
            start: "top+=38 62%",
            onEnter: () => step.classList.add(styles.on),
            onLeaveBack: () => step.classList.remove(styles.on),
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.process} aria-labelledby="processo-title">
      <div className={styles.aside}>
        <p className="eyebrow">Processo</p>
        <SplitReveal id="processo-title" className={`display ${styles.title}`}>
          Do zero à <span className="accent">carga máxima.</span>
        </SplitReveal>
        <p className={styles.lede}>
          Quatro etapas, um ritmo previsível. Você sabe o que acontece em cada
          semana — e o que cada real está fazendo.
        </p>
      </div>

      <div className={styles.listWrap}>
        <div className={styles.wire} aria-hidden="true">
          <span className={styles.fill} />
          <span className={styles.spark} />
        </div>

        <ol className={styles.list}>
          {STEPS.map((step) => (
            <li key={step.n} className={styles.step}>
              <span className={styles.node} aria-hidden="true" />
              <div className={`glass ${styles.card}`}>
                <div className={styles.cardHead}>
                  <span className={styles.n}>{step.n}</span>
                  <span className={styles.time}>{step.time}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.copy}>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
