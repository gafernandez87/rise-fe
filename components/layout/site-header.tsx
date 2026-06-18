import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "https://www.somosclaac.org/", label: "INICIO", active: true },
  { href: "https://www.somosclaac.org/landing-2/", label: "INICIATIVAS" },
  {
    href: "https://www.somosclaac.org/estado-de-las-organizaciones-juveniles-climaticas-en-america-latina-y-el-caribe/",
    label: "INFORME JUVENTUDES LAC",
  },
  { href: "https://www.somosclaac.org/potencia-tu-voz/", label: "POTENCIA TU VOZ" },
  { href: "https://www.climaps.org/", label: "CLIMAPS" },
  { href: "https://miradosveces.somosclaac.org/", label: "CAMPAÑA #MIRADOSVECES" },
];

export function SiteHeader() {
  return (
    <header className="claac-header">
      <div className="claac-header__overlay" />
      <div className="claac-header__content">
        <Link href="/" className="claac-header__brand" aria-label="CLAAC inicio">
          <Image
            src="https://www.somosclaac.org/wp-content/uploads/2025/05/Fondos.png"
            alt="CLAAC - Coalicion para Latinoamerica de Accion Climatica"
            width={1920}
            height={1080}
            priority
            className="claac-header__logo"
          />
        </Link>
        <nav className="claac-header__nav" aria-label="Principal">
          <Link
            href={navItems[0].href}
            className="claac-header__link claac-header__link--active"
            aria-current="page"
          >
            <span>{navItems[0].label}</span>
          </Link>
          <Link href={navItems[1].href} className="claac-header__link">
            <span>{navItems[1].label}</span>
          </Link>
          <Link href={navItems[2].href} className="claac-header__link">
            <span>{navItems[2].label}</span>
          </Link>
          <div className="claac-header__menu">
            <button className="claac-header__link claac-header__menu-trigger" type="button" aria-haspopup="true">
              <span>ACADEMIA COP30</span>
              <span className="claac-header__caret" aria-hidden="true" />
            </button>
            <div className="claac-header__submenu">
              <Link href="https://www.somosclaac.org/academia-cop-30/" className="claac-header__submenu-link">
                PLATAFORMA
              </Link>
            </div>
          </div>
          {navItems.slice(3).map((item) => (
            <Link key={item.label} href={item.href} className="claac-header__link">
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
