import type { CountryProfile } from "@/types/country-profiles";

// Shared by the form, preview, and public page so sections cannot drift apart.
export const countryProfileSections = [
  { field: "summary", formName: "profileSummary" },
  { field: "climateThreats", formName: "profileClimateThreats" },
  { field: "exposure", formName: "profileExposure" },
  { field: "vulnerability", formName: "profileVulnerability" },
  { field: "institutionalFramework", formName: "profileInstitutionalFramework" },
  { field: "criticalSectors", formName: "profileCriticalSectors" },
  { field: "prioritizedZones", formName: "profilePrioritizedZones" },
  { field: "adaptationMeasures", formName: "profileAdaptationMeasures" },
  { field: "featuredStory", formName: "profileFeaturedStory" },
  { field: "sources", formName: "profileSources" },
] as const;

export type CountryProfileSectionField = (typeof countryProfileSections)[number]["field"];

export function countryProfileSectionValue(profile: CountryProfile | undefined, field: CountryProfileSectionField): string {
  if (!profile) return "";

  // Null means the section has not been edited yet. An empty string is an
  // intentional deletion and must not bring back the older content.
  const value = profile[field];
  if (value != null) return value;

  switch (field) {
    case "climateThreats": return profile.risks.join(", ");
    case "exposure": return profile.exposureAndVulnerabilities ?? "";
    case "vulnerability": return profile.riskAnalysis ?? "";
    case "criticalSectors": return profile.sector;
    case "prioritizedZones": return profile.territory;
    case "featuredStory": return profile.storyTitle ?? "";
    default: return "";
  }
}

export function countryProfileSectionsPayload(formData: FormData) {
  const payload: Partial<Record<CountryProfileSectionField, string>> = {};
  for (const { field, formName } of countryProfileSections) {
    const value = formData.get(formName);
    if (typeof value === "string") payload[field] = value.trim();
  }
  return payload;
}
