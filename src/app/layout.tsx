import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BackgroundTexture from "@/components/BackgroundTexture";
import Embers from "@/components/Embers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://paulorgdc.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "paulorgdc.dev",
  description: "Portfólio de Paulo Roberto Griggi de Campos — Engenharia de Software.",
  openGraph: {
    title: "paulorgdc.dev · Engenharia de Software",
    description: "Portfólio de Paulo Roberto Griggi de Campos — Engenharia de Software.",
    url: SITE_URL,
    siteName: "paulorgdc.dev",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "paulorgdc.dev · Engenharia de Software",
    description: "Portfólio de Paulo Roberto Griggi de Campos — Engenharia de Software.",
    images: [`${SITE_URL}/og.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#040103",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <BackgroundTexture />
        <Embers />
        {children}
      </body>
    </html>
  );
}
