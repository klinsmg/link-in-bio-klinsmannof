"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { trap } from "./intro";

/**
 * Abertura, tudo por CSS com delays e um voo em JS no final:
 *  0,2s–2,0s   cinco serviços em tela cheia, em cortes secos de 0,31s (o do 1º lugar corta para verde)
 *  2,05s      o nome KLINSMANN entra grande, com os cinco serviços abaixo
 *  2,6s       a tela some e o nome voa até o título abaixo da foto de perfil, onde pousa
 * Toca em toda visita (só não toca com movimento reduzido); toque/Esc pula.
 * Enquanto toca, html[data-intro="play"] esconde o título real (ver globals.css) e o resto da página fica inerte.
 */
const START = 0.2;
const STEP = 0.31;
const FLIGHT_MS = 550;

const items = [
  { label: "Web design", icon: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 8.5h18M6.5 6.25h.01M9 6.25h.01" /><path d="M7 13h6M7 16h10" /></> },
  { label: "Código", icon: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" /> },
  { label: "Google", icon: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5.5 5.5" /></> },
  { label: "1º lugar", accent: true, icon: <path d="M7 21h10M12 17v4M8 3h8v6a4 4 0 0 1-8 0zM8 5H4v1.5A3.5 3.5 0 0 0 8 10M16 5h4v1.5A3.5 3.5 0 0 1 16 10" /> },
  { label: "IAs", icon: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 3v4M17 5h4" /> },
];

const FLIGHT_AT_MS = (START + items.length * STEP + 0.55) * 1000; // 0,55s depois de o nome entrar
const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const fade = (el: HTMLElement | null) =>
  el?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: "ease-out", fill: "forwards" });

export default function Splash() {
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const rows = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const announced = useRef(false);

  const announce = () => {
    if (announced.current) return;
    announced.current = true;
    dispatchEvent(new Event("intro:done")); // Motion, Sound e Background seguem daqui
  };

  const finish = () => {
    trap(null, false);
    document.documentElement.dataset.intro = "done"; // mostra o título real
    document.querySelector<HTMLElement>("h1")?.style.setProperty("opacity", "1"); // fica de fora da entrada do GSAP
    setPhase("done");
    announce();
  };

  useLayoutEffect(() => {
    const play = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.dataset.intro = play ? "play" : "skip";
    if (!play) return setPhase("done");
    setPhase("play");
    trap(root.current, true);

    const fly = () => {
      const h1 = document.querySelector("h1");
      const el = name.current;
      if (!h1 || !el) return finish();
      const range = document.createRange();
      range.selectNodeContents(h1);
      const to = range.getBoundingClientRect(); // caixa do texto, não do bloco inteiro
      const from = el.getBoundingClientRect();
      const s = to.width / from.width;

      announce(); // a página começa a entrar enquanto o nome voa
      trap(null, false);
      fade(bg.current);
      fade(rows.current);
      el.animate(
        [{ transform: "none" }, { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${s})` }],
        { duration: FLIGHT_MS, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "forwards" },
      ).finished.then(finish, finish);
    };

    const t = setTimeout(fly, FLIGHT_AT_MS);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && finish();
    addEventListener("keydown", esc);
    return () => { clearTimeout(t); removeEventListener("keydown", esc); trap(null, false); };
  }, []);

  if (phase !== "play") return null;
  return (
    <div ref={root} onClick={finish} className="fixed inset-0 z-9999 cursor-pointer overflow-hidden">
      <p role="status" className="sr-only">Abertura animada. Pressione Esc para pular.</p>
      <div ref={bg} className="absolute inset-0 bg-black" aria-hidden="true" />

      {/* 1 · um serviço por vez, em tela cheia */}
      <div ref={rows} className="absolute inset-0" aria-hidden="true">
        {items.map(({ label, icon, accent }, i) => (
          <div
            key={label}
            className={`sp-flash absolute inset-0 flex flex-col items-center justify-center gap-6 ${accent ? "bg-accent text-ink" : "bg-black text-paper"}`}
            style={delay(START + i * STEP)}
          >
            <svg viewBox="0 0 24 24" className="sp-zoom size-[min(62vw,46vh,420px)]" style={delay(START + i * STEP)}>{icon}</svg>
            <span className="sp-zoom font-mono text-[clamp(18px,4vw,40px)] font-bold tracking-wide uppercase" style={delay(START + i * STEP)}>{label}</span>
          </div>
        ))}

        {/* 2 · serviços juntos, pequenos, abaixo do nome */}
        <div className="absolute inset-x-0 top-1/2 flex justify-center px-4 pt-[clamp(32px,8vh,72px)]">
          <div className="flex max-w-4xl flex-wrap justify-center gap-x-[clamp(20px,5vw,64px)] gap-y-6">
            {items.map(({ label, icon, accent }, i) => (
              <div key={label} className="sp-pop flex flex-col items-center gap-2" style={{ animationDelay: `${START + items.length * STEP + 0.25 + i * 0.08}s` }}>
                <svg viewBox="0 0 24 24" className={`size-[clamp(40px,9vw,72px)] ${accent ? "text-accent" : "text-paper"}`}>{icon}</svg>
                <span className="font-mono text-[clamp(10px,1.6vw,14px)] tracking-wide text-dim uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* nome: mesma tipografia (e sombra, em em) do h1, para o voo pousar sem salto */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-full justify-center pb-4" aria-hidden="true">
        <div
          ref={name}
          className="sp-pop text-[clamp(44px,13vw,190px)] leading-normal font-black tracking-tight text-paper uppercase [text-shadow:0.088em_0.088em_0_var(--color-shadow)] [transform-origin:0_0]"
          style={{ animationDelay: `${START + items.length * STEP + 0.05}s` }}
        >
          Klinsmann
        </div>
      </div>
    </div>
  );
}
