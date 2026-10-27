import Image from "next/image";
import perfil from "../public/perfil.jpg";
import { EMAIL } from "./contact";
import Motion from "./Motion";
import Sound from "./Sound";
import Background from "./Background";
import Splash from "./Splash";
import { Chevron, Instagram, Mail, Spotify, WhatsApp } from "./icons";

const whatsapp =
  "https://wa.me/5511970321046?text=" +
  encodeURIComponent("Olá! Vim pelo Instagram e estou interessado. Podemos marcar uma reunião?");
const instagram = "https://www.instagram.com/klinsmannof/";
const spotify = "https://open.spotify.com/playlist/1GTHfzjunEykSHks4lBpAK";
const mailto = `mailto:${EMAIL}`;

const social = [
  { label: "Instagram", href: instagram, Icon: Instagram },
  { label: "WhatsApp", href: whatsapp, Icon: WhatsApp },
  { label: "Spotify", href: spotify, Icon: Spotify },
  { label: "E-mail", href: mailto, Icon: Mail },
];

const cards = [
  { title: "Fale no WhatsApp", sub: "(11) 97032-1046", href: whatsapp, Icon: WhatsApp, main: true },
  { title: "Instagram", sub: "@klinsmannof", href: instagram, Icon: Instagram },
  { title: "Playlist no Spotify", sub: "Ouça a seleção Klinsmann", href: spotify, Icon: Spotify },
];

const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
const NEW_TAB = " (abre em nova aba)";

const cardBase =
  "relative flex min-w-0 flex-1 items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-[transform,border-color] duration-150 ease-out active:scale-[.98] motion-reduce:transition-none motion-reduce:active:scale-100";

export default function Page() {
  return (
    <main className="w-full max-w-110 text-center">
      <Splash />
      <Background />
      <div className="mx-auto mb-4.5 size-28 rounded-full border-[3px] border-accent p-1.25">
        <Image src={perfil} alt="Klinsmann" priority fetchPriority="high" placeholder="blur" className="size-full rounded-full object-cover" />
      </div>
      <h1 data-anim="hero" className="text-[34px] font-black tracking-tight uppercase [text-shadow:0.088em_0.088em_0_var(--color-shadow)]">
        Klinsmann
      </h1>
      <p data-anim="hero" className="mt-1.5 font-bold">
        <mark className="bg-accent px-2 py-px text-ink">Web Design x Google</mark>
      </p>
      <p data-anim="hero" className="mt-3 text-[15px] text-balance text-dim">
        Seu negócio em primeiro lugar nas pesquisas e IAs
        <br />
        Agende uma reunião ↓
      </p>

      <nav data-anim="hero" aria-label="Redes sociais" className="mt-5.5 mb-6.5 flex justify-center gap-2.5">
        {social.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            {...ext(href)}
            aria-label={label + (href.startsWith("http") ? NEW_TAB : "")}
            className="grid size-11.5 place-items-center rounded-full border border-line bg-panel transition-colors duration-150 hover:border-paper hover:bg-paper hover:text-ink"
          >
            <Icon />
          </a>
        ))}
      </nav>

      <section className="grid gap-3">
        {cards.map(({ title, sub, href, Icon, main }) => (
          <div key={title} data-anim="reveal" className="flex">
            <a
              href={href}
              {...ext(href)}
              className={`${cardBase} ${
                main
                  ? "card-main border-paper bg-paper text-ink after:absolute after:-top-1.25 after:-right-1.25 after:size-3 after:bg-accent"
                  : "border-line bg-panel hover:-translate-y-0.5 hover:border-paper"
              }`}
            >
              <span className={`grid size-11 flex-none place-items-center rounded-[10px] text-lg ${main ? "bg-accent text-ink" : "bg-field"}`}>
                <Icon />
              </span>
              <span className="min-w-0 wrap-anywhere">
                <b className="block text-base">
                  {title}
                  <span className="sr-only">{NEW_TAB}</span>
                </b>
                <small className={`text-[13px] ${main ? "text-ink-soft" : "text-dim"}`}>{sub}</small>
              </span>
              <span className="ml-auto flex-none text-accent"><Chevron /></span>
            </a>
          </div>
        ))}

        {/* E-mail: Alpine copia o endereço e confirma */}
        <div
          data-anim="reveal"
          className="flex gap-2"
          x-data="copyEmail"
        >
          <a href={mailto} className={`${cardBase} border-line bg-panel hover:-translate-y-0.5 hover:border-paper`}>
            <span className="grid size-11 flex-none place-items-center rounded-[10px] bg-field text-lg"><Mail /></span>
            <span className="min-w-0 wrap-anywhere">
              <b className="block text-base">Fale por e-mail</b>
              <small className="text-[13px] text-dim">{EMAIL}</small>
            </span>
          </a>
          <button
            type="button"
            {...{ "x-on:click": "copy" }}
            aria-label="Copiar e-mail"
            className="w-18 flex-none cursor-pointer rounded-2xl border border-line bg-panel text-[13px] font-bold transition-colors hover:border-paper"
          >
            <span aria-live="polite" x-text="label">Copiar</span>
          </button>
        </div>
      </section>

      <footer data-anim="reveal" className="mt-6.5 text-xs text-micro">
        © 2026 KLINSMANN · Todos os direitos reservados
      </footer>
      <Motion />
      <Sound />
    </main>
  );
}
