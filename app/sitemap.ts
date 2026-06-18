import type { MetadataRoute } from "next";
import { getPublishedCases } from "@/lib/api";
import { projectCountries } from "@/lib/rise-content";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getPublishedCases();
  const staticRoutes = [
    "",
    "/mapa",
    "/perfiles",
    "/historias",
    "/informe-regional",
    "/metodologia",
  ].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...projectCountries.flatMap((country) => [
      {
        url: `${siteConfig.siteUrl}/perfiles/${country.slug}`,
        lastModified: new Date(),
      },
      {
        url: `${siteConfig.siteUrl}/historias/${country.slug}`,
        lastModified: new Date(),
      },
    ]),
    ...cases.map((item) => ({
      url: `${siteConfig.siteUrl}/casos/${item.slug}`,
      lastModified: new Date(),
    })),
  ];
}
