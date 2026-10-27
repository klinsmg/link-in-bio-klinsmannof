"use client";

import { useEffect, useRef, useState } from "react";
import { introReady, trap } from "./intro";

const VIDEO_ID = "5Pk_oHxy15M"; // Pharrell Williams · Freedom (player oficial do YouTube)

type YTPlayer = { playVideo(): void; pauseVideo(): void; setVolume(v: number): void; seekTo(s: number, allowSeekAhead: boolean): void };
type YTApi = { Player: new (el: HTMLElement, opts: object) => YTPlayer };
type YTWindow = Window & { YT?: YTApi; onYouTubeIframeAPIReady?: () => void };

/** Botão de som. A API do YouTube só é baixada no primeiro clique (e o navegador só libera áudio após um gesto). */
export default function Sound() {
  const [on, setOn] = useState(false);
  const [asking, setAsking] = useState(false); // pop-up de permissão ao abrir (só com JS, senão ficaria preso na tela)
  const player = useRef<YTPlayer | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const create = () => {
    const { YT } = window as YTWindow;
    if (!YT || !host.current) return;
    player.current = new YT.Player(host.current, {
      host: "https://www.youtube-nocookie.com",
      videoId: VIDEO_ID,
      playerVars: { autoplay: 1, loop: 1, playlist: VIDEO_ID, playsinline: 1 },
      events: { onReady: (e: { target: YTPlayer }) => { e.target.setVolume(40); e.target.seekTo(1.6, true); e.target.playVideo(); } },
    });
  };

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    introReady().then(() => (t = setTimeout(() => setAsking(true), 600))); // depois da abertura (Splash)
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAsking(false);
    addEventListener("keydown", esc);
    return () => { clearTimeout(t); removeEventListener("keydown", esc); };
  }, []);

  // Pop-up aberto: o resto da página fica inerte (foco preso) e o foco volta ao botão de som ao fechar
  useEffect(() => {
    if (!asking) return;
    trap(dialog.current, true);
    return () => { trap(null, false); button.current?.focus(); };
  }, [asking]);

  const toggle = () => {
    setAsking(false);
    if (on) player.current?.pauseVideo();
    else if (player.current) player.current.playVideo();
    else {
      const w = window as YTWindow;
      if (w.YT?.Player) create();
      else {
        w.onYouTubeIframeAPIReady = create;
        document.head.appendChild(Object.assign(document.createElement("script"), { src: "https://www.youtube.com/iframe_api", referrerPolicy: "strict-origin-when-cross-origin" }));
      }
    }
    setOn(!on);
  };

  return (
    <>
      {asking && (
        <div ref={dialog} className="fixed inset-0 z-20 grid place-items-center bg-bg/90 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="som-t" className="w-full max-w-80 rounded-2xl border border-line bg-panel p-6 text-center">
            <h2 id="som-t" className="text-lg font-black">Ativar música de fundo?</h2>
            {/* texto curto de propósito: o pop-up aparece depois da abertura e, se o texto fosse maior que o conteúdo já pintado, viraria o LCP */}
            <p className="mt-2 text-[13px] text-dim">“Freedom”, de Pharrell Williams.<span className="sr-only"> Você pode desligar quando quiser.</span></p>
            <div className="mt-5 grid gap-2">
              <button type="button" autoFocus onClick={toggle} className="cursor-pointer rounded-xl bg-accent px-4 py-3 font-extrabold text-ink">
                Ativar música
              </button>
              <button type="button" onClick={() => setAsking(false)} className="cursor-pointer rounded-xl border border-line px-4 py-3 font-bold hover:border-paper">
                Agora não
              </button>
            </div>
          </div>
        </div>
      )}
      <div ref={host} className="pointer-events-none fixed -left-2499.75 size-px" aria-hidden="true" />
      <button
        ref={button}
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label="Música"
        className="fixed right-4 bottom-4 z-10 grid size-12 cursor-pointer place-items-center rounded-full border border-line bg-panel transition-colors duration-150 hover:border-paper"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className={on ? "text-accent" : ""}>
          <path d="M4 9.500v5h4l5 4v-13l-5 4z" />
          {on ? <path d="M16.500 9a4 4 0 0 1 0 6M19 6.500a8 8 0 0 1 0 11" /> : <path d="m17 9.500 4 5m0-5-4 5" />}
        </svg>
      </button>
    </>
  );
}
