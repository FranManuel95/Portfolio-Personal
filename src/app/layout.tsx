import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MagicCursor from "../components/MagicCursor";
import SmoothScroll from "../components/SmoothScroll";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fran Perejón — AI Engineer · Agentes de IA y Automatización",
  description:
    "AI Engineer especializado en agentes de IA y RAG en producción, automatización con n8n y código, y desarrollo full-stack con Next.js. Llevo sistemas de IA de la idea a producción.",
  keywords: [
    "AI Engineer", "agentes de IA", "RAG", "MCP Servers", "automatización", "n8n",
    "Claude", "OpenAI", "Gemini", "Next.js", "React", "TypeScript", "Supabase",
    "Pinecone", "full-stack", "Sevilla",
  ],
  authors: [{ name: "Francisco Manuel Perejón Carmona" }],
  openGraph: {
    title: "Fran Perejón — AI Engineer · Agentes de IA y Automatización",
    description:
      "Agentes de IA y pipelines RAG en producción, automatización con n8n y código, y desarrollo full-stack. De la concepción a producción.",
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
  <SmoothScroll />
  <MagicCursor />
  <main className="relative z-10 min-h-dvh">{children}</main> {/* 👈 contenido por encima */}
</body>

    </html>
  );
}
