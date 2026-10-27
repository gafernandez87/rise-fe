"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CountryLabel } from "@/components/countries/country-label";
import { MapLoader } from "@/components/map/map-loader";
import {
  getDictionary,
  getLocalizedContentLists,
  localizedPath,
  type Locale,
} from "@/lib/i18n";
import {
  mapFiltersQuery,
  readMapInitialFilters,
  type MapInitialFilters,
  type MapFilterKey,
} from "@/lib/map-filters";
import {
  getFilterSuggestions,
  filterMapCases,
  normalizeFilterValue,
  uniqueFilterOptions,
  getCaseMeasureLabels,
  getCaseTerritory,
} from "@/lib/map-search";
import { getUiCopy } from "@/lib/ui-copy";
import { formatCountryNameWithFlag } from "@/lib/rise-content";
import type { Category, MapCase } from "@/types/cases";

type MapExplorerProps = {
  cases: MapCase[];
  categories: Category[];
  locale: Locale;
};

function getCaseRisk(item: MapCase, locale: Locale) {
  return item.threat ?? getUiCopy(locale).unknownThreat;
}

function getCaseMeasure(item: MapCase) {
  return getCaseMeasureLabels(item)[0] ?? item.category.name;
}

function MultiFilter({
  label,
  selected,
  options,
  onChange,
  formatOption,
}: {
  label: string;
  selected: string[];
  options: string[];
  onChange: (value: string[]) => void;
  formatOption?: (option: string) => string;
}) {
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="max-h-44 overflow-y-auto rounded-md border border-[color:var(--color-border)] p-2">
        {options.map((option) => {
          const checked = selected.some(
            (value) =>
              normalizeFilterValue(value) === normalizeFilterValue(option),
          );
          return (
            <label
              key={option}
              className="flex min-h-10 cursor-pointer items-center gap-2 rounded px-1 text-sm"
            >
              <input
                type="checkbox"
                checked={checked}
                className="h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                onChange={() =>
                  onChange(
                    checked
                      ? selected.filter(
                          (value) =>
                            normalizeFilterValue(value) !==
                            normalizeFilterValue(option),
                        )
                      : [...selected, option],
                  )
                }
              />
              <span className="min-w-0 break-words">
                {formatOption ? formatOption(option) : option}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function MapExplorer({ cases, categories, locale }: MapExplorerProps) {
  const dict = getDictionary(locale);
  const content = getLocalizedContentLists(locale);
  const ui = getUiCopy(locale);
  const searchParams = useSearchParams();
  const filters = readMapInitialFilters(
    Object.fromEntries(
      [...searchParams.keys()].map((key) => [key, searchParams.getAll(key)]),
    ),
  );
  const pathname = usePathname();
  const threatOptions = uniqueFilterOptions([
    ...cases.map((item) => getCaseRisk(item, locale)),
    ...(filters.risk ?? []),
  ]);
  const measureOptions = uniqueFilterOptions([
    ...categories.map((item) => item.name),
    ...cases.flatMap(getCaseMeasureLabels),
    ...(filters.measure ?? []),
  ]);
  const countryOptions = uniqueFilterOptions([
    ...cases.map((item) => item.country),
    ...(filters.country ?? []),
  ]);
  const territoryOptions = uniqueFilterOptions([
    ...cases.map(getCaseTerritory),
    ...(filters.territory ?? []),
  ]);
  const actorOptions = uniqueFilterOptions([
    ...content.actors.filter((actor) =>
      cases.some((item) =>
        normalizeFilterValue(item.youthRole ?? "").includes(
          normalizeFilterValue(actor),
        ),
      ),
    ),
    ...(filters.actor ?? []),
  ]);
  const updateFilters = (next: MapInitialFilters) => {
    const query = mapFiltersQuery(next);
    window.history.replaceState(
      null,
      "",
      `${pathname}${query ? `?${query}` : ""}`,
    );
  };
  const selectFilter = (key: MapFilterKey, values: string[]) =>
    updateFilters({ ...filters, [key]: values });
  const query = filters.query ?? "";
  const [filtersVisible, setFiltersVisible] = useState(true);
  const filtersPanelId = useId();
  const filtersToggleRef = useRef<HTMLButtonElement>(null);

  const filteredCases = filterMapCases(cases, filters, (item) =>
    getCaseRisk(item, locale),
  );
  const [view, setView] = useState<"auto" | "list" | "map">("auto");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLElement>());
  const activeId = filteredCases.some((item) => item.id === selectedId)
    ? selectedId
    : null;
  const suggestions = filteredCases.length
    ? []
    : getFilterSuggestions(cases, filters, (item) => getCaseRisk(item, locale));
  function selectMarker(id: string) {
    setSelectedId(id);
    cards.current
      .get(id)
      ?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }
  const clearFilters = () => updateFilters({});
  const filterGroups = [
    {
      key: "country",
      label: dict.mapExplorer.country,
      options: countryOptions,
      formatOption: formatCountryNameWithFlag,
    },
    {
      key: "risk",
      label: dict.mapExplorer.climateRisk,
      options: threatOptions,
    },
    {
      key: "measure",
      label: dict.mapExplorer.measureType,
      options: measureOptions,
    },
    {
      key: "territory",
      label: dict.mapExplorer.ecosystem,
      options: territoryOptions,
    },
    { key: "actor", label: dict.mapExplorer.actor, options: actorOptions },
  ] satisfies Array<{
    key: MapFilterKey;
    label: string;
    options: string[];
    formatOption?: (value: string) => string;
  }>;
  const activeFilters = filterGroups.flatMap((group) =>
    (filters[group.key] ?? []).map((value) => ({
      id: `${group.key}:${value}`,
      label: `${group.label}: ${value}`,
      remove: () =>
        selectFilter(
          group.key,
          (filters[group.key] ?? []).filter((item) => item !== value),
        ),
    })),
  );
  if (query)
    activeFilters.unshift({
      id: "query",
      label: `${dict.mapExplorer.search}: ${query}`,
      remove: () => updateFilters({ ...filters, query: undefined }),
    });

  return (
    <div
      className={`rise-map-explorer${filtersVisible ? "" : " rise-map-explorer--collapsed"}`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 xl:col-span-full">
        <p role="status" className="text-sm text-[color:var(--color-muted)]">
          {filteredCases.length} {dict.mapExplorer.of} {cases.length}{" "}
          {dict.mapExplorer.visibleCases}
        </p>
        <button
          ref={filtersToggleRef}
          type="button"
          onClick={() => setFiltersVisible((current) => !current)}
          className="rise-action inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold"
          aria-expanded={filtersVisible}
          aria-controls={filtersPanelId}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          {filtersVisible
            ? dict.mapExplorer.hideFilters
            : dict.mapExplorer.showFilters}
        </button>
      </div>

      <div
        id={filtersPanelId}
        className="rise-map-filters"
        aria-hidden={!filtersVisible}
        inert={!filtersVisible}
      >
        <div className="min-h-0 overflow-hidden">
          <aside
            aria-label={dict.mapExplorer.filters}
            className="min-w-0 rounded-lg border border-[color:var(--color-border)] bg-white p-4 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                    {dict.mapExplorer.filters}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                    {filteredCases.length} {dict.mapExplorer.of} {cases.length}{" "}
                    {dict.mapExplorer.visibleCases}
                  </p>
                </div>
              </div>
              <label className="grid gap-1 text-sm font-medium">
                {dict.mapExplorer.search}
                <input
                  value={query}
                  onChange={(event) =>
                    updateFilters({ ...filters, query: event.target.value })
                  }
                  className="min-w-0 w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm font-normal"
                  placeholder={dict.mapExplorer.searchPlaceholder}
                />
              </label>
              <p className="text-xs leading-5 text-[color:var(--color-muted)]">
                {ui.filterHelp}
              </p>
              {filterGroups
                .filter((group) => group.options.length > 0)
                .map((group) => (
                  <MultiFilter
                    key={group.key}
                    label={group.label}
                    options={group.options}
                    selected={filters[group.key] ?? []}
                    onChange={(values) => selectFilter(group.key, values)}
                    formatOption={group.formatOption}
                  />
                ))}
              <button
                type="button"
                onClick={clearFilters}
                className="rise-action w-full rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
              >
                {dict.mapExplorer.clearFilters}
              </button>
            </div>
          </aside>
        </div>
      </div>

      <section className="min-w-0 space-y-4 xl:col-start-1 xl:row-start-2">
        <p className="rounded-md bg-[color:var(--color-surface-muted)] p-3 text-sm">
          {ui.mapNote}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className="rise-action rounded border bg-white px-4 py-2 text-sm font-semibold"
          >
            {ui.listView}
          </button>
          {!mapFailed ? (
            <button
              type="button"
              aria-pressed={view === "map"}
              onClick={() => setView("map")}
              className="rise-action rounded border bg-white px-4 py-2 text-sm font-semibold"
            >
              {ui.mapView}
            </button>
          ) : null}
        </div>
        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={filter.remove}
                aria-label={`${ui.removeFilter}: ${filter.label}`}
                className="rise-action gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1 text-xs"
              >
                {filter.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        ) : null}
        {filteredCases.length === 0 ? (
          <div
            role="status"
            className="rounded-lg border border-[color:var(--color-border)] bg-white p-6"
          >
            <h2 className="text-lg font-semibold">{ui.noResults}</h2>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              {ui.noResultsHelp}
            </p>
            {suggestions.length ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm">{ui.suggestions}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.key}:${suggestion.value}`}
                      type="button"
                      onClick={() => updateFilters(suggestion.filters)}
                      className="rise-action rounded border px-3 py-2 text-sm"
                    >
                      {ui.removeFilter}:{" "}
                      {filterGroups.find(
                        (group) => group.key === suggestion.key,
                      )?.label ?? dict.mapExplorer.search}
                      : {suggestion.value} · {suggestion.count}{" "}
                      {ui.availableResults}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {activeFilters.length > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rise-action mt-4 rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
              >
                {dict.mapExplorer.clearFilters}
              </button>
            ) : null}
          </div>
        ) : null}
        {mapFailed ? (
          <p role="status" className="rounded border bg-white p-4 text-sm">
            {ui.mapFailed}
          </p>
        ) : view !== "list" ? (
          <div
            ref={mapRef}
            className={`${view === "auto" ? "hidden md:block " : ""}overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm`}
          >
            <MapLoader
              cases={filteredCases}
              layoutSignal={filtersVisible}
              locale={locale}
              selectedId={activeId}
              onSelect={selectMarker}
              onError={() => setMapFailed(true)}
            />
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCases.map((item) => (
            <article
              key={item.id}
              ref={(node) => {
                if (node) cards.current.set(item.id, node);
                else cards.current.delete(item.id);
              }}
              className={`rise-card rounded-lg border bg-white p-4 ${activeId === item.id ? "border-[color:var(--color-primary)] ring-2 ring-[color:var(--color-primary)]" : "border-[color:var(--color-border)]"}`}
            >
              {!mapFailed ? (
                <button
                  type="button"
                  aria-pressed={activeId === item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setView("map");
                    requestAnimationFrame(() =>
                      mapRef.current?.scrollIntoView({ block: "nearest" }),
                    );
                  }}
                  className="rise-action mb-3 rounded border px-3 py-2 text-sm"
                >
                  {ui.selectCase}
                </button>
              ) : null}
              {item.coverImageUrl ? (
                <Image
                  src={item.coverImageUrl}
                  alt={`${ui.imageAlt}: ${item.title}`}
                  width={640}
                  height={360}
                  unoptimized
                  className="mb-4 h-40 w-full rounded-md object-cover"
                />
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                  <CountryLabel
                    country={item.country}
                    fallback={dict.mapExplorer.countryTbd}
                  />
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
                  <dt className="font-semibold text-[color:var(--color-text)]">
                    {dict.mapExplorer.measure}
                  </dt>
                  <dd>{getCaseMeasure(item)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[color:var(--color-text)]">
                    {dict.mapExplorer.territory}
                  </dt>
                  <dd>
                    {getCaseTerritory(item) ??
                      dict.mapExplorer.territoryFallback}
                  </dd>
                </div>
                {item.youthRole ? (
                  <div>
                    <dt className="font-semibold">{ui.youthRole}</dt>
                    <dd className="line-clamp-3">{item.youthRole}</dd>
                  </div>
                ) : null}
              </dl>
              <Link
                href={localizedPath(`/casos/${item.slug}`, locale)}
                className="rise-action mt-4 inline-flex rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                {dict.mapExplorer.viewFullCase}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
