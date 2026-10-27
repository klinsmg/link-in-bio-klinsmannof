"use client";

import { useEffect, useState } from "react";
import { introReady } from "./intro";

const base = process.env.NEXT_PUBLIC_BASE ?? "";

/**
 * Fundo: fumaça verde em loop (a emenda fim→começo é suavizada no próprio arquivo), bem sutil.
 * `screen` faz o preto do vídeo sumir no fundo da página, então só o brilho verde soma.
 * Entra depois da abertura. Celular e rede lenta (3g ou pior) recebem a versão leve (640px); com movimento reduzido
 * ou economia de dados fica só o quadro estático (poster) e o vídeo nem é baixado.
 */
export default function Background() {
  const [show, setShow] = useState(false);
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    const net = (navigator as { connection?: { effectiveType?: string } }).connection?.effectiveType;
    const wide = matchMedia("(min-width: 768px)").matches && !/^(slow-2g|2g|3g)$/.test(net ?? "");
    introReady().then(() => {
      if (!still) setSrc(`${base}/${wide ? "fundo" : "fundo-sm"}.mp4`);
      setShow(true);
    });
  }, []);

  return (
    <video
      aria-hidden="true"
      tabIndex={-1}
      className="pointer-events-none fixed inset-0 -z-10 size-full object-cover mix-blend-screen transition-opacity duration-[2500ms] ease-out"
      style={{ opacity: show ? 0.25 : 0 }}
      src={src}
      poster={show ? `${base}/fundo.jpg` : undefined} // só depois da abertura: não disputa banda com a foto de perfil (LCP)
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
