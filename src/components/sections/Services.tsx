"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

import criativo from "@assets/images/servico-criativo.jpg";
import dados from "@assets/images/servico-dados.jpg";
import estrategia from "@assets/images/servico-estrategia.jpg";
import midia from "@assets/images/servico-midia.jpg";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";

import styles from "./Services.module.css";

type Service = {
  n: string;
  title: string;
  copy: string;
  tags: readonly string[];
  image: StaticImageData;
  /** traço do ícone, desenhado com DrawSVG quando o card chega ao centro */
  icon: string;
};

const SERVICES: readonly Service[] = [
  {
    n: "01",
    title: "Estratégia & Branding",
    copy: "Posicionamento, plataforma de marca e o plano que liga cada ação a um número de negócio.",
    tags: ["Pesquisa", "Posicionamento", "Identidade"],
    image: estrategia,
    icon: "M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M12 12l9-9M17 3h4v4",
  },
  {
    n: "02",
    title: "Criativo & Conteúdo",
    copy: "Campanhas, vídeo e social com acabamento de estúdio e ritmo de feed — feitos para parar o polegar.",
    tags: ["Campanhas", "Vídeo", "Social"],
    image: criativo,
    icon: "M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6L12 2ZM19 18l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z",
  },
  {
    n: "03",
    title: "Mídia & Performance",
    copy: "Meta, Google e TikTok Ads operados com teste contínuo e lance orientado a lucro, não a clique.",
    tags: ["Tráfego pago", "CRO", "Funis"],
    image: midia,
    icon: "M3 12h3l3-8 4 16 3-8h5",
  },
  {
    n: "04",
    title: "Dados & Growth",
    copy: "Dashboards, atribuição e CRM para enxergar o que gera receita — e repetir o que funciona.",
    tags: ["Analytics", "CRM", "Automação"],
    image: dados,
    icon: "M3 21h18M6 17v-5M11 17V8M16 17v-7M21 4l-6 5-4-3-8 6",
  },
];

/**
 * O CIRCUITO — rolagem horizontal presa.
 *
 * Desktop: a seção fica fixa e a esteira de cards corre para a esquerda
 * conforme a rolagem desce. Uma "corrente" de luz atravessa a esteira na
 * mesma medida, com a faísca na ponta. Cada card entra girado em Y (como uma
 * capa de coverflow) e assenta ao chegar ao centro, quando a imagem perde o
 * zoom e o ícone é desenhado traço a traço — tudo via `containerAnimation`,
 * que traduz a posição horizontal do card para o ScrollTrigger.
 *
 * Mobile: a esteira vira uma pilha vertical com entradas simples.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const track = section.querySelector<HTMLElement>(`.${styles.track}`)!;
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      const counter = section.querySelector<HTMLElement>(`.${styles.counterNow}`);

      const mm = gsap.matchMedia();

      mm.add(`${MOTION_OK} and (min-width: 900px)`, () => {
        const distance = () => track.scrollWidth - window.innerWidth;

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const index = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              if (counter) counter.textContent = SERVICES[index].n;
            },
          },
        });

        // a corrente cresce na mesma régua da esteira; como a esteira anda
        // para a esquerda enquanto a corrente avança, a faísca da ponta
        // varre a tela da esquerda para a direita
        const lane = section.querySelector<HTMLElement>(`.${styles.wireLane}`)!;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(`.${styles.wire}`, { scaleX: 0 }, { scaleX: 1 }, 0)
          .fromTo(`.${styles.spark}`, { x: 0 }, { x: () => lane.offsetWidth }, 0);

        cards.forEach((card) => {
          const image = card.querySelector(`.${styles.media} img`);
          const path = card.querySelector(`.${styles.icon} path`);

          gsap.fromTo(
            card,
            { rotationY: -24, z: -160, autoAlpha: 0.35, transformPerspective: 1400 },
            {
              rotationY: 0,
              z: 0,
              autoAlpha: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: slide,
                start: "left 100%",
                end: "center 55%",
                scrub: true,
              },
            },
          );

          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.35, xPercent: 8 },
              {
                scale: 1,
                xPercent: -4,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: slide,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }

          if (path) {
            gsap.fromTo(
              path,
              { drawSVG: "0%" },
              {
                drawSVG: "100%",
                duration: 1.6,
                ease: "power2.inOut",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: slide,
                  start: "left 70%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        });
      });

      mm.add(`${MOTION_OK} and (max-width: 899px)`, () => {
        cards.forEach((card) => {
          const path = card.querySelector(`.${styles.icon} path`);
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true } })
            .from(card, { y: 80, autoAlpha: 0, duration: 1.2, ease: "expo.out" })
            .fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut" }, 0.2);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="servicos" className={styles.services} aria-labelledby="servicos-title">
      <div className={styles.head}>
        <div>
          <p className="eyebrow">O circuito</p>
          <SplitReveal id="servicos-title" className={`display ${styles.title}`}>
            Quatro fases. <span className="accent">Uma corrente.</span>
          </SplitReveal>
        </div>
        <p className={styles.counter} aria-hidden="true">
          <span className={styles.counterNow}>01</span>
          <span className={styles.counterTotal}>/ 0{SERVICES.length}</span>
        </p>
      </div>

      <div className={styles.viewport}>
        <ol className={styles.track}>
          <li className={styles.wireLane} aria-hidden="true">
            <span className={styles.wire} />
            <span className={styles.spark} />
          </li>
          {SERVICES.map((service) => (
            <li key={service.n} className={`glass ${styles.card}`}>
              <div className={styles.media}>
                <Image
                  src={service.image}
                  alt=""
                  fill
                  quality={80}
                  sizes="(max-width: 899px) 92vw, 40vw"
                />
                <span className={styles.number}>{service.n}</span>
              </div>
              <div className={styles.body}>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d={service.icon} />
                </svg>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.copy}>{service.copy}</p>
                <ul className={styles.tags}>
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          <li className={styles.outro}>
            <p className="display">
              Tudo ligado.
              <br />
              <span className="accent">Tudo medido.</span>
            </p>
            <a href="#cases" className={styles.outroLink}>
              Ver resultados <span aria-hidden="true">→</span>
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}
