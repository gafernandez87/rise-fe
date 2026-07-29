import { localizedPath, type Locale } from "@/lib/i18n";

export type MapInitialFilters = {
  risk?: string;
  measure?: string;
};

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

const mapFilterAliases = {
  risk: ["risk", "riesgo"],
  measure: ["measure", "medida", "category", "categoria"],
} as const;

function firstSearchParamValue(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const normalizedValue = firstValue?.trim();

  return normalizedValue || undefined;
}

function readAliasedSearchParam(
  searchParams: SearchParamsRecord,
  aliases: readonly string[],
) {
  for (const alias of aliases) {
    const value = firstSearchParamValue(searchParams[alias]);

    if (value) {
      return value;
    }
  }

  return undefined;
}

export function readMapInitialFilters(searchParams: SearchParamsRecord): MapInitialFilters {
  return {
    risk: readAliasedSearchParam(searchParams, mapFilterAliases.risk),
    measure: readAliasedSearchParam(searchParams, mapFilterAliases.measure),
  };
}

export function mapFilterPath(locale: Locale, filter: keyof MapInitialFilters, value: string) {
  const query = new URLSearchParams({ [filter]: value });

  return localizedPath(`/mapa?${query.toString()}`, locale);
}
