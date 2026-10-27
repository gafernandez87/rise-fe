import { CountryLabel } from "@/components/countries/country-label";
import { countryProfileSections, countryProfileSectionValue } from "@/lib/country-profiles";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { CountryProfile } from "@/types/country-profiles";

export function CountryProfileSections({ profile, locale }: { profile: CountryProfile; locale: Locale }) {
  const dict = getDictionary(locale).profiles;
  const fallback = `${dict.placeholderPrefix} ${profile.name}. ${dict.placeholderSuffix}`;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {countryProfileSections.map(({ field }) => (
        <article key={field} className="min-w-0 rounded-lg border border-[color:var(--color-border)] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{dict.sections[field]}</h2>
            <CountryLabel country={profile.name} className="text-sm font-semibold text-[color:var(--color-primary)]" />
          </div>
          <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-[color:var(--color-muted)]">
            {countryProfileSectionValue(profile, field) || fallback}
          </p>
        </article>
      ))}
    </div>
  );
}
