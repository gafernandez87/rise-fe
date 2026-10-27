"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backofficeTokenCookie, fetchBackofficeApi, getBackofficeToken } from "@/lib/backoffice-api";
import { siteConfig } from "@/lib/site";
import type { CaseSeverity, CaseStatus } from "@/types/cases";
import type { CountryProfileStatus } from "@/types/country-profiles";
import { countryProfileSectionsPayload } from "@/lib/country-profiles";
import type { StoryStatus } from "@/types/stories";

const backofficeAdminEmail = process.env.BACKOFFICE_ADMIN_EMAIL ?? "backoffice@rise.local";

type LoginResponse = {
  accessToken: string;
};

const backofficePath = "/backoffice";
const profilesBackofficePath = `${backofficePath}?section=profiles`;
const storiesBackofficePath = `${backofficePath}?section=stories`;

function appendQueryParam(path: string, key: string, value: string) {
  const separator = path.includes("?") ? "&" : "?";

  return `${path}${separator}${key}=${value}`;
}

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formNullableText(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function formBackofficeErrorPath(formData: FormData, fallback: string) {
  const value = formText(formData, "backofficeErrorPath");

  if (
    value === backofficePath ||
    value?.startsWith(`${backofficePath}?`) ||
    value?.startsWith(`${backofficePath}/`)
  ) {
    return value;
  }

  return fallback;
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

function formLines(formData: FormData, key: string) {
  const value = formText(formData, key);

  return value ? value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) : [];
}

function removeEmptyValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<T>;
}

function editorialPayload(formData: FormData) {
  try {
    return {
      referenceRecords: JSON.parse(formText(formData, "referenceRecords") ?? "[]"),
      mediaMetadata: JSON.parse(formText(formData, "mediaMetadata") ?? "{}"),
      translations: JSON.parse(formText(formData, "translations") ?? "[]"),
    };
  } catch { throw new Error("Los metadatos editoriales no son válidos."); }
}

function buildMeasurePayload(formData: FormData) {
  const title = formText(formData, "title");
  const shortDescription = formText(formData, "shortDescription");
  const latitude = formNumber(formData, "latitude");
  const longitude = formNumber(formData, "longitude");

  if (!title) {
    return null;
  }

  const status = (formText(formData, "status") ?? "draft") as CaseStatus;
  const severity = (formText(formData, "severity") ?? null) as CaseSeverity | null;
  const slug = formText(formData, "slug") ?? slugify(title);
  const subnationalJurisdiction = formText(formData, "subnationalJurisdiction");
  const fullDescription = formText(formData, "fullDescription") ?? shortDescription;
  const photoUrl = formText(formData, "photoUrl");

  return removeEmptyValues({
    ...editorialPayload(formData),
    title,
    slug,
    shortDescription: shortDescription ?? "",
    fullDescription: fullDescription ?? "",
    status,
    severity,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    country: formText(formData, "country"),
    region: subnationalJurisdiction,
    locality: formText(formData, "locality"),
    subnationalJurisdiction,
    ecoregion: formText(formData, "ecoregion"),
    implementationDate: formText(formData, "implementationDate"),
    photoUrl: photoUrl ?? null,
    threat: formText(formData, "threat"),
    measureType: formText(formData, "measureType"),
    riskMethod: formNullableText(formData, "riskMethod"),
    riskSourceUrl: formNullableText(formData, "riskSourceUrl"),
    coordinatePrecision: formNullableText(formData, "coordinatePrecision"),
    locationMethod: formNullableText(formData, "locationMethod"),
    implementationStage: formNullableText(formData, "implementationStage"),
    sector: formNullableText(formData, "sector"),
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
    images: photoUrl && formText(formData, "originalPhotoUrl") !== photoUrl
      ? [
          {
            url: photoUrl,
            altText: editorialPayload(formData).mediaMetadata.alt ?? `Imagen de ${title}`,
            isCover: true,
            sortOrder: 0,
          },
        ]
      : undefined,
  });
}

function buildStoryPayload(formData: FormData) {
  const title = formText(formData, "storyTitle");
  const summary = formText(formData, "storySummary");
  const content = formText(formData, "storyContent");

  if (!title) {
    return null;
  }

  const mediaUrl = formText(formData, "storyMediaUrl");

  return removeEmptyValues({
    ...editorialPayload(formData),
    title,
    slug: formText(formData, "storySlug") ?? slugify(title),
    summary: summary ?? "",
    content: content ?? "",
    status: (formText(formData, "storyStatus") ?? "draft") as StoryStatus,
    country: formText(formData, "storyCountry"),
    territory: formText(formData, "storyTerritory"),
    mainRisk: formText(formData, "storyMainRisk"),
    caseId: formNullableText(formData, "storyCaseId"),
    mediaUrl: mediaUrl ?? null,
    mediaAlt: formNullableText(formData, "storyMediaAlt"),
    sourceUrl: formText(formData, "storySourceUrl"),
  });
}

function buildCountryProfilePayload(formData: FormData, options: { clearOptionalFields?: boolean } = {}) {
  const name = formText(formData, "profileName");
  const summary = formText(formData, "profileSummary");
  const mainRisk = formText(formData, "profileMainRisk");
  const territory = formText(formData, "profileTerritory");
  const sector = formText(formData, "profileSector");
  const optionalText = options.clearOptionalFields ? formNullableText : formText;

  if (!name) {
    return null;
  }

  return removeEmptyValues({
    ...editorialPayload(formData),
    name,
    slug: formText(formData, "profileSlug") ?? slugify(name),
    summary: summary ?? "",
    status: (formText(formData, "profileStatus") ?? "draft") as CountryProfileStatus,
    mainRisk: mainRisk ?? "",
    territory: territory ?? "",
    sector: sector ?? "",
    measuresCount: formNumber(formData, "profileMeasuresCount"),
    storyTitle: optionalText(formData, "profileStoryTitle"),
    risks: formLines(formData, "profileRisks"),
    heroImageUrl: optionalText(formData, "profileHeroImageUrl"),
    profilePdfUrl: optionalText(formData, "profilePdfUrl"),
    ...countryProfileSectionsPayload(formData),
  });
}

async function clearBackofficeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(backofficeTokenCookie);
}

async function backendMessage(response: Response) {
  try {
    const body = await response.json();
    return (Array.isArray(body.message) ? body.message.join("; ") : String(body.message ?? "No se pudo guardar.")).slice(0, 1200);
  } catch { return "No se pudo guardar."; }
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
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formText(formData, "email") ?? backofficeAdminEmail,
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
  const errorPath = formBackofficeErrorPath(formData, `${backofficePath}?mode=create`);
  const payload = buildMeasurePayload(formData);

  if (!payload) {
    redirect(appendQueryParam(errorPath, "save", "missing"));
  }

  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/cases`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "save", "error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    const message = await backendMessage(response);
    redirect(appendQueryParam(appendQueryParam(errorPath, "save", "error"), "detail", encodeURIComponent(message)));
  }

  revalidatePath(backofficePath);
  revalidatePath("/", "layout");
  redirect(`${backofficePath}?created=1`);
}

export async function updateMeasure(id: string, formData: FormData) {
  const token = await requireBackofficeToken();
  const errorPath = formBackofficeErrorPath(formData, `${backofficePath}?edit=${encodeURIComponent(id)}`);
  const payload = buildMeasurePayload(formData);

  if (!payload) {
    redirect(appendQueryParam(errorPath, "save", "missing"));
  }

  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/cases/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "save", "error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    const message = await backendMessage(response);
    redirect(appendQueryParam(appendQueryParam(errorPath, "save", "error"), "detail", encodeURIComponent(message)));
  }

  revalidatePath(backofficePath);
  revalidatePath("/", "layout");
  redirect(`${backofficePath}?updated=1`);
}

export async function deleteMeasure(id: string, formData: FormData) {
  const token = await requireBackofficeToken();
  const errorPath = formBackofficeErrorPath(formData, `${backofficePath}?edit=${encodeURIComponent(id)}`);
  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/cases/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "save", "delete-error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    redirect(appendQueryParam(errorPath, "save", "delete-error"));
  }

  revalidatePath(backofficePath);
  revalidatePath("/", "layout");
  redirect(`${backofficePath}?deleted=1`);
}

export async function createCountryProfile(formData: FormData) {
  const token = await requireBackofficeToken();
  const errorPath = formBackofficeErrorPath(formData, `${profilesBackofficePath}&profileMode=create`);
  const payload = buildCountryProfilePayload(formData);

  if (!payload) {
    redirect(appendQueryParam(errorPath, "profileSave", "missing"));
  }

  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/country-profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "profileSave", "error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    const message = await backendMessage(response);
    redirect(appendQueryParam(appendQueryParam(errorPath, "profileSave", "error"), "detail", encodeURIComponent(message)));
  }

  revalidatePath(backofficePath);
  revalidatePath("/perfiles");
  revalidatePath("/", "layout");
  redirect(`${profilesBackofficePath}&profileCreated=1`);
}

export async function updateCountryProfile(id: string, formData: FormData) {
  const token = await requireBackofficeToken();
  const errorPath = formBackofficeErrorPath(
    formData,
    `${profilesBackofficePath}&profileEdit=${encodeURIComponent(id)}`,
  );
  const payload = buildCountryProfilePayload(formData, { clearOptionalFields: true });

  if (!payload) {
    redirect(appendQueryParam(errorPath, "profileSave", "missing"));
  }

  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/country-profiles/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "profileSave", "error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    const message = await backendMessage(response);
    redirect(appendQueryParam(appendQueryParam(errorPath, "profileSave", "error"), "detail", encodeURIComponent(message)));
  }

  revalidatePath(backofficePath);
  revalidatePath("/perfiles");
  revalidatePath("/", "layout");
  redirect(`${profilesBackofficePath}&profileUpdated=1`);
}

export async function deleteCountryProfile(id: string, formData: FormData) {
  const token = await requireBackofficeToken();
  const errorPath = formBackofficeErrorPath(
    formData,
    `${profilesBackofficePath}&profileEdit=${encodeURIComponent(id)}`,
  );
  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/country-profiles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "profileSave", "delete-error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    redirect(appendQueryParam(errorPath, "profileSave", "delete-error"));
  }

  revalidatePath(backofficePath);
  revalidatePath("/perfiles");
  revalidatePath("/", "layout");
  redirect(`${profilesBackofficePath}&profileDeleted=1`);
}

export async function createStory(formData: FormData) {
  const token = await requireBackofficeToken();
  const errorPath = formBackofficeErrorPath(formData, `${storiesBackofficePath}&storyMode=create`);
  const payload = buildStoryPayload(formData);

  if (!payload) {
    redirect(appendQueryParam(errorPath, "storySave", "missing"));
  }

  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "storySave", "error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    const message = await backendMessage(response);
    redirect(appendQueryParam(appendQueryParam(errorPath, "storySave", "error"), "detail", encodeURIComponent(message)));
  }

  revalidatePath(backofficePath);
  revalidatePath("/historias");
  revalidatePath("/", "layout");
  redirect(`${storiesBackofficePath}&storyCreated=1`);
}

export async function updateStory(id: string, formData: FormData) {
  const token = await requireBackofficeToken();
  const errorPath = formBackofficeErrorPath(
    formData,
    `${storiesBackofficePath}&storyEdit=${encodeURIComponent(id)}`,
  );
  const payload = buildStoryPayload(formData);

  if (!payload) {
    redirect(appendQueryParam(errorPath, "storySave", "missing"));
  }

  let response: Response;

  try {
    response = await fetchBackofficeApi(`${siteConfig.apiUrl}/admin/stories/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    redirect(appendQueryParam(errorPath, "storySave", "error"));
  }

  if (response.status === 401) {
    await clearBackofficeSession();
    redirect(`${backofficePath}?error=session`);
  }

  if (!response.ok) {
    const message = await backendMessage(response);
    redirect(appendQueryParam(appendQueryParam(errorPath, "storySave", "error"), "detail", encodeURIComponent(message)));
  }

  revalidatePath(backofficePath);
  revalidatePath("/historias");
  revalidatePath("/", "layout");
  redirect(`${storiesBackofficePath}&storyUpdated=1`);
}
