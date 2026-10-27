import type { Metadata, Viewport } from "next";
import "./globals.css";

const description = "Web Design x Google: seu negócio em primeiro lugar nas pesquisas e IAs. Agende uma reunião.";

export const metadata: Metadata = {
  title: "KLINSMANN · Links",
  referrer: "strict-origin-when-cross-origin",
  description,
  openGraph: { type: "website", title: "Klinsmann · Web Design x Google", description },
};

export const viewport: Viewport = { themeColor: "#0B0B0B", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen justify-center bg-bg px-4 py-10 font-sans text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
