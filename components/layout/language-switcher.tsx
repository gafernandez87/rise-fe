"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getDictionary,
  localizedPath,
  type Locale,
} from "@/lib/i18n";

const displayLocales: Locale[] = ["en", "pt", "es"];

const flags: Record<Locale, string> = {
  en: "🇺🇸",
  pt: "🇧🇷",
  es: "🇪🇸",
};

export function LanguageSwitcher({
  locale,
  currentPath,
}: {
  locale: Locale;
  currentPath: string;
}) {
  const dict = getDictionary(locale);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="language-switcher" aria-label={dict.language.label}>
      {isOpen ? (
        <div className="language-switcher__panel">
        {displayLocales.map((item) => (
          <Link
            key={item}
            href={localizedPath(currentPath, item)}
              className={`language-switcher__flag${item === locale ? " language-switcher__flag--active" : ""}`}
            hrefLang={item}
            aria-current={item === locale ? "page" : undefined}
              aria-label={dict.language[item === "es" ? "spanish" : item === "en" ? "english" : "portuguese"]}
              onClick={() => setIsOpen(false)}
          >
              <span aria-hidden="true">{flags[item]}</span>
          </Link>
        ))}
      </div>
      ) : null}
      <button
        className="language-switcher__trigger"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        EN/ES/PT
      </button>
    </nav>
  );
}
