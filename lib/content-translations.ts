import type { EditorialMetadata } from "@/types/editorial";

// Only editorial text can override a record; IDs, permissions and URLs stay shared.
export const translatedFields = ["title", "shortDescription", "fullDescription", "country", "region", "locality", "subnationalJurisdiction", "ecoregion", "implementationDate", "threat", "measureType", "scope", "adaptationFocus", "nationalVulnerabilityProfile", "objectives", "proposedSolutions", "beneficiaryCommunities", "youthRole", "results", "contact", "financingType", "localClimateProblem", "nationalSocioPoliticalContext", "strategicAlliances", "enablingFactors", "coBenefits", "scalability", "longTermSustainability", "downloadableDocuments", "riskMethod", "locationMethod", "implementationStage", "sector", "summary", "content", "territory", "mainRisk", "mediaAlt", "name", "storyTitle", "risks", "riskAnalysis", "climateThreats", "exposureAndVulnerabilities", "exposure", "vulnerability", "institutionalFramework", "criticalSectors", "prioritizedZones", "adaptationMeasures", "featuredStory", "sources"] as const;
export function translationField(name: string) {
  const field = name.replace(/^(story|profile)([A-Z])/, (_, _prefix, first: string) => first.toLowerCase());
  return (translatedFields as readonly string[]).includes(field) ? field : null;
}
export function getContentTranslation(record: EditorialMetadata, locale: string) {
  return record.translations?.find((entry) => entry.language === locale);
}

export function hasContentTranslation(record: EditorialMetadata, locale: string) {
  const saved = getContentTranslation(record, locale);
  return Boolean(saved && translatedFields.some((field) => saved[field]?.trim()));
}

export function localizeRecord<T extends EditorialMetadata>(record: T, locale: string): T {
  const saved = getContentTranslation(record, locale);
  if (!saved) return record;
  const patch: Record<string, unknown> = {};
  for (const field of translatedFields) {
    const value = saved[field];
    // Empty translation inputs do not erase populated source fields.
    if (typeof value === "string" && value.trim()) {
      patch[field] = field === "risks" ? value.split(/\r?\n/).filter(Boolean) : value;
    }
  }
  if ("shortDescription" in record) {
    if (!patch.shortDescription && saved.summary?.trim()) patch.shortDescription = saved.summary;
    if (!patch.fullDescription && saved.content?.trim()) patch.fullDescription = saved.content;
  }
  return { ...record, ...patch };
}
