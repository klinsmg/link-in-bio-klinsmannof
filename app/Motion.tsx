"use client";

import { useEffect } from "react";
import { EMAIL } from "./contact";
import { introReady } from "./intro";

/** Carrega Alpine e (só quando a abertura toca) GSAP/ScrollTrigger sob demanda, e anima a entrada. */
export default function Motion() {
  useEffect(() => {
    // Alpine só faz o "Copiar" do e-mail: carrega com a página já pronta e o navegador ocioso
    introReady().then(() =>
      (window.requestIdleCallback ?? setTimeout)(() =>
        import("@alpinejs/csp").then(({ default: Alpine }) => {
          const w = window as unknown as { Alpine?: typeof Alpine };
          if (w.Alpine) return; // o modo de desenvolvimento roda o efeito duas vezes
          w.Alpine = Alpine;
          Alpine.data("copyEmail", () => ({
            ok: false,
            get label() { return this.ok ? "Copiado!" : "Copiar"; },
            copy() {
              navigator.clipboard?.writeText(EMAIL).then(() => {
                this.ok = true;
                setTimeout(() => (this.ok = false), 2000);
              }).catch(() => {});
            },
          }));
          Alpine.start();
        }),
      ),
    );

    // Sem abertura (visita repetida ou movimento reduzido) a página já está pronta: nada a animar, GSAP nem carrega.
    if (document.documentElement.dataset.intro !== "play") return;

    // Com a abertura, a página inteira já está pintada por baixo dela (é o que mantém o LCP baixo):
    // aqui só se escorrega e clareia o conteúdo ao sair a tela preta. Opacidade nunca parte de 0,
    // porque elemento invisível não conta no LCP e o texto "nasceria" só depois da abertura.
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      const from = { opacity: 0.4, y: 16 };
      const to = { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", clearProps: "transform,opacity", stagger: 0.08 };
      const ready = introReady();

      // Topo (o título é animado pelo voo do nome, não aqui)
      const hero = gsap.utils.toArray<HTMLElement>("[data-anim=hero]:not(h1)");
      gsap.set(hero, from);
      ready.then(() => gsap.to(hero, to));

      // Cartões e rodapé: os que estão fora da tela entram ao rolar
      const rest = gsap.utils.toArray<HTMLElement>("[data-anim=reveal]");
      gsap.set(rest, from);
      ScrollTrigger.batch(rest, {
        start: "top 92%",
        once: true,
        onEnter: (els) => ready.then(() => gsap.to(els, to)),
      });
    });
  }, []);

  return null;
}
