"use client";

import { useId, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "https://www.somosclaac.org/", label: "INICIO", active: true },
  { href: "https://www.somosclaac.org/landing-2/", label: "INICIATIVAS" },
  {
    href: "https://www.somosclaac.org/estado-de-las-organizaciones-juveniles-climaticas-en-america-latina-y-el-caribe/",
    label: "INFORME JUVENTUDES LAC",
  },
  { href: "https://www.somosclaac.org/potencia-tu-voz/", label: "POTENCIA TU VOZ", active: true },
  { href: "https://www.climaps.org/", label: "CLIMAPS" },
  { href: "https://miradosveces.somosclaac.org/", label: "CAMPAÑA #MIRADOSVECES" },
];

export function SiteHeader() {
  const navId = useId();
  const submenuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  function closeMenus() {
    setIsMenuOpen(false);
    setIsSubmenuOpen(false);
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
            alt="CLAAC - Coalicion para Latinoamerica de Accion Climatica"
            width={1920}
            height={1080}
            priority
            className="claac-header__logo"
          />
        </Link>
        <button
          className="claac-header__toggle"
          type="button"
          aria-controls={navId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
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
          <div className={`claac-header__menu${isSubmenuOpen ? " claac-header__menu--open" : ""}`}>
            <button
              className="claac-header__link claac-header__menu-trigger"
              type="button"
              aria-controls={submenuId}
              aria-expanded={isSubmenuOpen}
              aria-haspopup="true"
              onClick={() => setIsSubmenuOpen((current) => !current)}
            >
              <span>ACADEMIA COP30</span>
              <span className="claac-header__caret" aria-hidden="true" />
            </button>
            <div id={submenuId} className="claac-header__submenu">
              <Link
                href="https://www.somosclaac.org/academia-cop-30/"
                className="claac-header__submenu-link"
                onClick={closeMenus}
              >
                PLATAFORMA
              </Link>
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
