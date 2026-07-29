import { cookies } from "next/headers";
import { siteConfig } from "@/lib/site";
import type { AdaptationCase } from "@/types/cases";
import type { CountryProfile } from "@/types/country-profiles";
import type { ResilienceStory } from "@/types/stories";

export const backofficeTokenCookie = "rise_backoffice_token";
const backofficeRequestTimeoutMs = 12_000;

export async function fetchBackofficeApi(input: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), backofficeRequestTimeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getBackofficeToken() {
  return (await cookies()).get(backofficeTokenCookie)?.value;
}

export async function getBackofficeCases(token: string) {
  try {
    const response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/cases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return { cases: [] as AdaptationCase[], unauthorized: true, error: false };
    }

    if (!response.ok) {
      return { cases: [] as AdaptationCase[], unauthorized: false, error: true };
    }

    return {
      cases: (await response.json()) as AdaptationCase[],
      unauthorized: false,
      error: false,
    };
  } catch {
    return { cases: [] as AdaptationCase[], unauthorized: false, error: true };
  }
}

export async function getBackofficeStories(token: string) {
  try {
    const response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/stories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return { stories: [] as ResilienceStory[], unauthorized: true, error: false };
    }

    if (!response.ok) {
      return { stories: [] as ResilienceStory[], unauthorized: false, error: true };
    }

    return {
      stories: (await response.json()) as ResilienceStory[],
      unauthorized: false,
      error: false,
    };
  } catch {
    return { stories: [] as ResilienceStory[], unauthorized: false, error: true };
  }
}

export async function getBackofficeCountryProfiles(token: string) {
  try {
    const response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/country-profiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return { countryProfiles: [] as CountryProfile[], unauthorized: true, error: false };
    }

    if (!response.ok) {
      return { countryProfiles: [] as CountryProfile[], unauthorized: false, error: true };
    }

    return {
      countryProfiles: (await response.json()) as CountryProfile[],
      unauthorized: false,
      error: false,
    };
  } catch {
    return { countryProfiles: [] as CountryProfile[], unauthorized: false, error: true };
  }
}
