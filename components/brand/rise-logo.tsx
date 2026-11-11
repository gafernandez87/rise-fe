import Image from "next/image";
import type { Locale } from "@/lib/i18n";

const logos = {
  es: {
    src: "/brand/elements/rise-logo-red-es.svg",
    alt: "RISE - Resiliencia, Innovación, Saber y Empoderamiento",
    width: 577,
    height: 312,
  },
  en: {
    src: "/brand/elements/rise-logo-red-en.svg",
    alt: "RISE - Resilience through Innovation, Science and Empowerment",
    width: 478,
    height: 209,
  },
  pt: {
    src: "/brand/elements/rise-logo-red-pt.svg",
    alt: "RISE - Resiliência, Inovação, Saber e Empoderamento",
    width: 577,
    height: 312,
  },
} satisfies Record<Locale, { src: string; alt: string; width: number; height: number }>;

type RiseLogoProps = {
  locale: Locale;
  className?: string;
  decorative?: boolean;
  preload?: boolean;
};

export function RiseLogo({ locale, className, decorative = false, preload = false }: RiseLogoProps) {
  const logo = logos[locale];

  return (
    <Image
      src={logo.src}
      alt={decorative ? "" : logo.alt}
      width={logo.width}
      height={logo.height}
      className={className}
      aria-hidden={decorative || undefined}
      preload={preload}
      unoptimized
    />
  );
}
