import { localizedPath, type Locale } from "@/lib/i18n";

export const mapFilterAliases = {
  country: ["country", "pais"],
  risk: ["risk", "riesgo"],
  measure: ["measure", "medida", "category", "categoria"],
  territory: ["territory"],
  actor: ["actor"],
} as const;

export type MapFilterKey = keyof typeof mapFilterAliases;
export type MapInitialFilters = Partial<Record<MapFilterKey, string[]>> & { query?: string };
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export function readMapInitialFilters(searchParams: SearchParamsRecord): MapInitialFilters {
  const result: MapInitialFilters = {};
  for (const key of Object.keys(mapFilterAliases) as MapFilterKey[]) {
    for (const alias of mapFilterAliases[key]) {
      const raw = searchParams[alias];
      const values = [...new Set((Array.isArray(raw) ? raw : [raw]).map((v) => v?.trim()).filter((v): v is string => Boolean(v)))];
      if (values.length) {
        result[key] = values;
        break;
      }
    }
  }
  const query = searchParams.q;
  result.query = (Array.isArray(query) ? query[0] : query) || undefined;
  return result;
}

export function mapFiltersQuery(filters: MapInitialFilters) {
  const query = new URLSearchParams();
  for (const key of Object.keys(mapFilterAliases) as MapFilterKey[]) {
    for (const value of filters[key] ?? []) query.append(key, value);
  }
  if (filters.query) query.set("q", filters.query);
  return query.toString();
}

export function mapFilterPath(locale: Locale, filter: MapFilterKey, value: string) {
  return localizedPath(`/mapa?${mapFiltersQuery({ [filter]: [value] })}`, locale);
}
