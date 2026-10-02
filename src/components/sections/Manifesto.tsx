"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type PointerEvent } from "react";

import criativo from "@assets/images/servico-criativo.jpg";
import estrategia from "@assets/images/servico-estrategia.jpg";
import midia from "@assets/images/servico-midia.jpg";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

import styles from "./Manifesto.module.css";

const CHIPS = [
  { value: "2016", label: "ligados desde" },
  { value: "+180", label: "marcas energizadas" },
  { value: "DF → BR", label: "de Brasília para o país" },
] as const;

const OUTPUTS = ["Atenção", "Desejo", "Venda"] as const;

const MAX_VOLTS = 220;
const STATUS = [
  { until: 0.34, label: "Modo economia" },
  { until: 0.86, label: "Carregando" },
  { until: Infinity, label: "Carga máxima" },
] as const;

/* -------- geometria do medidor (viewBox 240 × 140, centro em 120,120) -------- */
const CX = 120;
const CY = 120;
const R = 92;
const polar = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: +(CX + r * Math.cos(rad)).toFixed(2), y: +(CY - r * Math.sin(rad)).toFixed(2) };
};
const TICKS = Array.from({ length: 23 }, (_, i) => {
  const deg = 180 - (i * 180) / 22;
  const major = i % 11 === 0;
  const mid = i % 2 === 0;
  return { a: polar(deg, R - 8), b: polar(deg, R - (major ? 22 : mid ? 16 : 12)), major };
});
// 0 e 220 ficam abaixo da linha de base: no fim do curso o ponteiro deita
// sobre ela e cobriria o rótulo
const LABELS = [
  { v: 0, x: CX - R + 4, y: CY + 13 },
  { v: 110, ...polar(90, R - 34) },
  { v: 220, x: CX + R - 4, y: CY + 13 },
];

/* onda do osciloscópio: 3 períodos de 120 u; a animação desloca 1 período */
const WAVE = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 360; x += 4) {
    pts.push(`${x},${(30 - 20 * Math.sin((2 * Math.PI * x) / 120)).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
})();

function Pill({ src }: { src: StaticImageData }) {
  return (
    <span className={styles.pill} aria-hidden="true">
      <Image src={src} alt="" fill quality={80} sizes="120px" />
    </span>
  );
}

/**
 * MANIFESTO — a lâmina de vidro que sobe sobre a hero (ver HeroStage).
 *
 * Presa na tela, ela "carrega" a marca: a frase acende palavra a palavra e,
 * no mesmo ritmo, o medidor de vidro à direita sobe de 0 a 220 V — arco
 * desenhado, ponteiro girando, display contando, a onda do osciloscópio
 * crescendo e o status mudando de "Modo economia" até "Carga máxima". As
 * miniaturas dentro da frase se abrem quando a leitura chega nelas,
 * empurrando as palavras. No fim, as três saídas da frase — atenção,
 * desejo e venda — enchem como barras do medidor.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const text = section.querySelector<HTMLElement>(`.${styles.text}`)!;
      const card = section.querySelector<HTMLElement>(`.${styles.meter}`)!;
      const readout = section.querySelector<HTMLElement>(`.${styles.volts}`)!;
      const status = section.querySelector<HTMLElement>(`.${styles.statusLabel}`)!;

      const setStatus = (progress: number) => {
        const next = STATUS.find((s) => progress < s.until)!;
        if (status.textContent !== next.label) status.textContent = next.label;
        card.classList.toggle(styles.full, progress >= STATUS[1].until);
      };

      /** Frase: palavras acendendo + miniaturas abrindo na hora certa. */
      const buildText = (tl: gsap.core.Timeline) => {
        const split = SplitText.create(text, { type: "words", wordsClass: styles.word });
        const step = 0.08;
        tl.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: step, duration: 0.5 }, 0);

        text.querySelectorAll<HTMLElement>(`.${styles.pill}`).forEach((pill) => {
          // abre junto com a primeira palavra que vem depois dela
          const after = split.words.findIndex(
            (w) => pill.compareDocumentPosition(w) & Node.DOCUMENT_POSITION_FOLLOWING,
          );
          tl.fromTo(
            pill,
            { width: 0, marginInline: 0, scale: 0.4, rotate: -12 },
            { width: "1.9em", marginInline: "0.1em", scale: 1, rotate: 0, ease: "power2.out", duration: 0.6 },
            Math.max(0, after - 1) * step,
          );
        });
        return split;
      };

      /** Medidor: tudo esticado sobre a mesma duração da frase. */
      const buildMeter = (tl: gsap.core.Timeline, duration: number) => {
        const volts = { v: 0 };
        tl.fromTo(`.${styles.arcValue}`, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration }, 0)
          .fromTo(
            `.${styles.needle}`,
            { rotation: -90, svgOrigin: `${CX} ${CY}` },
            { rotation: 90, svgOrigin: `${CX} ${CY}`, ease: "power1.inOut", duration },
            0,
          )
          .fromTo(
            volts,
            { v: 0 },
            {
              v: MAX_VOLTS,
              ease: "power1.inOut",
              duration,
              onUpdate: () => {
                readout.textContent = String(Math.round(volts.v)).padStart(3, "0");
              },
            },
            0,
          )
          .fromTo(`.${styles.waveAmp}`, { scaleY: 0.1, svgOrigin: "0 30" }, { scaleY: 1, svgOrigin: "0 30", ease: "power2.in", duration }, 0)
          .fromTo(
            `.${styles.outputFill}`,
            { scaleX: 0 },
            { scaleX: 1, ease: "power2.out", stagger: 0.12, duration: duration * 0.2 },
            duration * 0.78,
          )
          .fromTo(`.${styles.watermark}`, { xPercent: 8 }, { xPercent: -22, ease: "none", duration }, 0)
          .fromTo(`.${styles.orbA}`, { y: 120 }, { y: -80, ease: "none", duration }, 0)
          .fromTo(`.${styles.orbB}`, { y: -40 }, { y: 140, ease: "none", duration }, 0);
      };

      const mm = gsap.matchMedia();

      // Desktop: a seção fica presa e a frase dita o tempo do medidor
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => setStatus(self.progress),
          },
        });
        const split = buildText(tl);
        buildMeter(tl, tl.duration());
        setStatus(0);

        gsap.from(`.${styles.chip}`, {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 40%", once: true },
        });

        return () => split.revert();
      });

      // Mobile/tablet: sem pin — a frase e o medidor carregam ao passar
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        const textTl = gsap.timeline({
          scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
        });
        const split = buildText(textTl);

        const meterTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 60%",
            scrub: 0.6,
            onUpdate: (self) => setStatus(self.progress),
          },
        });
        buildMeter(meterTl, 1);
        setStatus(0);

        return () => split.revert();
      });
    },
    { scope: root },
  );

  // inclinação 3D do medidor sob o mouse
  const tilt = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = event.currentTarget;
    tilt.current ??= {
      x: gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" }),
      y: gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" }),
    };
    const r = el.getBoundingClientRect();
    tilt.current.x(((event.clientX - r.left) / r.width - 0.5) * 14);
    tilt.current.y(((event.clientY - r.top) / r.height - 0.5) * -14);
    el.style.setProperty("--gx", `${((event.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--gy", `${((event.clientY - r.top) / r.height) * 100}%`);
  };
  const onPointerLeave = () => {
    tilt.current?.x(0);
    tilt.current?.y(0);
  };

  return (
    <section ref={root} id="sobre" className={styles.manifesto} aria-labelledby="manifesto-title">
      <p className={styles.watermark} aria-hidden="true">
        Manifesto
      </p>
      <span className={`${styles.orb} ${styles.orbA}`} aria-hidden="true" />
      <span className={`${styles.orb} ${styles.orbB}`} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className="eyebrow" id="manifesto-title">
            Manifesto <span className={styles.eyebrowIndex}>/ 001</span>
          </p>

          <p className={`display ${styles.text}`}>
            Marca nenhuma cresce no modo economia. A Voltagem liga estratégia
            <Pill src={estrategia} />, criativo <Pill src={criativo} /> e mídia
            <Pill src={midia} /> num único <em>circuito</em> — para que cada
            real investido volte como <em>energia</em>: atenção, desejo e{" "}
            <em>venda.</em>
          </p>

          <ul className={styles.chips}>
            {CHIPS.map((chip) => (
              <li key={chip.value} className={`glass ${styles.chip}`}>
                <strong>{chip.value}</strong>
                <span>{chip.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.stage}>
          <div
            className={`glass ${styles.meter}`}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            role="img"
            aria-label={`Medidor de carga da marca chegando a ${MAX_VOLTS} volts`}
          >
            <div className={styles.meterHead}>
              <span>Medidor de carga</span>
              <span className={styles.live}>
                <i aria-hidden="true" /> Ao vivo
              </span>
            </div>

            <svg className={styles.gauge} viewBox="0 0 240 132" aria-hidden="true">
              <defs>
                <linearGradient id="manifesto-arc" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#5a28c8" />
                  <stop offset="0.6" stopColor="#a46bff" />
                  <stop offset="1" stopColor="#f1eaff" />
                </linearGradient>
              </defs>
              <path className={styles.arcTrack} d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} />
              <path className={styles.arcValue} d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} />
              {TICKS.map((t, i) => (
                <line
                  key={i}
                  className={t.major ? styles.tickMajor : styles.tick}
                  x1={t.a.x}
                  y1={t.a.y}
                  x2={t.b.x}
                  y2={t.b.y}
                />
              ))}
              {LABELS.map((l) => (
                <text key={l.v} className={styles.tickLabel} x={l.x} y={l.y} textAnchor="middle">
                  {l.v}
                </text>
              ))}
              <g className={styles.needle} transform={`rotate(90 ${CX} ${CY})`}>
                <line x1={CX} y1={CY} x2={CX} y2={CY - R + 14} />
              </g>
              <circle className={styles.hub} cx={CX} cy={CY} r="7" />
            </svg>

            <div className={styles.readout}>
              <span className={styles.volts}>{MAX_VOLTS}</span>
              <span className={styles.unit}>V</span>
              <span className={styles.status}>
                <i aria-hidden="true" />
                <span className={styles.statusLabel}>Carga máxima</span>
              </span>
            </div>

            <svg className={styles.scope} viewBox="0 0 240 60" preserveAspectRatio="none" aria-hidden="true">
              <line className={styles.scopeAxis} x1="0" y1="30" x2="240" y2="30" />
              <g className={styles.waveAmp}>
                <g className={styles.waveRun}>
                  <path className={styles.wave} d={WAVE} />
                </g>
              </g>
            </svg>

            <ul className={styles.outputs}>
              {OUTPUTS.map((label) => (
                <li key={label}>
                  <span>{label}</span>
                  <span className={styles.outputBar}>
                    <span className={styles.outputFill} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
