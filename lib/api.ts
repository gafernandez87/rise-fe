import { notFound } from "next/navigation";
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
  return getJson<MapCase[]>("/cases/map", []);
}

export function getCategories() {
  return getJson<Category[]>("/categories", []);
}

export async function getCaseBySlug(slug: string) {
  const fallback = null;
  const item = await getJson<AdaptationCase | null>(`/cases/${slug}`, fallback);
  if (!item) notFound();
  return item;
}

export function getPublishedCases() {
  return getJson<AdaptationCase[]>("/cases", []);
}

export function getPublishedStories() {
  return getJson<ResilienceStory[]>("/stories", []);
}

export function getPublishedCountryProfiles() {
  return getJson<CountryProfile[]>("/country-profiles", []);
}

export function getCountryProfileBySlug(slug: string) {
  const fallback = null;
  return getJson<CountryProfile | null>(`/country-profiles/${slug}`, fallback);
}

export function getStoryBySlug(slug: string) {
  const fallback = null;
  return getJson<ResilienceStory | null>(`/stories/${slug}`, fallback);
}
