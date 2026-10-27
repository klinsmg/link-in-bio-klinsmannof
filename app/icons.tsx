const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
);

export const Instagram = () => (
  <Svg><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></Svg>
);
export const WhatsApp = () => (
  <Svg><path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z" /><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z" /></Svg>
);
export const Spotify = () => (
  <Svg><circle cx="12" cy="12" r="9" /><path d="M7 9.5c3.5-1 7-.7 10 1M7.5 12.5c3-.8 6-.5 8.5 1M8 15.5c2.5-.6 5-.3 7 .8" /></Svg>
);
export const Mail = () => (
  <Svg><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></Svg>
);
export const Chevron = () => (
  <Svg><path d="m9 6 6 6-6 6" /></Svg>
);
