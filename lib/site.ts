function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getConfiguredApiUrl() {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  return apiUrl ? trimTrailingSlash(apiUrl) : "";
}

export const siteConfig = {
  name: "RISE",
  description:
    "Plataforma regional de medidas de adaptacion e historias de resiliencia lideradas por juventudes en America Latina.",
  siteUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  apiUrl: getConfiguredApiUrl(),
};
