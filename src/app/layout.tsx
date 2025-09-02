import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CursorHalo from "../components/CursorHalo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio FM",
  description: "Portfolio ultradark con transiciones progresivas",
  icons: { icon: "/favicon.png" },
};

// 👇 Ahora el themeColor va aquí (no en metadata)
export const viewport: Viewport = {
  // Puedes dejar un solo color o definir por media query:
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
  // opcionalmente:
  // colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CursorHalo />
        <main className="min-h-dvh">{children}</main>
      </body>
    </html>
  );
}
