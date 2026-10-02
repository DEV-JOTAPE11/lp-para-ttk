"use client";

import Image from "next/image";
import { useRef } from "react";

import fundo from "@assets/FUNDO.png";
import robo from "@assets/ROBO.png";
import { MagneticCta } from "@/components/hero/MagneticCta";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

import styles from "./Contact.module.css";

const WORD = "Contato";

const CHANNELS = [
  { label: "E-mail", value: "ola@voltagem.com.br", href: "mailto:ola@voltagem.com.br" },
  { label: "WhatsApp", value: "(61) 99999-0000", href: "https://wa.me/5561999990000" },
  { label: "Instagram", value: "@voltagem.ag", href: "https://instagram.com/" },
] as const;

/**
 * CONTATO — o portal.
 *
 * A seção fica presa enquanto um círculo se abre do centro (clip-path) e
 * revela de novo a cena da hero: a nebulosa, o busto subindo e o nome
 * gigante atrás dele — agora "CONTATO". A página termina onde começou,
 * fechando o laço visual. Por fim a placa de vidro com os canais sobe.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(`.${styles.word}`, { type: "chars", charsClass: styles.char });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 1,
          },
        });

        tl.fromTo(`.${styles.teaser}`, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.9, duration: 0.25 }, 0)
          .fromTo(
            `.${styles.portal}`,
            { clipPath: "circle(7% at 50% 50%)" },
            { clipPath: "circle(78% at 50% 50%)", duration: 0.55, ease: "power2.inOut" },
            0,
          )
          .fromTo(`.${styles.sky}`, { scale: 1.5 }, { scale: 1, duration: 0.7, ease: "power2.out" }, 0)
          .from(
            split.chars,
            {
              yPercent: 110,
              autoAlpha: 0,
              stagger: { each: 0.035, from: "center" },
              duration: 0.3,
              ease: "power3.out",
            },
            0.3,
          )
          .fromTo(`.${styles.robot}`, { yPercent: 55 }, { yPercent: 0, duration: 0.5, ease: "power2.out" }, 0.32)
          .from(`.${styles.panel}`, { yPercent: 40, autoAlpha: 0, duration: 0.28, ease: "power3.out" }, 0.72);

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contato" className={styles.contact} aria-labelledby="contato-title">
      <p className={styles.teaser} aria-hidden="true">
        <span>
          Pronto para subir
          <br />a <span className="accent">voltagem?</span>
        </span>
      </p>

      <div className={styles.portal}>
        <div className={styles.sky} aria-hidden="true">
          <Image src={fundo} alt="" fill quality={80} sizes="100vw" />
        </div>
        <div className={styles.glow} aria-hidden="true" />

        <h2 id="contato-title" className={styles.word}>
          {WORD}
        </h2>

        <div className={styles.robot} aria-hidden="true">
          <Image src={robo} alt="" quality={90} sizes="(max-width: 767px) 120vw, 50vw" />
        </div>

        <div className={`glass ${styles.panel}`}>
          <div className={styles.panelText}>
            <p className={styles.panelTitle}>Vamos ligar sua marca?</p>
            <p className={styles.panelCopy}>
              Conte onde você quer chegar. Respondemos em até 24h com um
              primeiro diagnóstico — sem custo.
            </p>
          </div>

          <ul className={styles.channels}>
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  {...(channel.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span>{channel.label}</span>
                  {channel.value}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.ctaSlot}>
            <MagneticCta href="mailto:ola@voltagem.com.br">Iniciar projeto</MagneticCta>
          </div>
        </div>
      </div>
    </section>
  );
}
