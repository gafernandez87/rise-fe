import { placeholderCases, placeholderCategories, placeholderMapCases } from "@/lib/placeholders";
import { siteConfig } from "@/lib/site";
import type { AdaptationCase, Category, MapCase } from "@/types/cases";

async function getJson<T>(path: string, fallback: T): Promise<T> {
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
