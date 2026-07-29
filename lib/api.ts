import {
  placeholderCases,
  placeholderCategories,
  placeholderCountryProfiles,
  placeholderMapCases,
  placeholderResilienceStories,
} from "@/lib/placeholders";
import { siteConfig } from "@/lib/site";
import type { AdaptationCase, Category, MapCase } from "@/types/cases";
import type { CountryProfile } from "@/types/country-profiles";
import type { ResilienceStory } from "@/types/stories";

async function getJson<T>(path: string, fallback: T): Promise<T> {
  if (!siteConfig.apiUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${siteConfig.apiUrl}${path}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getMapCases() {
  return getJson<MapCase[]>("/cases/map", placeholderMapCases);
}

export function getCategories() {
  return getJson<Category[]>("/categories", placeholderCategories);
}

export async function getCaseBySlug(slug: string) {
  const fallback = placeholderCases.find((item) => item.slug === slug) ?? placeholderCases[0];
  return getJson<AdaptationCase>(`/cases/${slug}`, fallback);
}

export function getPublishedCases() {
  return getJson<AdaptationCase[]>("/cases", placeholderCases);
}

export function getPublishedStories() {
  return getJson<ResilienceStory[]>("/stories", placeholderResilienceStories);
}

export function getPublishedCountryProfiles() {
  return getJson<CountryProfile[]>("/country-profiles", placeholderCountryProfiles);
}

export function getCountryProfileBySlug(slug: string) {
  const fallback = placeholderCountryProfiles.find((item) => item.slug === slug) ?? null;
  return getJson<CountryProfile | null>(`/country-profiles/${slug}`, fallback);
}

export function getStoryBySlug(slug: string) {
  const fallback = placeholderResilienceStories.find((item) => item.slug === slug) ?? null;
  return getJson<ResilienceStory | null>(`/stories/${slug}`, fallback);
}
