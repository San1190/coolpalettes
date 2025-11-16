import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generador de Paletas de Colores | Crea Combinaciones Gratis | CoolPalettes",
  description:
    "Descubre paletas de colores armónicas al instante. Pulsa la barra espaciadora para generar nuevas ideas de color para tus proyectos de diseño y programación. Gratis y fácil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
