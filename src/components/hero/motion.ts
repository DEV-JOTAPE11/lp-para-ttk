/**
 * Curvas e tempos de entrada da hero, trazidos dos projetos de referência:
 *
 * - code-flow `globals.css` → `gsapEntrada` (sobe saindo do desfoque, 2.4s,
 *   cubic-bezier(0.19, 1, 0.22, 1)) e `hero-robot-arrival` (o robô sobe de
 *   62% → 7% → 0 em 1.42s, cubic-bezier(0.16, 1, 0.3, 1), atraso 0.18s).
 * - code-flow `motion-primitives.tsx` → `FadeUp` (y 28 + blur 12, EASE).
 * - Fruity `Hero.tsx` → parallax do mouse em molas (stiffness 55,
 *   damping 18) e a flutuação ociosa dos sprites.
 */

/** Easing padrão do code-flow. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Curva do `gsapEntrada`: saída longa e macia. */
export const EASE_ENTRADA = [0.19, 1, 0.22, 1] as const;

/** Curva da chegada do robô. */
export const EASE_ARRIVAL = [0.16, 1, 0.3, 1] as const;

/** Mola do parallax do Fruity. */
export const PARALLAX_SPRING = { stiffness: 55, damping: 18 } as const;

/** Momento (s) em que o robô assenta e a copy começa a entrar. */
export const CONTENT_DELAY = 1.05;
