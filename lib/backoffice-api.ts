import { cookies } from "next/headers";
import { siteConfig } from "@/lib/site";
import type { AdaptationCase } from "@/types/cases";

export const backofficeTokenCookie = "rise_backoffice_token";

export async function getBackofficeToken() {
  return (await cookies()).get(backofficeTokenCookie)?.value;
}

export async function getBackofficeCases(token: string) {
  try {
    const response = await fetch(`${siteConfig.apiUrl}/admin/cases`, {
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
