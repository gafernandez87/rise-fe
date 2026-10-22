"use client";

import { useId, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { defaultLocale, localizedPath, type Locale } from "@/lib/i18n";

const navItems = [
  { href: "https://www.somosclaac.org/", label: "INICIO", active: true },
  { href: "https://www.somosclaac.org/landing-2/", label: "INICIATIVAS" },
  {
    href: "https://www.somosclaac.org/estado-de-las-organizaciones-juveniles-climaticas-en-america-latina-y-el-caribe/",
    label: "INFORME JUVENTUDES LAC",
  },
  { href: "https://www.somosclaac.org/potencia-tu-voz/", label: "POTENCIA TU VOZ", active: false },
  { href: "https://www.climaps.org/", label: "CLIMAPS" },
  { href: "https://miradosveces.somosclaac.org/", label: "CAMPAÑA #MIRADOSVECES" },
];

const riseNavItems = [
  {
    href: "/",
    label: {
      es: "Inicio RISE",
      en: "RISE home",
      pt: "Inicio RISE",
    },
  },
  {
    href: "/mapa",
    label: {
      es: "Mapa",
      en: "Map",
      pt: "Mapa",
    },
  },
  {
    href: "/perfiles",
    label: {
      es: "Perfiles",
      en: "Profiles",
      pt: "Perfis",
    },
  },
  {
    href: "/historias",
    label: {
      es: "Historias",
      en: "Stories",
      pt: "Historias",
    },
  },
  {
    href: "/informe-regional",
    label: {
      es: "Informe regional",
      en: "Regional report",
      pt: "Relatorio regional",
    },
  },
  {
    href: "/metodologia",
    label: {
      es: "Metodología",
      en: "Methodology",
      pt: "Metodologia",
    },
  },
] satisfies {
  href: string;
  label: Record<Locale, string>;
}[];

type SiteHeaderProps = {
  locale?: Locale;
  currentPath?: string;
};

function isRisePathActive(currentPath: string | undefined, href: string) {
  if (!currentPath) {
    return false;
  }

  if (href === "/") {
    return currentPath === "/";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteHeader({ locale = defaultLocale, currentPath }: SiteHeaderProps) {
  const navId = useId();
  const academiaSubmenuId = useId();
  const riseSubmenuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<"academia" | "rise" | null>(null);
  const isAcademiaSubmenuOpen = openSubmenu === "academia";
  const isRiseSubmenuOpen = openSubmenu === "rise";
  const isRiseSectionActive = riseNavItems.some((item) => isRisePathActive(currentPath, item.href));

  function closeMenus() {
    setIsMenuOpen(false);
    setOpenSubmenu(null);
  }

  return (
    <header className={`claac-header${isMenuOpen ? " claac-header--menu-open" : ""}`}>
      <div className="claac-header__overlay" />
      <div className="claac-header__content">
        <Link
          href="https://www.somosclaac.org/"
          className="claac-header__brand"
          aria-label="CLAAC inicio"
          onClick={closeMenus}
        >
          <Image
            src="/brand/organizations/claac.png"
            alt="CLAAC - Coalición para Latinoamérica de Acción Climática"
            width={1920}
            height={1080}
            priority
            className="claac-header__logo"
            loading="eager"
          />
        </Link>
        <button
          className="claac-header__toggle"
          type="button"
          aria-controls={navId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
        <nav id={navId} className="claac-header__nav" aria-label="Principal">
          <Link href={navItems[0].href} className="claac-header__link" onClick={closeMenus}>
            <span>{navItems[0].label}</span>
          </Link>
          <Link href={navItems[1].href} className="claac-header__link" onClick={closeMenus}>
            <span>{navItems[1].label}</span>
          </Link>
          <Link href={navItems[2].href} className="claac-header__link" onClick={closeMenus}>
            <span>{navItems[2].label}</span>
          </Link>
          <div className={`claac-header__menu${isAcademiaSubmenuOpen ? " claac-header__menu--open" : ""}`}>
            <button
              className="claac-header__link claac-header__menu-trigger"
              type="button"
              aria-controls={academiaSubmenuId}
              aria-expanded={isAcademiaSubmenuOpen}
              aria-haspopup="true"
              onClick={() => setOpenSubmenu((current) => (current === "academia" ? null : "academia"))}
            >
              <span>ACADEMIA COP30</span>
              <span className="claac-header__caret" aria-hidden="true" />
            </button>
            <div id={academiaSubmenuId} className="claac-header__submenu">
              <Link
                href="https://www.somosclaac.org/academia-cop-30/"
                className="claac-header__submenu-link"
                onClick={closeMenus}
              >
                PLATAFORMA
              </Link>
            </div>
          </div>
          <div className={`claac-header__menu${isRiseSubmenuOpen ? " claac-header__menu--open" : ""}`}>
            <button
              className="claac-header__link claac-header__menu-trigger claac-header__link--active"
              type="button"
              aria-controls={riseSubmenuId}
              aria-expanded={isRiseSubmenuOpen}
              aria-haspopup="true"
              onClick={() => setOpenSubmenu((current) => (current === "rise" ? null : "rise"))}
            >
              <span>RISE</span>
              <span className="claac-header__caret" aria-hidden="true" />
            </button>
            <div id={riseSubmenuId} className="claac-header__submenu">
              {riseNavItems.map((item) => {
                const isActive = isRisePathActive(currentPath, item.href);

                return (
                  <Link
                    key={item.href}
                    href={localizedPath(item.href, locale)}
                    className={`claac-header__submenu-link${isActive ? " claac-header__submenu-link--active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenus}
                  >
                    {item.label[locale]}
                  </Link>
                );
              })}
            </div>
          </div>
          {navItems.slice(3).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`claac-header__link${item.active ? " claac-header__link--active" : ""}`}
              aria-current={item.active ? "page" : undefined}
              onClick={closeMenus}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
