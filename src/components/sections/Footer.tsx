"use client";

import { useRef } from "react";

import { getLenis } from "@/components/effects/SmoothScroll";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

import styles from "./Footer.module.css";

const NAV = [
  { href: "#servicos", label: "Serviços" },
  { href: "#cases", label: "Cases" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
] as const;

const SOCIAL = [
  { href: "https://instagram.com/", label: "Instagram" },
  { href: "https://linkedin.com/", label: "LinkedIn" },
  { href: "https://behance.net/", label: "Behance" },
] as const;

/**
 * Rodapé. O nome gigante se acende da esquerda para a direita conforme o
 * rodapé entra (gradiente varrendo o texto), como uma barra de carga.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          `.${styles.brand}`,
          { backgroundPosition: "100% 0" },
          {
            backgroundPosition: "0% 0",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          },
        );
        gsap.from(`.${styles.brand}`, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={root} className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.tagline}>
          Agência de marketing em Brasília. Estratégia, criativo e mídia no
          mesmo circuito.
        </p>

        <nav aria-label="Rodapé" className={styles.cols}>
          <ul>
            {NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <ul>
            {SOCIAL.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className={`glass ${styles.toTop}`} onClick={toTop}>
          Voltar ao topo <span aria-hidden="true">↑</span>
        </button>
      </div>

      <p className={styles.brand} aria-hidden="true">
        Voltagem
      </p>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Voltagem. Todos os direitos reservados.</span>
        <span>Brasília, DF</span>
      </div>
    </footer>
  );
}
