"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

import styles from "./Hero.module.css";

/**
 * `MagneticHover` do code-flow, refeito em molas do motion: o botão segue o
 * cursor com um leve deslocamento e volta com um leve quique ao sair. A seta
 * gira 45° no hover, como no CTA da hero do code-flow.
 */
export function MagneticCta({
  href,
  children,
  strength = 0.3,
}: {
  href: string;
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.6 });

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node || reduce || event.pointerType !== "mouse") return;
    const bounds = node.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength);
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={styles.cta}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className={styles.ctaLabel}>{children}</span>
      <span className={styles.ctaIcon} aria-hidden="true">
        <svg viewBox="0 0 40 40" width="18" height="18" fill="none">
          <path
            d="M26.88 15.87 12.54 30.22l-2.36-2.36 14.35-14.35H11.88v-3.33h18.34v18.33h-3.34V15.87Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </motion.a>
  );
}
