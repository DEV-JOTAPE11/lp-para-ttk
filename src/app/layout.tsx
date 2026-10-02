import type { Metadata, Viewport } from "next";
import { Anton, Archivo } from "next/font/google";

import "./globals.css";

/** Anton: grotesca condensada de peso preto, a mesma família da referência.
 *  Só existe num corte (visualmente ~900), por isso o nome gigante usa
 *  `font-synthesis: none` para nunca receber negrito falso. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

/** Archivo variável para a copy de apoio. */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Voltagem — Agência de Marketing em Brasília",
  description:
    "Estratégia, criativo e mídia ligados no mesmo circuito. A Voltagem é uma agência de marketing de Brasília para marcas que querem ser sentidas, não apenas vistas.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07051a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${archivo.variable}`}>
      {/* extensões (ex.: ColorZilla) injetam atributos no body antes da hidratação */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
