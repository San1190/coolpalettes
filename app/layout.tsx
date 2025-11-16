import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";
import Script from "next/script";
import AdsBanner from "@/components/AdsBanner";
// import AdsBanner from "@/components/AdsBanner";

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
  alternates: { canonical: "https://coolpalettes.vercel.app" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "CoolPalettes | Generador de Paletas",
    description:
      "Genera paletas armónicas con un toque. Copia, bloquea y comparte.",
    url: "https://coolpalettes.vercel.app",
    siteName: "CoolPalettes",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoolPalettes | Generador de Paletas",
    description:
      "Genera paletas armónicas con un toque. Copia, bloquea y comparte.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-2082914258981472"}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script id="ld-json" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "CoolPalettes",
            url: "https://coolpalettes.vercel.app",
            description:
              "Generador de paletas armónicas con copia, bloqueo y compartir",
          })}
        </Script>
        <Chrome>{children}</Chrome>
        <AdsBanner />
      </body>
    </html>
  );
}
