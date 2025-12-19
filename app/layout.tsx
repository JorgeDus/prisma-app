import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prisma - Donde el talento universitario encuentra su luz",
  description: "Prisma es la plataforma donde estudiantes universitarios construyen perfiles profesionales integrales, conectan con oportunidades reales, y encuentran colaboradores para crear juntos.",
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
    <html lang="es">
      <head>
        <meta name="theme-color" content="#9333ea" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
