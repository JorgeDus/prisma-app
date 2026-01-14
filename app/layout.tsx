import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Prisma | Talento, Networking y Emprendimiento",
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
      <body className={`${plusJakarta.variable} ${geistMono.variable} antialiased bg-[#F9FAFB] text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
