"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CountryLabel } from "@/components/countries/country-label";
import { MapLoader } from "@/components/map/map-loader";
import {
  getDictionary,
  getLocalizedContentLists,
  getLocalizedCountries,
  localizedPath,
  type Locale,
} from "@/lib/i18n";
import type { MapInitialFilters } from "@/lib/map-filters";
import { formatCountryNameWithFlag } from "@/lib/rise-content";
import type { Category, MapCase } from "@/types/cases";

type MapExplorerProps = {
  cases: MapCase[];
  categories: Category[];
  initialFilters?: MapInitialFilters;
  locale: Locale;
};

function getCaseRisk(item: MapCase, locale: Locale) {
  const dict = getDictionary(locale);
  return item.threat ?? dict.mapExplorer.riskBySeverity[item.severity];
}

function normalizeFilterValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function uniqueFilterOptions(values: Array<string | null | undefined>) {
  const seenValues = new Set<string>();

  return values.filter((value): value is string => {
    const normalizedValue = value ? normalizeFilterValue(value) : "";

    if (!normalizedValue || seenValues.has(normalizedValue)) {
      return false;
    }

    seenValues.add(normalizedValue);
    return true;
  });
}

function filtersMatch(option: string, value: string) {
  return normalizeFilterValue(option) === normalizeFilterValue(value);
}

function resolveFilterOption(options: string[], value?: string) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return "";
  }

  return options.find((option) => filtersMatch(option, normalizedValue)) ?? normalizedValue;
}

function getCaseMeasureLabels(item: MapCase) {
  return uniqueFilterOptions([item.measureType, item.category.name]);
}

function getCaseMeasure(item: MapCase) {
  return getCaseMeasureLabels(item)[0] ?? item.category.name;
}

function getCaseTerritory(item: MapCase) {
  return item.ecoregion ?? item.locality ?? item.region;
}

function SelectFilter({
  label,
  value,
  options,
  allLabel,
  onChange,
  formatOption,
}: {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
  formatOption?: (option: string) => string;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm font-normal"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption ? formatOption(option) : option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MapExplorer({ cases, categories, initialFilters, locale }: MapExplorerProps) {
  const dict = getDictionary(locale);
  const content = getLocalizedContentLists(locale);
  const countries = getLocalizedCountries(locale);
  const router = useRouter();
  const pathname = usePathname();
  const threatOptions = useMemo(
    () => uniqueFilterOptions([...cases.map((item) => getCaseRisk(item, locale)), ...content.climateRisks, initialFilters?.risk]),
    [cases, content.climateRisks, initialFilters?.risk, locale],
  );
  const measureOptions = useMemo(
    () =>
      uniqueFilterOptions([
        ...categories.map((item) => item.name),
        ...cases.flatMap(getCaseMeasureLabels),
        ...content.adaptationMeasureTypes,
        initialFilters?.measure,
      ]),
    [cases, categories, content.adaptationMeasureTypes, initialFilters?.measure],
  );
  const countryOptions = useMemo(
    () => uniqueFilterOptions([...countries.map((item) => item.name), ...cases.map((item) => item.country), initialFilters?.country]),
    [cases, countries, initialFilters?.country],
  );
  const territoryOptions = useMemo(
    () => uniqueFilterOptions([...cases.map(getCaseTerritory), ...content.territories]),
    [cases, content.territories],
  );
  const initialCountry = resolveFilterOption(countryOptions, initialFilters?.country);
  const initialRisk = resolveFilterOption(threatOptions, initialFilters?.risk);
  const initialMeasure = resolveFilterOption(measureOptions, initialFilters?.measure);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(initialCountry);
  const [risk, setRisk] = useState(initialRisk);
  const [measure, setMeasure] = useState(initialMeasure);
  const [territory, setTerritory] = useState("");
  const [actor, setActor] = useState("");
  const [status, setStatus] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(true);

  const filteredCases = useMemo(() => {
    const normalizedQuery = normalizeFilterValue(query);

    return cases.filter((item) => {
      const caseRisk = getCaseRisk(item, locale);
      const caseMeasureLabels = getCaseMeasureLabels(item);
      const textMatch =
        !normalizedQuery ||
        [
          item.title,
          item.shortDescription,
          item.country,
          item.region,
          item.locality,
          item.ecoregion,
          item.threat,
          caseRisk,
          ...caseMeasureLabels,
        ]
          .filter(Boolean)
          .join(" ")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(normalizedQuery);

      const countryMatch = !country || Boolean(item.country && filtersMatch(item.country, country));
      const riskMatch = !risk || filtersMatch(caseRisk, risk);
      const measureMatch = !measure || caseMeasureLabels.some((label) => filtersMatch(label, measure));
      const territoryMatch = !territory || getCaseTerritory(item) === territory;
      const actorMatch = !actor || Boolean(item.youthRole?.toLowerCase().includes(actor.toLowerCase()));

      return textMatch && countryMatch && riskMatch && measureMatch && territoryMatch && actorMatch;
    });
  }, [actor, cases, country, locale, measure, query, risk, territory]);

  const clearFilters = () => {
    setQuery("");
    setCountry("");
    setRisk("");
    setMeasure("");
    setTerritory("");
    setActor("");
    setStatus("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className={filtersVisible ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]" : "grid gap-6"}>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[color:var(--color-muted)]">
            {filteredCases.length} {dict.mapExplorer.of} {cases.length} {dict.mapExplorer.visibleCases}
          </p>
          <button
            type="button"
            onClick={() => setFiltersVisible((current) => !current)}
            className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold"
            aria-expanded={filtersVisible}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            {filtersVisible ? dict.mapExplorer.hideFilters : dict.mapExplorer.showFilters}
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm">
          <MapLoader cases={filteredCases} layoutSignal={filtersVisible} locale={locale} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCases.map((item) => (
            <article key={item.id} className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                  <CountryLabel country={item.country} fallback={dict.mapExplorer.countryTbd} />
                  <span aria-hidden="true">·</span>
                  <span>{getCaseRisk(item, locale)}</span>
                </span>
              </p>
              <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                {item.shortDescription}
              </p>
              <dl className="mt-4 grid gap-2 text-xs text-[color:var(--color-muted)]">
                <div>
                  <dt className="font-semibold text-[color:var(--color-text)]">{dict.mapExplorer.measure}</dt>
                  <dd>{getCaseMeasure(item)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[color:var(--color-text)]">{dict.mapExplorer.territory}</dt>
                  <dd>{getCaseTerritory(item) ?? dict.mapExplorer.territoryFallback}</dd>
                </div>
              </dl>
              <Link
                href={localizedPath(`/casos/${item.slug}`, locale)}
                className="mt-4 inline-flex rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                {dict.mapExplorer.viewFullCase}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {filtersVisible ? (
        <aside className="h-fit rounded-lg border border-[color:var(--color-border)] bg-white p-4 shadow-sm xl:sticky xl:top-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {dict.mapExplorer.filters}
                </p>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                  {filteredCases.length} {dict.mapExplorer.of} {cases.length} {dict.mapExplorer.visibleCases}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFiltersVisible(false)}
                className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold"
              >
                {dict.mapExplorer.hideFilters}
              </button>
            </div>
            <label className="grid gap-1 text-sm font-medium">
              {dict.mapExplorer.search}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm font-normal"
                placeholder={dict.mapExplorer.searchPlaceholder}
              />
            </label>
            <SelectFilter
              label={dict.mapExplorer.country}
              value={country}
              options={countryOptions}
              allLabel={dict.mapExplorer.all}
              onChange={setCountry}
              formatOption={formatCountryNameWithFlag}
            />
            <SelectFilter
              label={dict.mapExplorer.climateRisk}
              value={risk}
              options={threatOptions}
              allLabel={dict.mapExplorer.all}
              onChange={setRisk}
            />
            <SelectFilter
              label={dict.mapExplorer.measureType}
              value={measure}
              options={measureOptions}
              allLabel={dict.mapExplorer.all}
              onChange={setMeasure}
            />
            <SelectFilter
              label={dict.mapExplorer.ecosystem}
              value={territory}
              options={territoryOptions}
              allLabel={dict.mapExplorer.all}
              onChange={setTerritory}
            />
            <SelectFilter
              label={dict.mapExplorer.actor}
              value={actor}
              options={content.actors}
              allLabel={dict.mapExplorer.all}
              onChange={setActor}
            />
            <SelectFilter
              label={dict.mapExplorer.contentStatus}
              value={status}
              options={[...dict.mapExplorer.statusOptions]}
              allLabel={dict.mapExplorer.all}
              onChange={setStatus}
            />
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
            >
              {dict.mapExplorer.clearFilters}
            </button>
            <div className="rounded-md bg-[color:var(--color-surface-muted)] p-3 text-xs leading-5 text-[color:var(--color-muted)]">
              {dict.mapExplorer.preparedFilters}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
