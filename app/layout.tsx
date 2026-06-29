import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const outfit = localFont({
  src: [
    {
      path: "./fonts/Outfit-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Outfit-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Outfit-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Outfit-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Outfit-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Outfit-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Outfit-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
  display: "swap",
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
    <html lang="es" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
