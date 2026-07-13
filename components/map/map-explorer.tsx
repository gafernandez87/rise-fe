"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { MapLoader } from "@/components/map/map-loader";
import {
  getDictionary,
  getLocalizedContentLists,
  getLocalizedCountries,
  localizedPath,
  type Locale,
} from "@/lib/i18n";
import type { Category, MapCase } from "@/types/cases";

type MapExplorerProps = {
  cases: MapCase[];
  categories: Category[];
  locale: Locale;
};

function getCaseRisk(item: MapCase, locale: Locale) {
  const dict = getDictionary(locale);
  return dict.mapExplorer.riskBySeverity[item.severity];
}

function SelectFilter({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
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
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MapExplorer({ cases, categories, locale }: MapExplorerProps) {
  const dict = getDictionary(locale);
  const content = getLocalizedContentLists(locale);
  const countries = getLocalizedCountries(locale);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [risk, setRisk] = useState("");
  const [measure, setMeasure] = useState("");
  const [territory, setTerritory] = useState("");
  const [actor, setActor] = useState("");
  const [status, setStatus] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(true);

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cases.filter((item) => {
      const textMatch =
        !normalizedQuery ||
        [item.title, item.shortDescription, item.country, item.region, item.category.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const countryMatch = !country || item.country === country;
      const riskMatch = !risk || getCaseRisk(item, locale) === risk;
      const measureMatch = !measure || item.category.name === measure;

      return textMatch && countryMatch && riskMatch && measureMatch;
    });
  }, [cases, country, locale, measure, query, risk]);

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
                {item.country ?? dict.mapExplorer.countryTbd} · {getCaseRisk(item, locale)}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                {item.shortDescription}
              </p>
              <dl className="mt-4 grid gap-2 text-xs text-[color:var(--color-muted)]">
                <div>
                  <dt className="font-semibold text-[color:var(--color-text)]">{dict.mapExplorer.measure}</dt>
                  <dd>{item.category.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[color:var(--color-text)]">{dict.mapExplorer.territory}</dt>
                  <dd>{item.region ?? dict.mapExplorer.territoryFallback}</dd>
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
              options={countries.map((item) => item.name)}
              allLabel={dict.mapExplorer.all}
              onChange={setCountry}
            />
            <SelectFilter
              label={dict.mapExplorer.climateRisk}
              value={risk}
              options={content.climateRisks}
              allLabel={dict.mapExplorer.all}
              onChange={setRisk}
            />
            <SelectFilter
              label={dict.mapExplorer.measureType}
              value={measure}
              options={[...new Set([...categories.map((item) => item.name), ...content.adaptationMeasureTypes])]}
              allLabel={dict.mapExplorer.all}
              onChange={setMeasure}
            />
            <SelectFilter
              label={dict.mapExplorer.ecosystem}
              value={territory}
              options={content.territories}
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
              onClick={() => {
                setQuery("");
                setCountry("");
                setRisk("");
                setMeasure("");
                setTerritory("");
                setActor("");
                setStatus("");
              }}
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
