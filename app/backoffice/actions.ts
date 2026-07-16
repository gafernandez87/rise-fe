"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backofficeTokenCookie, getBackofficeToken } from "@/lib/backoffice-api";
import { siteConfig } from "@/lib/site";
import type { CaseSeverity, CaseStatus } from "@/types/cases";

const backofficeAdminEmail = process.env.BACKOFFICE_ADMIN_EMAIL ?? "backoffice@rise.local";

type LoginResponse = {
  accessToken: string;
};

const backofficePath = "/backoffice";

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formNumber(formData: FormData, key: string) {
  const value = formText(formData, key);
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function removeEmptyValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ""),
  ) as Partial<T>;
}

function buildMeasurePayload(formData: FormData) {
  const title = formText(formData, "title");
  const shortDescription = formText(formData, "shortDescription");
  const latitude = formNumber(formData, "latitude");
  const longitude = formNumber(formData, "longitude");

  if (!title || !shortDescription || latitude === undefined || longitude === undefined) {
    return null;
  }

  const status = (formText(formData, "status") ?? "draft") as CaseStatus;
  const severity = (formText(formData, "severity") ?? "medium") as CaseSeverity;
  const slug = formText(formData, "slug") ?? slugify(title);
  const subnationalJurisdiction = formText(formData, "subnationalJurisdiction");
  const fullDescription = formText(formData, "fullDescription") ?? shortDescription;
  const photoUrl = formText(formData, "photoUrl");

  return removeEmptyValues({
    title,
    slug,
    shortDescription,
    fullDescription,
    status,
    severity,
    latitude,
    longitude,
    country: formText(formData, "country"),
    region: subnationalJurisdiction,
    locality: formText(formData, "locality"),
    subnationalJurisdiction,
    ecoregion: formText(formData, "ecoregion"),
    implementationDate: formText(formData, "implementationDate"),
    photoUrl,
    threat: formText(formData, "threat"),
    measureType: formText(formData, "measureType"),
    scope: formText(formData, "scope"),
    adaptationFocus: formText(formData, "adaptationFocus"),
    nationalVulnerabilityProfile: formText(formData, "nationalVulnerabilityProfile"),
    objectives: formText(formData, "objectives"),
    proposedSolutions: formText(formData, "proposedSolutions"),
    beneficiaryCommunities: formText(formData, "beneficiaryCommunities"),
    youthRole: formText(formData, "youthRole"),
    results: formText(formData, "results"),
    contact: formText(formData, "contact"),
    financingType: formText(formData, "financingType"),
    localClimateProblem: formText(formData, "localClimateProblem"),
    nationalSocioPoliticalContext: formText(formData, "nationalSocioPoliticalContext"),
    strategicAlliances: formText(formData, "strategicAlliances"),
    enablingFactors: formText(formData, "enablingFactors"),
    coBenefits: formText(formData, "coBenefits"),
    scalability: formText(formData, "scalability"),
    longTermSustainability: formText(formData, "longTermSustainability"),
    downloadableDocuments: formText(formData, "downloadableDocuments"),
    sourceUrl: formText(formData, "sourceUrl"),
    images: photoUrl
      ? [
          {
            url: photoUrl,
            altText: `Imagen de ${title}`,
            isCover: true,
            sortOrder: 0,
          },
        ]
      : [],
  });
}

async function clearBackofficeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(backofficeTokenCookie);
}

async function requireBackofficeToken() {
  const token = await getBackofficeToken();

  if (!token) {
    redirect(`${backofficePath}?error=session`);
  }

  return token;
}

export async function loginBackoffice(formData: FormData) {
  const password = formText(formData, "password");

  if (!password) {
    redirect(`${backofficePath}?error=missing`);
  }

  let response: Response;

  try {
    response = await fetch(`${siteConfig.apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: backofficeAdminEmail,
        password,
      }),
      cache: "no-store",
    });
  } catch {
    redirect(`${backofficePath}?error=unavailable`);
  }

  if (!response.ok) {
    redirect(`${backofficePath}?error=invalid`);
  }

  const data = (await response.json()) as LoginResponse;
  const cookieStore = await cookies();

  cookieStore.set(backofficeTokenCookie, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  redirect(backofficePath);
}

export async function logoutBackoffice() {
  const cookieStore = await cookies();
  cookieStore.delete(backofficeTokenCookie);
  redirect(backofficePath);
}

export async function createMeasure(formData: FormData) {
  const token = await requireBackofficeToken();
  const payload = buildMeasurePayload(formData);

  if (!payload) {
    redirect(`${backofficePath}?save=missing`);
  }

  const response = await fetch(`${siteConfig.apiUrl}/admin/cases`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    redirect(`${backofficePath}?save=error`);
  }

  revalidatePath(backofficePath);
  redirect(`${backofficePath}?created=1`);
}

export async function updateMeasure(id: string, formData: FormData) {
  const token = await requireBackofficeToken();
  const payload = buildMeasurePayload(formData);

  if (!payload) {
    redirect(`${backofficePath}?save=missing`);
  }

  const response = await fetch(`${siteConfig.apiUrl}/admin/cases/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    redirect(`${backofficePath}?save=error`);
  }

  revalidatePath(backofficePath);
  redirect(`${backofficePath}?updated=1`);
}

export async function deleteMeasure(id: string) {
  const token = await requireBackofficeToken();
  const response = await fetch(`${siteConfig.apiUrl}/admin/cases/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    redirect(`${backofficePath}?save=delete-error`);
  }

  revalidatePath(backofficePath);
  redirect(`${backofficePath}?deleted=1`);
}
