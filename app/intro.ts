/** Resolve quando a abertura termina (ou já, se ela não vai tocar). Motion, Sound e Background esperam por isso. */
export const introReady = (): Promise<void> =>
  document.documentElement.dataset.intro === "play"
    ? new Promise((r) => addEventListener("intro:done", () => r(), { once: true }))
    : Promise.resolve();

/** localStorage pode lançar erro (cookies bloqueados, alguns navegadores embutidos): nesse caso, só não lembra. */
export const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
};

/** Deixa inerte (sem foco, sem leitor de tela) tudo no <main> exceto `keep`: usado sob a abertura e o pop-up. */
export const trap = (keep: Element | null, on: boolean) =>
  document.querySelectorAll("main > *").forEach((el) => el !== keep && el.toggleAttribute("inert", on));
