import type { Locale } from "@/lib/i18n";

// Keep the header submenu and public navigation in sync.
export const riseNavItems = [
  { href: "/", label: { es: "Inicio", en: "Home", pt: "Início" } },
  { href: "/mapa", label: { es: "Explorar", en: "Explore", pt: "Explorar" } },
  { href: "/perfiles", label: { es: "Países", en: "Countries", pt: "Países" } },
  { href: "/historias", label: { es: "Historias", en: "Stories", pt: "Histórias" } },
  { href: "/metodologia", label: { es: "Metodología", en: "Methodology", pt: "Metodologia" } },
  { href: "/#sobre-rise", label: { es: "Acerca de RISE", en: "About RISE", pt: "Sobre o RISE" } },
] satisfies { href: string; label: Record<Locale, string> }[];
