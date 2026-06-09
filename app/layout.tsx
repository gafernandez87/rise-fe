import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Rise",
    template: "%s | Rise",
  },
  description:
    "Mapa interactivo de casos de adaptacion al cambio climatico en Latinoamerica.",
  openGraph: {
    title: "Rise",
    description:
      "Explora casos de adaptacion al cambio climatico en Latinoamerica.",
    siteName: "Rise",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
