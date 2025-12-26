import type { Metadata } from "next";
import { Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Prisma | Portafolio de Evidencia Dinámico",
  description: "Plataforma de validación de talento y portafolio de evidencia dinámica con rigor científico y autoridad académica.",
  icons: {
    icon: "/Prisma Icono.png",
    shortcut: "/favicon.ico",
    apple: "/logo192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={`${instrumentSerif.variable} ${geistMono.variable} antialiased bg-[#F9FAFB] text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
