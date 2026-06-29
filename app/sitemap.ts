import type { MetadataRoute } from "next";
import { getPublishedCases } from "@/lib/api";
import { getLocalizedCountries, locales, localizedPath } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getPublishedCases();
  const countries = getLocalizedCountries("es");
  const staticRoutes = [
    "",
    "/mapa",
    "/perfiles",
    "/historias",
    "/informe-regional",
    "/metodologia",
  ];
  const countryRoutes = countries.flatMap((country) => [
    `/perfiles/${country.slug}`,
    `/historias/${country.slug}`,
  ]);
  const caseRoutes = cases.map((item) => `/casos/${item.slug}`);
  const routes = [...staticRoutes, ...countryRoutes, ...caseRoutes];

  return locales.flatMap((locale) =>
    routes.map((path) => ({
      url: `${siteConfig.siteUrl}${localizedPath(path, locale)}`,
      lastModified: new Date(),
    })),
  );
}
