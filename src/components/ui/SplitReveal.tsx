"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Título que sobe de dentro da própria linha (máscara do SplitText).
 * `autoSplit` refaz a quebra quando a fonte carrega ou a largura muda — por
 * isso a animação nasce dentro de `onSplit`, como pede a doc do GSAP 3.13.
 * O tempo é o do `gsapEntrada` da hero: longo, macio, saindo do desfoque.
 */
export function SplitReveal({
  as: Tag = "h2",
  className,
  children,
  id,
  delay = 0,
  start = "top 86%",
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            self.masks.forEach((mask) => mask.classList.add("split-mask"));
            return gsap.from(self.lines, {
              yPercent: 115,
              rotate: 2.5,
              transformOrigin: "0% 100%",
              filter: "blur(6px)",
              duration: 1.5,
              delay,
              ease: "expo.out",
              stagger: 0.11,
              clearProps: "filter",
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
