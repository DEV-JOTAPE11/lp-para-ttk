"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import styles from "./Header.module.css";

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#cases", label: "Cases" },
  { href: "#sobre", label: "Sobre" },
] as const;

/** `site-header-arrival` do code-flow: desce 52px saindo do desfoque. */
const ARRIVAL = { duration: 0.92, delay: 0.08, ease: [0.16, 1, 0.3, 1] } as const;

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="2.5" stroke="currentColor" strokeWidth="3" />
      <path d="M13.6 5.5 8 13.1h3.6L10.2 18.5l5.8-7.7h-3.6l1.2-5.3Z" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 20.2s-7.6-4.6-7.6-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.6 2.7c0 5.5-7.6 10.1-7.6 10.1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Ao sair do topo o header vira uma pílula de vidro; rolando para baixo
  // ele se recolhe, rolando para cima volta. Só atributos no nó — o CSS
  // faz as transições, sem re-render a cada evento de scroll.
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      header.toggleAttribute("data-scrolled", y > 40);
      const hide = y > window.innerHeight * 0.9 && y > last + 2;
      const show = y < last - 2;
      if (hide) header.setAttribute("data-hidden", "");
      else if (show || y <= 40) header.removeAttribute("data-hidden");
      last = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      ref={ref}
      className={styles.header}
      initial={reduce ? false : { opacity: 0, y: -52, filter: "blur(18px)" }}
      animate={{
        opacity: [0, 1, 1],
        y: 0,
        filter: ["blur(18px)", "blur(2px)", "blur(0px)"],
        transitionEnd: { filter: "none" },
      }}
      transition={{
        ...ARRIVAL,
        opacity: { ...ARRIVAL, times: [0, 0.64, 1] },
        filter: { ...ARRIVAL, times: [0, 0.64, 1] },
      }}
    >
      <div className={styles.left}>
        <a href="#" className={styles.logo} aria-label="Voltagem — início">
          <LogoMark />
        </a>

        <nav aria-label="Principal">
          <ul className={styles.links}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.right}>
        <div className={styles.icons}>
          <a href="#cases" className={styles.icon} aria-label="Cases favoritos">
            <HeartIcon />
          </a>
          <button type="button" className={styles.icon} aria-label="Buscar">
            <SearchIcon />
          </button>
        </div>

        <a href="#contato" className={styles.action}>
          Contato
        </a>
      </div>
    </motion.header>
  );
}
