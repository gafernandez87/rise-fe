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
    default: "RISE",
    template: "%s | RISE",
  },
  description:
    "Plataforma regional de medidas de adaptacion e historias de resiliencia lideradas por juventudes en America Latina.",
  openGraph: {
    title: "RISE",
    description:
      "Explora casos, perfiles nacionales e historias de resiliencia en America Latina.",
    siteName: "RISE",
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
