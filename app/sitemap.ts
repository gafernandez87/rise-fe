import type { MetadataRoute } from "next";
import { getPublishedCases, getPublishedCountryProfiles, getPublishedStories } from "@/lib/api";
import { locales, localizedPath } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, countries, stories] = await Promise.all([
    getPublishedCases(),
    getPublishedCountryProfiles(),
    getPublishedStories(),
  ]);
  const staticRoutes = [
    "",
    "/mapa",
    "/perfiles",
    "/historias",
    "/informe-regional",
    "/metodologia",
  ];
  const countryRoutes = countries.map((country) => `/perfiles/${country.slug}`);
  const storyRoutes = stories.map((story) => `/historias/${story.slug}`);
  const caseRoutes = cases.map((item) => `/casos/${item.slug}`);
  const routes = [...staticRoutes, ...countryRoutes, ...storyRoutes, ...caseRoutes];

  return locales.flatMap((locale) =>
    routes.map((path) => ({
      url: `${siteConfig.siteUrl}${localizedPath(path, locale)}`,
      lastModified: new Date(),
    })),
  );
}
