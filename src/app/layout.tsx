import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CursorHalo from "../components/CursorHalo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fran Perejón — Desarrollador Web & Especialista en IA",
  description:
    "Desarrollador Web y Especialista en IA Aplicada. Diseño sistemas completos con Next.js, agentes conversacionales, automatización con n8n y arquitecturas RAG escalables.",
  keywords: [
    "desarrollador web", "IA generativa", "automatización", "Next.js", "React",
    "TypeScript", "Supabase", "n8n", "RAG", "agentes IA", "VAPI", "OpenAI", "Sevilla",
  ],
  authors: [{ name: "Francisco Manuel Perejón Carmona" }],
  openGraph: {
    title: "Fran Perejón — Desarrollador Web & Especialista en IA",
    description:
      "Diseño y construyo sistemas completos: apps web, agentes conversacionales, flujos automatizados y arquitecturas de IA escalables.",
    type: "website",
    locale: "es_ES",
  },
  icons: { icon: "/favicon.webp" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      
<body className={`${geistSans.variable} ${geistMono.variable} antialiased px-4`}>
  <CursorHalo
  
  />
  <main className="relative z-10 min-h-dvh">{children}</main> {/* 👈 contenido por encima */}
</body>

    </html>
  );
}
