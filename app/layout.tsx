import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const description = "Web Design x Google: seu negócio em primeiro lugar nas pesquisas e IAs. Agende uma reunião.";

// Domínio público para o og:image sair absoluto. Na Vercel vem sozinho; em outra hospedagem, defina NEXT_PUBLIC_SITE_URL.
const site = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "KLINSMANN · Links",
  referrer: "strict-origin-when-cross-origin",
  description,
  openGraph: { type: "website", title: "Klinsmann · Web Design x Google", description },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0B0B0B", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen justify-center bg-bg px-4 py-10 font-sans text-paper antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
