import type { MapInitialFilters } from "@/lib/map-filters";
import type { MapCase } from "@/types/cases";

export function normalizeFilterValue(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

export function uniqueFilterOptions(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  return values.filter((value): value is string => {
    const normalized = value ? normalizeFilterValue(value) : "";
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function getCaseMeasureLabels(item: MapCase) {
  return uniqueFilterOptions([item.measureType, item.category.name]);
}

export function getCaseTerritory(item: MapCase) {
  return item.ecoregion ?? item.locality ?? item.region;
}

export function filterMapCases(cases: MapCase[], filters: MapInitialFilters, riskLabel: (item: MapCase) => string) {
  const matches = (selected: string[] | undefined, values: Array<string | null | undefined>, partial = false) =>
    !selected?.length || selected.some((choice) => values.some((value) => value && (
      partial ? normalizeFilterValue(value).includes(normalizeFilterValue(choice)) : normalizeFilterValue(value) === normalizeFilterValue(choice)
    )));
  const query = normalizeFilterValue(filters.query ?? "");
  return cases.filter((item) => {
    const measures = getCaseMeasureLabels(item);
    const risk = riskLabel(item);
    const text = [item.title, item.shortDescription, item.country, item.region, item.locality, item.ecoregion, item.threat, item.youthRole, risk, ...measures].filter(Boolean).join(" ");
    return (!query || normalizeFilterValue(text).includes(query))
      && matches(filters.country, [item.country])
      && matches(filters.risk, [risk])
      && matches(filters.measure, measures)
      && matches(filters.territory, [getCaseTerritory(item)])
      && matches(filters.actor, [item.youthRole], true);
  });
}
